import { useEffect, useRef } from "react";
import { useSite } from "@/content/ContentContext";
import { frame } from "@/lib/frame";
import { renderAccent } from "@/components/ui/Accent";
import { stageRef } from "@/components/stage/stageStore";

/** Opening: the headline rises line by line over the floating 3D pieces. */
export default function Hero() {
  const { hero } = useSite();
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const key = hero.lines.join("|");

  useEffect(() => {
    if (frame.calm) return;
    const runs = lines.current.map((el, i) =>
      el?.animate(
        [{ transform: "translateY(105%) rotate(4deg)" }, { transform: "none" }],
        { duration: 1200, delay: 120 + i * 110, easing: "cubic-bezier(.25,1,.5,1)", fill: "backwards" }
      )
    );
    return () => runs.forEach((a) => a?.cancel());
  }, [key]);

  return (
    <section className="hero g" ref={stageRef("hero")} data-edit="hero">
      <h1 aria-label={hero.lines.join(" ")}>
        {hero.lines.map((line, i) => (
          <span className="ln" aria-hidden="true" key={i}>
            <span ref={(el) => (lines.current[i] = el)}>{renderAccent(line, hero.accent)}</span>
          </span>
        ))}
      </h1>
      <div className="hero-b">
        <p>{hero.sub}</p>
        <span className="scroll">{hero.scrollLabel}</span>
      </div>
    </section>
  );
}
