"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { throwSteps } from "@/data/content";
import { useBiText } from "@/lib/useBiText";
import { useMotionAllowed } from "@/lib/settings";
import { AxeDefs, AxeShape } from "../graphics/AxeSvg";
import { GlassCard } from "../ui/GlassCard";
import { ReadAloudButton } from "../ui/ReadAloudButton";
import { COURSE_STEPS, useProgress } from "@/lib/progress";

/**
 * Keyframes der Wurfanimation.
 * P: Scroll-Fortschritt 0..1, restliche Arrays: Werte an diesen Stützstellen.
 * Die Axt wird um ihren Schwerpunkt animiert, der Wurfarm rotiert um die Schulter.
 */
// Die Axt-Position beschreibt den Schwerpunkt. In den Halte-Phasen sind die
// Werte so gewählt, dass die Hand (Armende) das untere GRIFFENDE umfasst –
// das Griffende liegt bei Rotation r ca. 92px vom Schwerpunkt entfernt.
const P = [0, 0.18, 0.38, 0.52, 0.62, 0.85, 1];
const AXE_X = [148, 142, 20, 150, 300, 520, 655];
const AXE_Y = [140, 132, 98, 90, 130, 120, 162];
const AXE_R = [0, -10, -60, -20, 80, 260, 345];
const ARM_R = [0, -15, -170, -95, -60, -60, -60];

/** Segmente, in denen die einzelnen Erklärtexte sichtbar sind. */
const SEGMENTS: [number, number][] = [
  [0, 0.18],
  [0.18, 0.38],
  [0.38, 0.52],
  [0.52, 0.62],
  [0.62, 0.85],
  [0.85, 1],
];

/** Lineare Interpolation über die Keyframes (für die statische Variante). */
function sample(values: number[], p: number): number {
  if (p <= P[0]) return values[0];
  for (let i = 1; i < P.length; i++) {
    if (p <= P[i]) {
      const t = (p - P[i - 1]) / (P[i] - P[i - 1]);
      return values[i - 1] + t * (values[i] - values[i - 1]);
    }
  }
  return values[values.length - 1];
}

/** Statische Teile der Szene: Boden, Werfer:in, Zielscheibe. */
function SceneBase({ idPrefix }: { idPrefix: string }) {
  return (
    <>
      <AxeDefs id={idPrefix} />
      {/* Boden */}
      <line x1="0" y1="405" x2="800" y2="405" stroke="var(--muted)" strokeWidth="2" opacity="0.4" />
      {/* Zielscheibe rechts */}
      <rect x="640" y="60" width="120" height="345" rx="10" fill="#c89a68" />
      <line x1="680" y1="64" x2="680" y2="401" stroke="#8a5c34" strokeWidth="1.5" opacity="0.5" />
      <line x1="720" y1="64" x2="720" y2="401" stroke="#8a5c34" strokeWidth="1.5" opacity="0.5" />
      <circle cx="700" cy="165" r="58" fill="none" stroke="#33281c" strokeWidth="3.5" opacity="0.85" />
      <circle cx="700" cy="165" r="36" fill="none" stroke="#33281c" strokeWidth="3.5" opacity="0.85" />
      <circle cx="700" cy="165" r="14" fill="var(--target-red)" stroke="#33281c" strokeWidth="3" />
      {/* Werfer:in (Körper ohne Wurfarm) */}
      <circle cx="120" cy="150" r="17" fill="var(--foreground)" opacity="0.88" />
      <rect x="104" y="170" width="32" height="95" rx="14" fill="var(--foreground)" opacity="0.88" />
      <line x1="112" y1="262" x2="102" y2="400" stroke="var(--foreground)" strokeWidth="11" strokeLinecap="round" opacity="0.88" />
      <line x1="128" y1="262" x2="146" y2="400" stroke="var(--foreground)" strokeWidth="11" strokeLinecap="round" opacity="0.88" />
      <ellipse cx="99" cy="403" rx="17" ry="5.5" fill="var(--foreground)" opacity="0.88" />
      <ellipse cx="151" cy="403" rx="17" ry="5.5" fill="var(--foreground)" opacity="0.88" />
    </>
  );
}

function Arm({ rotate }: { rotate: number | MotionValue<number> }) {
  const content = (
    <>
      <line x1="0" y1="0" x2="28" y2="42" stroke="var(--foreground)" strokeWidth="11" strokeLinecap="round" opacity="0.88" />
      <circle cx="28" cy="42" r="8" fill="var(--accent-soft)" />
    </>
  );
  return (
    <g transform="translate(120 190)">
      {typeof rotate === "number" ? (
        <g style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "0px 0px", transformBox: "view-box" }}>{content}</g>
      ) : (
        <motion.g style={{ rotate, transformOrigin: "0px 0px" }}>{content}</motion.g>
      )}
    </g>
  );
}

