"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress";
import { SettingsPanel } from "./SettingsPanel";

const NAV_LINKS = [
  { href: "#lernen", label: "Lernen" },
  { href: "#wurf", label: "Technik" },
  { href: "#spiel", label: "Üben" },
  { href: "#standorte", label: "Standorte" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { percent } = useProgress();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        aria-label="Hauptnavigation"
        className="glass-strong relative mx-auto flex max-w-6xl items-center gap-2 rounded-2xl px-4 py-2.5"
      >
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
          <span aria-hidden className="text-xl">🪓</span>
          <span className="hidden sm:inline">Axtwerfen lernen</span>
          <span className="sm:hidden">Axtwerfen</span>
        </a>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-[var(--glass-bg)] hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Kursfortschritt */}
        <div
          className="ml-auto flex items-center gap-2 md:ml-3"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Kursfortschritt: ${percent} Prozent abgeschlossen`}
        >
          <div className="h-2 w-16 overflow-hidden rounded-full bg-foreground/10 sm:w-24">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-soft to-accent transition-[width] duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums text-muted">{percent}%</span>
        </div>

        {/* Kein position:relative – das Panel ankert an der gesamten Nav-Leiste,
            damit es auf schmalen Bildschirmen nicht links aus dem Viewport ragt. */}
        <div>
          <button
            type="button"
            aria-label="Einstellungen öffnen"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg transition-colors hover:bg-[var(--glass-bg)] cursor-pointer"
          >
            <span aria-hidden>⚙️</span>
          </button>
          <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-lg md:hidden cursor-pointer hover:bg-[var(--glass-bg)]"
        >
          <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
        </button>

        {/* Mobiles Menü */}
        {menuOpen && (
          <div className="glass-strong absolute inset-x-0 top-full mt-2 rounded-2xl p-2 md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-[var(--glass-bg)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
