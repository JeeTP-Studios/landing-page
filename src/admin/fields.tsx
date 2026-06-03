import { useContent } from "@/content/ContentContext";
import { getByPath, setByPath } from "./path";
import { useEffect, useState, type ReactNode } from "react";

/* ---------- hooks de binding ---------- */
function useField<T>(path: string): [T, (v: T) => void] {
  const { content, update } = useContent();
  const value = getByPath(content, path) as T;
  const setValue = (v: T) => update((d) => setByPath(d, path, v));
  return [value, setValue];
}

/* ---------- texto ---------- */
export function TextField({
  label,
  path,
  area,
  hint,
}: {
  label: string;
  path: string;
  area?: boolean;
  hint?: string;
}) {
  const [v, set] = useField<string>(path);
  return (
    <div className="fld">
      <label>{label}</label>
      {area ? (
        <textarea value={v ?? ""} onChange={(e) => set(e.target.value)} />
      ) : (
        <input
          type="text"
          value={v ?? ""}
          onChange={(e) => set(e.target.value)}
        />
      )}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

/* ---------- listas de strings ---------- */
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
  const [v, set] = useField<string[]>(path);
  const sep = mode === "commas" ? ", " : "\n";
  const splitChar = mode === "commas" ? "," : "\n";
  // Estado local "crudo": permite escribir comas, espacios y enters libremente
  // sin que se borren en cada tecla. Se parsea hacia el array al teclear.
  const [raw, setRaw] = useState<string>(() => (v || []).join(sep));

  // Re-sincroniza si el valor cambia desde fuera (import, reset, reorden).
  useEffect(() => {
    const parsed = raw
      .split(splitChar)
      .map((s) => s.trim())
      .filter(Boolean);
    if (JSON.stringify(parsed) !== JSON.stringify(v || [])) {
      setRaw((v || []).join(sep));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  const onChange = (value: string) => {
    setRaw(value);
    set(
      value
        .split(splitChar)
        .map((s) => s.trim())
        .filter(Boolean)
    );
  };

  return (
    <div className="fld">
      <label>{label}</label>
      {mode === "commas" ? (
        <input type="text" value={raw} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <textarea value={raw} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

/* ---------- pasos [num, texto] ---------- */
export function StepsField({
  label,
  path,
  hint,
}: {
  label: string;
  path: string;
  hint?: string;
}) {
  const [v, set] = useField<[string, string][]>(path);
  const join = (arr: [string, string][]) =>
    (arr || []).map((s) => (Array.isArray(s) ? s[1] : s)).join("\n");
  const [raw, setRaw] = useState<string>(() => join(v));

  useEffect(() => {
    const parsed = raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const current = (v || []).map((s) => (Array.isArray(s) ? s[1] : s));
    if (JSON.stringify(parsed) !== JSON.stringify(current)) {
      setRaw(join(v));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  const onChange = (value: string) => {
    setRaw(value);
    set(
      value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((t, i) => [String(i + 1).padStart(2, "0"), t] as [string, string])
    );
  };

  return (
    <div className="fld">
      <label>{label}</label>
      <textarea value={raw} onChange={(e) => onChange(e.target.value)} />
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

/* ---------- color ---------- */
export function ColorField({
  label,
  path,
  hint,
}: {
  label: string;
  path: string;
  hint?: string;
}) {
  const [v, set] = useField<string>(path);
  return (
    <div className="fld">
      <label>{label}</label>
      <div className="colorpick">
        <input
          type="color"
          value={v || "#000000"}
          onChange={(e) => set(e.target.value)}
        />
        <input type="text" value={v || ""} onChange={(e) => set(e.target.value)} />
      </div>
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

/* ---------- degradado (gradA/gradB/angle) ---------- */
export function GradientField({ prefix }: { prefix: string }) {
  const [a, setA] = useField<string>(`${prefix}.gradA`);
  const [b, setB] = useField<string>(`${prefix}.gradB`);
  const [angle, setAngle] = useField<number>(`${prefix}.angle`);
  return (
    <div className="fld">
      <label>Degradado de fondo</label>
      <div className="row">
        <div className="colorpick">
          <input type="color" value={a || "#000000"} onChange={(e) => setA(e.target.value)} />
          <input type="text" value={a || ""} onChange={(e) => setA(e.target.value)} />
        </div>
        <div className="colorpick">
          <input type="color" value={b || "#000000"} onChange={(e) => setB(e.target.value)} />
          <input type="text" value={b || ""} onChange={(e) => setB(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 11 }}>Angulo</label>
          <div className="rangewrap">
            <input
              type="range"
              min={0}
              max={360}
              value={angle ?? 140}
              onChange={(e) => setAngle(Number(e.target.value))}
            />
            <span className="val">{angle ?? 140}°</span>
          </div>
        </div>
        <div
          className="gradprev"
          style={{
            background: `linear-gradient(${angle ?? 140}deg, ${a}, ${b})`,
          }}
        />
      </div>
    </div>
  );
}

/* ---------- opacidad ---------- */
export function OpacityField({ prefix }: { prefix: string }) {
  const [v, set] = useField<number>(`${prefix}.opacity`);
  return (
    <div className="fld">
      <label>
        Opacidad de la capa de color{" "}
        <span className="hint" style={{ display: "inline" }}>
          (baja para ver el fondo global)
        </span>
      </label>
      <div className="rangewrap">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={v ?? 1}
          onChange={(e) => set(Number(e.target.value))}
        />
        <span className="val">{Math.round((v ?? 1) * 100)}%</span>
      </div>
    </div>
  );
}

/* ---------- imagen (url + subir archivo) ---------- */
export function ImageField({
  label,
  path,
  hint,
}: {
  label: string;
  path: string;
  hint?: string;
}) {
  const [v, set] = useField<string>(path);
  const onFile = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set(String(r.result));
    r.readAsDataURL(file);
  };
  return (
    <div className="fld">
      <label>{label}</label>
      <div className="imgrow">
        <div className="imgthumb">
          {v ? <img src={v} alt="" /> : "sin img"}
        </div>
        <input
          type="text"
          value={v || ""}
          onChange={(e) => set(e.target.value)}
          placeholder="URL de imagen (PNG transparente)"
        />
        <label className="uploadbtn">
          Subir
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
  const [v, set] = useField<string>(path);
  return (
    <div className="fld">
      <label>{label}</label>
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
  const [v, set] = useField<boolean>(path);
  return (
    <div className="switch-row">
      <label className="lbltxt">{label}</label>
      <label className="switch">
        <input
          type="checkbox"
          checked={!!v}
          onChange={(e) => set(e.target.checked)}
        />
        <span className="sl" />
      </label>
    </div>
  );
}

/* ---------- acordeón ---------- */
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
