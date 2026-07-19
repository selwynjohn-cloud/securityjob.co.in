import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isTalking, stopTalking } from '../services/tts';

type ReplayFn = () => void | Promise<void>;

interface SpeechPlaybackValue {
  speaking: boolean;
  /** True when the current screen has a “speak this page” function registered */
  canReplay: boolean;
  stop: () => void;
  startAgain: () => void;
  /** Screens register their “speak this page” function here */
  setReplay: (fn: ReplayFn | null) => void;
  /**
   * Owner-safe clear: only wipes the registration if `fn` is still the one
   * currently registered. Prevents an unmounting/blurring screen from erasing
   * the replay that the newly focused screen just registered.
   */
  clearReplay: (fn: ReplayFn) => void;
  /**
   * Owner-safe stop+clear for screen blur. If another screen already claimed
   * replay, we must NOT cancel speech — that would silence the new page.
   */
  releaseReplay: (fn: ReplayFn) => void;
}

const SpeechPlaybackContext = createContext<SpeechPlaybackValue | null>(null);

export function SpeechPlaybackProvider({ children }: { children: React.ReactNode }) {
  const replayRef = useRef<ReplayFn | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [canReplay, setCanReplay] = useState(false);

  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      try {
        const on = await isTalking();
        if (mounted) setSpeaking(on);
      } catch {
        if (mounted) setSpeaking(false);
      }
    };
    tick();
    const id = setInterval(tick, 400);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const stop = useCallback(() => {
    stopTalking();
    setSpeaking(false);
  }, []);

  /**
   * Start Audio — invoke replay in the same turn as the button press so the
   * web audio session unlocks before OpenAI TTS fetch + expo-av play.
   */
  const startAgain = useCallback(() => {
    const fn = replayRef.current;
    if (!fn) return;
    setSpeaking(true);
    try {
      const result = fn();
      void Promise.resolve(result).finally(() => {
        setTimeout(async () => {
          try {
            setSpeaking(await isTalking());
          } catch {
            setSpeaking(false);
          }
        }, 300);
      });
    } catch {
      setSpeaking(false);
    }
  }, []);

  const setReplay = useCallback((fn: ReplayFn | null) => {
    replayRef.current = fn;
    setCanReplay(!!fn);
  }, []);

  const clearReplay = useCallback((fn: ReplayFn) => {
    if (replayRef.current === fn) {
      replayRef.current = null;
      setCanReplay(false);
    }
  }, []);

  const releaseReplay = useCallback((fn: ReplayFn) => {
    // Only the screen that still owns Start Audio may stop speech on blur.
    // Otherwise home→company navigation kills company speech mid-start.
    if (replayRef.current === fn) {
      replayRef.current = null;
      setCanReplay(false);
      stopTalking();
      setSpeaking(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      speaking,
      canReplay,
      stop,
      startAgain,
      setReplay,
      clearReplay,
      releaseReplay,
    }),
    [speaking, canReplay, stop, startAgain, setReplay, clearReplay, releaseReplay],
  );

  return (
    <SpeechPlaybackContext.Provider value={value}>{children}</SpeechPlaybackContext.Provider>
  );
}

export function useSpeechPlayback() {
  const ctx = useContext(SpeechPlaybackContext);
  if (!ctx) {
    throw new Error('useSpeechPlayback must be used within SpeechPlaybackProvider');
  }
  return ctx;
}
