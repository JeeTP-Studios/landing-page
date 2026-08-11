import { useSite } from "@/content/ContentContext";
import { Reveal, RevealItem, RevealList } from "@/components/common/Reveal";

/**
 * How the work actually runs, as a vertical timeline. The rule on the left is
 * the spine; each step steps further in, so the sequence is legible at a
 * glance without numbering the reader through it.
 */
export default function ProcessStrip() {
  const c = useSite();
  const s = c.process;
  if (!s?.enabled || !s.steps?.length) return null;

  return (
    <section className="sect process">
      <div className="wrap">
        <Reveal as="h2" className="process-title">
          {s.title}
        </Reveal>
        <RevealList as="ol" className="process-list" amount={0.12}>
          {s.steps.map((st, i) => (
            <RevealItem
              as="li"
              key={st.title}
              className="process-step"
              style={{ ["--step" as string]: i }}
            >
              <span className="process-num num">{st.num}</span>
              <div className="process-body">
                <h3>{st.title}</h3>
                <p>{st.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
