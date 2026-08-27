"use client";

import { faq } from "@/data/content";
import { useBiText } from "@/lib/useBiText";
import { Section } from "../ui/Section";
import { GlassCard } from "../ui/GlassCard";

export function Faq() {
  const t = useBiText();

  return (
    <Section id="faq" kicker="Gut zu wissen" title="Häufige Fragen">
      <div className="space-y-3">
        {faq.map((item) => (
          <GlassCard key={item.q} className="overflow-hidden">
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="text-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-muted">{t(item.a)}</p>
            </details>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
