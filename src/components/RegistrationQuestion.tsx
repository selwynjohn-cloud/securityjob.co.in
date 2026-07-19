import type { CandidateProfile } from '../types';

/** Display value for confirmation / profile screens */
export function formatFieldValue(
  field: keyof CandidateProfile,
  profile: CandidateProfile,
  _t: (k: string) => string,
): string {
  if (field === 'consents') {
    return [
      profile.consents.privacy ? 'Privacy' : null,
      profile.consents.contact ? 'Contact' : null,
      profile.consents.whatsapp ? 'WhatsApp' : null,
    ]
      .filter(Boolean)
      .join(', ') || '—';
  }
  if (field === 'photo') {
    return profile.photo?.startsWith('data:image') ? 'Photo attached' : '—';
  }
  const value = profile[field];
  return String(value || '—');
}
