import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import type { LanguageCode } from '../types';

/** Best-effort BCP-47 locales for device voices */
const SPEECH_LOCALE: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  as: 'as-IN',
  or: 'or-IN',
};

/** iOS: 0.5 ≈ normal. Android: 1.0 ≈ normal. Prefer slightly faster. */
const SPEECH_RATE = Platform.select({ ios: 0.54, android: 1.18, default: 1.1 }) ?? 1.1;

let cachedVoiceId: string | null | undefined;

export function stopTalking() {
  Speech.stop();
}

export function isTalking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}

/** Strip URLs / symbols that make device TTS sound bad or drag. */
export function cleanForSpeech(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/www\.\S+/gi, '')
    .replace(/securityjob\.co\.in/gi, 'Security Job website')
    .replace(/[#*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function pickVoiceId(locale: string): Promise<string | undefined> {
  if (cachedVoiceId !== undefined) {
    return cachedVoiceId ?? undefined;
  }
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const lang = locale.slice(0, 2).toLowerCase();
    const matching = voices.filter(
      (v) =>
        v.language?.toLowerCase().startsWith(lang) ||
        v.language?.toLowerCase() === locale.toLowerCase(),
    );
    const pool = matching.length ? matching : voices;
    const preferred =
      pool.find((v) => /enhanced|premium|neural|natural|india|indian/i.test(v.name || '')) ||
      pool.find((v) => v.quality === Speech.VoiceQuality.Enhanced) ||
      pool[0];
    cachedVoiceId = preferred?.identifier ?? null;
    return preferred?.identifier;
  } catch {
    cachedVoiceId = null;
    return undefined;
  }
}

/**
 * Guide speaks aloud (device TTS) — shorter, faster, cleaner.
 */
export async function talkAsGuide(
  text: string,
  language: LanguageCode,
): Promise<void> {
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return;

  Speech.stop();
  const locale = SPEECH_LOCALE[language] ?? 'en-IN';
  const voice = await pickVoiceId(locale);

  return new Promise((resolve) => {
    const speak = (lang: string, voiceId?: string) => {
      Speech.speak(cleaned, {
        language: lang,
        voice: voiceId,
        pitch: 1.05,
        rate: SPEECH_RATE,
        onDone: () => resolve(),
        onStopped: () => resolve(),
        onError: () => {
          if (lang !== 'en-IN') {
            speak('en-IN');
          } else {
            resolve();
          }
        },
      });
    };

    speak(locale, voice);
  });
}
