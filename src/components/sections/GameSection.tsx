"use client";

import dynamic from "next/dynamic";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";

// Das Spiel wird nur im Browser und erst bei Bedarf geladen (Code Splitting).
const AxeGame = dynamic(() => import("../game/AxeGame").then((m) => m.AxeGame), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[9/5] w-full items-center justify-center rounded-2xl bg-[var(--background-accent)]">
      <p className="text-muted">Spiel wird geladen …</p>
    </div>
  ),
});

export function GameSection() {
  return (
    <Section
      id="spiel"
      kicker="Üben"
      title="Übungsspiel: Wirf die Axt!"
      readAloudText="Übungsspiel: Wirf die Axt. Halte die Maus oder den Finger gedrückt, um Kraft aufzubauen. Bewege den Zeiger nach oben oder unten für den Winkel. Lass los, um zu werfen. Du hast fünf Würfe pro Runde."
      wide
    >
      <p className="mb-6 max-w-2xl text-lg text-muted">
        Wende an, was du gelernt hast: Kraft, Winkel und Rotation entscheiden, ob die Axt stecken
        bleibt. 5 Würfe pro Runde – schaffst du das Bullseye?
      </p>
      <GlassCard className="p-4 sm:p-6">
        <AxeGame />
      </GlassCard>
    </Section>
  );
}
