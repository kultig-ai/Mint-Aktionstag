"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadJson, saveJson } from "./storage";

/** Die 7 Lernschritte des Kurses, in Reihenfolge. */
export const COURSE_STEPS = [
  { id: "sicherheit", label: "Sicherheit" },
  { id: "axt", label: "Die Axt" },
  { id: "griff", label: "Der Griff" },
  { id: "haltung", label: "Körperhaltung" },
  { id: "wurf", label: "Der Wurf" },
  { id: "rotation", label: "Rotation & Abstand" },
  { id: "fehler", label: "Fehler vermeiden" },
] as const;

export type StepId = (typeof COURSE_STEPS)[number]["id"];

const STORAGE_KEY = "axt-progress";

type ProgressContextValue = {
  completed: StepId[];
  markComplete: (id: StepId) => void;
  reset: () => void;
  percent: number;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<StepId[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliges Nachladen des gespeicherten Zustands
    setCompleted(loadJson<{ completed: StepId[] }>(STORAGE_KEY, { completed: [] }).completed);
  }, []);

  const markComplete = useCallback((id: StepId) => {
    setCompleted((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveJson(STORAGE_KEY, { completed: next });
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCompleted([]);
    saveJson(STORAGE_KEY, { completed: [] });
  }, []);

  const percent = Math.round((completed.length / COURSE_STEPS.length) * 100);

  const value = useMemo(
    () => ({ completed, markComplete, reset, percent }),
    [completed, markComplete, reset, percent]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress muss innerhalb von ProgressProvider verwendet werden");
  return ctx;
}
