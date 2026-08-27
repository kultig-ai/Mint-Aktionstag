"use client";

import { useEffect, useRef } from "react";
import { useSettings, type ThemeMode } from "@/lib/settings";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: "Hell", icon: "☀️" },
  { value: "dark", label: "Dunkel", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-4 py-1.5">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          aria-hidden
          className="block h-7 w-12 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] transition-colors peer-checked:bg-accent peer-focus-visible:outline-3 peer-focus-visible:outline-[var(--ring)] peer-focus-visible:outline-offset-2"
        />
        <span
          aria-hidden
          className="absolute left-1 top-1 h-5 w-5 rounded-full bg-foreground/70 transition-transform peer-checked:translate-x-5 peer-checked:bg-accent-contrast"
        />
      </span>
    </label>
  );
}

/** Einstellungs-Popover: Theme, Leichte Sprache, Animationen, Schriftgröße. */
export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, update } = useSettings();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label="Einstellungen"
      className="glass-solid absolute right-0 top-full z-50 mt-3 max-h-[calc(100vh-7rem)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-3xl p-5"
    >
      <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted">Einstellungen</h2>

      <fieldset className="mb-4">
        <legend className="mb-2 text-sm font-medium">Erscheinungsbild</legend>
        <div className="grid grid-cols-3 gap-2" role="radiogroup">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={settings.theme === opt.value}
              onClick={() => update("theme", opt.value)}
              className={`flex min-h-12 flex-col items-center justify-center rounded-2xl border px-2 py-2 text-xs font-medium transition-colors cursor-pointer ${
                settings.theme === opt.value
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-[var(--glass-border)] hover:bg-[var(--glass-bg)]"
              }`}
            >
              <span aria-hidden className="text-base">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="divide-y divide-[var(--glass-border)]">
        <Toggle
          label="Leichte Sprache"
          hint="Alle Lerntexte in einfacher Sprache"
          checked={settings.easyLanguage}
          onChange={(v) => update("easyLanguage", v)}
        />
        <Toggle
          label="Animationen reduzieren"
          hint="Bewegungen auf der Seite minimieren"
          checked={settings.reduceMotion}
          onChange={(v) => update("reduceMotion", v)}
        />
        <Toggle
          label="Größere Schrift"
          hint="Text auf der ganzen Seite vergrößern"
          checked={settings.largeText}
          onChange={(v) => update("largeText", v)}
        />
      </div>

      <p className="mt-3 text-xs text-muted">
        Einstellungen werden nur auf diesem Gerät gespeichert.
      </p>
    </div>
  );
}
