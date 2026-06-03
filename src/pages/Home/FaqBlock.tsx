import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";
import Faq from "@/components/common/Faq";

export default function FaqBlock() {
  const c = useSite();
  const s = c.faq;
  if (!s.enabled) return null;
  return (
    <section className="blk">
      <div
        className="blk-ov"
        style={{ background: grad(s), opacity: s.opacity }}
      />
      <div className="wrap">
        <div className="lbl reveal">{s.label}</div>
        <div className="head reveal">
          <h2>{s.title}</h2>
        </div>
        <div className="faqgrid reveal">
          <Faq items={s.items} />
          <div className="faqbox">
            <div className="env">✉</div>
            <h3>{c.ui.faqBox.title}</h3>
            <p>{c.ui.faqBox.body}</p>
            <Link to="/contact">{c.ui.faqBox.button}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
