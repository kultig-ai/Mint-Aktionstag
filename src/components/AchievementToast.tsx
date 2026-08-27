"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ACHIEVEMENTS, useAchievements } from "@/lib/achievements";
import { useMotionAllowed } from "@/lib/settings";

/** Kleine Erfolgsmeldung unten rechts, wenn ein Achievement freigeschaltet wird. */
export function AchievementToast() {
  const { lastUnlocked, clearToast } = useAchievements();
  const motionAllowed = useMotionAllowed();
  const achievement = ACHIEVEMENTS.find((a) => a.id === lastUnlocked);

  useEffect(() => {
    if (!lastUnlocked) return;
    const timer = setTimeout(clearToast, 4200);
    return () => clearTimeout(timer);
  }, [lastUnlocked, clearToast]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60]">
      <AnimatePresence>
        {achievement && (
          <motion.div
            key={achievement.id}
            initial={motionAllowed ? { opacity: 0, y: 24, scale: 0.95 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass-strong flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl"
          >
            <span aria-hidden className="text-3xl">{achievement.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Erfolg freigeschaltet
              </p>
              <p className="font-bold">{achievement.title}</p>
              <p className="text-sm text-muted">{achievement.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
