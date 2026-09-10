import { useEffect, useState } from "react";

/**
 * Background video for the homepage hero.
 * Renders only on larger screens with a fast connection and when the visitor
 * hasn't asked for reduced motion — otherwise the still image stays visible.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wideEnough = window.matchMedia("(min-width: 768px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (wideEnough && !reducedMotion && !conn?.saveData) setEnabled(true);
  }, []);

  if (!enabled) return null;

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
