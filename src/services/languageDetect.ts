import type { LanguageCode } from '../types';
import { SITE_LANGUAGES } from '../data/registrationQuestions';

/** Whisper ISO → app UI language (only en/hi/ta have full catalogs) */
const WHISPER_TO_UI: Record<string, LanguageCode> = {
  en: 'en',
  hi: 'hi',
  ta: 'ta',
  te: 'te',
  as: 'as',
  or: 'or',
  od: 'or',
};

/** Whisper ISO → securityjob.co.in Primary Language option */
const WHISPER_TO_SITE_LANG: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  as: 'Assamese',
  or: 'Other',
  od: 'Other',
  kn: 'Kannada',
  ml: 'Malayalam',
  bn: 'Bengali',
  mr: 'Marathi',
};

export function whisperToUiLanguage(code?: string): LanguageCode | null {
  if (!code) return null;
  return WHISPER_TO_UI[code.toLowerCase()] ?? null;
}

export function whisperToSitePrimaryLanguage(code?: string): string | null {
  if (!code) return null;
  const mapped = WHISPER_TO_SITE_LANG[code.toLowerCase()];
  if (mapped && (SITE_LANGUAGES as readonly string[]).includes(mapped)) {
    return mapped;
  }
  return 'Other';
}
