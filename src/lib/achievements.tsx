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

export const ACHIEVEMENTS = [
  { id: "first-throw", icon: "🪓", title: "Erster Wurf", text: "Du hast deine erste Axt geworfen." },
  { id: "first-stick", icon: "🎯", title: "Erster Treffer", text: "Deine Axt ist stecken geblieben." },
  { id: "bullseye", icon: "🏆", title: "Bullseye", text: "Volltreffer in die Mitte!" },
  { id: "streak-5", icon: "🔥", title: "Serie", text: "5 Treffer hintereinander." },
  { id: "tutorial-done", icon: "🎓", title: "Kurs abgeschlossen", text: "Alle 7 Lernschritte gemeistert." },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];

const STORAGE_KEY = "axt-achievements";

type AchievementsContextValue = {
  unlocked: AchievementId[];
  unlock: (id: AchievementId) => void;
  /** Zuletzt freigeschaltetes Achievement für die Toast-Anzeige. */
  lastUnlocked: AchievementId | null;
  clearToast: () => void;
};

const AchievementsContext = createContext<AchievementsContextValue | null>(null);

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<AchievementId[]>([]);
  const [lastUnlocked, setLastUnlocked] = useState<AchievementId | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliges Nachladen des gespeicherten Zustands
    setUnlocked(loadJson<{ unlocked: AchievementId[] }>(STORAGE_KEY, { unlocked: [] }).unlocked);
  }, []);

  const unlock = useCallback((id: AchievementId) => {
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveJson(STORAGE_KEY, { unlocked: next });
      setLastUnlocked(id);
      return next;
    });
  }, []);

  const clearToast = useCallback(() => setLastUnlocked(null), []);

  const value = useMemo(
    () => ({ unlocked, unlock, lastUnlocked, clearToast }),
    [unlocked, unlock, lastUnlocked, clearToast]
  );

  return <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>;
}

export function useAchievements(): AchievementsContextValue {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error("useAchievements muss innerhalb von AchievementsProvider verwendet werden");
  return ctx;
}
