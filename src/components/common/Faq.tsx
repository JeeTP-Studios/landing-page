import { useId, useRef, useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import type { FaqItem } from "@/types/content";

/** Accordion, one answer open at a time. Height animates from measured content
 *  so long answers are never clipped. */
export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  const uid = useId();
  const bodies = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="faq">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={f.q}>
            <h3>
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`${uid}-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{f.q}</span>
                {isOpen ? (
                  <Minus size={17} weight="bold" />
                ) : (
                  <Plus size={17} weight="bold" />
                )}
              </button>
            </h3>
            <div
              className="faq-a"
              id={`${uid}-${i}`}
              role="region"
              hidden={!isOpen}
              style={{
                maxHeight: isOpen
                  ? (bodies.current[i]?.scrollHeight ?? 400) + 40
                  : 0,
              }}
            >
              <div ref={(el) => (bodies.current[i] = el)}>
                {f.a
                  .split("\n")
                  .filter(Boolean)
                  .map((line) => (
                    <p key={line}>{line}</p>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
