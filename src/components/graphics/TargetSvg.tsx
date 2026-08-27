/**
 * Frontale Holz-Zielscheibe mit Trefferringen.
 * viewBox: 0 0 200 200, Zentrum (100, 100).
 */
export function TargetDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-plank`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c89a68" />
        <stop offset="0.5" stopColor="#dbb183" />
        <stop offset="1" stopColor="#bd8f5e" />
      </linearGradient>
    </defs>
  );
}

/** Zielscheibe als SVG-Gruppe (200×200, Zentrum bei 100/100). */
export function TargetShape({ id }: { id: string }) {
  return (
    <g>
      {/* Holzplatte */}
      <rect x="4" y="4" width="192" height="192" rx="18" fill={`url(#${id}-plank)`} />
      {/* Bretterfugen */}
      {[42, 80, 118, 156].map((x) => (
        <line key={x} x1={x} y1="8" x2={x} y2="192" stroke="#8a5c34" strokeWidth="1.5" opacity="0.5" />
      ))}
      {/* Ringe */}
      <circle cx="100" cy="100" r="86" fill="none" stroke="#33281c" strokeWidth="3" opacity="0.85" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="#33281c" strokeWidth="3" opacity="0.85" />
      <circle cx="100" cy="100" r="42" fill="none" stroke="#33281c" strokeWidth="3" opacity="0.85" />
      <circle cx="100" cy="100" r="20" fill="var(--target-red)" stroke="#33281c" strokeWidth="3" />
      {/* Killshot-Punkte */}
      <circle cx="45" cy="38" r="7" fill="var(--target-blue)" stroke="#33281c" strokeWidth="2" />
      <circle cx="155" cy="38" r="7" fill="var(--target-blue)" stroke="#33281c" strokeWidth="2" />
    </g>
  );
}

/** Eigenständige Zielscheiben-SVG. */
export function TargetSvg({
  id,
  className,
  title = "Zielscheibe",
}: {
  id: string;
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title}>
      <TargetDefs id={id} />
      <TargetShape id={id} />
    </svg>
  );
}
