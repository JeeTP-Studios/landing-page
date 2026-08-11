import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useSite } from "@/content/ContentContext";
import { paragraphs } from "@/lib/style";
import PageHero from "@/components/common/PageHero";
import { Reveal, RevealItem, RevealList } from "@/components/common/Reveal";
import ClientsBlock from "@/components/common/ClientsBlock";
import Footer from "@/components/layout/Footer";

export default function About() {
  const site = useSite();
  const a = site.about;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const gallery = (a.gallery || []).filter(Boolean);

  return (
    <>
      <PageHero eyebrow={a.hero.eyebrow} title={a.hero.title} tint={a.hero} />

      {/* Sticky heading against flowing body: the argument, told once. */}
      <section className="sect">
        <div className="wrap editorial">
          <Reveal as="h2" className="editorial-head">
            {a.intro.heading}
          </Reveal>
          <Reveal delay={0.06} className="editorial-body">
            {paragraphs(a.intro.body).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="sect-tight">
          <RevealList className="wrap about-gallery" amount={0.12}>
            {gallery.slice(0, 3).map((src, i) => (
              <RevealItem key={src} className={`about-shot about-shot-${i}`}>
                <img src={src} alt="" loading="lazy" />
              </RevealItem>
            ))}
          </RevealList>
        </section>
      )}

      {/* Two positions, side by side. Different family from the block above. */}
      <section className="sect">
        <div className="wrap about-pair">
          <Reveal className="about-pane">
            <h3>{a.overview.heading}</h3>
            {paragraphs(a.overview.body).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.08} className="about-pane">
            <h3>{a.beliefs.heading}</h3>
            {paragraphs(a.beliefs.body).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <Link className="link about-link" to="/case-studies">
              {site.ui.buttons.work}
              <ArrowUpRight size={15} weight="bold" />
            </Link>
          </Reveal>
        </div>
      </section>

      <ClientsBlock title={site.clients.title} />
      <Footer />
    </>
  );
}
