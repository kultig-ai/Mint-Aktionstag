"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadJson, saveJson } from "@/lib/storage";
import { useAchievements } from "@/lib/achievements";
import { useMotionAllowed } from "@/lib/settings";
import { Button } from "../ui/Button";

/**
 * Virtuelles Axtwerfen auf <canvas>.
 *
 * Steuerung:
 *  - Maus/Touch: gedrückt halten = Kraft aufladen (pendelt), Höhe des Zeigers = Wurfwinkel,
 *    loslassen = werfen.
 *  - Tastatur: Leertaste halten = Kraft, Pfeil hoch/runter = Winkel, Leertaste loslassen = werfen.
 *
 * Vereinfachte Physik: Schwerkraft + konstante Rotationsgeschwindigkeit.
 * Die Axt bleibt nur stecken, wenn die Schneide zuerst trifft (Rotationsfenster).
 */

// Weltkoordinaten (werden auf die Canvas-Größe skaliert)
const W = 900;
const H = 500;
const FLOOR_Y = 455;
const HAND_X = 150;
const HAND_Y = 250;
const BOARD_X = 790; // Vorderkante der Zielwand
const TARGET_CY = 210;
const GRAVITY = 620;
const ROT_SPEED = 400; // Grad/Sekunde
const THROWS_PER_ROUND = 5;

const RINGS = [
  { r: 16, points: 6, label: "Bullseye" },
  { r: 40, points: 4, label: "Innerer Ring" },
  { r: 66, points: 3, label: "Mittlerer Ring" },
  { r: 92, points: 2, label: "Äußerer Ring" },
];

type Phase = "ready" | "charging" | "flying" | "settle" | "roundOver";

type ThrowResult = {
  points: number;
  label: string;
  stuck: boolean;
  tip: string;
  rotations: number;
};

type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string;
};

type GameState = {
  phase: Phase;
  power: number;        // 0..1, pendelt beim Aufladen
  powerDir: 1 | -1;
  angleDeg: number;     // Abwurfwinkel über der Horizontalen
  axe: { x: number; y: number; vx: number; vy: number; rot: number };
  particles: Particle[];
  settleTimer: number;
  stuckRot: number | null;
  flash: number;
};

function initialState(): GameState {
  return {
    phase: "ready",
    power: 0,
    powerDir: 1,
    angleDeg: 18,
    axe: { x: HAND_X, y: HAND_Y, vx: 0, vy: 0, rot: 0 },
    particles: [],
    settleTimer: 0,
    stuckRot: null,
    flash: 0,
  };
}

function drawAxe(ctx: CanvasRenderingContext2D, x: number, y: number, rotDeg: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotDeg * Math.PI) / 180);
  ctx.scale(scale, scale);
  // Griff (Schwerpunkt am Ursprung, Griff nach unten, Schneide nach rechts)
  ctx.fillStyle = "#a8794a";
  ctx.beginPath();
  ctx.roundRect(-7, -46, 14, 152, 7);
  ctx.fill();
  ctx.fillStyle = "#4c3520";
  ctx.beginPath();
  ctx.roundRect(-9, 82, 18, 22, 6);
  ctx.fill();
  // Kopf
  ctx.fillStyle = "#8f979f";
  ctx.beginPath();
  ctx.roundRect(-16, -50, 34, 36, 7);
  ctx.fill();
  // Blatt
  ctx.beginPath();
  ctx.moveTo(16, -52);
  ctx.quadraticCurveTo(46, -60, 55, -38);
  ctx.quadraticCurveTo(60, -14, 42, 6);
  ctx.quadraticCurveTo(34, -8, 16, -10);
  ctx.closePath();
  ctx.fill();
  // Schneidenkante
  ctx.strokeStyle = "#e8edf2";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(54, -36);
  ctx.quadraticCurveTo(59, -13, 43, 4);
  ctx.stroke();
  ctx.restore();
}

