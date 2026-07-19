import { useCallback, useEffect, useRef, useState } from 'react';
import { stopTalking, talkAsGuide } from '../services/tts';
import { useApp } from '../store/AppContext';

type ExtraText = string | (() => string | Promise<string>);

/** Speak guide script when a screen opens; stop on leave. */
export function useGuideSpeech(
  scriptKey: string,
  enabled = true,
  extraText?: ExtraText,
) {
  const { t, language } = useApp();
  const [speaking, setSpeaking] = useState(false);
  const runId = useRef(0);

  const speak = useCallback(async () => {
    const id = ++runId.current;
    let text = t(scriptKey);
    if (extraText) {
      const extra =
        typeof extraText === 'function' ? await extraText() : extraText;
      if (extra?.trim()) text = `${text} ${extra.trim()}`;
    }
    setSpeaking(true);
    stopTalking();
    await talkAsGuide(text, language);
    if (id === runId.current) setSpeaking(false);
  }, [extraText, language, scriptKey, t]);

  useEffect(() => {
    if (!enabled) return;
    speak();
    return () => {
      runId.current += 1;
      stopTalking();
      setSpeaking(false);
    };
  }, [enabled, speak]);

  return { speaking, speakAgain: speak, stop: stopTalking };
}
