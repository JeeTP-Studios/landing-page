import { useContent } from "@/content/ContentContext";
import { getOverlay, overlayAlignLines, setOverlay } from "@/content/i18n";
import { getByPath, setByPath } from "@/lib/path";
import { useEffect, useState, type ReactNode } from "react";
import { useEditLang } from "./editLang";

/* ============================================================
   Field components, bound to the document by path ("hero.sub").

   Text fields (TextField, ListField, StepsField) follow the editing language:
   in Spanish they read and write the overlay and show the English text as a
   hint. Every other field (images, colours, switches, selects, numbers, links)
   edits the shared base and says so.
   ============================================================ */

/** Binding of a text path to either the base or the Spanish overlay. */
function useText<T>(path: string, shared = false) {
  const { content, update } = useContent();
  const es = useEditLang() === "es" && !shared;
  const base = getByPath(content, path) as T;
  const value = (es ? getOverlay(content, path) : base) as T | undefined;
  const set = (v: T) =>
    update((d) => (es ? setOverlay(d, path, v) : setByPath(d, path, v)));
  return { es, base, value, set };
}

/** Binding for shared (non-text) fields. */
function useShared<T>(path: string): [T, (v: T) => void, boolean] {
  const { content, update } = useContent();
  const es = useEditLang() === "es";
  const value = getByPath(content, path) as T;
  const set = (v: T) => update((d) => setByPath(d, path, v));
  return [value, set, es];
}

function Label({ children, shared }: { children: ReactNode; shared?: boolean }) {
  return (
    <label>
      {children}
      {shared ? <span className="sharedtag">same in both languages</span> : null}
    </label>
  );
}

