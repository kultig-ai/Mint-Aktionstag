"use client";

import { useState } from "react";
import { safetyRules, safetyHazards } from "@/data/content";
import { useBiText } from "@/lib/useBiText";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";

/** Positionen der Gefahren-Hotspots in Prozent der Szene. */
const HAZARD_SPOTS: Record<string, { left: string; top: string }> = {
  "open-shoes": { left: "9%", top: "78%" },
  drink: { left: "24%", top: "62%" },
  "damaged-axe": { left: "41%", top: "80%" },
  "person-in-lane": { left: "60%", top: "42%" },
};

function SafetyScene() {
  return (
    <svg viewBox="0 0 600 300" className="w-full" aria-hidden>
      {/* Rückwand & Boden */}
      <rect x="0" y="0" width="600" height="260" fill="var(--background-accent)" />
      <rect x="0" y="255" width="600" height="45" fill="#8a5c34" opacity="0.5" />
      <line x1="0" y1="255" x2="600" y2="255" stroke="#5c3d22" strokeWidth="2" opacity="0.6" />
      {/* Wurflinie */}
      <line x1="140" y1="180" x2="140" y2="255" stroke="var(--accent)" strokeWidth="3" strokeDasharray="8 6" />
      <text x="146" y="196" fontSize="12" fill="var(--muted)">Wurflinie</text>

      {/* Zielscheibe an der Wand rechts */}
      <rect x="490" y="60" width="100" height="180" rx="8" fill="#c89a68" />
      <circle cx="540" cy="140" r="38" fill="none" stroke="#33281c" strokeWidth="3" />
      <circle cx="540" cy="140" r="22" fill="none" stroke="#33281c" strokeWidth="3" />
      <circle cx="540" cy="140" r="8" fill="var(--target-red)" />

      {/* Werfende Person (links) mit Flip-Flops */}
      <g>
        <circle cx="80" cy="150" r="14" fill="var(--foreground)" opacity="0.85" />
        <rect x="68" y="166" width="24" height="52" rx="10" fill="var(--foreground)" opacity="0.85" />
        {/* Arme mit Axt über dem Kopf */}
        <line x1="80" y1="175" x2="102" y2="120" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <rect x="96" y="86" width="8" height="42" rx="4" fill="#9a6b3f" />
        <path d="M104 88 Q120 84 124 98 Q122 110 110 112 L104 106 Z" fill="#8f979f" />
        {/* Beine */}
        <line x1="72" y1="216" x2="70" y2="248" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <line x1="88" y1="216" x2="92" y2="248" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        {/* Flip-Flops (Gefahr!) */}
        <ellipse cx="68" cy="252" rx="13" ry="4.5" fill="#e85d75" />
        <ellipse cx="94" cy="252" rx="13" ry="4.5" fill="#e85d75" />
      </g>

      {/* Getränk auf Fass nahe der Wurflinie (Gefahr!) */}
      <g>
        <rect x="145" y="205" width="34" height="50" rx="5" fill="#7a5230" />
        <line x1="145" y1="220" x2="179" y2="220" stroke="#5c3d22" strokeWidth="2" />
        <line x1="145" y1="242" x2="179" y2="242" stroke="#5c3d22" strokeWidth="2" />
        <path d="M154 186 L170 186 L167 205 L157 205 Z" fill="var(--target-blue)" opacity="0.85" />
      </g>

      {/* Beschädigte Axt am Boden (Gefahr!) */}
      <g transform="translate(240 238) rotate(12)">
        <rect x="0" y="6" width="64" height="8" rx="4" fill="#9a6b3f" />
        <path d="M60 -2 Q78 -4 82 8 Q80 20 66 22 L60 14 Z" fill="#8f979f" />
        {/* Riss im Griff */}
        <path d="M22 5 L28 10 L23 15" fill="none" stroke="var(--danger)" strokeWidth="2.5" />
      </g>

      {/* Person in der Wurfbahn (Gefahr!) */}
      <g>
        <circle cx="360" cy="130" r="14" fill="var(--foreground)" opacity="0.85" />
        <rect x="348" y="146" width="24" height="52" rx="10" fill="var(--foreground)" opacity="0.85" />
        <line x1="348" y1="160" x2="330" y2="185" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <line x1="372" y1="160" x2="390" y2="180" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <line x1="352" y1="196" x2="342" y2="250" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <line x1="368" y1="196" x2="380" y2="250" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        {/* Handy in der Hand */}
        <rect x="386" y="172" width="10" height="16" rx="2" fill="var(--target-blue)" />
      </g>
    </svg>
  );
}

