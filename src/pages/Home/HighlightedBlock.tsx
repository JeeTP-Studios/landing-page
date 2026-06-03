import { Link, useNavigate } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";

export default function HighlightedBlock() {
  const c = useSite();
  const s = c.highlighted;
  const navigate = useNavigate();
  if (!s.enabled) return null;
  return (
    <section className="blk" id="proyectos">
      <div
        className="blk-ov"
        style={{ background: grad(s), opacity: s.opacity }}
      />
      <div className="wrap">
        <div className="lbl reveal">{s.label}</div>
        <div className="head reveal">
          <h2>{s.title}</h2>
          <Link to="/case-studies" className="ghost-btn">
            {c.ui.buttons.allCases} <span>→</span>
          </Link>
        </div>
        <div className="hrow">
          {c.projects.map((p) => (
            <div
              className="hcard"
              key={p.id}
              onClick={() => navigate(`/case-studies/${p.id}`)}
            >
              <span className="br tl" />
              <span className="br tr" />
              <span className="br bl" />
              <span className="br brr" />
              <div className="htags">
                {(p.tags || []).slice(0, 2).map((t, i) => (
                  <span className="t" key={i}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="fill" style={{ background: p.gradA }}>
                {p.img ? (
                  <img
                    src={p.img}
                    style={{
                      width: "60%",
                      height: "60%",
                      objectFit: "contain",
                    }}
                    alt={p.name}
                  />
                ) : (
                  p.mono
                )}
              </div>
              <div className="hn">{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
