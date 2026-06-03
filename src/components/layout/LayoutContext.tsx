import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface LayoutContextValue {
  crumb: ReactNode;
  setCrumb: (node: ReactNode) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [crumb, setCrumb] = useState<ReactNode>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const value = useMemo(
    () => ({ crumb, setCrumb, menuOpen, setMenuOpen }),
    [crumb, menuOpen]
  );
  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout debe usarse dentro de <LayoutProvider>");
  return ctx;
}

/** Hook de página: fija el breadcrumb del header mientras la página esté montada. */
export function useCrumb(node: ReactNode, deps: unknown[] = []) {
  const { setCrumb } = useLayout();
  useEffect(() => {
    setCrumb(node);
    return () => setCrumb(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
