import { useSite } from "@/content/ContentContext";
import { Reveal } from "./Reveal";
import LogoMarquee from "./LogoMarquee";

/**
 * Social proof band. Sits under the hero on the home page, never inside it.
 * A quiet label plus the marks, nothing else.
 */
export default function ClientsBlock({ title }: { title: string }) {
  const { clients, carousel } = useSite();
  if (!clients.logos?.length) return null;
  return (
    <section className="sect-tight clients">
      <div className="wrap">
        <Reveal as="p" className="clients-title">
          {title}
        </Reveal>
      </div>
      <LogoMarquee
        logos={clients.logos}
        speedSec={carousel.speedSec}
        whiteLogos={clients.whiteLogos}
        colorOnHover={clients.colorOnHover}
      />
    </section>
  );
}
