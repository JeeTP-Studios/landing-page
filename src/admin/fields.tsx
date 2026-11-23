import { useContent } from "@/content/ContentContext";
import { getOverlay, overlayAlignLines, setOverlay } from "@/content/i18n";
import { getByPath, setByPath } from "@/lib/path";
import { useEffect, useId, useState, type ReactNode } from "react";
import { useEditLang } from "./editLang";
import { Icon } from "./icons";
import { useFieldSearch } from "./search";

/* ============================================================
   Field components, bound to the document by path ("hero.sub").

   Text fields (TextField, ListField, StepsField) follow the editing language:
   in Spanish they read and write the overlay, show the English as a guide, and
   flag themselves while Spanish is missing. Every other field (images,
   switches, selects, numbers, links) edits the shared base and says so.
   ============================================================ */

const hasText = (v: unknown) => typeof v === "string" && v.trim() !== "";

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

/** Common frame of a field: label, tags, control, guidance. */
function Field({
  label,
  text = "",
  sharedTag,
  missing,
  onCopyEnglish,
  counter,
  hint,
  children,
}: {
  label: string;
  /** Current content, for the search box. */
  text?: string;
  sharedTag?: boolean;
  /** Spanish mode and nothing translated yet. */
  missing?: boolean;
  onCopyEnglish?: () => void;
  counter?: { len: number; max: number; what?: string };
  hint?: ReactNode;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  const { query, sectionHit } = useFieldSearch();
  if (query && !sectionHit && !`${label} ${text}`.toLowerCase().includes(query)) return null;
  return (
    <div className={`fld${missing ? " untranslated" : ""}`}>
      <div className="fld-head">
        <label htmlFor={id}>{label}</label>
        {sharedTag ? <span className="sharedtag">same in both languages</span> : null}
        {missing ? <span className="misstag">Shows English until translated</span> : null}
        {missing && onCopyEnglish ? (
          <button type="button" className="linkbtn" onClick={onCopyEnglish}>
            <Icon name="copy" size={13} /> Copy English
          </button>
        ) : null}
        {counter ? (
          <span className={`counter${counter.len > counter.max ? " over" : ""}`}>
            {counter.what ? `${counter.what} ` : ""}
            {counter.len}/{counter.max}
          </span>
        ) : null}
      </div>
      {children(id)}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
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
  max,
}: {
  label: string;
  path: string;
  area?: boolean;
  hint?: string;
  /** Stores a number (input type=number). Numbers are never translated. */
  number?: boolean;
  /** Not translatable (links, codes, names): always edits the base. */
  shared?: boolean;
  /** Recommended length; the counter turns red past it (it never blocks typing). */
  max?: number;
}) {
  const isShared = !!(shared || number);
  const { es, base, value, set } = useText<string | number>(path, isShared);
  const lang = useEditLang();
  const inEs = es && !isShared;
  const missing = inEs && hasText(base) && !hasText(value);
  const str = (value as string | number | undefined) ?? "";
  return (
    <Field
      label={label}
      text={String(str || base || "")}
      sharedTag={lang === "es" && isShared}
      missing={missing}
      onCopyEnglish={() => set(base as string)}
      counter={max ? { len: String(str).length, max } : undefined}
      hint={
        <>
          {inEs && hasText(base) ? <span className="english">English: {String(base)}</span> : null}
          {hint}
        </>
      }
    >
      {(id) =>
        area ? (
          <textarea
            id={id}
            value={String(str)}
            placeholder={inEs ? String(base ?? "") : undefined}
            onChange={(e) => set(e.target.value)}
          />
        ) : number ? (
          <input
            id={id}
            type="number"
            value={(value as number) ?? 0}
            onChange={(e) => set(Number(e.target.value) || 0)}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={String(str)}
            placeholder={inEs ? String(base ?? "") : undefined}
            onChange={(e) => set(e.target.value)}
          />
        )
      }
    </Field>
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
  maxLine,
}: {
  label: string;
  path: string;
  mode?: "lines" | "commas";
  hint?: string;
  /** Recommended length of the longest line. */
  maxLine?: number;
}) {
  const { update } = useContent();
  const { es, base, value, set } = useText<string[]>(path);
  const sep = mode === "commas" ? ", " : "\n";
  const splitChar = mode === "commas" ? "," : "\n";
  const current = (value as string[] | undefined) || [];
  // Raw text state lets commas, spaces and Enter be typed freely.
  const [raw, setRaw] = useState<string>(() => current.map((s) => s ?? "").join(sep));

  // Re-sync when the value changes from outside (import, reset, undo, copy).
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

  const missing = es && (base || []).some(hasText) && !current.some(hasText);
  const longest = Math.max(0, ...parseLines(raw, splitChar, false).map((l) => l.length));
  return (
    <Field
      label={label}
      text={raw}
      missing={missing}
      onCopyEnglish={() => set([...(base || [])])}
      counter={maxLine ? { len: longest, max: maxLine, what: "longest line" } : undefined}
      hint={
        <>
          {es ? (
            <span className="english">
              English: {(base || []).join(" · ")}. Keep one line per item, in the same order.
            </span>
          ) : null}
          {hint}
        </>
      }
    >
      {(id) =>
        mode === "commas" ? (
          <input
            id={id}
            type="text"
            value={raw}
            placeholder={es ? (base || []).join(sep) : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <textarea
            id={id}
            value={raw}
            rows={Math.min(8, Math.max(3, raw.split("\n").length + 1))}
            placeholder={es ? (base || []).join(sep) : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      }
    </Field>
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

  const missing = es && texts(base).some(hasText) && !texts(value).some(hasText);
  return (
    <Field
      label={label}
      text={raw}
      missing={missing}
      onCopyEnglish={() => set(texts(base).map((t) => ["", t] as [string, string]))}
      hint={
        <>
          {es ? <span className="english">English: {texts(base).join(" · ")}</span> : null}
          {hint}
        </>
      }
    >
      {(id) => (
        <textarea
          id={id}
          value={raw}
          rows={Math.min(8, Math.max(3, raw.split("\n").length + 1))}
          placeholder={es ? texts(base).join("\n") : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

/* ---------- image ---------- */

/** Above this an embedded image makes the whole content file heavy. */
const EMBED_WARN_KB = 300;

/** Size in KB of the file inside a data: URL, or 0 for an ordinary path. */
function embeddedKb(v: string): number {
  if (!v.startsWith("data:")) return 0;
  return Math.round(((v.length - v.indexOf(",") - 1) * 3) / 4 / 1024);
}

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
  const [over, setOver] = useState(false);
  const [broken, setBroken] = useState(false);
  const value = v || "";
  const kb = embeddedKb(value);

  useEffect(() => setBroken(false), [value]);

  const onFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = () => set(String(r.result));
    r.readAsDataURL(file);
  };

  return (
    <Field label={label} text={value.startsWith("data:") ? "" : value} sharedTag={es} hint={hint}>
      {(id) => (
        <>
          <div
            className={`imgfield${over ? " over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              const f = e.dataTransfer.files[0];
              if (f) onFile(f);
              else {
                const t = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
                if (t) set(t.trim());
              }
            }}
          >
            <div className="imgthumb">
              {value && !broken ? (
                <img src={value} alt="" onError={() => setBroken(true)} />
              ) : (
                <span>
                  <Icon name="image" size={22} />
                  {broken ? "Cannot load" : "No image"}
                </span>
              )}
            </div>
            <div className="imgside">
              <input
                id={id}
                type="text"
                value={kb ? "" : value}
                placeholder={kb ? `Uploaded image (${kb} KB)` : "Path or link, e.g. /resources/photo.jpg"}
                onChange={(e) => set(e.target.value)}
              />
              <div className="imgbtns">
                <label className="btn ghost small">
                  <Icon name="upload" size={14} /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      onFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                {value ? (
                  <button type="button" className="btn ghost small" onClick={() => set("")}>
                    Remove
                  </button>
                ) : null}
                <span className="dropnote">or drop a file here</span>
              </div>
            </div>
          </div>
          {kb > EMBED_WARN_KB ? (
            <div className="warnbox" role="alert">
              This image is stored inside the content file ({kb} KB) and will slow the whole site
              down. Better: add the file to <code>public/resources/</code> in the repository and
              paste its path here (for example <code>/resources/photo.jpg</code>).
            </div>
          ) : kb ? (
            <div className="hint">
              Stored inside the content file ({kb} KB). For big images, use a file in{" "}
              <code>public/resources/</code> instead.
            </div>
          ) : null}
        </>
      )}
    </Field>
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
    <Field label={label} text={v} sharedTag={es}>
      {(id) => (
        <select id={id} className="selfld" value={v} onChange={(e) => set(e.target.value)}>
          {options.map(([val, txt]) => (
            <option key={val} value={val}>
              {txt}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/* ---------- switch ---------- */
export function SwitchField({ label, path, hint }: { label: string; path: string; hint?: string }) {
  const [v, set, es] = useShared<boolean>(path);
  const { query, sectionHit } = useFieldSearch();
  const id = useId();
  if (query && !sectionHit && !label.toLowerCase().includes(query)) return null;
  return (
    <div className="switch-row">
      <div>
        <label htmlFor={id} className="lbltxt">
          {label}
        </label>
        {es ? <span className="sharedtag">same in both languages</span> : null}
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
      <span className="switch">
        <input id={id} type="checkbox" checked={!!v} onChange={(e) => set(e.target.checked)} />
        <span className="sl" />
      </span>
    </div>
  );
}

/* ---------- layout helpers ---------- */

/** A titled cluster of fields inside a section. */
export function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="ad-group">
      <div className="ad-group-title">{title}</div>
      {hint ? <div className="hint">{hint}</div> : null}
      {children}
    </div>
  );
}

/** Two short fields side by side. */
export function Row({ children }: { children: ReactNode }) {
  return <div className="frow">{children}</div>;
}
