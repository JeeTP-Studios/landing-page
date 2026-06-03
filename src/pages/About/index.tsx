import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad, paragraphs } from "@/lib/style";
import { useReveal } from "@/hooks/useReveal";
import { useCrumb } from "@/components/layout/LayoutContext";
import ScrollCue from "@/components/common/ScrollCue";
import NewsBlock from "@/components/common/NewsBlock";
import LogoMarquee from "@/components/common/LogoMarquee";
import Footer from "@/components/layout/Footer";

export default function About() {
  const site = useSite();
  const a = site.about;
  useCrumb(
    <>
      <Link to="/">HOME</Link> › <span className="on">NOSOTROS</span>
    </>
  );
  useReveal([a]);
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <>
      <section className="phero">
        <div
          className="ov"
          style={{ background: grad(a.hero), opacity: a.hero.opacity }}
        />
        <div className="pin-content">
          <div className="eye">{a.hero.eyebrow}</div>
          <h1>{a.hero.title}</h1>
        </div>
        <ScrollCue id="acir" />
      </section>

      <section className="sect">
        <div className="wrap">
          <div className="two reveal">
            <div>
              <h2>{a.intro.heading}</h2>
            </div>
            <div className="bd">
              {paragraphs(a.intro.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <LogoMarquee
            logos={site.clients.logos}
            speedSec={site.carousel.speedSec}
          />
        </div>
      </section>

      <section className="sect">
        <div className="wrap">
          <div className="two reveal">
            <div>
              <h2>{a.overview.heading}</h2>
            </div>
            <div className="bd">
              {paragraphs(a.overview.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sect">
        <div className="wrap">
          <div className="two reveal">
            <div>
              <h2>{a.beliefs.heading}</h2>
            </div>
            <div className="bd">
              {paragraphs(a.beliefs.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                <Link className="inl" to="/case-studies">
                  {site.ui.buttons.aboutCases}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <NewsBlock enabled={a.news.enabled} />
      <Footer />
    </>
  );
}
