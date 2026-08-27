"use client";

import { ACHIEVEMENTS, useAchievements } from "@/lib/achievements";
import { COURSE_STEPS, useProgress } from "@/lib/progress";
import { useEffect } from "react";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";

export function AchievementsSection() {
  const { unlocked, unlock } = useAchievements();
  const { completed, percent } = useProgress();

  // Kurs-Achievement freischalten, wenn alle Lernschritte gesehen wurden.
  useEffect(() => {
    if (completed.length === COURSE_STEPS.length) unlock("tutorial-done");
  }, [completed, unlock]);

  return (
    <Section id="erfolge" kicker="Dein Fortschritt" title="Erfolge & Abzeichen" wide>
      <GlassCard className="mb-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold">Lernfortschritt: {percent} % abgeschlossen</p>
          <p className="text-sm text-muted">
            {completed.length} von {COURSE_STEPS.length} Schritten
          </p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-soft to-accent transition-[width] duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <ol className="mt-4 flex flex-wrap gap-2">
          {COURSE_STEPS.map((step, i) => {
            const done = completed.includes(step.id);
            return (
              <li
                key={step.id}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  done ? "bg-success/15 text-success" : "glass text-muted"
                }`}
              >
                <span aria-hidden>{done ? "✓" : i + 1}</span>
                {step.label}
                <span className="sr-only">{done ? " – abgeschlossen" : " – noch offen"}</span>
              </li>
            );
          })}
        </ol>
      </GlassCard>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.includes(achievement.id);
          return (
            <li key={achievement.id}>
              <GlassCard
                className={`h-full p-5 text-center transition-opacity ${isUnlocked ? "" : "opacity-45"}`}
              >
                <span aria-hidden className={`text-4xl ${isUnlocked ? "" : "grayscale"}`}>
                  {achievement.icon}
                </span>
                <p className="mt-2 font-bold">{achievement.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {isUnlocked ? achievement.text : "Noch gesperrt"}
                </p>
                <span className="sr-only">{isUnlocked ? "Freigeschaltet" : "Noch nicht freigeschaltet"}</span>
              </GlassCard>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
