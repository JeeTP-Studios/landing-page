import { useEffect, useRef } from "react";
import { useSite } from "@/content/ContentContext";
import { Reveal } from "@/components/common/Reveal";

/**
 * Metrics with no card containers: hairlines and space do the grouping.
 * Numbers count up once, the first time the band is seen. Feedback that the
 * figures are live, not decoration; it never replays.
 */
export default function StatsBand() {
  const c = useSite();
  const s = c.stats;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const nums = [...grid.querySelectorAll<HTMLElement>(".stat-num")];
    const settle = () =>
      nums.forEach((el) => (el.textContent = el.dataset.final || ""));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - t0) / 1300, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          nums.forEach((el) => {
            const v = Number(el.dataset.value || 0);
            el.textContent = `${Math.round(v * ease)}${el.dataset.suffix || ""}`;
          });
          if (t < 1) raf = requestAnimationFrame(tick);
          else settle();
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(grid);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [s.items]);

  if (!s.enabled || !s.items?.length) return null;

  return (
    <section className="sect stats">
      <div className="wrap">
        <Reveal as="h2" className="stats-title">
          {s.title}
        </Reveal>
        <div className="stats-grid" ref={gridRef}>
          {s.items.map((it) => (
            <div className="stat" key={it.label}>
              <span
                className="stat-num num"
                data-value={it.value}
                data-suffix={it.suffix}
                data-final={`${it.value}${it.suffix}`}
              >
                {`0${it.suffix}`}
              </span>
              <span className="stat-label">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
