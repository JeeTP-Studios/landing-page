import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";
import { useReveal } from "@/hooks/useReveal";
import { useTilt } from "@/hooks/useTilt";
import { useCrumb } from "@/components/layout/LayoutContext";
import Footer from "@/components/layout/Footer";

export default function Cases() {
  const c = useSite();
  const cs = c.cases;
  const navigate = useNavigate();
  const [filter, setFilter] = useState("*");
  const gridRef = useRef<HTMLDivElement>(null);
  useTilt(gridRef, ".casecard", [c.projects, filter]);

  useCrumb(
    <>
      <Link to="/">HOME</Link> › <span className="on">CASE STUDIES</span>
    </>
  );
  useReveal([c.projects]);
  useEffect(() => window.scrollTo(0, 0), []);

  const allTags = useMemo(
    () => [...new Set(c.projects.flatMap((p) => p.tags || []))],
    [c.projects]
  );

  return (
    <>
      <section className="pd" style={{ paddingTop: 150 }}>
        <div className="wrap">
          <div className="lbl reveal">{cs.label}</div>
          <div className="head reveal" style={{ marginBottom: 24 }}>
            <h2>{cs.title}</h2>
          </div>
          <div className="casefilters reveal">
            <button
              className={`chip ${filter === "*" ? "on" : ""}`}
              onClick={() => setFilter("*")}
            >
              Todos
            </button>
            {allTags.map((t) => {
              const key = t.toLowerCase();
              return (
                <button
                  key={key}
                  className={`chip ${filter === key ? "on" : ""}`}
                  onClick={() => setFilter(key)}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <div className="casegrid" ref={gridRef}>
            {c.projects
              .filter(
                (p) =>
                  filter === "*" ||
                  (p.tags || []).map((t) => t.toLowerCase()).includes(filter)
              )
              .map((p) => (
                <div
                  className="casecard"
                  key={p.id}
                  onClick={() => navigate(`/case-studies/${p.id}`)}
                >
                  <span className="br tl" />
                  <span className="br tr" />
                  <span className="br bl" />
                  <span className="br brr" />
                  <div className="htags">
                    {(p.tags || []).slice(0, 3).map((t, i) => (
                      <span className="t" key={i}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="fill" style={{ background: grad(p) }}>
                    {p.pattern && p.pattern !== "none" ? (
                      <span
                        className={`cardpat pat-${p.pattern}`}
                        style={{ opacity: p.patternOpacity ?? 0.25 }}
                      />
                    ) : null}
                    {p.img ? (
                      <img src={p.img} alt={p.name} />
                    ) : (
                      <span className="mono2">{p.mono}</span>
                    )}
                  </div>
                  <div className="hn">{p.name}</div>
                  <div className="hcta">
                    Ver caso <span>↗</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
