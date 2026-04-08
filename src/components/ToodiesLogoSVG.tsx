interface ToodiesLogoSVGProps {
  /** Tailwind / inline className passed to the wrapping <svg> */
  className?: string;
  /** Override fill colour (default: #d4af37 gold) */
  color?: string;
  /** SVG width in pixels – height is auto-calculated from viewBox */
  width?: number | string;
  /** SVG height in pixels */
  height?: number | string;
}

/**
 * Toodies brand logo as an inline SVG.
 * Replaces figma:asset imports that don't exist on Netlify production.
 * Works at any size — use className / width / height to control it.
 */
export function ToodiesLogoSVG({
  className = '',
  color = '#d4af37',
  width,
  height,
}: ToodiesLogoSVGProps) {
  return (
    <svg
      viewBox="0 0 260 72"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      aria-label="Toodies"
      role="img"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="toodiesGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f5e27d" />
          <stop offset="45%"  stopColor={color} />
          <stop offset="100%" stopColor="#9e7c1a" />
        </linearGradient>
        <filter id="toodiesGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Crown / diamond accent ── */}
      <g filter="url(#toodiesGlow)">
        {/* Centre diamond */}
        <polygon
          points="130,2 138,13 130,22 122,13"
          fill="url(#toodiesGold)"
        />
        {/* Left mini diamond */}
        <polygon
          points="110,8 115,13 110,18 105,13"
          fill={color}
          opacity="0.55"
        />
        {/* Right mini diamond */}
        <polygon
          points="150,8 155,13 150,18 145,13"
          fill={color}
          opacity="0.55"
        />
        {/* Thin connecting bar */}
        <rect x="105" y="12.5" width="50" height="1.2" fill={color} opacity="0.3" rx="1" />
      </g>

      {/* ── Wordmark "TOODIES" ── */}
      <text
        x="130"
        y="55"
        textAnchor="middle"
        fill="url(#toodiesGold)"
        fontFamily="'Georgia', 'Garamond', 'Times New Roman', serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="9"
        filter="url(#toodiesGlow)"
      >
        TOODIES
      </text>

      {/* ── Tagline ── */}
      <text
        x="130"
        y="68"
        textAnchor="middle"
        fill={color}
        opacity="0.45"
        fontFamily="'Georgia', serif"
        fontSize="7.5"
        fontWeight="400"
        letterSpacing="5"
      >
        PREMIUM APPAREL
      </text>

      {/* ── Decorative side lines ── */}
      <line x1="16"  y1="55" x2="72"  y2="55" stroke={color} strokeWidth="0.7" opacity="0.2" />
      <line x1="188" y1="55" x2="244" y2="55" stroke={color} strokeWidth="0.7" opacity="0.2" />
    </svg>
  );
}

/**
 * Compact single-line wordmark — for tight spaces (nav sidebar, small header).
 * No crown, no tagline. Just "TOODIES" in gold.
 */
export function ToodiesWordmark({
  className = '',
  color = '#d4af37',
  width,
  height,
}: ToodiesLogoSVGProps) {
  return (
    <svg
      viewBox="0 0 200 36"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      aria-label="Toodies"
      role="img"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="toodiesGoldW" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f5e27d" />
          <stop offset="50%"  stopColor={color} />
          <stop offset="100%" stopColor="#9e7c1a" />
        </linearGradient>
      </defs>
      {/* Diamond accent to the left */}
      <polygon
        points="9,5 14,12 9,18 4,12"
        fill="url(#toodiesGoldW)"
      />
      <text
        x="22"
        y="24"
        textAnchor="start"
        fill="url(#toodiesGoldW)"
        fontFamily="'Georgia', 'Garamond', 'Times New Roman', serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="6"
      >
        TOODIES
      </text>
    </svg>
  );
}
