import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";
import RowScroller from "@/components/common/RowScroller";

export default function ServicesCardsBlock() {
  const c = useSite();
  const s = c.services;
  if (!s.enabled) return null;
  return (
    <section className="blk" id="servicios">
      <div
        className="blk-ov"
        style={{ background: grad(s), opacity: s.opacity }}
      />
      <div className="wrap">
        <div className="lbl reveal">{s.label}</div>
        <div className="head reveal">
          <h2>{s.title}</h2>
          <Link to="/services" className="ghost-btn">
            {c.ui.buttons.viewServices} <span>→</span>
          </Link>
        </div>
        <RowScroller className="srow">
          {s.items.map((it, i) => (
            <div className="scard reveal" key={i} style={{ background: it.color }}>
              <h3>{it.h}</h3>
              <div className="sb">
                {it.a}
                <b>{it.b}</b>
              </div>
            </div>
          ))}
        </RowScroller>
      </div>
    </section>
  );
}
