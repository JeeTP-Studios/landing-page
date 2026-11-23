import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContent } from "@/content/ContentContext";
import { useLanguage } from "@/content/LanguageContext";
import { openLink, type Link, type ToEditor, type ToPreview } from "./channel";
import { editLabel } from "./labels";
import { PREVIEW_SID } from "./mode";

interface Box {
  key: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const find = (key: string) =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-edit]")).find(
    (el) => el.dataset.edit === key
  ) ?? null;

/** The visible part of an element, so a tall pinned block still gets a box. */
function boxOf(el: HTMLElement): Box {
  const r = el.getBoundingClientRect();
  const top = Math.max(r.top, 0);
  const bottom = Math.min(r.bottom, window.innerHeight);
  const left = Math.max(r.left, 0);
  const right = Math.min(r.right, window.innerWidth);
  return {
    key: el.dataset.edit ?? "",
    top,
    left,
    width: Math.max(right - left, 0),
    height: Math.max(bottom - top, 0),
  };
}

/**
 * Lives only inside the editor's iframe. It applies what the editor pushes
 * (draft, language, page), outlines the block under the pointer, and turns a
 * click on a block into a message to the editor instead of a navigation.
 */
export default function PreviewBridge() {
  const { setContent } = useContent();
  const { setLang } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const link = useRef<Link<ToEditor, ToPreview> | null>(null);
  const awaiting = useRef<string | null>(null);
  const queued = useRef<string | null>(null);
  const hoverEl = useRef<HTMLElement | null>(null);
  const [hover, setHover] = useState<Box | null>(null);
  const [flash, setFlash] = useState<Box | null>(null);

  const scrollTo = (key: string, tries = 40) => {
    const el = find(key);
    if (!el) {
      if (tries > 0) window.setTimeout(() => scrollTo(key, tries - 1), 50);
      return;
    }
    const tall = el.getBoundingClientRect().height > window.innerHeight * 0.9;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: tall ? "start" : "center", behavior: reduce ? "auto" : "smooth" });
    // Wait for the scroll to settle before drawing the highlight.
    window.setTimeout(() => {
      const again = find(key);
      if (!again) return;
      setFlash(boxOf(again));
      window.setTimeout(() => setFlash(null), 1300);
    }, reduce ? 50 : 650);
  };

  useEffect(() => {
    document.documentElement.dataset.preview = "1";
    const l = openLink<ToEditor, ToPreview>(PREVIEW_SID, () => window.parent);
    link.current = l;
    const off = l.onMessage((m) => {
      if (m.t === "state") {
        setContent(m.doc);
        setLang(m.lang);
      } else if (m.t === "route") {
        if (m.path !== window.location.pathname) {
          awaiting.current = m.path;
          navigate(`${m.path}?preview=1&sid=${PREVIEW_SID}`);
        }
      } else if (m.t === "focus") {
        if (awaiting.current) queued.current = m.key;
        else scrollTo(m.key);
      }
    });
    l.send({ t: "ready" });
    return () => {
      off();
      l.close();
      delete document.documentElement.dataset.preview;
    };
    // The handlers only use refs and stable setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A page change resets the scroll; a queued focus runs after that.
  useEffect(() => {
    if (awaiting.current && pathname === awaiting.current) {
      awaiting.current = null;
      const key = queued.current;
      queued.current = null;
      if (key) window.setTimeout(() => scrollTo(key), 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const blockOf = (t: EventTarget | null) =>
      t instanceof Element ? t.closest<HTMLElement>("[data-edit]") : null;

    const onMove = (e: MouseEvent) => {
      const el = blockOf(e.target);
      hoverEl.current = el;
      setHover(el ? boxOf(el) : null);
    };
    const onLeave = () => {
      hoverEl.current = null;
      setHover(null);
    };
    const onClick = (e: MouseEvent) => {
      const el = blockOf(e.target);
      const anchor = e.target instanceof Element && e.target.closest("a");
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        link.current?.send({ t: "select", key: el.dataset.edit ?? "" });
      } else if (anchor) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onSubmit = (e: Event) => e.preventDefault();
    const track = () => {
      if (hoverEl.current) setHover(boxOf(hoverEl.current));
    };

    window.addEventListener("mousemove", onMove, true);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("click", onClick, true);
    window.addEventListener("submit", onSubmit, true);
    window.addEventListener("scroll", track, true);
    window.addEventListener("resize", track);
    return () => {
      window.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("submit", onSubmit, true);
      window.removeEventListener("scroll", track, true);
      window.removeEventListener("resize", track);
    };
  }, []);

  const draw = (b: Box, cls: string) => (
    <div
      className={`pv-box ${cls}`}
      style={{ top: b.top, left: b.left, width: b.width, height: b.height }}
    >
      <span className="pv-tag">{editLabel(b.key)}</span>
    </div>
  );

  return (
    <>
      {hover && draw(hover, "pv-hover")}
      {flash && draw(flash, "pv-flash")}
    </>
  );
}
