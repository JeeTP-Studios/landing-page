import { useEffect } from "react";

/**
 * Observa todos los `.reveal` dentro del documento (o de un contenedor)
 * y les agrega `.in` cuando entran al viewport. Se re-ejecuta cuando
 * cambian las dependencias (p. ej. al cambiar de ruta/contenido).
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in");
            io.unobserve(x.target);
          }
        }),
      { threshold: 0.14 }
    );
    document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => {
      // Escalonado: cada .reveal hereda un retardo según su orden dentro del
      // mismo contenedor, para que los hermanos aparezcan en cascada.
      const parent = el.parentElement;
      if (parent && !el.style.transitionDelay) {
        const sibs = Array.from(
          parent.querySelectorAll<HTMLElement>(":scope > .reveal")
        );
        const i = sibs.indexOf(el);
        if (i > 0) el.style.transitionDelay = `${Math.min(i, 6) * 40}ms`;
      }
      io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
