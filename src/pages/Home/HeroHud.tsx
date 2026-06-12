import { useEffect, useRef } from "react";

/**
 * HUD del hero: rieles tipo "regla" con ticks animados y lecturas numéricas
 * que cambian (instrumento vivo), más un leve parallax con el mouse.
 * Es puramente decorativo (pointer-events: none) y respeta reduce-motion.
 */

const pad = (n: number) => String(n).padStart(2, "0");
const rnd = (max = 99) => Math.floor(Math.random() * max);

const RAIL_SIDES = ["left", "right"] as const;
const CORNERS = ["tl", "tr", "bl", "br"] as const;
const RAIL_NUMS = [0, 1, 2, 3, 4];

export default function HeroHud() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const readouts = [...root.querySelectorAll<HTMLElement>("[data-num]")];
    const rails = [...root.querySelectorAll<HTMLElement>(".hrail")];
    const corners = [...root.querySelectorAll<HTMLElement>(".hcorner")];

    let alive = true;
    let raf = 0;
    let lastCycle = 0;

    // parallax con el mouse (lerp suave)
    const mouse = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduce) window.addEventListener("mousemove", onMove, { passive: true });

    const cycle = () => {
      for (const el of readouts) {
        // solo una parte cambia en cada tick: se siente más orgánico
        if (Math.random() < 0.45) {
          const n = el.querySelector(".n");
          const sup = el.querySelector("sup");
          if (n) n.textContent = pad(rnd());
          if (sup) sup.textContent = pad(rnd());
        }
      }
    };

    const frame = (t: number) => {
      if (!alive) return;
      if (t - lastCycle > 120) {
        lastCycle = t;
        cycle();
      }
      cur.x += (mouse.x - cur.x) * 0.06;
      cur.y += (mouse.y - cur.y) * 0.06;
      rails.forEach((r) => {
        r.style.transform = `translate3d(${cur.x * -7}px, ${cur.y * 9}px, 0)`;
      });
      corners.forEach((cc) => {
        cc.style.transform = `translate3d(${cur.x * -10}px, ${cur.y * 6}px, 0)`;
      });
      raf = requestAnimationFrame(frame);
    };

    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="hero-hud" ref={ref}>
      <span className="corner c1" />
      <span className="corner c2" />
      <span className="corner c3" />
      <span className="corner c4" />

      {RAIL_SIDES.map((side) => (
        <div className={`hrail ${side}`} key={side}>
          <span className="hrail-line" />
          <div className="hrail-nums">
            {RAIL_NUMS.map((i) => (
              <span className="hreadout" data-num key={i}>
                <span className="n">{pad(rnd())}</span>
                {(i === 0 || i === 4) && <sup>{pad(rnd())}</sup>}
              </span>
            ))}
          </div>
        </div>
      ))}

      {CORNERS.map((p) => (
        <span className={`hcorner ${p}`} data-num key={p}>
          <span className="n">{pad(rnd())}</span>
          <sup>{pad(rnd())}</sup>
        </span>
      ))}
    </div>
  );
}
