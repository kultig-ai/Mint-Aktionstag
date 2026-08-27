"use client";

import { useState } from "react";
import { stancePoints } from "@/data/content";
import { useBiText } from "@/lib/useBiText";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";

/** Marker-Positionen in Prozent der Szene (viewBox 500×320). */
const MARKERS: Record<string, { left: string; top: string }> = {
  feet: { left: "17%", top: "84%" },
  shoulders: { left: "17%", top: "38%" },
  gaze: { left: "28%", top: "18%" },
  distance: { left: "58%", top: "72%" },
};

function StanceScene({ activeId }: { activeId: string }) {
  const hl = (id: string) => (activeId === id ? "var(--accent)" : "var(--foreground)");
  return (
    <svg viewBox="0 0 500 320" className="w-full" aria-hidden>
      {/* Boden */}
      <line x1="0" y1="290" x2="500" y2="290" stroke="var(--muted)" strokeWidth="2" opacity="0.5" />

      {/* Figur (Seitenansicht) */}
      <g>
        {/* Kopf mit Blickrichtung */}
        <circle cx="90" cy="60" r="18" fill={hl("gaze")} opacity="0.9" />
        {/* Blicklinie */}
        <line
          x1="108"
          y1="58"
          x2="410"
          y2="120"
          stroke={activeId === "gaze" ? "var(--accent)" : "var(--muted)"}
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity={activeId === "gaze" ? 1 : 0.5}
        />
        {/* Rumpf */}
        <rect x="76" y="82" width="30" height="85" rx="13" fill={hl("shoulders")} opacity="0.9" />
        {/* Arme: halten Axt vor dem Körper */}
        <line x1="92" y1="100" x2="130" y2="140" stroke={hl("shoulders")} strokeWidth="9" strokeLinecap="round" opacity="0.9" />
        <rect x="124" y="128" width="9" height="52" rx="4.5" fill="#9a6b3f" />
        <path d="M133 128 Q152 122 156 138 Q154 152 140 154 L133 146 Z" fill="#8f979f" />
        {/* Beine */}
        <line x1="84" y1="166" x2="76" y2="284" stroke={hl("feet")} strokeWidth="10" strokeLinecap="round" opacity="0.9" />
        <line x1="98" y1="166" x2="112" y2="284" stroke={hl("feet")} strokeWidth="10" strokeLinecap="round" opacity="0.9" />
        {/* Füße */}
        <ellipse cx="74" cy="287" rx="16" ry="5" fill={hl("feet")} />
        <ellipse cx="116" cy="287" rx="16" ry="5" fill={hl("feet")} />
      </g>

      {/* Abstand zur Zielwand */}
      <g opacity={activeId === "distance" ? 1 : 0.65}>
        <line
          x1="135"
          y1="265"
          x2="435"
          y2="265"
          stroke={activeId === "distance" ? "var(--accent)" : "var(--muted)"}
          strokeWidth="2.5"
          markerEnd="url(#stance-arrow)"
          markerStart="url(#stance-arrow-back)"
        />
        <text
          x="285"
          y="256"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill={activeId === "distance" ? "var(--accent)" : "var(--muted)"}
        >
          3,5 – 4 m
        </text>
      </g>

      {/* Zielwand rechts */}
      <rect x="440" y="60" width="46" height="230" rx="6" fill="#c89a68" />
      <circle cx="463" cy="140" r="19" fill="none" stroke="#33281c" strokeWidth="3" />
      <circle cx="463" cy="140" r="7" fill="var(--target-red)" />

      <defs>
        <marker id="stance-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--muted)" />
        </marker>
        <marker id="stance-arrow-back" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--muted)" />
        </marker>
      </defs>
    </svg>
  );
}

export function Stance() {
  const t = useBiText();
  const [activeId, setActiveId] = useState(stancePoints[0].id);

  return (
    <Section
      id="haltung"
      title="Die richtige Körperhaltung"
      stepId="haltung"
      readAloudText={
        "Die richtige Körperhaltung. " +
        stancePoints.map((p) => `${p.title}: ${t(p.text)}`).join(" ")
      }
      wide
    >
      <GlassCard className="p-6 sm:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="relative">
            <StanceScene activeId={activeId} />
            {stancePoints.map((point, i) => (
              <button
                key={point.id}
                type="button"
                onClick={() => setActiveId(point.id)}
                aria-pressed={activeId === point.id}
                aria-label={`${point.title} hervorheben`}
                className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-sm font-bold transition-all cursor-pointer ${
                  activeId === point.id
                    ? "scale-110 border-accent bg-accent text-accent-contrast shadow-lg shadow-accent/40"
                    : "border-accent/60 bg-[var(--glass-bg-strong)] text-accent hover:scale-105"
                }`}
                style={MARKERS[point.id]}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <ol className="space-y-3">
            {stancePoints.map((point, i) => (
              <li key={point.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(point.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors cursor-pointer ${
                    activeId === point.id
                      ? "border-accent/60 bg-accent/10"
                      : "border-[var(--glass-border)] hover:bg-[var(--glass-bg)]"
                  }`}
                >
                  <p className="font-bold">
                    <span className="mr-2 text-accent">{i + 1}.</span>
                    {point.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{t(point.text)}</p>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </GlassCard>
    </Section>
  );
}
