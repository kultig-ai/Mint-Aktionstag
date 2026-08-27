"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gripData } from "@/data/content";
import { useBiText } from "@/lib/useBiText";
import { useMotionAllowed } from "@/lib/settings";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";
import { AxeDefs, AxeShape } from "../graphics/AxeSvg";

function GripIllustration({ grip }: { grip: "one-hand" | "two-hand" }) {
  return (
    <svg viewBox="0 0 200 300" className="mx-auto w-40 sm:w-48" aria-hidden>
      <AxeDefs id={`grip-${grip}`} />
      <g transform="translate(40 10)">
        <AxeShape id={`grip-${grip}`} />
        {grip === "two-hand" ? (
          <g>
            {/* Zwei Hände übereinander am Griffende */}
            <ellipse cx="60" cy="200" rx="22" ry="14" fill="var(--accent-soft)" opacity="0.95" />
            <ellipse cx="60" cy="226" rx="22" ry="14" fill="var(--accent)" opacity="0.95" />
            <text x="94" y="205" fontSize="13" fill="var(--muted)">Hand 1</text>
            <text x="94" y="231" fontSize="13" fill="var(--muted)">Hand 2</text>
          </g>
        ) : (
          <g>
            {/* Eine Hand am Griffende, Daumen seitlich */}
            <ellipse cx="60" cy="216" rx="23" ry="16" fill="var(--accent)" opacity="0.95" />
            <ellipse cx="42" cy="206" rx="7" ry="11" fill="var(--accent-soft)" opacity="0.95" />
            <text x="94" y="221" fontSize="13" fill="var(--muted)">Wurfhand</text>
          </g>
        )}
      </g>
    </svg>
  );
}

export function Grip() {
  const t = useBiText();
  const motionAllowed = useMotionAllowed();
  const [gripId, setGripId] = useState<"one-hand" | "two-hand">("two-hand");
  const grip = gripData.find((g) => g.id === gripId) ?? gripData[0];

  return (
    <Section
      id="griff"
      title="Der richtige Griff"
      stepId="griff"
      readAloudText={
        "Der richtige Griff. " +
        gripData.map((g) => `${g.name}: ${t(g.intro)}`).join(" ")
      }
    >
      <div
        className="mb-6 inline-flex rounded-2xl p-1 glass"
        role="tablist"
        aria-label="Griffart wählen"
      >
        {gripData.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={g.id === gripId}
            onClick={() => setGripId(g.id)}
            className={`min-h-11 rounded-xl px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              g.id === gripId
                ? "bg-accent text-accent-contrast shadow-md"
                : "text-muted hover:text-foreground"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <GlassCard className="overflow-hidden p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={grip.id}
            initial={motionAllowed ? { opacity: 0, x: 16 } : false}
            animate={motionAllowed ? { opacity: 1, x: 0 } : undefined}
            exit={motionAllowed ? { opacity: 0, x: -16 } : undefined}
            transition={{ duration: 0.25 }}
            className="grid items-center gap-8 md:grid-cols-2"
          >
            <GripIllustration grip={grip.id} />
            <div>
              <p className="text-lg leading-relaxed">{t(grip.intro)}</p>
              <ul className="mt-5 space-y-4">
                {grip.points.map((point, i) => (
                  <li key={point.title} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent"
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-semibold">{point.title}.</span>{" "}
                      <span className="text-muted">{t(point.text)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </Section>
  );
}
