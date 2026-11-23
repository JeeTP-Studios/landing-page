/** Splits a text into paragraphs at line breaks. */
export function paragraphs(text: string): string[] {
  return (text || "").split("\n").filter(Boolean);
}

/** Fills {placeholders} in a template string. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
}
