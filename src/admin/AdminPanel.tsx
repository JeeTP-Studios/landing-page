import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContent } from "@/content/ContentContext";
import type { Lang } from "@/content/i18n";
import { EditLangContext } from "./editLang";
import { Icon } from "./icons";
import { AdminNavContext, type AdminNav } from "./nav";
import PageEditor from "./PageEditor";
import PreviewPane from "./PreviewPane";
import ProjectsPage from "./ProjectsPage";
import PublishPanel from "./PublishPanel";
import Rail from "./Rail";
import { locate, pageByKey, previewKeyFor, routeOfPage } from "./sections";
import TopBar from "./TopBar";
import { useMediaQuery } from "./useMediaQuery";

const TOAST_MS = 2600;

/**
 * The content editor: pages on the left, the fields of one page in the middle,
 * the real site on the right. Opening a block in either side finds it in the
 * other. Nothing is saved to the repository from here: Publish downloads the
 * file that replaces `public/content.json`.
 */
export default function AdminPanel() {
  const { content, unsaved, saveLocal, undo, redo } = useContent();
  const [page, setPage] = useState("home");
  const [projectId, setProjectIdState] = useState<string | null>(null);
  const [openKey, setOpenKeyState] = useState<string | null>(null);
  const [editLang, setEditLang] = useState<Lang>("en");
  const [search, setSearch] = useState("");
  const [route, setRoute] = useState("/");
  const [focus, setFocus] = useState<{ key: string; n: number } | null>(null);
  const [previewWide, setPreviewWide] = useState(true);
  const [previewNarrow, setPreviewNarrow] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [toast, setToast] = useState("");
  const narrow = useMediaQuery("(max-width: 1099px)");
  const editor = useRef<HTMLDivElement>(null);
  const toastTimer = useRef(0);

  const previewVisible = narrow ? previewNarrow : previewWide;
  const query = search.trim().toLowerCase();
  const es = editLang === "es";

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), TOAST_MS);
  }, []);

  const askFocus = (key: string) => setFocus((f) => ({ key, n: (f?.n ?? 0) + 1 }));

  const selectPage = (key: string) => {
    setPage(key);
    setProjectIdState(null);
    setOpenKeyState(null);
    setSearch("");
    setRoute(routeOfPage(key));
  };

  const nav: AdminNav = {
    openKey,
    setOpenKey: (k) => {
      setOpenKeyState(k);
      if (k) askFocus(previewKeyFor(k));
    },
    projectId,
    setProjectId: (id) => {
      setProjectIdState(id);
      setOpenKeyState(null);
      setRoute(id ? `/case-studies/${id}` : "/case-studies");
    },
    go: (target, section) => {
      selectPage(target);
      if (section) {
        setOpenKeyState(section);
        askFocus(previewKeyFor(section));
      }
    },
    query,
  };

  // A click on a block in the preview: open it here. The preview is already
  // showing it, so neither the page nor the scroll of the preview changes.
  const onSelect = (key: string) => {
    const loc = locate(key, content);
    if (!loc) return;
    setPage(loc.page);
    setProjectIdState(loc.project ?? null);
    setOpenKeyState(loc.open);
    setSearch("");
    if (narrow) setPreviewNarrow(false);
  };

  // Bring the open card into view, whoever opened it.
  useEffect(() => {
    if (!openKey) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.requestAnimationFrame(() =>
      document
        .getElementById(`sec-${openKey}`)
        ?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" })
    );
    return () => window.cancelAnimationFrame(id);
  }, [openKey, page, projectId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Save by itself a moment after the last change, and when the tab is left.
  useEffect(() => {
    if (!unsaved) return;
    const t = window.setTimeout(saveLocal, 1200);
    return () => window.clearTimeout(t);
  }, [unsaved, content, saveLocal]);

  const unsavedRef = useRef(unsaved);
  unsavedRef.current = unsaved;
  useEffect(() => {
    const flush = () => unsavedRef.current && saveLocal();
    const onHide = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [saveLocal]);

  // Undo and redo act on the draft, also while a field has the focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (k === "y") {
        e.preventDefault();
        redo();
      } else if (k === "s") {
        e.preventDefault();
        saveLocal();
        notify("Saved in this browser.");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, saveLocal, notify]);

  const routes = useMemo(
    () => [
      {
        group: "Pages",
        items: [
          { path: "/", label: "Home" },
          { path: "/about", label: "About" },
          { path: "/services", label: "Services" },
          { path: "/case-studies", label: "Work" },
          { path: "/contact", label: "Contact" },
        ],
      },
      {
        group: "Case studies",
        items: content.projects.map((p) => ({ path: `/case-studies/${p.id}`, label: p.name || "Project" })),
      },
    ],
    [content.projects]
  );

  const def = pageByKey(page);
  const hidePreview = () => (narrow ? setPreviewNarrow(false) : setPreviewWide(false));

  return (
    <div className="admin">
      <TopBar
        editLang={editLang}
        onLang={setEditLang}
        previewVisible={previewVisible}
        onTogglePreview={() => (narrow ? setPreviewNarrow(!previewNarrow) : setPreviewWide(!previewWide))}
        onPublish={() => setPublishOpen(true)}
        notify={notify}
      />

      <div className={`ad-body${previewVisible ? " with-preview" : ""}${narrow && previewVisible ? " preview-only" : ""}`}>
        <Rail page={page} onPage={selectPage} />

        <main className="ad-editor" ref={editor}>
          <div className="ad-tools">
            <label className="search">
              <Icon name="search" size={16} />
              <input
                type="search"
                placeholder="Search this page by name or text"
                aria-label="Search this page by name or text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          {es ? (
            <div className="modebar" role="note">
              <b>Editing Spanish.</b> A field marked “Shows English until translated” is still in
              English on the Spanish site. “Copy English” starts you from the English text.
            </div>
          ) : null}
          <AdminNavContext.Provider value={nav}>
            <EditLangContext.Provider value={editLang}>
              {/* Remount on language change so text fields reload their raw text. */}
              <div className="ad-page" key={`${editLang}:${page}`}>
                {page === "projects" ? <ProjectsPage /> : def ? <PageEditor page={def} /> : null}
              </div>
            </EditLangContext.Provider>
          </AdminNavContext.Provider>
        </main>

        {previewVisible ? (
          <PreviewPane
            content={content}
            lang={editLang}
            route={route}
            onRoute={setRoute}
            routes={routes}
            focus={focus}
            onSelect={onSelect}
            onHide={hidePreview}
          />
        ) : null}
      </div>

      {publishOpen ? <PublishPanel onClose={() => setPublishOpen(false)} /> : null}
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
