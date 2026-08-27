"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { demoLocations } from "@/data/content";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";

/**
 * Standortsuche "Axtwerfen in deiner Nähe".
 *
 * Mit gesetztem NEXT_PUBLIC_GOOGLE_MAPS_API_KEY wird die Google Maps JavaScript API
 * inkl. Places-Textsuche geladen (siehe .env.example).
 * TODO: Sobald ein echter API-Key vorliegt, die Places-Integration einmal
 * durchtesten (Suchbegriffe: "Axe Throwing", "Axtwerfen").
 *
 * Ohne Key läuft ein vollwertiger Demo-Modus mit stilisierter Karte und
 * Beispiel-Ergebnissen – plus echtem Link zur Google-Maps-Suche.
 */

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type Place = {
  name: string;
  address: string;
  km: number | null;
  mapsUrl: string;
  demo: boolean;
};

function demoResults(query: string): Place[] {
  return demoLocations.map((loc) => ({
    name: loc.name,
    address: `${loc.address}, ${loc.city}`,
    km: loc.km,
    mapsUrl: `https://www.google.com/maps/search/${encodeURIComponent("Axtwerfen " + (query || loc.city))}`,
    demo: true,
  }));
}

/** Stilisierte Demo-Karte mit Pins. */
function DemoMap({ activeIndex }: { activeIndex: number | null }) {
  return (
    <svg viewBox="0 0 100 70" className="w-full rounded-2xl" aria-hidden>
      <rect width="100" height="70" fill="var(--background-accent)" />
      {/* Stilisierte Straßen */}
      <path d="M0 40 Q30 34 55 42 T100 36" fill="none" stroke="var(--muted)" strokeWidth="1.6" opacity="0.4" />
      <path d="M30 0 Q34 30 26 70" fill="none" stroke="var(--muted)" strokeWidth="1.2" opacity="0.35" />
      <path d="M68 0 Q60 36 74 70" fill="none" stroke="var(--muted)" strokeWidth="1" opacity="0.3" />
      {/* Fluss */}
      <path d="M46 0 Q52 22 44 44 Q40 58 50 70" fill="none" stroke="var(--target-blue)" strokeWidth="2.6" opacity="0.4" />
      {/* Eigener Standort */}
      <circle cx="50" cy="40" r="2.4" fill="var(--target-blue)" />
      <circle cx="50" cy="40" r="4.6" fill="var(--target-blue)" opacity="0.25" />
      {/* Pins */}
      {demoLocations.map((loc, i) => (
        <g key={loc.name} transform={`translate(${loc.x} ${loc.y})`}>
          <path
            d="M0 0 C-2.6 -3.4 -2.6 -6.4 0 -8 C2.6 -6.4 2.6 -3.4 0 0 Z"
            fill={activeIndex === i ? "var(--accent)" : "var(--target-red)"}
            transform="scale(1.6)"
          />
          <circle cx="0" cy="-8.6" r="1.4" fill="#fff" />
        </g>
      ))}
      <text x="3" y="66" fontSize="3.4" fill="var(--muted)">
        Demo-Karte – mit API-Key erscheint hier Google Maps
      </text>
    </svg>
  );
}

