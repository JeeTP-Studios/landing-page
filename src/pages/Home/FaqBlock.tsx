import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { useSite } from "@/content/ContentContext";
import { Reveal } from "@/components/common/Reveal";
import Faq from "@/components/common/Faq";

export default function FaqBlock() {
  const c = useSite();
  const s = c.faq;
  if (!s.enabled || !s.items?.length) return null;

  return (
    <section className="sect faq-sect">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <Reveal>
            <h2>{s.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="faq-card notch">
              <h3>{c.ui.faqBox.title}</h3>
              <p>{c.ui.faqBox.body}</p>
              <Link to="/contact" className="btn">
                {c.ui.buttons.contact}
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.06}>
          <Faq items={s.items} />
        </Reveal>
      </div>
    </section>
  );
}
