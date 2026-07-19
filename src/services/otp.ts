/**
 * OTP — Fast2SMS via local OTP server.
 * Falls back to mock 123456 when EXPO_PUBLIC_OTP_API_URL is unset or server unreachable (dev).
 */

export const MOCK_OTP = '123456';

const API_URL = (process.env.EXPO_PUBLIC_OTP_API_URL || '').replace(/\/$/, '');

export interface OtpService {
  sendOtp(mobile: string): Promise<{ ok: true; testMode: boolean; message?: string }>;
  verifyOtp(mobile: string, code: string): Promise<{ ok: boolean; message?: string }>;
}

function toPhone(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits.slice(-10);
}

export class Fast2SmsOtpService implements OtpService {
  async sendOtp(mobile: string) {
    if (!API_URL) {
      return { ok: true as const, testMode: true, message: 'No OTP server URL — using test OTP' };
    }

    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: toPhone(mobile) }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        testMode?: boolean;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || `Send failed (${res.status})`);
      }
      return { ok: true as const, testMode: Boolean(data.testMode), message: data.message };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'OTP server unreachable';
      // Dev fallback so flow is not blocked if server is down
      if (__DEV__) {
        console.warn('[otp] falling back to mock:', msg);
        return { ok: true as const, testMode: true, message: msg };
      }
      throw e;
    }
  }

  async verifyOtp(mobile: string, code: string) {
    const trimmed = code.trim();

    if (!API_URL) {
      return { ok: trimmed === MOCK_OTP, message: trimmed === MOCK_OTP ? undefined : 'Invalid test OTP' };
    }

    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: toPhone(mobile), code: trimmed }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };

      if (data.ok) return { ok: true };

      // If server says not sent / expired and user enters mock in __DEV__, allow
      if (__DEV__ && trimmed === MOCK_OTP) {
        return { ok: true, message: 'Accepted mock OTP (dev)' };
      }

      return { ok: false, message: data.message || 'Incorrect OTP' };
    } catch {
      if (__DEV__ && trimmed === MOCK_OTP) {
        return { ok: true, message: 'OTP server offline — mock accepted' };
      }
      return { ok: false, message: 'Could not verify OTP. Check OTP server.' };
    }
  }
}

export const otpService = new Fast2SmsOtpService();
