"use client";

import { useState } from "react";
import { mistakes } from "@/data/content";
import { useBiText } from "@/lib/useBiText";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";

function MistakeCard({ mistake }: { mistake: (typeof mistakes)[number] }) {
  const t = useBiText();
  const [open, setOpen] = useState(false);

  return (
    <GlassCard className="h-full overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-5 text-left cursor-pointer"
      >
        <span aria-hidden className="text-3xl">{mistake.icon}</span>
        <span className="flex-1">
          <span className="block font-bold">{mistake.problem}</span>
          <span className="mt-1 block text-sm text-accent">
            {open ? "Weniger anzeigen ▲" : "Ursache & Lösung ▼"}
          </span>
        </span>
      </button>
      {open && (
        <div className="space-y-3 px-5 pb-5">
          <div className="rounded-2xl bg-danger/10 p-3.5 text-sm">
            <p className="font-bold text-danger">Ursache</p>
            <p className="mt-0.5">{t(mistake.cause)}</p>
          </div>
          <div className="rounded-2xl bg-success/10 p-3.5 text-sm">
            <p className="font-bold text-success">Lösung</p>
            <p className="mt-0.5">{t(mistake.solution)}</p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

export function Mistakes() {
  const t = useBiText();

  return (
    <Section
      id="fehler"
      title="Warum bleibt meine Axt nicht stecken?"
      stepId="fehler"
      readAloudText={
        "Typische Fehler beim Axtwerfen. " +
        mistakes.map((m) => `${m.problem}. Ursache: ${t(m.cause)} Lösung: ${t(m.solution)}`).join(" ")
      }
      wide
    >
      <p className="mb-6 max-w-2xl text-lg text-muted">
        {t({
          normal:
            "Fast jeder Fehlwurf hat eine von diesen sechs Ursachen. Tippe auf eine Karte, um Ursache und Lösung zu sehen.",
          easy: "Es gibt 6 häufige Fehler. Tippe auf eine Karte. Dann siehst du die Lösung.",
        })}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mistakes.map((mistake) => (
          <li key={mistake.problem}>
            <MistakeCard mistake={mistake} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
