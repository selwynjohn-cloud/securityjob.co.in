import type { CandidateProfile } from '../types';
import { submitToSecurityJobSite } from './securityjobApi';

let sequence = 1;

export function issueRegistrationNumber(): string {
  const num = String(sequence).padStart(6, '0');
  sequence += 1;
  return `SJ-2026-${num}`;
}

/**
 * Verify locally, then POST to the same endpoint as www.securityjob.co.in
 */
export async function submitRegistration(
  profile: CandidateProfile,
): Promise<CandidateProfile> {
  const remote = await submitToSecurityJobSite(profile);
  if (!remote.ok) {
    throw new Error(remote.message);
  }

  return {
    ...profile,
    registrationNumber:
      remote.regCode ||
      profile.registrationNumber ||
      issueRegistrationNumber(),
  };
}
