import type { GradientLayer } from "@/types/content";

/** Construye un linear-gradient a partir de una capa de degradado. */
export function grad(o: Partial<GradientLayer>): string {
  return `linear-gradient(${o.angle ?? 140}deg, ${o.gradA ?? "#0b042a"}, ${
    o.gradB ?? "#0b042a"
  })`;
}

/** Divide un texto en párrafos por dobles saltos de línea. */
export function paragraphs(text: string): string[] {
  return (text || "").split("\n").filter(Boolean);
}
