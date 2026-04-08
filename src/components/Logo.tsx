import { ToodiesLogoSVG, ToodiesWordmark } from './ToodiesLogoSVG';

interface LogoProps {
  className?: string;
  alt?: string;
  /** Use "wordmark" for compact single-line version (sidebar, small headers) */
  variant?: 'full' | 'wordmark';
}

export function Logo({ className = 'h-14 w-auto', alt = 'Toodies', variant = 'full' }: LogoProps) {
  if (variant === 'wordmark') {
    return <ToodiesWordmark className={className} />;
  }
  return <ToodiesLogoSVG className={className} />;
}
