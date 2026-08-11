import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface LayoutContextValue {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const value = useMemo(() => ({ menuOpen, setMenuOpen }), [menuOpen]);
  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used inside <LayoutProvider>");
  return ctx;
}

/** Nav destinations, in one place so header, menu and footer never drift. */
export const NAV_KEYS = [
  ["/", "home"],
  ["/about", "about"],
  ["/services", "services"],
  ["/case-studies", "cases"],
  ["/contact", "contact"],
] as const;
