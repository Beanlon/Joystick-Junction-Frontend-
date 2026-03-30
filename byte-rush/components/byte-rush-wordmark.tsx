/** Inline wordmark from ByteRush_logo.html — keeps Orbitron working (unlike <img src=".svg">). */
export function ByteRushWordmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 520 105"
      preserveAspectRatio="xMinYMid meet"
      aria-label="ByteRush"
      role="img"
    >
      <defs>
        <linearGradient
          id="brRushGradNav"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#5DCAA5" />
          <stop offset="100%" stopColor="#0F6E56" />
        </linearGradient>
        <filter
          id="brRushGlowNav"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text y="88" x="0">
        <tspan className="br-byte">Byte</tspan>
        <tspan
          className="br-rush"
          fill="url(#brRushGradNav)"
          filter="url(#brRushGlowNav)"
        >
          Rush
        </tspan>
      </text>
    </svg>
  );
}