export function LocationFinder() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [geoAsked, setGeoAsked] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsReady, setMapsReady] = useState(false);

  // Google Maps Script nur laden, wenn ein API-Key konfiguriert ist.
  useEffect(() => {
    if (!MAPS_KEY) return;
    if (document.querySelector("script[data-maps-loader]")) return;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places&language=de&loading=async&callback=__mapsReady`;
    script.async = true;
    script.dataset.mapsLoader = "true";
    (window as unknown as Record<string, unknown>).__mapsReady = () => setMapsReady(true);
    script.onerror = () => setStatus("Google Maps konnte nicht geladen werden – Demo-Modus aktiv.");
    document.head.appendChild(script);
  }, []);

  const searchGoogle = useCallback(
    async (searchText: string) => {
      // TODO: Mit echtem API-Key verifizieren (Places API "Text Search (New)").
      const g = (window as unknown as { google?: typeof google }).google;
      if (!g?.maps || !mapRef.current) return false;
      try {
        const { Map } = (await g.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        const { Place } = (await g.maps.importLibrary("places")) as google.maps.PlacesLibrary;
        const { places } = await Place.searchByText({
          textQuery: `Axe Throwing Axtwerfen ${searchText}`,
          fields: ["displayName", "formattedAddress", "location", "googleMapsURI"],
          maxResultCount: 8,
        });
        if (!places.length) {
          setStatus("Keine Axtwurf-Standorte gefunden – versuche eine größere Stadt in der Nähe.");
          return true;
        }
        const map = new Map(mapRef.current, {
          center: places[0].location ?? { lat: 50.94, lng: 6.96 },
          zoom: 11,
          mapId: "AXT_MAP",
        });
        const { AdvancedMarkerElement } = (await g.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;
        for (const place of places) {
          if (place.location) new AdvancedMarkerElement({ map, position: place.location });
        }
        setResults(
          places.map((p) => ({
            name: p.displayName ?? "Axtwurf-Standort",
            address: p.formattedAddress ?? "",
            km: null,
            mapsUrl:
              p.googleMapsURI ??
              `https://www.google.com/maps/search/${encodeURIComponent(p.displayName ?? "Axtwerfen")}`,
            demo: false,
          }))
        );
        setStatus(null);
        return true;
      } catch {
        setStatus("Die Google-Suche ist fehlgeschlagen – Demo-Ergebnisse werden angezeigt.");
        return false;
      }
    },
    []
  );

  const runSearch = useCallback(
    async (searchText: string) => {
      setActiveIndex(null);
      if (MAPS_KEY && mapsReady) {
        const ok = await searchGoogle(searchText);
        if (ok) return;
      }
      setResults(demoResults(searchText));
      if (!MAPS_KEY) {
        setStatus(
          "Demo-Modus: Beispiel-Ergebnisse. Der Link „In Google Maps suchen“ führt zur echten Suche."
        );
      }
    },
    [mapsReady, searchGoogle]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch(query.trim());
  };

  const useGeolocation = () => {
    setGeoAsked(true);
    if (!("geolocation" in navigator)) {
      setStatus("Dein Browser unterstützt keine Standortabfrage – gib stattdessen eine Stadt ein.");
      return;
    }
    setStatus("Standort wird abgefragt …");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setQuery("Mein Standort");
        void runSearch(`${latitude.toFixed(3)},${longitude.toFixed(3)}`);
      },
      () => {
        setStatus("Standort nicht freigegeben – kein Problem, gib einfach eine Stadt oder PLZ ein.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <GlassCard className="p-6 sm:p-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="location-input" className="sr-only">
          Stadt oder Postleitzahl
        </label>
        <input
          id="location-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stadt oder PLZ, z. B. Köln"
          className="glass min-h-12 flex-1 rounded-2xl border-0 px-5 text-base placeholder:text-muted"
        />
        <Button type="submit">Suchen</Button>
        <Button type="button" variant="secondary" onClick={useGeolocation}>
          📍 Meinen Standort nutzen
        </Button>
      </form>
      {!geoAsked && (
        <p className="mt-2 text-xs text-muted">
          Dein Standort wird nur nach deiner Zustimmung abgefragt, ausschließlich für diese Suche
          verwendet und nicht gespeichert.
        </p>
      )}

      {status && (
        <p aria-live="polite" className="mt-4 rounded-2xl bg-accent/10 px-4 py-3 text-sm">
          ℹ️ {status}
        </p>
      )}

      {results && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            {/* Google-Maps-Container (bei API-Key) oder Demo-Karte */}
            {MAPS_KEY ? (
              <div ref={mapRef} className="aspect-[10/7] w-full rounded-2xl bg-[var(--background-accent)]" />
            ) : (
              <DemoMap activeIndex={activeIndex} />
            )}
          </div>
          <ul className="space-y-3" aria-label="Gefundene Axtwurf-Standorte">
            {results.map((place, i) => (
              <li key={place.name}>
                <div
                  className={`rounded-2xl border p-4 transition-colors ${
                    activeIndex === i ? "border-accent/60 bg-accent/10" : "border-[var(--glass-border)]"
                  }`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-bold">{place.name}</p>
                    {place.km !== null && (
                      <p className="text-sm font-semibold text-accent">
                        {place.km.toFixed(1).replace(".", ",")} km
                      </p>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{place.address}</p>
                  <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-accent hover:underline"
                  >
                    {place.demo ? "In Google Maps suchen" : "Route anzeigen"} ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!results && (
        <p className="mt-6 text-muted">
          Gib eine Stadt ein oder nutze deinen Standort, um Axtwurf-Hallen in der Nähe zu finden.
        </p>
      )}
    </GlassCard>
  );
}
