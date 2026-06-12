import { useEffect, useRef, useState } from "react";

/**
 * Efecto máquina de escribir en bucle sobre una lista de frases.
 * Escribe una, la mantiene unos segundos, la borra y pasa a la siguiente.
 * Con una sola frase la escribe y la deja fija (cursor parpadeando).
 * Respeta prefers-reduced-motion (muestra la primera sin animar).
 */
export default function Typewriter({
  texts,
  className,
}: {
  texts: string[];
  className?: string;
}) {
  const list = texts.filter((t) => t && t.trim().length > 0);
  const [out, setOut] = useState(list[0] ?? "");
  const [typing, setTyping] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (list.length === 0) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
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
          if (list.length === 1) return; // una sola frase: queda fija
          phase = "hold";
          timer.current = setTimeout(step, 2200);
          return;
        }
        timer.current = setTimeout(step, 52 + Math.random() * 45);
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
          timer.current = setTimeout(step, 320);
          return;
        }
        timer.current = setTimeout(step, 26);
      }
    };

    timer.current = setTimeout(step, 450);
    return () => {
      alive = false;
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.join("|")]);

  return (
    <h1 className={className}>
      <span className="tw-text">{out}</span>
      <span className={`tw-caret ${typing ? "typing" : ""}`} aria-hidden>
        |
      </span>
    </h1>
  );
}
