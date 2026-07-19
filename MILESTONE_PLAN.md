# Security Job — Milestone Implementation Plan

**Product:** SecurityJob  
**Tagline:** Speak. Register. Find Your Security Job.  
**Organisation:** Agile Security Force Pvt. Ltd. / Agile Group  
**Stack:** React Native (Expo) · TypeScript · Expo Router · Supabase (later) · OpenAI (later)

---

## Requirement summary

Build an Android-first, multilingual, voice-first mobile app for Indian security-job candidates (limited literacy / digital experience / bandwidth). Candidates register by voice or typing, get job recommendations, apply, track status, and ask questions via an AI Security Library. Future roles: Recruiter, Branch Official, Head Office Admin, Library Admin.

**Milestone 1 constraint:** Foundation + candidate UI + typed registration + local validation + sample data. No paid APIs. No real SMS/OTP/transcription.

> **Note:** Candidate registration field list was truncated in the brief. Milestone 1 uses the standard security-recruitment fields listed under Milestone 1 below. Confirm or amend before Milestone 2.

---

## Architecture principles (all milestones)

| Principle | Approach |
|-----------|----------|
| Provider-agnostic | `services/` interfaces (speech, otp, jobs, ai-library); swap implementations later |
| Secrets off-device | Edge/server functions only from Milestone 2+ |
| i18n-first | All candidate UI strings in translation files (EN / TA / HI first) |
| Accessibility | Large controls, one question at a time, language switch on major screens, audio-only mode flag |
| Brand | Navy `#071D3B` / `#102F57`, red `#C51F2A`, gold `#D5A62E` — no police/military symbols; no new logos |

```
src/
  theme/          # colours, typography, spacing
  i18n/           # en.ts, ta.ts, hi.ts + LanguageContext
  data/           # sample jobs, FAQs, mock OTP, demo transcripts
  types/          # Candidate, Job, Application, etc.
  services/       # speech, otp, registration, jobs, library (mock in M1)
  store/          # candidate session, guide, language, consents
  components/     # GuidePortrait, BigButton, MicButton, ProgressBar, JobCard…
app/              # Expo Router screens
assets/images/    # male-agile-guide.png, female-agile-guide.png
```

---

## Milestone 1 — Candidate foundation (THIS BUILD)

**Goal:** Installable Expo app with full candidate navigation, translations, sample data, typed registration + local validation. Voice UI simulated only.

### Deliverables

1. **App foundation** — Expo + TypeScript + Expo Router, Android-first layout, theme tokens, service stubs  
2. **All 18 candidate-facing screens** (wired, navigable)  
3. **Navigation** — onboarding → registration → main candidate tabs/stack  
4. **Translation structure** — English, Tamil, Hindi; ready for more languages  
5. **AI Security Guide** — male/female selection; label “AI Security Guide”; asset paths as specified  
6. **Sample data** — jobs, library answers, notifications, mock OTP `123456`, demo transcripts  
7. **Typed registration** — one-question-at-a-time component; speak UI simulated  
8. **Local validation** — required fields, mobile format, consent gates, confirmation before submit  

### Candidate screens (M1)

| # | Screen | M1 behaviour |
|---|--------|----------------|
| 1 | Splash | Brand + tagline + Continue |
| 2 | Language | EN / TA / HI + speaker icon (local audio cue or visual only) |
| 3 | Guide selection | Male / Female images, highlight selection |
| 4 | Welcome | Guide + Start Registration / Learn / Support / Change Language |
| 5 | Privacy & Consent | 3 checkboxes; block until mandatory consent |
| 6 | Registration intro | Progress overview + Start |
| 7 | Voice/Typed registration | Mic simulation + typed input + repeat / edit / confirm |
| 8 | Information confirmation | Edit per field; mandatory complete to continue |
| 9 | OTP verification | Mock OTP, test-mode label, resend countdown, change mobile |
| 10 | Registration success | SJ-2026-000001 sample number + next actions |
| 11 | Suitable Jobs | Max 3 sample cards + actions |
| 12 | Job Details | Full sample detail + actions (no real call/WhatsApp deep-links required beyond `Linking`) |
| 13 | Application confirmation | Checkbox + submit → sample application |
| 14 | Application status | Visual tracker + terminal states |
| 15 | Candidate profile | Show registered / sample profile |
| 16 | Security Library | Categories + sample FAQs / demo answers |
| 17 | Human Support | Action list (local state / placeholders) |
| 18 | Notifications | Sample notification list |

### Registration fields (M1 — pending your confirmation)

