import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useSite } from "@/content/ContentContext";
import PageHero from "@/components/common/PageHero";
import { Reveal, RevealItem, RevealList } from "@/components/common/Reveal";
import ClientsBlock from "@/components/common/ClientsBlock";
import Footer from "@/components/layout/Footer";

export default function Services() {
  const site = useSite();
  const s = site.servicesPage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageHero eyebrow={s.hero.eyebrow} title={s.hero.title} tint={s.hero} />

      {/* Capability groups. Each group is one chunk with its own set of
          deliverables, rather than one long undifferentiated list. */}
      <section className="sect">
        <div className="wrap">
          <RevealList className="groups" amount={0.08}>
            {s.groups.map((g) => (
              <RevealItem className="group" key={g.title}>
                <span className="group-num num">{g.num}</span>
                <h3 className="group-title">{g.title}</h3>
                <div className="group-links">
                  {(g.links || []).map((l) => (
                    <Link className="group-link" to="/contact" key={l}>
                      {l}
                      <ArrowUpRight size={13} weight="bold" />
                    </Link>
                  ))}
                </div>
              </RevealItem>
            ))}
          </RevealList>
        </div>
      </section>

      {s.who.enabled && (
        <section className="sect who">
          <div className="wrap">
            <Reveal className="who-head">
              <h2>{s.who.heading}</h2>
              <p>{s.who.body}</p>
            </Reveal>
          </div>
          <RevealList className="who-row" amount={0.1}>
            {s.who.cards.map((w, i) => (
              <RevealItem className={`who-card notch who-card-${i % 3}`} key={w.title}>
                {w.img ? <img src={w.img} alt="" loading="lazy" /> : null}
                <span className="who-scrim" />
                <h3>{w.title}</h3>
              </RevealItem>
            ))}
          </RevealList>
        </section>
      )}

      <ClientsBlock title={s.clientsTitle} />
      <Footer />
    </>
  );
}