function SafetyCheck() {
  const t = useBiText();
  const [found, setFound] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const allFound = found.length === safetyHazards.length;

  const find = (id: string) => {
    setFound((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <GlassCard className="mt-10 overflow-hidden">
      <div className="p-6 pb-4 sm:p-8 sm:pb-4">
        <h3 className="text-xl font-bold">Sicherheits-Check: Was ist hier falsch?</h3>
        <p className="mt-1 text-muted">
          In dieser Szene verstecken sich {safetyHazards.length} Gefahren. Tippe auf die Stellen, die
          dir gefährlich vorkommen.
        </p>
      </div>
      <div className="relative mx-4 overflow-hidden rounded-2xl sm:mx-8">
        <SafetyScene />
        {safetyHazards.map((hazard, i) => {
          const spot = HAZARD_SPOTS[hazard.id];
          const isFound = found.includes(hazard.id) || revealed;
          return (
            <button
              key={hazard.id}
              type="button"
              onClick={() => find(hazard.id)}
              aria-label={
                isFound
                  ? `Gefahr gefunden: ${hazard.label}`
                  : `Verdächtige Stelle ${i + 1} von ${safetyHazards.length} prüfen`
              }
              aria-pressed={isFound}
              className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-lg transition-all cursor-pointer ${
                isFound
                  ? "border-danger bg-danger/25 text-danger"
                  : "border-dashed border-foreground/30 bg-foreground/5 hover:border-accent hover:bg-accent/15"
              }`}
              style={{ left: spot.left, top: spot.top }}
            >
              {isFound ? "⚠️" : <span className="opacity-50">?</span>}
            </button>
          );
        })}
      </div>
      <div className="p-6 sm:p-8">
        <p aria-live="polite" className="font-semibold">
          {allFound
            ? "🎉 Stark! Du hast alle Gefahren gefunden."
            : `${found.length} von ${safetyHazards.length} Gefahren gefunden`}
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {safetyHazards.map((hazard) => {
            const isFound = found.includes(hazard.id) || revealed;
            return (
              <li
                key={hazard.id}
                className={`rounded-2xl border p-4 text-sm transition-colors ${
                  isFound
                    ? "border-danger/40 bg-danger/10"
                    : "border-[var(--glass-border)] text-muted"
                }`}
              >
                {isFound ? (
                  <>
                    <p className="font-bold">⚠️ {hazard.label}</p>
                    <p className="mt-1">{t(hazard.explanation)}</p>
                  </>
                ) : (
                  <p>❓ Noch nicht gefunden …</p>
                )}
              </li>
            );
          })}
        </ul>
        {!allFound && !revealed && (
          <Button variant="secondary" className="mt-4" onClick={() => setRevealed(true)}>
            Auflösen
          </Button>
        )}
      </div>
    </GlassCard>
  );
}

export function Safety() {
  const t = useBiText();
  const readAloud =
    "Sicherheit beim Axtwerfen. " + safetyRules.map((r) => `${r.title}: ${t(r.text)}`).join(" ");

  return (
    <Section
      id="sicherheit"
      title="Sicherheit zuerst"
      stepId="sicherheit"
      readAloudText={readAloud}
      wide
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {safetyRules.map((rule) => (
          <li key={rule.title}>
            <GlassCard className="h-full p-5">
              <span aria-hidden className="text-3xl">{rule.icon}</span>
              <h3 className="mt-2 font-bold">{rule.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{t(rule.text)}</p>
            </GlassCard>
          </li>
        ))}
      </ul>
      <SafetyCheck />
    </Section>
  );
}
