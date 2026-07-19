# Security Job

**Speak. Register. Find Your Security Job.**  
Agile Security Force Pvt. Ltd. / Agile Group · [securityjob.co.in](https://www.securityjob.co.in)

Android-first, multilingual, voice-first candidate app (Expo + TypeScript). Same EOI registration as the website.

## Milestone 1 (current)

Candidate foundation: voice registration, live vacancies from securityjob.co.in, EN/TA/HI UI, Whisper STT, guide TTS.

See [MILESTONE_PLAN.md](./MILESTONE_PLAN.md) for the full milestone roadmap.

## Run

```bash
cd ~/Projects/SecurityJob
npm start
```

Then press `a` for Android emulator / Expo Go, or scan the QR code.

### Demo OTP

Use test OTP: **123456** (no real SMS).

### Guide images

Place official assets at:

- `assets/images/male-agile-guide.png`
- `assets/images/female-agile-guide.png`

Replace any temporary placeholders with your approved Agile Security Guide images (do not edit faces/uniforms).

## Structure

```
app/                 Expo Router screens
src/theme/           Brand colours & typography
src/i18n/            en / ta / hi (+ ready for more)
src/data/            Sample jobs, FAQs, questions
src/services/        speech, otp, jobs, validation (mockable)
src/store/           Session + candidate state
src/components/      Shared UI
```
