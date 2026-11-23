import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { posterFit, projectPoster } from "@/lib/project";
import CaseSectionView from "@/sections/CaseSections";
import { Reveal } from "@/components/ui/Reveal";
import Footer from "@/components/layout/Footer";

export default function CaseStudy() {
  const { id } = useParams();
  const c = useSite();
  const navigate = useNavigate();
  const idx = c.projects.findIndex((x) => x.id === id);
  const p = c.projects[idx];

  useEffect(() => {
    if (!p && id !== undefined && c.projects.length) navigate("/case-studies");
  }, [p, id, c.projects.length, navigate]);

  if (!p) return null;

  const next = c.projects[(idx + 1) % c.projects.length];
  const sections = (p.sections || []).filter((s) => s.enabled);
  const L = c.ui.caseStudy;
  const hero = projectPoster(p);

  return (
    <>
      <article className="page case">
        <div className="g">
          <Link className="ulink case-back" to="/case-studies">
            ← {L.back}
          </Link>

          <header className="case-top">
            <div className="case-tags">
              {(p.tags || []).map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <Reveal as="h1">{p.name}</Reveal>
            <p className="lede">{p.desc}</p>
          </header>

          <Reveal className="case-hero" data-fit={posterFit(hero)}>
            {hero ? <img src={hero} alt={p.name} /> : null}
          </Reveal>

          <dl className="case-specs">
            <div>
              <dt>{L.specCategory}</dt>
              <dd>{p.category}</dd>
            </div>
            <div>
              <dt>{L.specDuration}</dt>
              <dd>{p.duration}</dd>
            </div>
            <div>
              <dt>{L.specMeta}</dt>
              <dd>
                {p.year} · {p.location}
              </dd>
            </div>
          </dl>

          <div className="case-sections">
            {sections.map((s) => (
              <CaseSectionView key={s.id} section={s} project={p} />
            ))}
          </div>

          <Link className="up-next" to={`/case-studies/${next.id}`}>
            <span>
              <small>{L.upNext}</small>
              <b>{next.name}</b>
            </span>
            <i aria-hidden="true">→</i>
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
