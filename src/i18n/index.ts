import { en, type TranslationSchema } from './en';
import { hi } from './hi';
import { ta } from './ta';
import { supportedLanguages } from './languages';
import type { LanguageCode } from '../types';

/**
 * Full UI catalogs today: en, hi, ta.
 * Telugu / Assamese / Odia use English UI strings for now, while speech
 * recognition supports those languages (auto-detect or manual Whisper hint).
 */
const catalogs: Partial<Record<LanguageCode, TranslationSchema>> = {
  en,
  ta,
  hi,
};

export { supportedLanguages };
export { LANGUAGE_OPTIONS } from './languages';

export function getCatalog(lang: LanguageCode): TranslationSchema {
  return catalogs[lang] ?? en;
}

function lookup(obj: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export function translate(
  lang: LanguageCode,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const raw = lookup(getCatalog(lang), key) ?? lookup(en, key) ?? key;
  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v)),
    raw,
  );
}

export { en, ta, hi };
