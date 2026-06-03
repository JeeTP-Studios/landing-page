import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";
import { useReveal } from "@/hooks/useReveal";
import { useCrumb } from "@/components/layout/LayoutContext";
import ScrollCue from "@/components/common/ScrollCue";
import RowScroller from "@/components/common/RowScroller";
import ClientsBlock from "@/components/common/ClientsBlock";
import NewsBlock from "@/components/common/NewsBlock";
import Footer from "@/components/layout/Footer";

const WHO_COLORS = ["#2ea3d8", "#ff3b3b", "#c44bff", "#ff7a2e", "#1fc7c7", "#7c5cff"];

export default function Services() {
  const site = useSite();
  const s = site.servicesPage;
  useCrumb(
    <>
      <Link to="/">HOME</Link> › <span className="on">SERVICIOS</span>
    </>
  );
  useReveal([s]);
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <>
      <section className="phero">
        <div
          className="ov"
          style={{ background: grad(s.hero), opacity: s.hero.opacity }}
        />
        <div className="pin-content">
          <div className="eye">{s.hero.eyebrow}</div>
          <h1>{s.hero.title}</h1>
        </div>
        <ScrollCue id="scir" />
      </section>

      <section className="sect">
        <div className="wrap">
          <div className="svcwrap">
            <div className="svctitle reveal">
              <h2>{site.ui.servicesPageTitle}</h2>
            </div>
            <div className="reveal">
              {s.groups.map((g, i) => (
                <div className="svcg" key={i}>
                  <div className="num">{g.num}</div>
                  <h3>{g.title}</h3>
                  <div className="links">
                    {(g.links || []).map((l, li) => (
                      <Link to="/contact" key={li}>
                        {l} <span className="ar">↗</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {s.who.enabled && (
        <section className="sect">
          <div className="wrap">
            <div className="head reveal">
              <div>
                <h2 style={{ fontSize: "clamp(28px,4vw,52px)" }}>
                  {s.who.heading}
                </h2>
                <p
                  style={{
                    color: "var(--muted)",
                    maxWidth: "60ch",
                    marginTop: 16,
                  }}
                >
                  {s.who.body}
                </p>
              </div>
            </div>
            <RowScroller className="whorow">
              {s.who.cards.map((w, i) => (
                <div className="whocard" key={i}>
                  <div
                    className="wov"
                    style={{
                      background: `linear-gradient(150deg, ${
                        WHO_COLORS[i % WHO_COLORS.length]
                      }, #06182e)`,
                    }}
                  />
                  {w.img ? <img src={w.img} alt={w.title} /> : null}
                  <h3>{w.title}</h3>
                </div>
              ))}
            </RowScroller>
          </div>
        </section>
      )}

      <ClientsBlock title={s.clientsTitle} />
      <NewsBlock enabled={s.news.enabled} />
      <Footer />
    </>
  );
}