| Field | Required | Notes |
|-------|----------|--------|
| Full name | Yes | |
| Mobile number | Yes | 10-digit Indian |
| Date of birth | Yes | Age derived; 18–60 typical |
| Gender | Yes | |
| Current city / location | Yes | |
| Preferred work locations | Yes | Multi-select sample cities |
| Preferred role | Yes | Guard / Supervisor / Gunman / Housekeeping (sample) |
| Years of experience | Yes | 0–30+ |
| Expected monthly salary | Yes | Number |
| Shift preference | Yes | Day / Night / Rotating / Any |
| Accommodation needed | Yes | Yes / No / Either |
| Available joining date | Yes | |
| Languages spoken | Yes | Multi-select |
| Highest education | Optional | |
| Ex-serviceman | Optional | Yes / No |
| Height (cm) | Optional | Common for site requirements |
| Aadhaar available | Optional | Yes / No (not collecting Aadhaar number in M1) |

### Explicitly out of scope for M1

- Real OpenAI / speech-to-text / TTS  
- Real SMS OTP / WhatsApp Business API  
- Supabase auth & database  
- Recruiter / Branch / HO / Library Admin apps  
- Production matching engine  
- Paid maps  

### Exit criteria

- App runs on Android emulator or Expo Go  
- Full candidate flow completable with typing  
- Language switch works on major screens  
- Guide selection persists through registration  
- Consent gates and field validation enforce rules  
- No paid API keys required  

**→ Stop here. User tests and approves before Milestone 2.**

---

## Milestone 2 — Persistence & real OTP

- Supabase project: auth (phone), `candidates`, `consents`, `applications`  
- Persist registration & profile  
- Real OTP via Supabase / SMS provider behind edge function  
- Secure session restore  
- Replace mock registration number with server sequence  

---

## Milestone 3 — Voice pipeline

- Speech-to-text via edge function (OpenAI or swappable provider)  
- TTS for questions / guide prompts  
- Record again / edit / confirm wired to real transcripts  
- Offline-tolerant queue for low bandwidth  
- Audio-only mode (spoken prompts + large mic, minimal reading)  

**Brought forward into M1 (option C):** Expo Go mic recording + Whisper hybrid  
(`auto` language detect + `manual` selected language). Languages: EN, HI, TA, TE, AS, OR.  
API key via `EXPO_PUBLIC_OPENAI_API_KEY` for local testing; move to edge function before production.  

---

## Milestone 4 — Jobs, apply & status

- Vacancy sync from Supabase  
- Recommendation rules (location, role, salary, shift, accommodation)  
- Apply / save / not interested persisted  
- Status tracker driven by recruiter updates  
- Push / in-app notifications  

---

## Milestone 5 — Security Library (AI)

- Approved document store (Library Admin uploads)  
- RAG / grounded answers from approved docs only  
- Unanswered-question queue for Library Admin  
- Voice ask + typed ask  
- Clear “from approved materials” labelling  

---

## Milestone 6 — Staff portals (Recruiter → HO)

- Recruiter: assigned candidates, calls, interviews, status, notes  
- Branch Official: vacancies, assign recruiters, follow-ups, reports  
- Head Office: branches, approve vacancies, access, audit, corrections  
- Role-based navigation (separate Expo routes or web admin later)  

---

## Milestone 7 — Library Admin & hardening

- Document upload, version, effective date, activate/deactivate  
- Review unanswered questions  
- Audit history, settings, performance on low-end Android  
- Play Store readiness (privacy policy, permissions copy, crash reporting)  

---

## Risk & dependency register

| Risk | Mitigation |
|------|------------|
| Guide PNGs not yet uploaded | Paths ready at `assets/images/*-agile-guide.png`. Temporary stand-ins used for M1 testing — replace with your official uploads (no face/uniform edits). |
| Registration fields incomplete in brief | Confirm field list before M2 schema freeze |
| Voice accuracy in noisy sites | M3: confirm/edit loop; typed fallback always available |
| Low literacy | One question at a time; TTS; large UI; audio-only mode |
| Provider lock-in | Service interfaces from day one |

---

## Milestone 1 approval checklist (for you)

- [ ] Splash → language → guide → welcome feel correct  
- [ ] Consent blocks registration until agreed  
- [ ] Typed registration + confirmation + mock OTP works  
- [ ] Jobs / details / apply / status / profile / library / support / notifications usable  
- [ ] EN / TA / HI strings look correct  
- [ ] Guide images (once uploaded) display without face/uniform edits  
- [ ] Approve Milestone 1 to proceed to Milestone 2  
`}