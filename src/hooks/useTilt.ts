import { useEffect, type RefObject } from "react";

/**
 * Tilt 3D + parallax con el cursor para cards.
 * Escribe variables CSS en cada card (--rx, --ry, --px, --py, --gx, --gy)
 * que el CSS usa para rotar la tarjeta, mover la imagen y posicionar el brillo.
 * Se desactiva en touch y con prefers-reduced-motion.
 */
export function useTilt<T extends HTMLElement>(
  ref: RefObject<T>,
  selector: string,
  deps: unknown[] = []
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches
    )
      return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const cleanups: Array<() => void> = [];

    for (const card of cards) {
      let raf = 0;
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width; // 0..1
        const py = (e.clientY - r.top) / r.height; // 0..1
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty("--rx", ((py - 0.5) * -11).toFixed(2) + "deg");
          card.style.setProperty("--ry", ((px - 0.5) * 13).toFixed(2) + "deg");
          card.style.setProperty("--px", ((px - 0.5) * -18).toFixed(1) + "px");
          card.style.setProperty("--py", ((py - 0.5) * -18).toFixed(1) + "px");
          card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(raf);
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--px", "0px");
        card.style.setProperty("--py", "0px");
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(raf);
      });
    }

    return () => cleanups.forEach((c) => c());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
