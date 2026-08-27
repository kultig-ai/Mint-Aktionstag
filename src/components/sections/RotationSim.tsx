"use client";

import { useState } from "react";
import { useBiText } from "@/lib/useBiText";
import type { BiText } from "@/data/content";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";
import { AxeDefs, AxeShape } from "../graphics/AxeSvg";

/**
 * Vereinfachtes Modell: Auf ca. 3,8 m macht die Axt genau eine Umdrehung.
 * Es geht ums Prinzip, nicht um perfekte Physik.
 */
const ONE_ROTATION_DISTANCE = 3.8;
const MIN_D = 2.5;
const MAX_D = 5;

type Verdict = {
  kind: "good" | "close" | "far";
  hit: string;
  text: BiText;
};

function evaluate(distance: number): { rotations: number; delta: number; verdict: Verdict } {
  const rotations = distance / ONE_ROTATION_DISTANCE;
  // Abweichung vom Ideal (genau 1 Umdrehung), in Grad, normalisiert auf -180..180
  let delta = (rotations - 1) * 360;
  delta = ((delta + 180) % 360 + 360) % 360 - 180;

  let verdict: Verdict;
  if (Math.abs(delta) <= 30) {
    verdict = {
      kind: "good",
      hit: "Schneide – bleibt stecken! 🎯",
      text: {
        normal: "Guter Abstand! Die Axt hat genau eine Umdrehung gemacht und trifft mit der Schneide.",
        easy: "Guter Abstand! Die Axt trifft mit der Klinge. Sie bleibt stecken.",
      },
    };
  } else if (delta < 0) {
    verdict = {
      kind: "close",
      hit: delta < -120 ? "Griff trifft zuerst" : "Kopf trifft zuerst",
      text: {
        normal: "Zu nah. Die Axt dreht sich noch nicht weit genug – geh ein Stück zurück.",
        easy: "Du bist zu nah. Die Axt dreht sich zu wenig. Geh ein Stück zurück.",
      },
    };
  } else {
    verdict = {
      kind: "far",
      hit: delta > 120 ? "Griff trifft zuerst" : "Kopf trifft zuerst",
      text: {
        normal: "Zu weit. Die Axt dreht sich über den idealen Punkt hinaus – geh ein Stück vor.",
        easy: "Du bist zu weit weg. Die Axt dreht sich zu viel. Geh ein Stück nach vorn.",
      },
    };
  }
  return { rotations, delta, verdict };
}

const VERDICT_COLOR: Record<Verdict["kind"], string> = {
  good: "text-success",
  close: "text-warning",
  far: "text-warning",
};

