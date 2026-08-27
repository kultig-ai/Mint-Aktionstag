"use client";

import { useState } from "react";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";
import { AxeSvg } from "../graphics/AxeSvg";

/**
 * TODO: Später echtes Erklärvideo einbinden.
 * Geplant: <video> mit Poster, Untertiteln (VTT) und Transkript –
 * die Quelle hier eintragen und den Platzhalter-Zustand entfernen.
 */
export function VideoPlaceholder() {
  const [clicked, setClicked] = useState(false);

  return (
    <Section
      id="video"
      kicker="Bald verfügbar"
      title="Der komplette Wurf erklärt"
    >
      <GlassCard className="overflow-hidden">
        <div className="relative aspect-video w-full bg-gradient-to-br from-[#2c2118] to-[#14110e]">
          {/* Poster-Platzhalter */}
          <div aria-hidden className="absolute inset-0 flex items-center justify-center opacity-20">
            <AxeSvg id="video-poster" className="h-2/3" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <button
              type="button"
              onClick={() => setClicked(true)}
              aria-label="Erklärvideo abspielen (noch nicht verfügbar)"
              className="flex h-20 w-20 items-center justify-center rounded-full glass-strong text-3xl text-white transition-transform hover:scale-105 cursor-pointer"
            >
              <span aria-hidden className="ml-1">▶</span>
            </button>
            <p aria-live="polite" className="max-w-sm text-sm text-white/80">
              {clicked
                ? "Das Erklärvideo wird gerade produziert und bald hier eingebunden. Bis dahin zeigt dir die Scroll-Animation oben jeden Schritt des Wurfs."
                : "Hier entsteht ein ausführliches Erklärvideo mit dem kompletten Bewegungsablauf in Zeitlupe."}
            </p>
          </div>
        </div>
      </GlassCard>
    </Section>
  );
}
