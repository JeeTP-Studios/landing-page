import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import LogoMarquee from "./LogoMarquee";

/** Bloque de clientes reutilizable (home / servicios): carrusel de logos. */
export default function ClientsBlock({ title }: { title: string }) {
  const { clients, carousel, ui } = useSite();
  return (
    <section className="sect">
      <div className="wrap">
        <div className="head reveal">
          <h2 style={{ fontSize: "clamp(28px,4vw,52px)" }}>{title}</h2>
          <Link to="/case-studies" className="ghost-btn">
            {ui.buttons.viewCases} <span>→</span>
          </Link>
        </div>
      </div>
      <div className="wrap">
        <LogoMarquee
          logos={clients.logos}
          speedSec={carousel.speedSec}
          whiteLogos={clients.whiteLogos}
          colorOnHover={clients.colorOnHover}
        />
      </div>
    </section>
  );
}
