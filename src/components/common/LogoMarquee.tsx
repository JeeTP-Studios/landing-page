import type { LogoItem } from "@/types/content";

/**
 * Carrusel de logos que se desliza automáticamente en bucle.
 * La velocidad (segundos por vuelta) es configurable; menor = más rápido.
 * Se duplica la lista para lograr un loop continuo sin saltos.
 */
export default function LogoMarquee({
  logos,
  speedSec = 30,
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
    "logomarquee reveal",
    whiteLogos ? "white" : "",
    whiteLogos && colorOnHover ? "color-hover" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls}>
      <div
        className="logomarquee-track"
        style={{ animationDuration: `${Math.max(4, speedSec)}s` }}
      >
        {loop.map((l, i) => (
          <div className="lg" key={i} aria-hidden={i >= logos.length}>
            {l.img ? <img src={l.img} alt={l.name} /> : l.name}
          </div>
        ))}
      </div>
    </div>
  );
}
