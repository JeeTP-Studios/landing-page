import { useEffect, useRef, useState } from "react";

/**
 * Types one phrase, holds it, deletes it, moves to the next. Renders an inline
 * span so the surrounding heading owns the semantics and the type scale.
 * Under prefers-reduced-motion it renders the first phrase, statically.
 */
export default function Typewriter({
  texts,
  className = "",
}: {
  texts: string[];
  className?: string;
}) {
  const list = texts.filter((t) => t && t.trim().length > 0);
  const [out, setOut] = useState(list[0] ?? "");
  const [typing, setTyping] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const key = list.join("|");

  useEffect(() => {
    if (list.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(list[0]);
      return;
    }

    let cur = 0;
    let char = 0;
    let phase: "typing" | "hold" | "deleting" = "typing";
    let alive = true;

    const step = () => {
      if (!alive) return;
      const full = list[cur % list.length];
      if (phase === "typing") {
        char++;
        setOut(full.slice(0, char));
        setTyping(true);
        if (char >= full.length) {
          if (list.length === 1) return;
          phase = "hold";
          timer.current = setTimeout(step, 2400);
          return;
        }
        timer.current = setTimeout(step, 48 + Math.random() * 40);
      } else if (phase === "hold") {
        phase = "deleting";
        setTyping(false);
        timer.current = setTimeout(step, 40);
      } else {
        char--;
        setOut(full.slice(0, Math.max(char, 0)));
        if (char <= 0) {
          phase = "typing";
          cur++;
          timer.current = setTimeout(step, 260);
          return;
        }
        timer.current = setTimeout(step, 24);
      }
    };

    timer.current = setTimeout(step, 500);
    return () => {
      alive = false;
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <span className={`tw ${className}`}>
      <span className="tw-text">{out}</span>
      <span className={`tw-caret ${typing ? "is-typing" : ""}`} aria-hidden />
    </span>
  );
}
