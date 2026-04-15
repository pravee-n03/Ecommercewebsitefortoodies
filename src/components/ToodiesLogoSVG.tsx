import toodiesLogo from '../assets/toodies-wordmark.jpeg';

interface ToodiesLogoSVGProps {
  /** Tailwind / inline className passed to the wrapping container */
  className?: string;
  /** Not used for image logo, kept for API compatibility */
  color?: string;
  /** Image width in pixels */
  width?: number | string;
  /** Image height in pixels */
  height?: number | string;
}

/**
 * Toodies brand logo — full size version.
 * Used on Auth pages, Landing page, Privacy/Terms headers.
 */
export function ToodiesLogoSVG({
  className = '',
  width,
  height,
}: ToodiesLogoSVGProps) {
  const imgHeight = height ?? (width ? undefined : 48);
  const imgWidth = width ?? undefined;

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ lineHeight: 0 }}
    >
      <img
        src={toodiesLogo}
        alt="Toodies"
        width={imgWidth}
        height={imgHeight}
        style={{
          display: 'block',
          objectFit: 'contain',
          borderRadius: '10px',
          width: imgWidth ? (typeof imgWidth === 'number' ? `${imgWidth}px` : imgWidth) : 'auto',
          height: imgHeight ? (typeof imgHeight === 'number' ? `${imgHeight}px` : imgHeight) : 'auto',
          maxWidth: '100%',
        }}
        draggable={false}
      />
    </div>
  );
}

/**
 * Compact Toodies logo — for tight spaces like sidebar headers.
 */
export function ToodiesWordmark({
  className = '',
  width,
  height,
}: ToodiesLogoSVGProps) {
  const size = height ?? width ?? 32;

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ lineHeight: 0 }}
    >
      <img
        src={toodiesLogo}
        alt="Toodies"
        style={{
          display: 'block',
          objectFit: 'contain',
          borderRadius: '8px',
          height: typeof size === 'number' ? `${size}px` : size,
          width: 'auto',
          maxWidth: '100%',
        }}
        draggable={false}
      />
    </div>
  );
}
