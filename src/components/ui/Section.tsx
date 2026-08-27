"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionAllowed } from "@/lib/settings";
import { useProgress, type StepId, COURSE_STEPS } from "@/lib/progress";
import { ReadAloudButton } from "./ReadAloudButton";

type SectionProps = {
  id: string;
  kicker?: string;
  title: string;
  /** Text für die Vorlesefunktion (i. d. R. Titel + Einleitung). */
  readAloudText?: string;
  /** Wenn gesetzt, wird dieser Kursschritt beim Ansehen als erledigt markiert. */
  stepId?: StepId;
  children: ReactNode;
  wide?: boolean;
};

export function Section({ id, kicker, title, readAloudText, stepId, children, wide }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { markComplete, completed } = useProgress();
  const motionAllowed = useMotionAllowed();

  // Kursschritt als erledigt markieren, sobald die Sektion zur Hälfte gesehen wurde.
  useEffect(() => {
    if (!stepId || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          markComplete(stepId);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stepId, markComplete]);

  const stepIndex = stepId ? COURSE_STEPS.findIndex((s) => s.id === stepId) : -1;
  const done = stepId ? completed.includes(stepId) : false;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-24"
    >
      <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
        <motion.header
          initial={motionAllowed ? { opacity: 0, y: 24 } : false}
          whileInView={motionAllowed ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          {stepIndex >= 0 && (
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              Schritt {stepIndex + 1} von {COURSE_STEPS.length}
              {done && (
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success/20 text-xs text-success"
                  title="Abgeschlossen"
                >
                  ✓<span className="sr-only">abgeschlossen</span>
                </span>
              )}
            </p>
          )}
          {kicker && stepIndex < 0 && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{kicker}</p>
          )}
          <h2 id={`${id}-heading`} className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
          {readAloudText && (
            <div className="mt-4">
              <ReadAloudButton text={readAloudText} />
            </div>
          )}
        </motion.header>
        {children}
      </div>
    </section>
  );
}
