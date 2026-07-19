import type { LanguageCode } from '../types';

export interface LanguageOption {
  code: LanguageCode;
  /** Native script label shown on the language screen */
  nativeLabel: string;
  englishName: string;
  whisperCode: string;
}

/** Guard-facing languages — order matches landing dropdown */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', nativeLabel: 'English', englishName: 'English', whisperCode: 'en' },
  { code: 'hi', nativeLabel: 'हिन्दी', englishName: 'Hindi', whisperCode: 'hi' },
  { code: 'te', nativeLabel: 'తెలుగు', englishName: 'Telugu', whisperCode: 'te' },
  { code: 'ta', nativeLabel: 'தமிழ்', englishName: 'Tamil', whisperCode: 'ta' },
  { code: 'or', nativeLabel: 'ଓଡ଼ିଆ', englishName: 'Odia', whisperCode: 'or' },
  { code: 'as', nativeLabel: 'অসমীয়া', englishName: 'Assamese', whisperCode: 'as' },
  { code: 'kn', nativeLabel: 'ಕನ್ನಡ', englishName: 'Kannada', whisperCode: 'kn' },
];

export const supportedLanguages: LanguageCode[] = LANGUAGE_OPTIONS.map((l) => l.code);