export function AxeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initialState());
  const rafRef = useRef<number>(0);
  const themeDarkRef = useRef(false);
  const motionAllowed = useMotionAllowed();
  const motionRef = useRef(motionAllowed);
  const { unlock } = useAchievements();

  useEffect(() => {
    motionRef.current = motionAllowed;
  }, [motionAllowed]);

  const [throwsLeft, setThrowsLeft] = useState(THROWS_PER_ROUND);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [lastResult, setLastResult] = useState<ThrowResult | null>(null);
  const [roundOver, setRoundOver] = useState(false);
  const streakRef = useRef(0);
  const scoreRef = useRef(0);
  const throwsRef = useRef(THROWS_PER_ROUND);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliges Nachladen des gespeicherten Highscores
    setHighscore(loadJson<{ value: number }>("axt-highscore", { value: 0 }).value);
  }, []);

  const finishThrow = useCallback(
    (result: ThrowResult) => {
      setLastResult(result);
      if (result.stuck) unlock("first-stick");
      if (result.points === 6) unlock("bullseye");
      if (result.stuck && result.points > 0) {
        streakRef.current += 1;
        if (streakRef.current >= 5) unlock("streak-5");
      } else {
        streakRef.current = 0;
      }
      scoreRef.current += result.points;
      setScore(scoreRef.current);
      throwsRef.current -= 1;
      setThrowsLeft(throwsRef.current);
      if (throwsRef.current <= 0) {
        setRoundOver(true);
        stateRef.current.phase = "roundOver";
        setHighscore((prev) => {
          const next = Math.max(prev, scoreRef.current);
          saveJson("axt-highscore", { value: next });
          return next;
        });
      }
    },
    [unlock]
  );

  const restart = useCallback(() => {
    stateRef.current = initialState();
    streakRef.current = 0;
    scoreRef.current = 0;
    throwsRef.current = THROWS_PER_ROUND;
    setScore(0);
    setThrowsLeft(THROWS_PER_ROUND);
    setLastResult(null);
    setRoundOver(false);
  }, []);

  // Aufladen starten/beenden
  const startCharge = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "ready") return;
    s.phase = "charging";
    s.power = 0;
    s.powerDir = 1;
    setLastResult(null);
  }, []);

  const release = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "charging") return;
    const v = 380 + s.power * 620;
    const rad = (s.angleDeg * Math.PI) / 180;
    s.axe = {
      x: HAND_X,
      y: HAND_Y,
      vx: v * Math.cos(rad),
      vy: -v * Math.sin(rad),
      rot: -20,
    };
    s.phase = "flying";
    unlock("first-throw");
  }, [unlock]);

  // Pointer-Steuerung
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setAngleFromPointer = (clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const rel = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
      stateRef.current.angleDeg = 40 - rel * 34; // oben = steiler, unten = flacher
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Synthetische Events (z. B. in Tests) haben keine gültige pointerId.
      }
      setAngleFromPointer(e.clientY);
      startCharge();
    };
    const onMove = (e: PointerEvent) => {
      if (stateRef.current.phase === "charging") setAngleFromPointer(e.clientY);
    };
    const onUp = () => release();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [startCharge, release]);

  // Tastatur-Steuerung
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!e.repeat) startCharge();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        stateRef.current.angleDeg = Math.min(40, stateRef.current.angleDeg + 2);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        stateRef.current.angleDeg = Math.max(6, stateRef.current.angleDeg - 2);
      }
    },
    [startCharge]
  );
  const onKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        release();
      }
    },
    [release]
  );

  // Game-Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = canvas.clientWidth;
      const height = (width * H) / W;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const isDark = () => document.documentElement.classList.contains("dark");

    const spawnParticles = (x: number, y: number, count: number, bullseye: boolean) => {
      const s = stateRef.current;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * (bullseye ? 260 : 160);
        s.particles.push({
          x, y,
          vx: Math.cos(angle) * speed - 40,
          vy: Math.sin(angle) * speed - 60,
          life: 0,
          maxLife: 0.5 + Math.random() * 0.5,
          size: 2.5 + Math.random() * 4,
          color: bullseye && Math.random() < 0.4 ? "#e8933c" : "#a8794a",
        });
      }
    };

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      themeDarkRef.current = isDark();

      // --- Update ---
      if (s.phase === "charging") {
        s.power += s.powerDir * dt * 0.9;
        if (s.power >= 1) { s.power = 1; s.powerDir = -1; }
        if (s.power <= 0) { s.power = 0; s.powerDir = 1; }
      }

      if (s.phase === "flying") {
        s.axe.vy += GRAVITY * dt;
        s.axe.x += s.axe.vx * dt;
        s.axe.y += s.axe.vy * dt;
        s.axe.rot += ROT_SPEED * dt;

        // Treffer an der Zielwand?
        if (s.axe.x >= BOARD_X - 8) {
          const dy = Math.abs(s.axe.y - TARGET_CY);
          const impactRot = ((s.axe.rot % 360) + 360) % 360;
          // Schneide zeigt bei ~0° nach rechts → Steckfenster ±45°
          const bladeDelta = impactRot > 180 ? impactRot - 360 : impactRot;
          const stuck = Math.abs(bladeDelta) <= 45 && s.axe.y > 40 && s.axe.y < FLOOR_Y - 10;
          const ring = RINGS.find((r) => dy <= r.r);
          const rotations = Math.round(((s.axe.rot + 20) / 360) * 10) / 10;

          let tip: string;
          if (!stuck) {
            tip =
              bladeDelta < -20
                ? "Die Axt hat sich zu wenig gedreht – wirf mit etwas weniger Kraft."
                : "Die Axt hat sich zu weit gedreht – wirf mit etwas mehr Schwung.";
          } else if (!ring) {
            tip = s.axe.y < TARGET_CY ? "Zu hoch – etwas weniger Kraft oder flacherer Winkel." : "Zu tief – etwas mehr Kraft oder steilerer Winkel.";
          } else if (ring.points === 6) {
            tip = "Perfekt! Merk dir genau dieses Gefühl.";
          } else {
            tip = s.axe.y < TARGET_CY ? "Guter Wurf! Einen Tick tiefer zielen." : "Guter Wurf! Einen Tick höher zielen.";
          }

          const points = stuck && ring ? ring.points : 0;
          const label = !stuck ? "Abgeprallt" : ring ? ring.label : "Neben der Scheibe";

          if (stuck) {
            s.stuckRot = bladeDelta * 0.4; // leicht eingedreht stecken lassen
            s.axe.x = BOARD_X - 4;
            if (motionRef.current) spawnParticles(BOARD_X - 6, s.axe.y, points === 6 ? 26 : 14, points === 6);
            if (points === 6) s.flash = 0.6;
          } else {
            // Abprallen
            s.axe.vx = -s.axe.vx * 0.25;
            s.axe.vy = -140;
          }
          s.phase = "settle";
          s.settleTimer = 1.4;
          finishThrow({ points, label, stuck, tip, rotations });
        } else if (s.axe.y > FLOOR_Y || s.axe.x > W + 60) {
          s.phase = "settle";
          s.settleTimer = 1.2;
          finishThrow({
            points: 0,
            label: "Fehlschuss",
            stuck: false,
            tip: s.axe.y > FLOOR_Y ? "Zu wenig Kraft – die Axt kam nicht bis zur Scheibe." : "Deutlich zu viel Kraft.",
            rotations: Math.round(((s.axe.rot + 20) / 360) * 10) / 10,
          });
        }
      }

      if (s.phase === "settle") {
        if (s.stuckRot === null) {
          // Abgeprallte Axt fällt zu Boden
          s.axe.vy += GRAVITY * dt;
          s.axe.x += s.axe.vx * dt;
          s.axe.y = Math.min(FLOOR_Y, s.axe.y + s.axe.vy * dt);
          s.axe.rot += 120 * dt;
        }
        s.settleTimer -= dt;
        if (s.settleTimer <= 0 && throwsRef.current > 0) {
          s.phase = "ready";
          s.axe = { x: HAND_X, y: HAND_Y, vx: 0, vy: 0, rot: 0 };
          s.stuckRot = null;
        }
      }

      // Partikel
      s.particles = s.particles.filter((p) => (p.life += dt) < p.maxLife);
      for (const p of s.particles) {
        p.vy += GRAVITY * 0.7 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      if (s.flash > 0) s.flash -= dt;

      // --- Zeichnen ---
      const dark = themeDarkRef.current;
      const scale = canvas.width / W;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Hintergrund
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, dark ? "#1d1813" : "#ece5da");
      bg.addColorStop(1, dark ? "#14110e" : "#e0d6c8");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Boden
      ctx.fillStyle = dark ? "#26201a" : "#d3c5b2";
      ctx.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);

      // Wurflinie
      ctx.strokeStyle = dark ? "#e8933c" : "#c2570e";
      ctx.setLineDash([10, 8]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(HAND_X + 30, FLOOR_Y);
      ctx.lineTo(HAND_X + 30, FLOOR_Y - 70);
      ctx.stroke();
      ctx.setLineDash([]);

      // Zielwand + Ringe
      ctx.fillStyle = "#c89a68";
      ctx.beginPath();
      ctx.roundRect(BOARD_X, 55, 95, FLOOR_Y - 55, 10);
      ctx.fill();
      ctx.strokeStyle = "#8a5c34";
      ctx.lineWidth = 1.5;
      for (const gx of [BOARD_X + 32, BOARD_X + 64]) {
        ctx.beginPath();
        ctx.moveTo(gx, 60);
        ctx.lineTo(gx, FLOOR_Y - 5);
        ctx.stroke();
      }
      ctx.strokeStyle = "#33281c";
      for (const ring of [...RINGS].reverse()) {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(BOARD_X + 45, TARGET_CY, ring.r, 0, Math.PI * 2);
        if (ring.points === 6) {
          ctx.fillStyle = dark ? "#d05a45" : "#b3402e";
          ctx.fill();
        }
        ctx.stroke();
      }

      // Werfer:in
      ctx.fillStyle = dark ? "#f1ece5" : "#241f1a";
      ctx.globalAlpha = 0.88;
      ctx.beginPath();
      ctx.arc(100, 175, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(85, 195, 30, 88, 13);
      ctx.fill();
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.strokeStyle = ctx.fillStyle as string;
      ctx.beginPath();
      ctx.moveTo(93, 283); ctx.lineTo(86, FLOOR_Y);
      ctx.moveTo(107, 283); ctx.lineTo(118, FLOOR_Y);
      ctx.stroke();
      // Wurfarm zeigt zur Axt
      const s2 = stateRef.current;
      const armTargetX = s2.phase === "flying" || s2.phase === "settle" ? 150 : s2.axe.x;
      const armTargetY = s2.phase === "flying" || s2.phase === "settle" ? 205 : s2.axe.y;
      ctx.beginPath();
      ctx.moveTo(108, 210);
      ctx.lineTo(armTargetX, armTargetY);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Axt
      if (s2.phase === "charging") {
        // Beim Aufladen leicht nach hinten geneigt, je nach Kraft
        drawAxe(ctx, s2.axe.x, s2.axe.y - 20, -25 - s2.power * 40, 0.72);
      } else if (s2.phase !== "roundOver") {
        drawAxe(ctx, s2.axe.x, s2.axe.y, s2.stuckRot !== null ? s2.stuckRot : s2.axe.rot, 0.72);
      }

      // Ziel-Hilfslinie beim Aufladen
      if (s2.phase === "charging") {
        const rad = (s2.angleDeg * Math.PI) / 180;
        ctx.strokeStyle = dark ? "rgba(232,147,60,0.55)" : "rgba(194,87,14,0.5)";
        ctx.setLineDash([3, 9]);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(HAND_X, HAND_Y - 20);
        ctx.lineTo(HAND_X + Math.cos(rad) * 190, HAND_Y - 20 - Math.sin(rad) * 190);
        ctx.stroke();
        ctx.setLineDash([]);

        // Kraftbalken
        ctx.fillStyle = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
        ctx.beginPath();
        ctx.roundRect(60, 60, 26, 200, 13);
        ctx.fill();
        const ph = s2.power * 192;
        const powerGrad = ctx.createLinearGradient(0, 260, 0, 60);
        powerGrad.addColorStop(0, "#4ade80");
        powerGrad.addColorStop(0.55, "#e8933c");
        powerGrad.addColorStop(1, "#d05a45");
        ctx.fillStyle = powerGrad;
        ctx.beginPath();
        ctx.roundRect(64, 256 - ph, 18, ph, 9);
        ctx.fill();
        // Sweet-Spot-Markierung
        ctx.strokeStyle = dark ? "#f1ece5" : "#241f1a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(58, 256 - 0.62 * 192);
        ctx.lineTo(88, 256 - 0.62 * 192);
        ctx.stroke();
      }

      // Partikel
      for (const p of s.particles) {
        ctx.globalAlpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
      }
      ctx.globalAlpha = 1;

      // Bullseye-Blitz
      if (s.flash > 0 && motionRef.current) {
        ctx.globalAlpha = s.flash;
        ctx.strokeStyle = "#e8933c";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(BOARD_X + 45, TARGET_CY, 20 + (0.6 - s.flash) * 160, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [finishThrow]);

  return (
    <div>
      {/* HUD */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="glass rounded-2xl px-4 py-2 text-sm font-semibold">
          Wurf{" "}
          <span className="tabular-nums">
            {Math.min(THROWS_PER_ROUND, THROWS_PER_ROUND - throwsLeft + 1)}/{THROWS_PER_ROUND}
          </span>
        </div>
        <div className="glass rounded-2xl px-4 py-2 text-sm font-semibold">
          Punkte <span className="tabular-nums">{score}</span>
        </div>
        <div className="glass rounded-2xl px-4 py-2 text-sm font-semibold">
          🏆 Highscore <span className="tabular-nums">{highscore}</span>
        </div>
        <Button variant="secondary" className="ml-auto !min-h-10 !px-4 !py-2 text-sm" onClick={restart}>
          ↺ Neustart
        </Button>
      </div>

      {/* Spielfläche */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="application"
          aria-label="Axtwerfen-Spiel. Leertaste gedrückt halten, um Kraft aufzubauen, Pfeiltasten hoch und runter für den Winkel, Leertaste loslassen zum Werfen. Mit Maus oder Finger: gedrückt halten und loslassen."
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className="w-full touch-none rounded-2xl"
          style={{ aspectRatio: `${W}/${H}` }}
        />
        {roundOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 p-4 backdrop-blur-sm">
            <div className="glass-strong w-full max-w-sm rounded-3xl p-6 text-center">
              <p className="text-4xl" aria-hidden>{score >= 20 ? "🏆" : score >= 10 ? "🎯" : "🪓"}</p>
              <h4 className="mt-2 text-2xl font-bold">Runde beendet!</h4>
              <p className="mt-1 text-lg">
                <span className="font-bold text-accent">{score} Punkte</span>
                {score >= highscore && score > 0 && " – neuer Highscore!"}
              </p>
              <p className="mt-2 text-sm text-muted">
                {score >= 20
                  ? "Stark! Du hast den Dreh raus."
                  : score >= 10
                    ? "Gut! Achte auf den Sweet-Spot im Kraftbalken."
                    : "Übung macht den Unterschied – halte die Kraft nahe der Markierung."}
              </p>
              <Button className="mt-5 w-full" onClick={restart}>
                Neue Runde
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Feedback nach dem Wurf */}
      <div aria-live="polite" className="mt-4 min-h-16">
        {lastResult && !roundOver && (
          <div
            className={`glass flex flex-wrap items-center gap-x-6 gap-y-1 rounded-2xl px-5 py-3.5 ${
              lastResult.points > 0 ? "border-success/40" : ""
            }`}
          >
            <p className="font-bold">
              {lastResult.points > 0 ? "✅" : "❌"} {lastResult.label}
              {lastResult.points > 0 && (
                <span className="ml-2 text-accent">+{lastResult.points} Punkte</span>
              )}
            </p>
            <p className="text-sm text-muted">
              Rotation: {lastResult.rotations.toFixed(1).replace(".", ",")} Umdrehungen
            </p>
            <p className="w-full text-sm sm:w-auto">💡 {lastResult.tip}</p>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-muted">
        <strong>Steuerung:</strong> Gedrückt halten = Kraft aufladen (pendelt) · Zeiger hoch/runter =
        Winkel · Loslassen = Wurf. Mit Tastatur: Leertaste halten, Pfeiltasten für den Winkel.
        Triff den Sweet-Spot (Markierung) im Kraftbalken!
      </p>
    </div>
  );
}
