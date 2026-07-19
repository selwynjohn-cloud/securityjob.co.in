import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import type { GuideGender, LanguageCode } from '../types';

/**
 * Guide voice: OpenAI TTS → MP3 via expo-av (primary).
 * Falls back to browser speechSynthesis, then a bundled welcome clip, because
 * Selwyn’s Mac had silent speechSynthesis in Safari and Chrome, and the
 * OpenAI key may also hit quota errors.
 */

const OPENAI_SPEECH_URL = 'https://api.openai.com/v1/audio/speech';
const TTS_MODEL = 'tts-1';

const FALLBACK_WELCOME = require('../../assets/audio/welcome-en.wav');

/**
 * Bumped every time we start OR stop speech. In-flight work checks this token
 * so Stop is never undone by a late network/play callback.
 */
let speechGeneration = 0;

let currentSound: Audio.Sound | null = null;
/** True while fetching / synthesizing / playing — drives Stop Audio. */
let active = false;

/** Cache: voice+language+text → playable blob/data URI */
const uriCache = new Map<string, string>();
const MAX_CACHE = 24;

function getApiKey(): string | undefined {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() || undefined;
}

function pickVoice(gender: GuideGender): 'nova' | 'onyx' {
  return gender === 'male' ? 'onyx' : 'nova';
}

function cacheKey(
  text: string,
  language: LanguageCode,
  gender: GuideGender,
): string {
  return `${pickVoice(gender)}:${language}:${text}`;
}

function rememberUri(key: string, uri: string) {
  if (uriCache.has(key)) return;
  if (uriCache.size >= MAX_CACHE) {
    const oldest = uriCache.keys().next().value;
    if (oldest != null) {
      const oldUri = uriCache.get(oldest);
      uriCache.delete(oldest);
      if (oldUri?.startsWith('blob:') && typeof URL !== 'undefined') {
        try {
          URL.revokeObjectURL(oldUri);
        } catch {
          // ignore
        }
      }
    }
  }
  uriCache.set(key, uri);
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa === 'function') {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : null;
    const c = i + 2 < bytes.length ? bytes[i + 2] : null;
    const triple = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    out += chars[(triple >> 18) & 63];
    out += chars[(triple >> 12) & 63];
    out += b == null ? '=' : chars[(triple >> 6) & 63];
    out += c == null ? '=' : chars[triple & 63];
  }
  return out;
}

/** Must run inside the Start Audio click so later play() is allowed. */
function unlockWebAudioSession() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    const AC =
      window.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitAudioContext;
    if (AC) {
      const ctx = new AC();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      void ctx.close?.();
    }
  } catch {
    // ignore
  }
  try {
    const el = new window.Audio(
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=',
    );
    el.volume = 0.01;
    void el.play().catch(() => undefined);
  } catch {
    // ignore
  }
}

async function unloadCurrentSound() {
  const sound = currentSound;
  currentSound = null;
  if (!sound) return;
  try {
    await sound.stopAsync();
  } catch {
    // ignore
  }
  try {
    await sound.unloadAsync();
  } catch {
    // ignore
  }
}

function cancelWebSpeech() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // ignore
  }
}

export function stopTalking() {
  speechGeneration += 1;
  active = false;
  cancelWebSpeech();
  void unloadCurrentSound();
}

export function isTalking(): Promise<boolean> {
  if (active) return Promise.resolve(true);
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const s = window.speechSynthesis;
      if (s && (s.speaking || s.pending)) return Promise.resolve(true);
    } catch {
      // ignore
    }
  }
  return Promise.resolve(false);
}

export function cleanForSpeech(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/www\.\S+/gi, '')
    .replace(/securityjob\.co\.in/gi, 'Security Job website')
    .replace(/[#*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchOpenAiSpeechUri(
  text: string,
  language: LanguageCode,
  gender: GuideGender,
  myGen: number,
): Promise<string | null> {
  const key = cacheKey(text, language, gender);
  const cached = uriCache.get(key);
  if (cached) return cached;

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error(
      '[tts] Missing EXPO_PUBLIC_OPENAI_API_KEY — skipping cloud voice.',
    );
    return null;
  }

  let response: Response;
  try {
    response = await fetch(OPENAI_SPEECH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        voice: pickVoice(gender),
        input: text,
        response_format: 'mp3',
      }),
    });
  } catch (err) {
    console.error('[tts] OpenAI TTS network error', err);
    return null;
  }

  if (myGen !== speechGeneration) return null;

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error(
      '[tts] OpenAI TTS failed',
      response.status,
      detail.slice(0, 280),
    );
    return null;
  }

  const buffer = await response.arrayBuffer();
  if (myGen !== speechGeneration) return null;
  if (!buffer.byteLength) {
    console.error('[tts] OpenAI TTS returned empty audio');
    return null;
  }

  if (
    Platform.OS === 'web' &&
    typeof URL !== 'undefined' &&
    typeof Blob !== 'undefined'
  ) {
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    const uri = URL.createObjectURL(blob);
    rememberUri(key, uri);
    return uri;
  }

  const b64 = bytesToBase64(new Uint8Array(buffer));
  const uri = `data:audio/mpeg;base64,${b64}`;
  rememberUri(key, uri);
  return uri;
}

