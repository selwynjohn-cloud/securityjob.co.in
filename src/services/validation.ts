import type { CandidateProfile, Consents } from '../types';
import { REGISTRATION_QUESTIONS } from '../data/registrationQuestions';

export function isValidIndianMobile(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.trim());
}

export function validateField(
  field: keyof CandidateProfile,
  value: string | string[] | Consents,
): string | null {
  if (field === 'consents') return null;

  if (field === 'phone') {
    if (!isValidIndianMobile(String(value))) return 'registration.invalidMobile';
    return null;
  }

  if (field === 'photo') {
    return String(value).startsWith('data:image') ? null : 'registration.photoRequired';
  }

  if (Array.isArray(value)) {
    return value.length ? null : 'registration.invalid';
  }

  return String(value ?? '').trim() ? null : 'registration.invalid';
}

export function hasMandatoryConsents(consents: Consents): boolean {
  return consents.privacy && consents.contact;
}

export function getMissingRequiredFields(
  profile: CandidateProfile,
): (keyof CandidateProfile)[] {
  const missing: (keyof CandidateProfile)[] = [];
  for (const q of REGISTRATION_QUESTIONS) {
    if (!q.required) continue;
    const value = profile[q.field];
    if (q.field === 'consents') continue;
    if (!String(value ?? '').trim()) {
      missing.push(q.field);
    } else if (validateField(q.field, value as string) !== null) {
      missing.push(q.field);
    }
  }
  return missing;
}

export function createEmptyProfile(): CandidateProfile {
  return {
    name: '',
    phone: '',
    location: '',
    role: '',
    experience: '',
    education: '',
    language: '',
    photo: '',
    consents: { privacy: false, contact: false, whatsapp: false },
  };
}
