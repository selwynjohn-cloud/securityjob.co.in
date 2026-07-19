import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { stopTalking, talkAsGuide } from '../services/tts';
import { useApp } from '../store/AppContext';
import { useSpeechPlayback } from '../store/SpeechPlayback';

type ExtraText = string | (() => string | Promise<string>);

function isThenable(value: unknown): value is Promise<string> {
  return (
    !!value &&
    typeof value === 'object' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (value as any).then === 'function'
  );
}

/** Speak guide script when a screen opens; stop on leave. */
export function useGuideSpeech(
  scriptKey: string,
  enabled = true,
  extraText?: ExtraText,
) {
  const { t, language, guide } = useApp();
  const { setReplay, clearReplay, releaseReplay } = useSpeechPlayback();
  const [speaking, setSpeaking] = useState(false);
  const runId = useRef(0);
  const hasSpoken = useRef(false);
  const gender = guide ?? 'female';

  // Keep the latest translate fn + extraText in refs so `speak` has a STABLE
  // identity. Previously an inline extraText (e.g. () => t('...')) changed on
  // every render, which re-created `speak`, which re-ran the auto-speak effect
  // below on every render — restarting speech endlessly and defeating Stop.
  const tRef = useRef(t);
  const extraRef = useRef(extraText);
  useEffect(() => {
    tRef.current = t;
    extraRef.current = extraText;
  });

  /**
   * Resolve text and call talkAsGuide. OpenAI TTS + expo-av unlocks audio on
   * the Start Audio tap; keep sync text resolution so unlock runs immediately.
   */
  const speak = useCallback(() => {
    const id = ++runId.current;
    const base = tRef.current(scriptKey) || '';
    const extra = extraRef.current;

    const runWithText = (text: string) => {
      if (id !== runId.current) return;
      const cleaned = text.trim();
      if (!cleaned) return;
      setSpeaking(true);
      void talkAsGuide(cleaned, language, gender).finally(() => {
        if (id === runId.current) setSpeaking(false);
      });
    };

    if (extra == null) {
      runWithText(base);
      return;
    }

    if (typeof extra === 'string') {
      runWithText(extra.trim() ? `${base} ${extra.trim()}` : base);
      return;
    }

    // Function extra — call it NOW. If it returns a plain string, stay sync
    // (splash uses () => t('...')). Only Promise results go async.
    let result: string | Promise<string>;
    try {
      result = extra();
    } catch {
      runWithText(base);
      return;
    }

    if (!isThenable(result)) {
      const bit = String(result || '').trim();
      runWithText(bit ? `${base} ${bit}` : base);
      return;
    }

    // Async extra (e.g. live vacancies). On web, speak the base script in this
    // same turn so Start Audio keeps Safari's user gesture. Vacancy text is
    // skipped on web Start Audio rather than silently killing all speech.
    if (Platform.OS === 'web') {
      runWithText(base);
      return;
    }

    void Promise.resolve(result).then((resolved) => {
      if (id !== runId.current) return;
      const bit = resolved?.trim();
      runWithText(bit ? `${base} ${bit}` : base);
    });
  }, [scriptKey, language, gender]);

  // Register/clear the replay based on FOCUS, not just mount. With the Expo
  // Router stack, pushing a new screen leaves the old one mounted, and popping
  // back never re-runs a plain mount effect — both leave the shared replay
  // pointing at the wrong (or a null) screen. useFocusEffect makes the screen
  // that is actually on top always own “Start Audio”, and clears it on blur so
  // a page with no guide script can’t replay the previous page.
  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        clearReplay(speak);
        return;
      }
      // Register Start Audio BEFORE auto-speak so a blocked autoplay still
      // leaves a working gold Start Audio button on web.
      setReplay(speak);
      // Auto-speak once when the screen first opens (preserve prior behaviour):
      // don’t re-speak every time the visitor navigates back to it.
      // On web, autoplay is often blocked — Start Audio remains the reliable path.
      if (!hasSpoken.current) {
        hasSpoken.current = true;
        speak();
      }
      return () => {
        runId.current += 1;
        setSpeaking(false);
        // Owner-safe: do not cancel if the next screen already claimed replay.
        releaseReplay(speak);
      };
    }, [enabled, speak, setReplay, clearReplay, releaseReplay]),
  );

  return { speaking, speakAgain: speak, stop: stopTalking };
}
