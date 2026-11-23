import { useId, useState } from "react";
import type { FaqItem } from "@/types/content";

/** Minimal accordion: hairlines, one answer open at a time. */
export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  const uid = useId();
  return (
    <div className="faq">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={i}>
            <h3>
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`${uid}-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{f.q}</span>
                <i aria-hidden="true">+</i>
              </button>
            </h3>
            <div className="faq-a" id={`${uid}-${i}`} role="region">
              <div>
                {f.a
                  .split("\n")
                  .filter(Boolean)
                  .map((line, k) => (
                    <p key={k}>{line}</p>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
