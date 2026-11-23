import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEFAULTS } from "@/data/defaults";
import { localize } from "./i18n";
import { useLanguage } from "./LanguageContext";
import type { SiteContent } from "@/types/content";
import {
  clearLocalOverride,
  clone,
  downloadContent,
  parseImportedContent,
  resolveContent,
  writeLocalOverride,
} from "./contentSource";

/** How many editing steps undo can walk back. */
const HISTORY_CAP = 50;
/** Edits closer together than this (typing) count as one undo step. */
const COALESCE_MS = 700;

type Mutator = (draft: SiteContent) => void;

interface Draft {
  content: SiteContent;
  past: SiteContent[];
  future: SiteContent[];
  /** When the last edit happened, to group fast typing into one step. */
  lastAt: number;
}

type Action =
  | { t: "edit"; fn: Mutator; now: number }
  /** `history` keeps the previous document reachable by undo. */
  | { t: "set"; content: SiteContent; history: boolean }
  | { t: "undo" }
  | { t: "redo" };

function reduce(s: Draft, a: Action): Draft {
  switch (a.t) {
    case "edit": {
      const next = clone(s.content);
      a.fn(next);
      const group = s.past.length > 0 && a.now - s.lastAt < COALESCE_MS;
      const past = group ? s.past : [...s.past, s.content].slice(-HISTORY_CAP);
      return { content: next, past, future: [], lastAt: a.now };
    }
    case "set":
      return a.history
        ? {
            content: a.content,
            past: [...s.past, s.content].slice(-HISTORY_CAP),
            future: [],
            lastAt: 0,
          }
        : { content: a.content, past: [], future: [], lastAt: 0 };
    case "undo": {
      if (!s.past.length) return s;
      const past = s.past.slice(0, -1);
      return {
        content: s.past[s.past.length - 1],
        past,
        future: [s.content, ...s.future],
        lastAt: 0,
      };
    }
    case "redo": {
      if (!s.future.length) return s;
      return {
        content: s.future[0],
        past: [...s.past, s.content].slice(-HISTORY_CAP),
        future: s.future.slice(1),
        lastAt: 0,
      };
    }
  }
}

interface ContentContextValue {
  /** The English base document with the Spanish overlay inside. What the admin edits. */
  content: SiteContent;
  /** The document a visitor reads: `content` in the active language. */
  site: SiteContent;
  loading: boolean;
  /** What the site ships (defaults plus the published file), to compare the draft with. */
  published: SiteContent;
  /** The draft has changes that are not yet saved in this browser. */
  unsaved: boolean;
  /** The draft is not the published document. */
  differsFromPublished: boolean;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  /** Replaces the document in memory without an undo step (the preview's draft). */
  setContent: (next: SiteContent) => void;
  /** Applies a change to a copy of the document. */
  update: (mutator: Mutator) => void;
  /** Saves the draft as the local override (localStorage). */
  saveLocal: () => void;
  /** Drops the local override and goes back to the published document. */
  resetToRemote: () => Promise<void>;
  /** Back to the values the site shipped with. */
  resetToDefaults: () => void;
  /** Downloads the draft as content.json. */
  exportJson: () => void;
  /** Replaces the draft with a content.json (an undo step is kept). */
  importJson: (text: string) => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const [state, dispatch] = useReducer(reduce, undefined, () => ({
    content: clone(DEFAULTS),
    past: [],
    future: [],
    lastAt: 0,
  }));
  const [published, setPublished] = useState<SiteContent>(() => clone(DEFAULTS));
  const [loading, setLoading] = useState(true);
  /** JSON of the draft as last stored in (or loaded from) this browser. */
  const [savedJson, setSavedJson] = useState("");

  const { content } = state;
  const contentJson = useMemo(() => JSON.stringify(content), [content]);
  const publishedJson = useMemo(() => JSON.stringify(published), [published]);

  // Handlers read the latest values through refs so they stay stable.
  const latest = useRef({ content, contentJson, publishedJson });
  latest.current = { content, contentJson, publishedJson };

  useEffect(() => {
    let alive = true;
    resolveContent().then((r) => {
      if (!alive) return;
      dispatch({ t: "set", content: r.content, history: false });
      setSavedJson(JSON.stringify(r.content));
      setPublished(r.published);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const setContent = useCallback(
    (next: SiteContent) => dispatch({ t: "set", content: next, history: false }),
    []
  );

  const update = useCallback(
    (fn: Mutator) => dispatch({ t: "edit", fn, now: Date.now() }),
    []
  );

  const undo = useCallback(() => dispatch({ t: "undo" }), []);
  const redo = useCallback(() => dispatch({ t: "redo" }), []);

  const saveLocal = useCallback(() => {
    const { content: c, contentJson: cj, publishedJson: pj } = latest.current;
    // A draft equal to the published file needs no override, and keeping one
    // would hide the next deploy from this browser.
    if (cj === pj) clearLocalOverride();
    else writeLocalOverride(c);
    setSavedJson(cj);
  }, []);

  const resetToRemote = useCallback(async () => {
    clearLocalOverride();
    const r = await resolveContent();
    dispatch({ t: "set", content: r.content, history: true });
    setSavedJson(JSON.stringify(r.content));
    setPublished(r.published);
  }, []);

  const resetToDefaults = useCallback(() => {
    const fresh = clone(DEFAULTS);
    clearLocalOverride();
    dispatch({ t: "set", content: fresh, history: true });
    setSavedJson(JSON.stringify(fresh));
  }, []);

  const exportJson = useCallback(() => downloadContent(latest.current.content), []);

  const importJson = useCallback((text: string) => {
    dispatch({ t: "set", content: parseImportedContent(text), history: true });
  }, []);

  const site = useMemo(() => localize(content, lang), [content, lang]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      site,
      loading,
      published,
      unsaved: savedJson !== "" && contentJson !== savedJson,
      differsFromPublished: contentJson !== publishedJson,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      undo,
      redo,
      setContent,
      update,
      saveLocal,
      resetToRemote,
      resetToDefaults,
      exportJson,
      importJson,
    }),
    [
      content,
      site,
      loading,
      published,
      savedJson,
      contentJson,
      publishedJson,
      state.past.length,
      state.future.length,
      undo,
      redo,
      setContent,
      update,
      saveLocal,
      resetToRemote,
      resetToDefaults,
      exportJson,
      importJson,
    ]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

/** The document in the active language. Every public component reads this. */
export function useSite(): SiteContent {
  return useContent().site;
}