export function RotationSim() {
  const t = useBiText();
  const [distance, setDistance] = useState(3.2);
  const { rotations, verdict } = evaluate(distance);

  // Person: näher an der Scheibe = weiter rechts. 2,5 m → x 300, 5 m → x 40.
  const personX = 300 - ((distance - MIN_D) / (MAX_D - MIN_D)) * 260;
  const handX = personX + 32;
  const handY = 92;
  const targetX = 660;
  const targetY = 120;
  const totalAngle = rotations * 360;
  // Rotation beim Auftreffen: Bei genau einer Umdrehung (ideal) zeigt die
  // Schneide wieder nach vorn zur Scheibe (0°). Zu nah → negativ (Griff/Kopf
  // voran), zu weit → positiv (überdreht).
  const impactRotation = totalAngle - 360;

  // Geister-Äxte entlang der Flugbahn: starten beim Abwurf senkrecht
  // (Schneide oben, -90°) und drehen bis zur Auftreff-Rotation.
  const ghosts = [0.25, 0.5, 0.75].map((f) => ({
    x: handX + (targetX - 26 - handX) * f,
    y: handY - Math.sin(f * Math.PI) * 34 + (targetY - handY) * f,
    r: -90 + (impactRotation + 90) * f,
    opacity: 0.25 + f * 0.2,
  }));

  return (
    <Section
      id="rotation"
      title="Abstand & Rotation verstehen"
      stepId="rotation"
      readAloudText="Abstand und Rotation. Die Axt dreht sich im Flug von selbst. Auf ungefähr vier Meter macht sie genau eine Umdrehung. Stehst du zu nah, dreht sie sich zu wenig. Stehst du zu weit weg, dreht sie sich zu viel. Probiere es mit dem Schieberegler aus."
      wide
    >
      <GlassCard className="p-6 sm:p-8">
        <p className="max-w-2xl text-lg">
          {t({
            normal:
              "Die Axt dreht sich im Flug von selbst – etwa eine volle Umdrehung auf 3,8 Meter. Verändere deinen Abstand und beobachte, wie die Axt in der Scheibe ankommt.",
            easy: "Die Axt dreht sich beim Fliegen von allein. Ändere den Abstand mit dem Regler. Schau, wie die Axt ankommt.",
          })}
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl bg-[var(--background-accent)]/60">
          <svg viewBox="0 0 800 260" className="w-full" aria-hidden>
            <AxeDefs id="sim" />
            {/* Boden */}
            <line x1="0" y1="225" x2="800" y2="225" stroke="var(--muted)" strokeWidth="2" opacity="0.4" />
            {/* Maßband */}
            <line x1={personX + 20} y1="243" x2={targetX} y2="243" stroke="var(--accent)" strokeWidth="2" opacity="0.7" />
            <text x={(personX + targetX) / 2} y="237" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--accent)">
              {distance.toFixed(1).replace(".", ",")} m
            </text>

            {/* Person */}
            <g style={{ transition: "transform 0.2s" }} transform={`translate(${personX} 0)`}>
              <circle cx="20" cy="60" r="13" fill="var(--foreground)" opacity="0.85" />
              <rect x="8" y="76" width="24" height="64" rx="10" fill="var(--foreground)" opacity="0.85" />
              <line x1="28" y1="86" x2="42" y2="96" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
              <line x1="12" y1="138" x2="6" y2="222" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
              <line x1="28" y1="138" x2="38" y2="222" stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
            </g>

            {/* Flugbahn */}
            <path
              d={`M ${handX} ${handY} Q ${(handX + targetX) / 2} ${handY - 70} ${targetX - 20} ${targetY}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="2 9"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Geister-Äxte auf der Bahn */}
            {ghosts.map((g, i) => (
              <g
                key={i}
                style={{
                  transform: `translate(${g.x}px, ${g.y}px) rotate(${g.r}deg)`,
                  transformOrigin: "0px 0px",
                  transformBox: "view-box",
                  opacity: g.opacity,
                }}
              >
                <g transform="scale(0.32) translate(-60 -90)">
                  <AxeShape id="sim" />
                </g>
              </g>
            ))}

            {/* Zielwand */}
            <rect x={targetX} y="30" width="90" height="195" rx="8" fill="#c89a68" />
            <circle cx={targetX + 45} cy={targetY} r="42" fill="none" stroke="#33281c" strokeWidth="3" opacity="0.85" />
            <circle cx={targetX + 45} cy={targetY} r="24" fill="none" stroke="#33281c" strokeWidth="3" opacity="0.85" />
            <circle cx={targetX + 45} cy={targetY} r="9" fill="var(--target-red)" stroke="#33281c" strokeWidth="2.5" />

            {/* Axt beim Auftreffen */}
            <g
              style={{
                transform: `translate(${targetX + 14}px, ${targetY + 8}px) rotate(${impactRotation}deg)`,
                transformOrigin: "0px 0px",
                transformBox: "view-box",
                transition: "transform 0.15s",
              }}
            >
              <g transform="scale(0.5) translate(-60 -90)">
                <AxeShape id="sim" />
              </g>
            </g>
          </svg>
        </div>

        {/* Regler */}
        <div className="mt-6">
          <label htmlFor="distance-slider" className="mb-2 block font-semibold">
            Dein Abstand zur Zielscheibe
          </label>
          <input
            id="distance-slider"
            type="range"
            min={MIN_D}
            max={MAX_D}
            step={0.1}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
            style={{ height: "2rem" }}
            aria-valuetext={`${distance.toFixed(1).replace(".", ",")} Meter`}
          />
          <div className="flex justify-between text-xs text-muted">
            <span>2,5 m (zu nah)</span>
            <span>3,8 m (ideal)</span>
            <span>5 m (zu weit)</span>
          </div>
        </div>

        {/* Feedback */}
        <div aria-live="polite" className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--glass-border)] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Abstand</p>
            <p className="text-xl font-bold tabular-nums">{distance.toFixed(1).replace(".", ",")} m</p>
          </div>
          <div className="rounded-2xl border border-[var(--glass-border)] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Drehungen im Flug</p>
            <p className="text-xl font-bold tabular-nums">{rotations.toFixed(2).replace(".", ",")}</p>
          </div>
          <div className="rounded-2xl border border-[var(--glass-border)] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Was trifft zuerst?</p>
            <p className={`text-xl font-bold ${VERDICT_COLOR[verdict.kind]}`}>{verdict.hit}</p>
          </div>
        </div>
        <p className={`mt-4 rounded-2xl p-4 font-medium glass ${VERDICT_COLOR[verdict.kind]}`}>
          {verdict.kind === "good" ? "✅ " : "💡 "}
          {t(verdict.text)}
        </p>
      </GlassCard>
    </Section>
  );
}
