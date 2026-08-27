"use client";

import { useEffect, useRef, useState } from "react";
import { isSpeechSupported, pauseSpeech, resumeSpeech, speak, stopSpeech } from "@/lib/speech";

type SpeechState = "idle" | "playing" | "paused";

/**
 * "Text vorlesen"-Button mit Start / Pause / Stop.
 * Ohne SpeechSynthesis-Unterstützung wird der Button deaktiviert angezeigt.
 */
export function ReadAloudButton({ text, label = "Text vorlesen" }: { text: string; label?: string }) {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<SpeechState>("idle");
  const mounted = useRef(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Browser-Feature erst nach dem Mount prüfbar (SSR)
    setSupported(isSpeechSupported());
    mounted.current = true;
    return () => {
      mounted.current = false;
      stopSpeech();
    };
  }, []);

  if (!supported) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted glass" role="status">
        🔇 Vorlesen wird von diesem Browser nicht unterstützt
      </span>
    );
  }

  const start = () => {
    speak(text, () => {
      if (mounted.current) setState("idle");
    });
    setState("playing");
  };

  const btn =
    "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium glass " +
    "hover:bg-[var(--glass-bg-strong)] cursor-pointer";

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {state === "idle" && (
        <button type="button" className={btn} onClick={start}>
          <span aria-hidden>🔊</span> {label}
        </button>
      )}
      {state === "playing" && (
        <button
          type="button"
          className={btn}
          onClick={() => {
            pauseSpeech();
            setState("paused");
          }}
        >
          <span aria-hidden>⏸️</span> Pause
        </button>
      )}
      {state === "paused" && (
        <button
          type="button"
          className={btn}
          onClick={() => {
            resumeSpeech();
            setState("playing");
          }}
        >
          <span aria-hidden>▶️</span> Weiter
        </button>
      )}
      {state !== "idle" && (
        <button
          type="button"
          className={btn}
          onClick={() => {
            stopSpeech();
            setState("idle");
          }}
        >
          <span aria-hidden>⏹️</span> Stopp
        </button>
      )}
    </span>
  );
}
