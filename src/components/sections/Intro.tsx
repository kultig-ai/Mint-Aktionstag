"use client";

import { intro } from "@/data/content";
import { useBiText } from "@/lib/useBiText";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";

const FACTS = [
  { icon: "🎯", label: "Wie Dart", text: "nur mit Axt statt Pfeil" },
  { icon: "📏", label: "3,5–4 m", text: "typischer Wurfabstand" },
  { icon: "🔄", label: "1 Drehung", text: "macht die Axt im Flug" },
  { icon: "🏟️", label: "Ligen & Hallen", text: "gibt es weltweit" },
];

export function Intro() {
  const t = useBiText();

  return (
    <Section
      id="lernen"
      kicker="Einführung"
      title={intro.title}
      readAloudText={`${intro.title}. ${t(intro.text)}`}
    >
      <GlassCard className="p-6 sm:p-8">
        <p className="text-lg leading-relaxed">{t(intro.text)}</p>
      </GlassCard>
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {FACTS.map((fact) => (
          <li key={fact.label}>
            <GlassCard className="h-full p-4 text-center">
              <span aria-hidden className="text-2xl">{fact.icon}</span>
              <p className="mt-1 font-bold">{fact.label}</p>
              <p className="text-sm text-muted">{fact.text}</p>
            </GlassCard>
          </li>
        ))}
      </ul>
    </Section>
  );
}
