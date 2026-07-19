/**
 * Security Job OTP API — Fast2SMS Smart OTP
 * POST https://www.fast2sms.com/dev/otp/send
 * POST https://www.fast2sms.com/dev/otp/verify
 *
 * POST /send-otp   { phone: "9876543210" }
 * POST /verify-otp { phone: "9876543210", code: "123456" }
 * GET  /health
 */
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '32kb' }));

const PORT = Number(process.env.OTP_SERVER_PORT || 8787);
const API_KEY = process.env.FAST2SMS_API_KEY || '';
const OTP_ID = process.env.FAST2SMS_OTP_ID || '';

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 10 && /^[6-9]/.test(digits)) return digits;
  return null;
}

async function fast2smsPost(pathname, body) {
  if (!API_KEY) throw new Error('FAST2SMS_API_KEY missing in .env');
  const res = await fetch(`https://www.fast2sms.com${pathname}`, {
    method: 'POST',
    headers: {
      Authorization: API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    provider: 'fast2sms-smart-otp',
    keyConfigured: Boolean(API_KEY),
    otpIdConfigured: Boolean(OTP_ID),
    otpId: OTP_ID || null,
  });
});

app.post('/send-otp', async (req, res) => {
  try {
    const phone = normalizePhone(req.body?.phone);
    if (!phone) {
      return res.status(400).json({ ok: false, message: 'Enter a valid 10-digit Indian mobile.' });
    }
    if (!OTP_ID) {
      return res.status(500).json({ ok: false, message: 'FAST2SMS_OTP_ID missing in .env' });
    }

    const { res: upstream, data } = await fast2smsPost('/dev/otp/send', {
      mobile: phone,
      otp_id: OTP_ID,
      otp_length: 6,
      otp_expiry: 10,
    });

    if (!upstream.ok || data.return === false) {
      const msg = data.message || `Fast2SMS send HTTP ${upstream.status}`;
      throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }

    return res.json({
      ok: true,
      testMode: false,
      channel: 'sms',
      provider: 'fast2sms-smart-otp',
      requestId: data.request_id,
      expiresInSeconds: 600,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to send OTP';
    console.error('[send-otp]', message);
    return res.status(502).json({ ok: false, message });
  }
});

app.post('/verify-otp', async (req, res) => {
  try {
    const phone = normalizePhone(req.body?.phone);
    const code = String(req.body?.code || '').trim();

    if (!phone || !/^\d{4,10}$/.test(code)) {
      return res.status(400).json({ ok: false, message: 'Invalid phone or OTP.' });
    }
    const { res: upstream, data } = await fast2smsPost('/dev/otp/verify', {
      mobile: phone,
      otp: code,
    });

    if (!upstream.ok || data.return === false) {
      return res.status(400).json({
        ok: false,
        message: data.message || 'Incorrect or expired OTP',
      });
    }

    return res.json({ ok: true, provider: 'fast2sms-smart-otp' });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Verify failed';
    return res.status(502).json({ ok: false, message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Security Job OTP server on http://0.0.0.0:${PORT}`);
  console.log(`Smart OTP ID: ${OTP_ID || 'MISSING'}`);
});
