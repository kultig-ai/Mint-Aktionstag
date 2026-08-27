"use client";

import { useState } from "react";
import { axeParts } from "@/data/content";
import { useBiText } from "@/lib/useBiText";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";
import { AxeSvg } from "../graphics/AxeSvg";

/** Hotspot-Positionen in Prozent des Axt-Containers (viewBox 120×260). */
const SPOTS: Record<string, { left: string; top: string }> = {
  kopf: { left: "42%", top: "24%" },
  schneide: { left: "88%", top: "27%" },
  schwerpunkt: { left: "54%", top: "40%" },
  griff: { left: "50%", top: "72%" },
};

export function AxeAnatomy() {
  const t = useBiText();
  const [activeId, setActiveId] = useState(axeParts[0].id);
  const active = axeParts.find((p) => p.id === activeId) ?? axeParts[0];

  return (
    <Section
      id="axt"
      title="Lerne deine Axt kennen"
      stepId="axt"
      readAloudText={
        "Die Teile einer Wurfaxt. " + axeParts.map((p) => `${p.name}: ${t(p.text)}`).join(" ")
      }
    >
      <GlassCard className="p-6 sm:p-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="relative mx-auto w-48 sm:w-56">
            <AxeSvg id="anatomy" className="w-full" title="Wurfaxt mit markierten Bauteilen" />
            {axeParts.map((part) => {
              const isActive = part.id === activeId;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setActiveId(part.id)}
                  aria-pressed={isActive}
                  aria-label={`${part.name} anzeigen`}
                  className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "scale-110 border-accent bg-accent text-accent-contrast shadow-lg shadow-accent/40"
                      : "border-accent/60 bg-[var(--glass-bg-strong)] text-accent hover:scale-105"
                  }`}
                  style={SPOTS[part.id]}
                >
                  {axeParts.indexOf(part) + 1}
                </button>
              );
            })}
          </div>
          <div aria-live="polite">
            <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Bauteile der Axt">
              {axeParts.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  role="tab"
                  aria-selected={part.id === activeId}
                  onClick={() => setActiveId(part.id)}
                  className={`min-h-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                    part.id === activeId
                      ? "bg-accent text-accent-contrast"
                      : "glass hover:bg-[var(--glass-bg-strong)]"
                  }`}
                >
                  {part.name}
                </button>
              ))}
            </div>
            <h3 className="text-2xl font-bold">{active.name}</h3>
            <p className="mt-2 text-lg leading-relaxed text-muted">{t(active.text)}</p>
          </div>
        </div>
      </GlassCard>
    </Section>
  );
}
