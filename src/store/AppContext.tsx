import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { SAMPLE_NOTIFICATIONS } from '../data/sampleNotifications';
import { translate } from '../i18n';
import { createEmptyProfile } from '../services/validation';
import type {
  AppNotification,
  ApplicationStatus,
  CandidateProfile,
  Consents,
  GuideGender,
  JobApplication,
  LanguageCode,
  SpeechMode,
} from '../types';

const STORAGE_KEY = 'securityjob.m1.session';

interface PersistedState {
  language: LanguageCode;
  speechMode: SpeechMode;
  guide: GuideGender | null;
  audioOnly: boolean;
  onboardingComplete: boolean;
  registered: boolean;
  profile: CandidateProfile;
  application: JobApplication | null;
  savedJobIds: string[];
  rejectedJobIds: string[];
  notifications: AppNotification[];
}

interface AppContextValue extends PersistedState {
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLanguage: (lang: LanguageCode) => void;
  setSpeechMode: (mode: SpeechMode) => void;
  setGuide: (guide: GuideGender) => void;
  setAudioOnly: (value: boolean) => void;
  setConsents: (consents: Consents) => void;
  updateProfile: (patch: Partial<CandidateProfile>) => void;
  setProfileField: (field: keyof CandidateProfile, value: string | string[]) => void;
  completeRegistration: (profile: CandidateProfile) => void;
  setOnboardingComplete: (value: boolean) => void;
  saveJob: (jobId: string) => void;
  rejectJob: (jobId: string) => void;
  submitApplication: (jobId: string) => void;
  setApplicationStatus: (status: ApplicationStatus) => void;
  markNotificationRead: (id: string) => void;
  resetDemo: () => void;
  hydrated: boolean;
}

const defaultState: PersistedState = {
  language: 'en',
  speechMode: 'auto',
  guide: 'female',
  audioOnly: false,
  onboardingComplete: false,
  registered: false,
  profile: createEmptyProfile(),
  application: null,
  savedJobIds: [],
  rejectedJobIds: [],
  notifications: SAMPLE_NOTIFICATIONS,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          setState((prev) => ({
            ...prev,
            ...parsed,
            profile: { ...createEmptyProfile(), ...parsed.profile },
            notifications: parsed.notifications ?? SAMPLE_NOTIFICATIONS,
          }));
        }
      } catch {
        // ignore corrupt storage
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [state, hydrated]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(state.language, key, vars),
    [state.language],
  );

  const setLanguage = useCallback((language: LanguageCode) => {
    setState((s) => ({ ...s, language }));
  }, []);

  const setSpeechMode = useCallback((speechMode: SpeechMode) => {
    setState((s) => ({ ...s, speechMode }));
  }, []);

  const setGuide = useCallback((guide: GuideGender) => {
    setState((s) => ({ ...s, guide }));
  }, []);

  const setAudioOnly = useCallback((audioOnly: boolean) => {
    setState((s) => ({ ...s, audioOnly }));
  }, []);

  const setConsents = useCallback((consents: Consents) => {
    setState((s) => ({
      ...s,
      profile: { ...s.profile, consents },
    }));
  }, []);

  const updateProfile = useCallback((patch: Partial<CandidateProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  const setProfileField = useCallback(
    (field: keyof CandidateProfile, value: string | string[]) => {
      setState((s) => ({
        ...s,
        profile: { ...s.profile, [field]: value },
      }));
    },
    [],
  );

  const completeRegistration = useCallback((profile: CandidateProfile) => {
    setState((s) => ({
      ...s,
      profile,
      registered: true,
      onboardingComplete: true,
    }));
  }, []);

  const setOnboardingComplete = useCallback((onboardingComplete: boolean) => {
    setState((s) => ({ ...s, onboardingComplete }));
  }, []);

  const saveJob = useCallback((jobId: string) => {
    setState((s) => ({
      ...s,
      savedJobIds: s.savedJobIds.includes(jobId)
        ? s.savedJobIds
        : [...s.savedJobIds, jobId],
      rejectedJobIds: s.rejectedJobIds.filter((id) => id !== jobId),
    }));
  }, []);

  const rejectJob = useCallback((jobId: string) => {
    setState((s) => ({
      ...s,
      rejectedJobIds: s.rejectedJobIds.includes(jobId)
        ? s.rejectedJobIds
        : [...s.rejectedJobIds, jobId],
      savedJobIds: s.savedJobIds.filter((id) => id !== jobId),
    }));
  }, []);

  const submitApplication = useCallback((jobId: string) => {
    setState((s) => ({
      ...s,
      application: {
        id: `app-${Date.now()}`,
        jobId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const setApplicationStatus = useCallback((status: ApplicationStatus) => {
    setState((s) =>
      s.application ? { ...s, application: { ...s.application, status } } : s,
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      hydrated,
      t,
      setLanguage,
      setSpeechMode,
      setGuide,
      setAudioOnly,
      setConsents,
      updateProfile,
      setProfileField,
      completeRegistration,
      setOnboardingComplete,
      saveJob,
      rejectJob,
      submitApplication,
      setApplicationStatus,
      markNotificationRead,
      resetDemo,
    }),
    [
      state,
      hydrated,
      t,
      setLanguage,
      setSpeechMode,
      setGuide,
      setAudioOnly,
      setConsents,
      updateProfile,
      setProfileField,
      completeRegistration,
      setOnboardingComplete,
      saveJob,
      rejectJob,
      submitApplication,
      setApplicationStatus,
      markNotificationRead,
      resetDemo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