function Axe({
  idPrefix,
  x,
  y,
  rotate,
}: {
  idPrefix: string;
  x: number | MotionValue<number>;
  y: number | MotionValue<number>;
  rotate: number | MotionValue<number>;
}) {
  const inner = (
    <g transform="scale(0.6) translate(-60 -90)">
      <AxeShape id={idPrefix} />
    </g>
  );
  if (typeof x === "number") {
    return (
      <g
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
          transformOrigin: "0px 0px",
          transformBox: "view-box",
        }}
      >
        {inner}
      </g>
    );
  }
  return (
    <motion.g style={{ x, y, rotate, transformOrigin: "0px 0px" }}>{inner}</motion.g>
  );
}

/** Scrollgesteuerte Variante. */
function AnimatedStory() {
  const t = useBiText();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const axeX = useTransform(scrollYProgress, P, AXE_X);
  const axeY = useTransform(scrollYProgress, P, AXE_Y);
  const axeR = useTransform(scrollYProgress, P, AXE_R);
  const armR = useTransform(scrollYProgress, P, ARM_R);
  const barWidth = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  // Für jeden Erklärtext eine Opacity-Kurve, an das jeweilige Segment gebunden.
  // Hooks müssen für alle Segmente in fester Reihenfolge aufgerufen werden.
  const captionOpacities = SEGMENTS.map(([start, end]) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks -- feste Array-Länge, stabile Hook-Reihenfolge
    useTransform(
      scrollYProgress,
      [Math.max(0, start - 0.02), start + 0.02, end - 0.04, Math.min(1, end + 0.01)],
      [0, 1, 1, 0]
    )
  );

  return (
    <div ref={containerRef} className="relative" style={{ height: "420vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4">
        <GlassCard strong className="w-full max-w-5xl overflow-hidden p-4 sm:p-6">
          <svg viewBox="0 0 800 450" className="w-full" aria-hidden>
            <SceneBase idPrefix="story" />
            <Arm rotate={armR} />
            <Axe idPrefix="story" x={axeX} y={axeY} rotate={axeR} />
          </svg>
          {/* Erklärtexte: eigener Bereich UNTER der Szene, damit sie die
              Animation auf kleinen Bildschirmen nicht verdecken. */}
          <div className="relative mt-3 min-h-36 sm:min-h-28">
            {throwSteps.map((step, i) => (
              <motion.div
                key={step.title}
                style={{ opacity: captionOpacities[i] }}
                className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
              >
                <div className="glass-strong max-w-md rounded-2xl px-5 py-3 text-center">
                  <p className="text-sm font-bold text-accent">
                    {i + 1}/6 · {step.title}
                  </p>
                  <p className="mt-0.5 text-sm sm:text-base">{t(step.text)}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Fortschrittsbalken der Animation */}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-soft to-accent"
              style={{ width: barWidth }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            Scrolle weiter, um den Wurf ablaufen zu sehen
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

/** Statische Variante bei reduzierter Bewegung: Storyboard mit 6 Standbildern. */
function StaticStory() {
  const t = useBiText();
  const FRAMES = [0.08, 0.3, 0.45, 0.56, 0.74, 1];
  return (
    <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {throwSteps.map((step, i) => {
        const p = FRAMES[i];
        return (
          <GlassCard key={step.title} className="overflow-hidden">
            <svg viewBox="0 0 800 450" className="w-full" aria-hidden>
              <SceneBase idPrefix={`static-${i}`} />
              <Arm rotate={sample(ARM_R, p)} />
              <Axe
                idPrefix={`static-${i}`}
                x={sample(AXE_X, p)}
                y={sample(AXE_Y, p)}
                rotate={sample(AXE_R, p)}
              />
            </svg>
            <div className="p-4">
              <p className="text-sm font-bold text-accent">
                {i + 1}/6 · {step.title}
              </p>
              <p className="mt-1 text-sm">{t(step.text)}</p>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

export function ScrollStory() {
  const t = useBiText();
  const motionAllowed = useMotionAllowed();
  const stepIndex = COURSE_STEPS.findIndex((s) => s.id === "wurf");
  const { markComplete } = useProgress();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          markComplete("wurf");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [markComplete]);

  return (
    <section
      ref={sectionRef}
      id="wurf"
      aria-labelledby="wurf-heading"
      className="scroll-mt-24 py-16 md:py-24"
    >
      <div className="mx-auto mb-8 max-w-4xl px-4 sm:px-6 md:mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          Schritt {stepIndex + 1} von {COURSE_STEPS.length}
        </p>
        <h2 id="wurf-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
          Der komplette Bewegungsablauf
        </h2>
        <div className="mt-4">
          <ReadAloudButton
            text={
              "Der komplette Bewegungsablauf. " +
              throwSteps.map((s, i) => `Phase ${i + 1}, ${s.title}: ${t(s.text)}`).join(" ")
            }
          />
        </div>
      </div>
      {motionAllowed ? <AnimatedStory /> : <StaticStory />}
    </section>
  );
}
