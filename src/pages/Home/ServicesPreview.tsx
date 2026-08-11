import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "@/content/ContentContext";
import { Reveal, RevealItem, RevealList } from "@/components/common/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Sticky split: the panel on the left changes to match whichever service the
 * reader is on. State transition, so the media and the list never disagree.
 * Auto-advances until the reader takes over, then stays where they put it.
 */
export default function ServicesPreview() {
  const c = useSite();
  const s = c.services;
  const items = s.items || [];
  const n = items.length;
  const [active, setActive] = useState(0);
  const taken = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (n <= 1 || reduce) return;
    const id = setInterval(() => {
      if (taken.current) return;
      setActive((a) => (a + 1) % n);
    }, 3600);
    return () => clearInterval(id);
  }, [n, reduce]);

  if (!s.enabled || n === 0) return null;
  const cur = items[Math.min(active, n - 1)];

  const pick = (i: number) => {
    taken.current = true;
    setActive(i);
  };

  return (
    <section className="sect services" id="services">
      <div className="wrap">
        <div className="services-head">
          <Reveal>
            <p className="eyebrow">{s.label}</p>
            <h2>{s.title}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Link to="/services" className="link">
              {c.ui.buttons.services}
              <ArrowUpRight size={15} weight="bold" />
            </Link>
          </Reveal>
        </div>

        <div className="services-grid">
          <div className="services-panel">
            <div className="services-panel-inner notch">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className="services-frame"
                  initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{
                    background: `linear-gradient(155deg, ${cur.color}38, var(--bg-2) 70%)`,
                  }}
                >
                  {cur.img ? (
                    <img src={cur.img} alt="" />
                  ) : (
                    <span className="services-frame-mark" aria-hidden>
                      {cur.h.charAt(0)}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
              <span className="services-frame-tag">{cur.h}</span>
            </div>
          </div>

          <RevealList as="ul" className="services-list" amount={0.15}>
            {items.map((it, i) => (
              <RevealItem
                as="li"
                key={it.h}
                className={`service-row ${i === active ? "is-on" : ""}`}
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
              >
                <Link to="/services" onClick={() => pick(i)}>
                  <span className="service-index num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="service-body">
                    <span className="service-name">{it.h}</span>
                    <span className="service-sub">{it.a}</span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    weight="bold"
                    className="service-arrow"
                  />
                </Link>
              </RevealItem>
            ))}
          </RevealList>
        </div>
      </div>
    </section>
  );
}
