import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { IS_PREVIEW } from "@/preview/mode";
import { DEFAULT_LANG, isLang, type Lang } from "./i18n";

const STORAGE_LANG = "jeetp_lang";

interface LanguageValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

function readStored(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_LANG);
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

function readQuery(search: string): Lang | null {
  const v = new URLSearchParams(search).get("lang");
  return isLang(v) ? v : null;
}

/**
 * Site language. English unless the visitor chose otherwise: the browser's
 * language is deliberately not consulted. `?lang=es|en` wins over the stored
 * choice and is stored in turn.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const { search } = useLocation();
  const [lang, setLangState] = useState<Lang>(
    () => readQuery(window.location.search) ?? readStored() ?? DEFAULT_LANG
  );

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    // The editor's preview follows the editor's language and must not
    // overwrite the language this browser chose as a visitor.
    if (IS_PREVIEW) return;
    try {
      localStorage.setItem(STORAGE_LANG, l);
    } catch {
      /* storage unavailable: the choice lasts for this visit */
    }
  }, []);

  // A link with ?lang= applies when followed inside the app too.
  useEffect(() => {
    const q = readQuery(search);
    if (q) setLang(q);
  }, [search, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
