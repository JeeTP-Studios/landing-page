import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import Clients from "@/components/ui/Clients";
import Footer from "@/components/layout/Footer";

export default function Services() {
  const { servicesPage: s, solutions } = useSite();

  return (
    <>
      <main className="page">
        <PageHero
          editKey="services-hero"
          eyebrow={s.hero.eyebrow}
          title={s.hero.title}
          accent={s.hero.accent}
        />

        {/* The same solutions the home presents, here as a list. */}
        <section className="g sv-sol" data-edit="services-solutions">
          {solutions.items.map((it, i) => (
            <Reveal className="sv-row" key={i}>
              <h3>{it.title}</h3>
              <div>
                <p>{it.body}</p>
                {it.chips.length ? (
                  <ul>
                    {it.chips.map((c, k) => (
                      <li key={k}>{c}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          ))}
        </section>

        {/* Capability groups: what each solution is made of. */}
        <section className="sect g groups" data-edit="services-groups">
          {s.groups.map((g) => (
            <Reveal className="group" key={g.num + g.title}>
              <span className="group-num">{g.num}</span>
              <h3>{g.title}</h3>
              <div className="group-links">
                {(g.links || []).map((l, i) => (
                  <Link to="/contact" key={i}>
                    {l} <i aria-hidden="true">↗</i>
                  </Link>
                ))}
              </div>
            </Reveal>
          ))}
        </section>

        {s.who.enabled && (
          <section className="sect who" data-edit="services-who">
            <div className="g who-head">
              <Reveal as="h2" className="h3">
                {s.who.heading}
              </Reveal>
              <p className="lede">{s.who.body}</p>
            </div>
            <div className="who-row g">
              {s.who.cards.map((w, i) => (
                <Reveal className="who-card" key={i} delay={i * 0.05}>
                  {w.img ? <img src={w.img} alt="" loading="lazy" /> : null}
                  <span className="who-scrim" />
                  <h3>{w.title}</h3>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <Clients />
      </main>
      <Footer />
    </>
  );
}
