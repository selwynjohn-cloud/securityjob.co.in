/**
 * Hybrid speech (option C): auto-detect or manual language via Whisper.
 * Records with expo-av (Expo Go compatible).
 */

import { Audio } from 'expo-av';

import { SAMPLE_VOICE_TRANSCRIPTS } from '../data/registrationQuestions';
import type { LanguageCode, SpeechMode } from '../types';

export type { SpeechMode };

export interface TranscriptResult {
  text: string;
  detectedLanguage?: string;
  mode: SpeechMode;
  provider: 'whisper' | 'demo';
  errorMessage?: string;
}

export interface SpeechListenOptions {
  mode: SpeechMode;
  language: LanguageCode;
  fieldId?: string;
}

const WHISPER_LANG: Record<LanguageCode, string> = {
  en: 'en',
  hi: 'hi',
  ta: 'ta',
  te: 'te',
  as: 'as',
  or: 'or',
};

export const DETECTED_LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  as: 'Assamese',
  or: 'Odia',
  od: 'Odia',
};

function getApiKey(): string | undefined {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() || undefined;
}

export function isCloudSpeechConfigured(): boolean {
  return Boolean(getApiKey());
}

async function ensureMicPermission(): Promise<void> {
  const current = await Audio.getPermissionsAsync();
  if (current.granted) return;
  const asked = await Audio.requestPermissionsAsync();
  if (!asked.granted) throw new Error('MIC_DENIED');
}

async function transcribeWithWhisper(
  uri: string,
  options: SpeechListenOptions,
): Promise<TranscriptResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'audio/m4a',
    name: 'guard-speech.m4a',
  } as unknown as Blob);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  // Help Whisper with Indian languages; auto mode still detects language
  if (options.mode === 'manual') {
    formData.append('language', WHISPER_LANG[options.language] ?? 'en');
  }

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`WHISPER_FAILED:${response.status}:${detail.slice(0, 120)}`);
  }

  const data = (await response.json()) as { text?: string; language?: string };
  const text = (data.text ?? '').trim();
  if (!text) throw new Error('EMPTY_TRANSCRIPT');

  return {
    text,
    detectedLanguage: data.language,
    mode: options.mode,
    provider: 'whisper',
  };
}

export class HybridSpeechService {
  private recording: Audio.Recording | null = null;
  private listening = false;
  private startedAt = 0;
  private options: SpeechListenOptions = {
    mode: 'auto',
    language: 'en',
    fieldId: 'name',
  };

  configure(options: Partial<SpeechListenOptions>) {
    this.options = { ...this.options, ...options };
  }

  setField(fieldId: string) {
    this.options.fieldId = fieldId;
  }

  isAvailable() {
    return true;
  }

  get isListening() {
    return this.listening;
  }

  async startListening(options?: Partial<SpeechListenOptions>): Promise<void> {
    if (options) this.configure(options);
    await ensureMicPermission();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch {
        // ignore
      }
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    await recording.startAsync();
    this.recording = recording;
    this.listening = true;
    this.startedAt = Date.now();
  }

  async stopListening(): Promise<TranscriptResult> {
    this.listening = false;
    const recording = this.recording;
    this.recording = null;

    // Prefer at least ~1s of audio for Whisper
    const elapsed = Date.now() - this.startedAt;
    if (elapsed < 900) {
      await new Promise((r) => setTimeout(r, 900 - elapsed));
    }

    if (!recording) {
      throw new Error('NO_RECORDING');
    }

    try {
      await recording.stopAndUnloadAsync();
    } catch {
      // URI may still exist
    }

    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch {
      // ignore
    }

    const uri = recording.getURI();
    if (!uri) throw new Error('NO_RECORDING');

    if (!getApiKey()) {
      return {
        ...this.demoFallback(),
        errorMessage: 'NO_API_KEY',
      };
    }

    return transcribeWithWhisper(uri, this.options);
  }

  private demoFallback(): TranscriptResult {
    const fieldId = this.options.fieldId ?? 'name';
    return {
      text: SAMPLE_VOICE_TRANSCRIPTS[fieldId] ?? '',
      detectedLanguage: WHISPER_LANG[this.options.language],
      mode: this.options.mode,
      provider: 'demo',
    };
  }
}

export const speechService = new HybridSpeechService();
