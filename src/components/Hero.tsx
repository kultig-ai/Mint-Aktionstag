"use client";

import { motion } from "framer-motion";
import { useMotionAllowed } from "@/lib/settings";
import { LinkButton } from "./ui/Button";
import { GlassCard } from "./ui/GlassCard";
import { AxeDefs, AxeShape } from "./graphics/AxeSvg";
import { TargetDefs, TargetShape } from "./graphics/TargetSvg";

export function Hero() {
  const motionAllowed = useMotionAllowed();

  return (
    <section id="top" aria-label="Einstieg" className="px-4 pb-8 pt-28 sm:px-6 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <motion.div
          initial={motionAllowed ? { opacity: 0, y: 30 } : false}
          animate={motionAllowed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium glass">
            <span aria-hidden>🎯</span> Interaktiver Anfängerkurs
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Lerne Axtwerfen.
            <br />
            <span className="bg-gradient-to-r from-accent-soft to-accent bg-clip-text text-transparent">
              Schritt für Schritt.
            </span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Von deinem ersten Griff bis zum Treffer in der Zielscheibe – mit Animationen,
            Simulationen und einem Übungsspiel direkt im Browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="#lernen">Lernen starten</LinkButton>
            <LinkButton href="#standorte" variant="secondary">
              Standort finden
            </LinkButton>
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted">
            <span aria-hidden>⚠️</span>
            <span>
              Axtwerfen nur an sicheren Orten üben – am besten zuerst in einer professionellen
              Halle unter Anleitung.
            </span>
          </p>
        </motion.div>

        {/* Animierte Szene: Axt fliegt zur Zielscheibe */}
        <motion.div
          initial={motionAllowed ? { opacity: 0, scale: 0.94 } : false}
          animate={motionAllowed ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <GlassCard className="relative overflow-hidden p-6 sm:p-8" aria-hidden>
            <div className="relative mx-auto flex max-w-md items-center justify-center">
              <svg viewBox="0 0 420 300" className="w-full">
                <AxeDefs id="hero-axe" />
                {/* Flugbahn */}
                <path
                  d="M30 190 Q160 90 300 130"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeDasharray="2 10"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                {/* Zielscheibe rechts */}
                <TargetDefs id="hero-target" />
                <g transform="translate(255, 55) scale(0.75)">
                  <TargetShape id="hero-target" />
                </g>
                {/* Fliegende, rotierende Axt */}
                <motion.g
                  style={{ transformOrigin: "0px 0px" }}
                  initial={false}
                  animate={
                    motionAllowed
                      ? { x: [40, 330], y: [185, 118, 130], rotate: [0, 340] }
                      : { x: 330, y: 130, rotate: 340 }
                  }
                  transition={
                    motionAllowed
                      ? {
                          duration: 2.4,
                          repeat: Infinity,
                          repeatDelay: 1.8,
                          ease: "easeOut",
                        }
                      : undefined
                  }
                >
                  <g transform="scale(0.42) translate(-60 -90)">
                    <AxeShape id="hero-axe" />
                  </g>
                </motion.g>
              </svg>
            </div>
            <p className="mt-4 text-center text-sm text-muted">
              Abstand + Rotation = Treffer. Genau das lernst du hier.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
