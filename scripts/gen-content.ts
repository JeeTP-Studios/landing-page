/* Genera public/content.json a partir de los defaults.
   Uso: npx tsx scripts/gen-content.ts  (o npm run gen:content) */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { DEFAULTS } from "../src/data/defaults.ts";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../public/content.json");
mkdirSync(resolve(here, "../public"), { recursive: true });
writeFileSync(out, JSON.stringify(DEFAULTS, null, 2));
console.log("content.json generado en", out);
