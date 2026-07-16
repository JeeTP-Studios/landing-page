import { useEffect, useRef } from "react";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";

/**
 * Banda de métricas del home. Los números cuentan de 0 al valor final la
 * primera vez que la banda entra al viewport (respeta reduced-motion).
 */
export default function StatsBand() {
  const c = useSite();
  const s = c.stats;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nums = [...grid.querySelectorAll<HTMLElement>(".stat-num")];
    if (reduce) {
      nums.forEach((el) => (el.textContent = el.dataset.final || ""));
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const t = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          nums.forEach((el) => {
            const v = Number(el.dataset.value || 0);
            el.textContent = `${Math.round(v * ease)}${el.dataset.suffix || ""}`;
          });
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    io.observe(grid);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [s.items]);

  if (!s.enabled || !s.items?.length) return null;
  return (
    <section className="blk stats-blk">
      <div className="blk-ov" style={{ background: grad(s), opacity: s.opacity }} />
      <div className="wrap">
        <div className="lbl reveal">{s.label}</div>
        <div className="head reveal">
          <h2>{s.title}</h2>
        </div>
        <div className="stats-grid reveal" ref={gridRef}>
          {s.items.map((it, i) => (
            <div className="stat" key={i}>
              <span
                className="stat-num"
                data-value={it.value}
                data-suffix={it.suffix}
                data-final={`${it.value}${it.suffix}`}
              >
                0{it.suffix}
              </span>
              <span className="stat-label">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
