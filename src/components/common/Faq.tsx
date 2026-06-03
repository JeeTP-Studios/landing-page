import { useState } from "react";
import type { FaqItem } from "@/types/content";

/** Acordeón de FAQ con una sola pregunta abierta a la vez. */
export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className="faq-item" key={i}>
            <button
              className="faq-q"
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              {f.q}
              <span className="pm">{isOpen ? "−" : "+"}</span>
            </button>
            <div
              className="faq-a"
              style={{ maxHeight: isOpen ? 400 : 0 }}
            >
              <p>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