async function playRemoteOrDataUri(uri: string, myGen: number): Promise<boolean> {
  if (myGen !== speechGeneration) return false;

  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  if (myGen !== speechGeneration) return false;
  await unloadCurrentSound();
  if (myGen !== speechGeneration) return false;

  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, volume: 1.0, progressUpdateIntervalMillis: 400 },
    );
    if (myGen !== speechGeneration) {
      await sound.unloadAsync().catch(() => undefined);
      return false;
    }
    currentSound = sound;

    await new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          if ('error' in status && status.error) {
            console.error('[tts] playback error', status.error);
            finish();
          }
          return;
        }
        if (status.didJustFinish) finish();
      });
      setTimeout(() => finish(), 180_000);
    });
    return true;
  } catch (err) {
    console.error('[tts] Audio.Sound play failed', err);
    return false;
  }
}

async function playBundledFallback(myGen: number): Promise<boolean> {
  if (myGen !== speechGeneration) return false;
  console.error(
    '[tts] Playing bundled welcome audio — cloud TTS unavailable. Check OpenAI billing/quota.',
  );
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  if (myGen !== speechGeneration) return false;
  await unloadCurrentSound();
  if (myGen !== speechGeneration) return false;

  try {
    const { sound } = await Audio.Sound.createAsync(FALLBACK_WELCOME, {
      shouldPlay: true,
      volume: 1.0,
    });
    if (myGen !== speechGeneration) {
      await sound.unloadAsync().catch(() => undefined);
      return false;
    }
    currentSound = sound;
    await new Promise<void>((resolve) => {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) resolve();
      });
      setTimeout(resolve, 15_000);
    });
    return true;
  } catch (err) {
    console.error('[tts] Bundled fallback play failed', err);
    return false;
  }
}

/** Last-resort browser TTS (often silent on Selwyn’s Mac — try anyway). */
function speakWebSynthesis(
  text: string,
  gender: GuideGender,
  myGen: number,
): Promise<boolean> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return Promise.resolve(false);
  }
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve(false);

  try {
    if (synth.speaking || synth.pending || synth.paused) synth.cancel();
  } catch {
    // ignore
  }

  return new Promise((resolve) => {
    if (myGen !== speechGeneration) {
      resolve(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 1;
    utter.volume = 1;
    try {
      const voices = synth.getVoices() || [];
      const prefer =
        gender === 'male'
          ? /alex|daniel|fred|male/i
          : /samantha|victoria|karen|female|nova/i;
      const pick =
        voices.find((v) => prefer.test(v.name) && v.localService) ||
        voices.find((v) => v.lang?.startsWith('en') && v.localService) ||
        voices.find((v) => v.lang?.startsWith('en'));
      if (pick) {
        utter.voice = pick;
        utter.lang = pick.lang || 'en-US';
      }
    } catch {
      // ignore
    }

    let settled = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };

    utter.onend = () => done(true);
    utter.onerror = () => done(false);

    try {
      synth.speak(utter);
      if (synth.paused) synth.resume();
    } catch {
      done(false);
      return;
    }

    // If speak() never starts (silent Safari/Chrome), fail fast → bundled clip.
    setTimeout(() => {
      if (settled) return;
      if (myGen !== speechGeneration) {
        done(false);
        return;
      }
      if (!synth.speaking && !synth.pending) {
        try {
          synth.cancel();
        } catch {
          // ignore
        }
        done(false);
        return;
      }
      // It started — wait for onend, with a generous safety cap.
      setTimeout(() => {
        if (!settled) done(true);
      }, Math.min(120_000, 3000 + Math.ceil(text.length / 12) * 1000));
    }, 700);
  });
}

/**
 * Guide speaks aloud — OpenAI MP3 via expo-av when possible.
 * Prefer Start Audio so the web audio session is unlocked first.
 */
export async function talkAsGuide(
  text: string,
  language: LanguageCode,
  gender: GuideGender = 'female',
): Promise<void> {
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return;

  speechGeneration += 1;
  const myGen = speechGeneration;
  active = true;

  unlockWebAudioSession();
  cancelWebSpeech();
  void unloadCurrentSound();

  try {
    // 1) Cloud TTS → real MP3 (works in every browser when quota allows)
    const uri = await fetchOpenAiSpeechUri(cleaned, language, gender, myGen);
    if (myGen !== speechGeneration) return;
    if (uri) {
      const ok = await playRemoteOrDataUri(uri, myGen);
      if (ok || myGen !== speechGeneration) return;
    }

    // 2) Browser speechSynthesis (may be silent on this Mac)
    if (Platform.OS === 'web') {
      const spoke = await speakWebSynthesis(cleaned, gender, myGen);
      if (spoke || myGen !== speechGeneration) return;
    }

    // 3) Bundled welcome clip — proves speakers/volume; always audible via expo-av
    await playBundledFallback(myGen);
  } finally {
    if (myGen === speechGeneration) {
      active = false;
    }
  }
}
