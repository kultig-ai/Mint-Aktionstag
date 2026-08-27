"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { loadJson, saveJson } from "./storage";

export type ThemeMode = "light" | "dark" | "system";

export type Settings = {
  theme: ThemeMode;
  easyLanguage: boolean;
  reduceMotion: boolean;
  largeText: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  easyLanguage: false,
  reduceMotion: false,
  largeText: false,
};

const STORAGE_KEY = "axt-settings";

type SettingsContextValue = {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applyToDocument(settings: Settings) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = settings.theme === "dark" || (settings.theme === "system" && systemDark);
  root.classList.toggle("dark", dark);
  root.classList.toggle("reduce-motion", settings.reduceMotion);
  root.classList.toggle("large-text", settings.largeText);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Erst nach dem Mount aus LocalStorage lesen (SSR-sicher, einmalige Hydration).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliges Nachladen des gespeicherten Zustands
    setSettings(loadJson(STORAGE_KEY, DEFAULT_SETTINGS));
  }, []);

  useEffect(() => {
    applyToDocument(settings);
    saveJson(STORAGE_KEY, settings);
  }, [settings]);

  // Bei Theme "System" auf Änderungen der Systemeinstellung reagieren.
  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyToDocument(settings);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [settings]);

  const update = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const value = useMemo(() => ({ settings, update }), [settings, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings muss innerhalb von SettingsProvider verwendet werden");
  return ctx;
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** true, wenn Animationen reduziert werden sollen (System ODER Website-Einstellung). */
export function useMotionAllowed(): boolean {
  const { settings } = useSettings();
  const systemReduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  return !settings.reduceMotion && !systemReduced;
}
