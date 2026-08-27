# MINT-Aktionstag 🚀 – Axtwerfen lernen

Ein Mitmach-Projekt der **RheinEnergie**: Schüler*innen haben beschrieben, welche Webseite sie
sich wünschen – und eine KI (Claude) hat sie live entwickelt.

**Das Ergebnis:** Eine interaktive Lernplattform, die Anfänger*innen Schritt für Schritt
das Axtwerfen beibringt. 🪓🎯

## Features

- **Interaktiver 7-Schritte-Kurs** mit Fortschrittsanzeige (lokal gespeichert)
- **Sicherheits-Check:** „Was ist hier falsch?"-Suchbild mit 4 versteckten Gefahren
- **Interaktive Axt-Anatomie** (Kopf, Schneide, Griff, Schwerpunkt)
- **Grifftechniken:** Einhand- und Zweihandwurf im Vergleich
- **Scrollgesteuerte Wurfanimation:** Der komplette Bewegungsablauf in 6 Phasen
- **Rotations-Simulation:** Slider für den Abstand – zeigt, wie sich die Axt dreht
- **Übungsspiel** auf Canvas: Kraft, Winkel, Rotation, 5-Wurf-Runden, Highscore, Partikeleffekte
- **Gamification:** 5 Achievements mit Erfolgs-Toasts
- **Standortsuche** „Axtwerfen in deiner Nähe" (Google Maps vorbereitet, Demo-Modus ohne API-Key)
- **Liquid-Glass-Design** mit Light/Dark/System-Mode
- **Barrierefreiheit:** Leichte Sprache, Vorlesefunktion (SpeechSynthesis), reduzierte
  Animationen, größere Schrift, Keyboard-Navigation, ARIA, Focus States

## Tech-Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Canvas API

## Entwicklung

```bash
npm install
npm run dev     # Dev-Server auf http://localhost:3000
npm run build   # Production-Build
npm run lint    # ESLint
```

Unter Windows mit portabler Node-Installation: `dev.cmd` starten.

### Google Maps (optional)

Für echte Standort-Ergebnisse einen API-Key (Maps JavaScript API + Places API) in `.env.local`
hinterlegen – siehe [.env.example](.env.example). Ohne Key läuft die Suche im Demo-Modus.

## Projektstruktur

```
src/
├── app/               Layout, Seite, SEO (sitemap, robots), Styles
├── components/
│   ├── ui/            GlassCard, Buttons, Section, Vorlese-Button
│   ├── sections/      Alle Inhaltsbereiche der Seite
│   ├── game/          Das Canvas-Übungsspiel
│   ├── map/           Standortsuche (Google Maps + Demo-Fallback)
│   └── graphics/      Wiederverwendbare SVGs (Axt, Zielscheibe)
├── data/content.ts    Alle Lerninhalte (normal + Leichte Sprache)
└── lib/               Settings, Fortschritt, Achievements, Speech, Storage
```

## Offene TODOs

- Erklärvideo produzieren und im Video-Platzhalter einbinden
- Google-Maps-API-Key hinterlegen und Places-Suche verifizieren
- Echte Domain in `layout.tsx`, `sitemap.ts`, `robots.ts` eintragen
- Impressum & Datenschutzerklärung ergänzen

---

*Ein Projekt im Rahmen des MINT-Aktionstags bei der RheinEnergie.*
