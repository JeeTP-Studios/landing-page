import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";
import { useReveal } from "@/hooks/useReveal";
import { useCrumb } from "@/components/layout/LayoutContext";
import CaseSectionView from "@/sections/CaseSections";
import Footer from "@/components/layout/Footer";

export default function CaseStudy() {
  const { id } = useParams();
  const c = useSite();
  const navigate = useNavigate();
  const idx = c.projects.findIndex((x) => x.id === id);
  const p = c.projects[idx];

  useCrumb(
    <>
      <Link to="/">HOME</Link> › <Link to="/case-studies">CASE STUDIES</Link> ›{" "}
      <span className="on">{(p?.name || "").toUpperCase()}</span>
    </>,
    [p?.id]
  );
  useReveal([p?.id]);
  useEffect(() => window.scrollTo(0, 0), [id]);

  useEffect(() => {
    if (!p && id !== undefined && c.projects.length) navigate("/case-studies");
  }, [p, id, c.projects.length, navigate]);

  if (!p) return null;

  const next = c.projects[(idx + 1) % c.projects.length];
  const sections = (p.sections || []).filter((s) => s.enabled);
  const L = c.ui.caseStudy;

  return (
    <>
      <section className="pd">
        <div className="wrap">
          <Link className="pd-back" to="/case-studies">
            {L.back}
          </Link>

          {p.heroMode === "custom" && p.heroImage ? (
            <div className="pd-hero pd-hero-custom">
              <img src={p.heroImage} alt={p.name} />
            </div>
          ) : (
            <div className="pd-hero">
              <div className="ov" style={{ background: grad(p) }} />
              <div className="pd-ghost">{p.ghost}</div>
              <div className="pd-emb">
                {p.img ? (
                  <img src={p.img} alt={p.name} />
                ) : (
                  <div
                    className="mono"
                    style={{
                      background: `linear-gradient(140deg, ${p.accent}, ${p.gradB})`,
                    }}
                  >
                    {p.mono}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pd-specs">
            <div className="s">
              <small>{L.specCategory}</small>
              <div>{p.category}</div>
            </div>
            <div className="s">
              <small>{L.specDuration}</small>
              <div>{p.duration}</div>
            </div>
            <div className="s">
              <small>{L.specMeta}</small>
              <div>
                {p.year} · {p.location}
              </div>
            </div>
          </div>

          {sections.map((s) => (
            <CaseSectionView key={s.id} section={s} project={p} />
          ))}

          <div
            className="cs-upnext"
            onClick={() => navigate(`/case-studies/${next.id}`)}
          >
            <div>
              <div className="lbl">{L.upNext}</div>
              <h3>{next.name}</h3>
            </div>
            <div className="arrow">→</div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
