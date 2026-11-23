import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { paragraphs } from "@/lib/text";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import Clients from "@/components/ui/Clients";
import Footer from "@/components/layout/Footer";

export default function About() {
  const { about: a, ui } = useSite();
  const gallery = (a.gallery || []).filter(Boolean).slice(0, 3);

  return (
    <>
      <main className="page">
        <PageHero
          editKey="about-hero"
          eyebrow={a.hero.eyebrow}
          title={a.hero.title}
          accent={a.hero.accent}
        />

        <section className="sect g editorial" data-edit="about-intro">
          <Reveal as="h2" className="h3">
            {a.intro.heading}
          </Reveal>
          <Reveal delay={0.06} className="prose">
            {paragraphs(a.intro.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </section>

        {gallery.length > 0 && (
          <section className="g about-gallery" data-edit="about-gallery">
            {gallery.map((src, i) => (
              <Reveal className={`about-shot about-shot-${i}`} key={src} delay={i * 0.06}>
                <img src={src} alt="" loading="lazy" />
              </Reveal>
            ))}
          </section>
        )}

        <section className="sect g about-pair">
          <Reveal className="pane-text" data-edit="about-overview">
            <h3 className="h3">{a.overview.heading}</h3>
            {paragraphs(a.overview.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.08} className="pane-text" data-edit="about-beliefs">
            <h3 className="h3">{a.beliefs.heading}</h3>
            {paragraphs(a.beliefs.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <Link className="ulink" to="/case-studies">
              {ui.buttons.work} →
            </Link>
          </Reveal>
        </section>

        <Clients />
      </main>
      <Footer />
    </>
  );
}
