import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULTS } from "@/data/defaults";
import type { SiteContent } from "@/types/content";
import {
  clearLocalOverride,
  clone,
  downloadContent,
  parseImportedContent,
  resolveContent,
  writeLocalOverride,
} from "./contentSource";

interface ContentContextValue {
  content: SiteContent;
  loading: boolean;
  hasLocalOverride: boolean;
  remoteLoaded: boolean;
  /** Reemplaza el contenido completo en memoria (no persiste). */
  setContent: (next: SiteContent) => void;
  /** Aplica un cambio funcional sobre una copia del contenido. */
  update: (mutator: (draft: SiteContent) => void) => void;
  /** Guarda el contenido actual como override local (localStorage). */
  saveLocal: () => void;
  /** Descarta el override local y recarga desde el remoto/defaults. */
  resetToRemote: () => Promise<void>;
  /** Restablece a los valores de fábrica. */
  resetToDefaults: () => void;
  /** Exporta el contenido actual como content.json. */
  exportJson: () => void;
  /** Importa un content.json (reemplaza el contenido en memoria). */
  importJson: (text: string) => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => clone(DEFAULTS));
  const [loading, setLoading] = useState(true);
  const [hasLocalOverride, setHasLocalOverride] = useState(false);
  const [remoteLoaded, setRemoteLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    resolveContent().then((r) => {
      if (!alive) return;
      setContentState(r.content);
      setHasLocalOverride(r.hasLocalOverride);
      setRemoteLoaded(r.remoteLoaded);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const setContent = useCallback((next: SiteContent) => {
    setContentState(next);
  }, []);

  const update = useCallback((mutator: (draft: SiteContent) => void) => {
    setContentState((prev) => {
      const draft = clone(prev);
      mutator(draft);
      return draft;
    });
  }, []);

  const saveLocal = useCallback(() => {
    setContentState((prev) => {
      writeLocalOverride(prev);
      return prev;
    });
    setHasLocalOverride(true);
  }, []);

  const resetToRemote = useCallback(async () => {
    clearLocalOverride();
    setLoading(true);
    const r = await resolveContent();
    setContentState(r.content);
    setHasLocalOverride(r.hasLocalOverride);
    setRemoteLoaded(r.remoteLoaded);
    setLoading(false);
  }, []);

  const resetToDefaults = useCallback(() => {
    const fresh = clone(DEFAULTS);
    clearLocalOverride();
    setContentState(fresh);
    setHasLocalOverride(false);
  }, []);

  const exportJson = useCallback(() => {
    setContentState((prev) => {
      downloadContent(prev);
      return prev;
    });
  }, []);

  const importJson = useCallback((text: string) => {
    const next = parseImportedContent(text);
    setContentState(next);
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      loading,
      hasLocalOverride,
      remoteLoaded,
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
      loading,
      hasLocalOverride,
      remoteLoaded,
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
  if (!ctx) throw new Error("useContent debe usarse dentro de <ContentProvider>");
  return ctx;
}

/** Atajo para leer sólo el documento de contenido. */
export function useSite(): SiteContent {
  return useContent().content;
}
