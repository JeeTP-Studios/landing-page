import { useEffect, useRef } from "react";
import { frame, subscribe } from "@/lib/frame";
import { clamp } from "@/lib/math";
import type { LogoItem } from "@/types/content";

const COPIES = 4;

/**
 * Logo band that drifts on its own and speeds up and leans with the scroll
 * velocity. Four copies of the set make the loop seamless at any width.
 * Under reduced motion it stays still.
 */
export default function ClientsMarquee({
  logos,
  label,
}: {
  logos: LogoItem[];
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const width = useRef(1);
  const x = useRef(0);

  useEffect(() => {
    const el = track.current;
    if (!el || !logos.length) return;
    const measure = () => {
      width.current = Math.max(1, el.scrollWidth / COPIES);
    };
    measure();
    window.addEventListener("resize", measure);
    el.addEventListener("load", measure, true);
    document.fonts?.ready.then(measure);
    if (frame.calm) {
      return () => {
        window.removeEventListener("resize", measure);
        el.removeEventListener("load", measure, true);
      };
    }
    const unsub = subscribe((_, s) => {
      x.current -= 0.7 + Math.abs(s.vel) * 0.5;
      if (x.current < -width.current) x.current += width.current;
      el.style.transform = `translate3d(${x.current}px,0,0) skewX(${clamp(s.vel * -0.35, -14, 14)}deg)`;
    });
    return () => {
      unsub();
      window.removeEventListener("resize", measure);
      el.removeEventListener("load", measure, true);
    };
  }, [logos]);

  if (!logos.length) return null;
  return (
    <div className="mq" role="group" aria-label={label} data-edit="clients">
      <div className="mq-t" ref={track}>
        {Array.from({ length: COPIES }).flatMap((_, k) =>
          logos.map((l) =>
            l.img ? (
              <img key={`${k}-${l.name}`} src={l.img} alt={k ? "" : l.name} />
            ) : (
              <span key={`${k}-${l.name}`} className="mq-name" aria-hidden={k > 0}>
                {l.name}
              </span>
            )
          )
        )}
      </div>
    </div>
  );
}
