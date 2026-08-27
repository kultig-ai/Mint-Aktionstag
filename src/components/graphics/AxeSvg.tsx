/**
 * Stilisierte Wurfaxt als SVG-Gruppe.
 * viewBox-Empfehlung: 0 0 120 260. Schneide zeigt nach rechts, Griff nach unten.
 * Über gradientId lassen sich mehrere Instanzen auf einer Seite konfliktfrei nutzen.
 */
export function AxeDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9a6b3f" />
        <stop offset="0.5" stopColor="#b98453" />
        <stop offset="1" stopColor="#8a5c34" />
      </linearGradient>
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#c6ccd4" />
        <stop offset="0.55" stopColor="#8f979f" />
        <stop offset="1" stopColor="#6a7076" />
      </linearGradient>
    </defs>
  );
}

export function AxeShape({ id }: { id: string }) {
  return (
    <g>
      {/* Griff */}
      <rect x="53" y="46" width="14" height="204" rx="7" fill={`url(#${id}-wood)`} />
      <rect x="56" y="52" width="3" height="192" rx="1.5" fill="#ffffff" opacity="0.18" />
      {/* Griffband unten */}
      <rect x="51" y="218" width="18" height="26" rx="6" fill="#4c3520" opacity="0.85" />
      {/* Nacken (hinten) */}
      <rect x="38" y="52" width="14" height="22" rx="4" fill={`url(#${id}-steel)`} />
      {/* Auge / Kopf um den Griff */}
      <rect x="46" y="44" width="30" height="38" rx="7" fill={`url(#${id}-steel)`} />
      {/* Blatt mit Schneide rechts */}
      <path
        d="M74 42 Q104 32 114 52 Q120 78 102 98 Q94 84 74 82 Z"
        fill={`url(#${id}-steel)`}
      />
      {/* Schneidenkante */}
      <path
        d="M113 50 Q120 77 103 97"
        fill="none"
        stroke="#eef2f6"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.9"
      />
    </g>
  );
}

/** Eigenständige Axt-SVG (z. B. für kleine Icons). */
export function AxeSvg({ id, className, title }: { id: string; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 120 260"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <AxeDefs id={id} />
      <AxeShape id={id} />
    </svg>
  );
}
