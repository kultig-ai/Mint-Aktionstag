"use client";

import { Section } from "../ui/Section";
import { LocationFinder } from "../map/LocationFinder";

export function Locations() {
  return (
    <Section
      id="standorte"
      kicker="Ausprobieren"
      title="Axtwerfen in deiner Nähe"
      readAloudText="Axtwerfen in deiner Nähe. Gib eine Stadt oder Postleitzahl ein, um Axtwurf-Hallen in deiner Umgebung zu finden. Der erste Besuch in einer Halle mit Anleitung ist der beste Start."
      wide
    >
      <p className="mb-6 max-w-2xl text-lg text-muted">
        Der beste Ort für deine ersten Würfe ist eine professionelle Axtwurf-Halle: geprüfte Äxte,
        sichere Bahnen und Menschen, die dir alles zeigen.
      </p>
      <LocationFinder />
    </Section>
  );
}