/* ---------- text ---------- */
export function TextField({
  label,
  path,
  area,
  hint,
  number,
  shared,
}: {
  label: string;
  path: string;
  area?: boolean;
  hint?: string;
  /** Stores a number (input type=number). Numbers are never translated. */
  number?: boolean;
  /** Not translatable (links, codes, names): always edits the base. */
  shared?: boolean;
}) {
  const isShared = !!(shared || number);
  const { es, base, value, set } = useText<string | number>(path, isShared);
  const inEs = es && !isShared;
  return (
    <div className="fld">
      <Label shared={useEditLang() === "es" && isShared}>{label}</Label>
      {area ? (
        <textarea
          value={(value as string) ?? ""}
          placeholder={inEs ? String(base ?? "") : undefined}
          onChange={(e) => set(e.target.value)}
        />
      ) : number ? (
        <input
          type="number"
          value={(value as number) ?? 0}
          onChange={(e) => set(Number(e.target.value) || 0)}
        />
      ) : (
        <input
          type="text"
          value={(value as string) ?? ""}
          placeholder={inEs ? String(base ?? "") : undefined}
          onChange={(e) => set(e.target.value)}
        />
      )}
      {inEs ? <div className="hint">English: {String(base ?? "")}</div> : null}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

/* ---------- lists of strings ---------- */
function parseLines(raw: string, sep: string, keepBlank: boolean): string[] {
  const parts = raw.split(sep).map((s) => s.trim());
  if (!keepBlank) return parts.filter(Boolean);
  // A translation keeps blank lines so each line stays on its own item.
  while (parts.length && parts[parts.length - 1] === "") parts.pop();
  return parts;
}

export function ListField({
  label,
  path,
  mode = "lines",
  hint,
}: {
  label: string;
  path: string;
  mode?: "lines" | "commas";
  hint?: string;
}) {
  const { update } = useContent();
  const { es, base, value, set } = useText<string[]>(path);
  const sep = mode === "commas" ? ", " : "\n";
  const splitChar = mode === "commas" ? "," : "\n";
  const current = (value as string[] | undefined) || [];
  // Raw text state lets commas, spaces and Enter be typed freely.
  const [raw, setRaw] = useState<string>(() => current.map((s) => s ?? "").join(sep));

  // Re-sync when the value changes from outside (import, reset).
  useEffect(() => {
    const parsed = parseLines(raw, splitChar, es);
    if (JSON.stringify(parsed) !== JSON.stringify(current.map((s) => s ?? ""))) {
      setRaw(current.map((s) => s ?? "").join(sep));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onChange = (text: string) => {
    setRaw(text);
    const next = parseLines(text, splitChar, es);
    if (es) {
      set(next);
      return;
    }
    // Adding or removing a line shifts the Spanish below it with it.
    update((d) => {
      overlayAlignLines(d, path, (getByPath(d, path) as string[]) || [], next);
      setByPath(d, path, next);
    });
  };

  return (
    <div className="fld">
      <Label>{label}</Label>
      {mode === "commas" ? (
        <input
          type="text"
          value={raw}
          placeholder={es ? (base || []).join(sep) : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <textarea
          value={raw}
          placeholder={es ? (base || []).join(sep) : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {es ? (
        <div className="hint">
          English: {(base || []).join(" · ")}. Keep one line per item, in the same order.
        </div>
      ) : null}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

/* ---------- steps [number, text] ---------- */
export function StepsField({
  label,
  path,
  hint,
}: {
  label: string;
  path: string;
  hint?: string;
}) {
  const { update } = useContent();
  const { es, base, value, set } = useText<[string, string][]>(path);
  const texts = (v?: [string, string][]) =>
    (v || []).map((s) => (Array.isArray(s) ? s[1] ?? "" : String(s ?? "")));
  const [raw, setRaw] = useState<string>(() => texts(value).join("\n"));

  useEffect(() => {
    const parsed = parseLines(raw, "\n", es);
    if (JSON.stringify(parsed) !== JSON.stringify(texts(value))) {
      setRaw(texts(value).join("\n"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onChange = (text: string) => {
    setRaw(text);
    const lines = parseLines(text, "\n", es);
    if (es) {
      set(lines.map((t) => ["", t] as [string, string]));
      return;
    }
    update((d) => {
      overlayAlignLines(d, path, texts(getByPath(d, path) as [string, string][]), lines);
      setByPath(
        d,
        path,
        lines.map((t, i) => [String(i + 1).padStart(2, "0"), t] as [string, string])
      );
    });
  };

  return (
    <div className="fld">
      <Label>{label}</Label>
      <textarea
        value={raw}
        placeholder={es ? texts(base).join("\n") : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {es ? <div className="hint">English: {texts(base).join(" · ")}</div> : null}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

/* ---------- image (url + upload) ---------- */
export function ImageField({
  label,
  path,
  hint,
}: {
  label: string;
  path: string;
  hint?: string;
}) {
  const [v, set, es] = useShared<string>(path);
  const onFile = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set(String(r.result));
    r.readAsDataURL(file);
  };
  return (
    <div className="fld">
      <Label shared={es}>{label}</Label>
      <div className="imgrow">
        <div className="imgthumb">{v ? <img src={v} alt="" /> : "no img"}</div>
        <input
          type="text"
          value={v || ""}
          onChange={(e) => set(e.target.value)}
          placeholder="Image URL"
        />
        <label className="uploadbtn">
          Upload
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      </div>
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

/* ---------- select ---------- */
export function SelectField({
  label,
  path,
  options,
}: {
  label: string;
  path: string;
  options: [string, string][];
}) {
  const [v, set, es] = useShared<string>(path);
  return (
    <div className="fld">
      <Label shared={es}>{label}</Label>
      <select className="selfld" value={v} onChange={(e) => set(e.target.value)}>
        {options.map(([val, txt]) => (
          <option key={val} value={val}>
            {txt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- switch ---------- */
export function SwitchField({ label, path }: { label: string; path: string }) {
  const [v, set, es] = useShared<boolean>(path);
  return (
    <div className="switch-row">
      <label className="lbltxt">
        {label}
        {es ? <span className="sharedtag">same in both languages</span> : null}
      </label>
      <label className="switch">
        <input type="checkbox" checked={!!v} onChange={(e) => set(e.target.checked)} />
        <span className="sl" />
      </label>
    </div>
  );
}

/* ---------- accordion ---------- */
export function Accordion({
  summary,
  children,
  open,
  right,
}: {
  summary: ReactNode;
  children: ReactNode;
  open?: boolean;
  right?: ReactNode;
}) {
  return (
    <details className="acc" open={open}>
      <summary>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {summary}
          {right}
        </span>
      </summary>
      <div className="accbody">{children}</div>
    </details>
  );
}
