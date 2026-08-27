export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6">
      <div className="glass mx-auto max-w-6xl rounded-3xl p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold">
              <span aria-hidden>🪓</span> Axtwerfen lernen
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Eine interaktive Lernplattform – entstanden beim MINT-Aktionstag der RheinEnergie.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Sicherheit</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Axtwerfen ist eine Aktivität mit Verletzungsrisiko. Übe zuerst in einer
              professionellen Halle unter Anleitung. Wirf niemals auf Menschen, Tiere oder
              ungeeignete Ziele – und beachte immer die lokalen Regeln.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Rechtliches</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {/* TODO: Echte Rechtstexte ergänzen, sobald die Seite offiziell betrieben wird. */}
              <li><span className="text-muted">Impressum (Platzhalter)</span></li>
              <li><span className="text-muted">Datenschutz (Platzhalter)</span></li>
              <li>
                <a href="#sicherheit" className="text-accent hover:underline">
                  Sicherheitsregeln
                </a>
              </li>
              <li>
                <a href="#top" className="text-accent hover:underline">
                  Nach oben ↑
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-[var(--glass-border)] pt-4 text-xs text-muted">
          Standortdaten werden nur nach ausdrücklicher Zustimmung abgefragt und nicht gespeichert.
          Einstellungen und Fortschritt liegen ausschließlich lokal in deinem Browser.
        </p>
      </div>
    </footer>
  );
}
