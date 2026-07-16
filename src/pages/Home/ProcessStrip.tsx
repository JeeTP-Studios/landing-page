import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";

/**
 * Tira de proceso ("how we work") del home: pasos numerados sobre una línea
 * conectora, con hover que enciende cada paso.
 */
export default function ProcessStrip() {
  const c = useSite();
  const s = c.process;
  if (!s.enabled || !s.steps?.length) return null;
  return (
    <section className="blk process-blk">
      <div className="blk-ov" style={{ background: grad(s), opacity: s.opacity }} />
      <div className="wrap">
        <div className="lbl reveal">{s.label}</div>
        <div className="head reveal">
          <h2>{s.title}</h2>
        </div>
        <ol className="proc-grid">
          {s.steps.map((st, i) => (
            <li className="proc-step reveal" key={i}>
              <span className="proc-num">{st.num}</span>
              <h3 className="proc-h">{st.title}</h3>
              <p className="proc-b">{st.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
