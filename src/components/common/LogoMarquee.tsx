import type { LogoItem } from "@/types/content";

/**
 * Continuous logo band. Two identical halves scroll as one track so the loop
 * has no seam. Pauses on hover so a logo can actually be read, and the whole
 * thing stops under reduced motion (handled in CSS).
 *
 * Logos only: no industry captions underneath. The mark is the credibility.
 */
export default function LogoMarquee({
  logos,
  speedSec = 40,
  whiteLogos = false,
  colorOnHover = false,
}: {
  logos: LogoItem[];
  speedSec?: number;
  whiteLogos?: boolean;
  colorOnHover?: boolean;
}) {
  if (!logos.length) return null;
  const loop = [...logos, ...logos];
  const cls = [
    "marquee",
    whiteLogos ? "is-flat" : "",
    whiteLogos && colorOnHover ? "is-color-hover" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      <div
        className="marquee-track"
        style={{ animationDuration: `${Math.max(8, speedSec)}s` }}
      >
        {loop.map((l, i) => (
          <div className="marquee-item" key={i} aria-hidden={i >= logos.length}>
            {l.img ? (
              <img src={l.img} alt={i < logos.length ? l.name : ""} loading="lazy" />
            ) : (
              <span>{l.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
