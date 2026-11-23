import { useSite } from "@/content/ContentContext";
import Faq from "@/components/ui/Faq";
import Pill from "@/components/ui/Pill";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FaqBlock() {
  const { faq, ui } = useSite();
  if (!faq.items.length) return null;
  return (
    <section className="faq-sect g">
      <SectionHeading title={faq.title} accent={faq.accent} />
      <Faq items={faq.items} />
      <div className="faq-more">
        <div>
          <h3>{ui.faqBox.title}</h3>
          <p>{ui.faqBox.body}</p>
        </div>
        <Pill to="/contact">{ui.faqBox.button}</Pill>
      </div>
    </section>
  );
}
