import type { CandidateProfile, SecurityJobRegisterPayload } from '../types';

const REGISTER_URL = 'https://www.securityjob.co.in/api/securityjob/register';

export function toRegisterPayload(profile: CandidateProfile): SecurityJobRegisterPayload {
  return {
    name: profile.name.trim(),
    phone: profile.phone.trim(),
    location: profile.location.trim(),
    role: profile.role.trim(),
    experience: profile.experience.trim(),
    education: profile.education.trim(),
    language: profile.language.trim() || 'Hindi',
    photo: profile.photo,
  };
}

export async function submitToSecurityJobSite(
  profile: CandidateProfile,
): Promise<
  | { ok: true; regCode?: string; registeredAt?: string }
  | { ok: false; message: string }
> {
  const payload = toRegisterPayload(profile);

  if (!payload.photo?.startsWith('data:image')) {
    return { ok: false, message: 'Photo is required (same as securityjob.co.in).' };
  }

  try {
    const res = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: { ok?: boolean; regCode?: string; registeredAt?: string; message?: string } = {};
    try {
      data = JSON.parse(text) as typeof data;
    } catch {
      // non-JSON body
    }

    if (!res.ok || data.ok === false) {
      return {
        ok: false,
        message:
          data.message ||
          `Registration failed (${res.status}). ${text.slice(0, 120)}`,
      };
    }

    return {
      ok: true,
      regCode: data.regCode,
      registeredAt: data.registeredAt,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { ok: false, message: msg };
  }
}
