/**
 * Sichere LocalStorage-Helfer.
 * Die Website funktioniert auch dann, wenn LocalStorage nicht verfügbar ist
 * (z. B. Privatmodus, blockierte Site-Daten) – dann geht lediglich der
 * gespeicherte Fortschritt verloren.
 */

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // LocalStorage nicht verfügbar – Einstellung gilt nur für diese Sitzung.
  }
}
