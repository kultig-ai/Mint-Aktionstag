"use client";

import { useSettings } from "./settings";
import type { BiText } from "@/data/content";

/** Liefert je nach Einstellung den normalen Text oder die Leichte-Sprache-Version. */
export function useBiText(): (t: BiText) => string {
  const { settings } = useSettings();
  return (t: BiText) => (settings.easyLanguage ? t.easy : t.normal);
}
