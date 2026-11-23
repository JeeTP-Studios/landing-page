import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/content/i18n";
import { openLink, type Link, type ToEditor, type ToPreview } from "@/preview/channel";
import type { SiteContent } from "@/types/content";
import { Icon, type IconName } from "./icons";

const DEVICES: { id: string; label: string; width: number; icon: IconName }[] = [
  { id: "desktop", label: "Desktop", width: 1440, icon: "desktop" },
  { id: "tablet", label: "Tablet 820", width: 820, icon: "tablet" },
  { id: "phone", label: "Phone 390", width: 390, icon: "phone" },
];

/** How long the draft waits after the last keystroke before it is pushed. */
const PUSH_DELAY_MS = 150;

interface Props {
  content: SiteContent;
  lang: Lang;
  /** Page the preview shows. */
  route: string;
  onRoute: (path: string) => void;
  routes: { group: string; items: { path: string; label: string }[] }[];
  /** Asks the preview to scroll to and highlight a block. `n` makes a repeat count. */
  focus: { key: string; n: number } | null;
  /** The visitor clicked a block in the preview. */
  onSelect: (key: string) => void;
  onHide: () => void;
}

/** The real site in an iframe, fed the draft through a channel as it changes. */
export default function PreviewPane({
  content,
  lang,
  route,
  onRoute,
  routes,
  focus,
  onSelect,
  onHide,
}: Props) {
  const sid = useMemo(() => Math.random().toString(36).slice(2, 10), []);
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const link = useRef<Link<ToPreview, ToEditor> | null>(null);
  const [device, setDevice] = useState("desktop");
  const [area, setArea] = useState({ w: 0, h: 0 });
  // Only the first route is the iframe's address; later ones travel as messages.
  const firstSrc = useRef(`${route}?preview=1&sid=${sid}`);

  const latest = useRef({ content, lang, route, onSelect });
  latest.current = { content, lang, route, onSelect };

  useEffect(() => {
    const l = openLink<ToPreview, ToEditor>(sid, () => frame.current?.contentWindow ?? null);
    link.current = l;
    const off = l.onMessage((m) => {
      if (m.t === "ready") {
        const { content: c, lang: g, route: r } = latest.current;
        l.send({ t: "state", doc: c, lang: g });
        l.send({ t: "route", path: r });
      } else if (m.t === "select") latest.current.onSelect(m.key);
    });
    return () => {
      off();
      l.close();
      link.current = null;
    };
  }, [sid]);

  useEffect(() => {
    const t = window.setTimeout(
      () => link.current?.send({ t: "state", doc: content, lang }),
      PUSH_DELAY_MS
    );
    return () => window.clearTimeout(t);
  }, [content, lang]);

  // The draft goes first: a page for a project created a moment ago must find
  // the project when it opens.
  useEffect(() => {
    const { content: c, lang: g } = latest.current;
    link.current?.send({ t: "state", doc: c, lang: g });
    link.current?.send({ t: "route", path: route });
  }, [route]);

  useEffect(() => {
    if (focus) link.current?.send({ t: "focus", key: focus.key });
  }, [focus]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setArea({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setArea({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // The page is laid out at the device's width and scaled down to fit the pane.
  const dev = DEVICES.find((d) => d.id === device)!;
  const pad = 16;
  const availW = Math.max(area.w - pad * 2, 100);
  const availH = Math.max(area.h - pad * 2, 100);
  const scale = Math.min(1, availW / dev.width);
  const frameW = dev.width;
  const frameH = availH / scale;

  const known = routes.some((g) => g.items.some((i) => i.path === route));

  return (
    <aside className="pv" aria-label="Live preview">
      <div className="pv-bar">
        <div className="seg" role="group" aria-label="Preview size">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={device === d.id ? "on" : ""}
              aria-pressed={device === d.id}
              title={d.label}
              onClick={() => setDevice(d.id)}
            >
              <Icon name={d.icon} size={16} />
              <span>{d.label}</span>
            </button>
          ))}
        </div>
        <select
          className="selfld pv-route"
          aria-label="Page shown in the preview"
          value={route}
          onChange={(e) => onRoute(e.target.value)}
        >
          {known ? null : <option value={route}>{route}</option>}
          {routes.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.items.map((i) => (
                <option key={i.path} value={i.path}>
                  {i.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <a
          className="btn ghost icon"
          href={`${route}?lang=${lang}`}
          target="_blank"
          rel="noopener"
          aria-label="Open this page in a new tab"
          title="Open in a new tab"
        >
          <Icon name="external" size={16} />
        </a>
        <button
          type="button"
          className="btn ghost icon pv-hide"
          aria-label="Hide the preview"
          title="Hide the preview"
          onClick={onHide}
        >
          <Icon name="panel" size={16} />
        </button>
      </div>
      <div className="pv-note">
        Showing the {lang === "es" ? "Spanish" : "English"} site, as you type. Click anything on
        the page to edit it.
      </div>
      <div className="pv-stage" ref={stage}>
        <div className="pv-frame" style={{ width: frameW * scale, height: frameH * scale }}>
          <iframe
            ref={frame}
            title="Live preview of the site"
            src={firstSrc.current}
            style={{
              width: frameW,
              height: frameH,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
          />
        </div>
      </div>
    </aside>
  );
}
