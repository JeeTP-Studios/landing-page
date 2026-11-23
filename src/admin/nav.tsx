import { createContext, useContext } from "react";

/** Where the editor is, and how a part of it asks to move. */
export interface AdminNav {
  /** `data-edit` key of the block whose fields are open. */
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
  /** Project open on the Projects page. */
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  /** Jump to another page, opening one of its blocks. */
  go: (page: string, section?: string) => void;
  /** The search box. Lowercase, empty when not searching. */
  query: string;
}

export const AdminNavContext = createContext<AdminNav | null>(null);

export function useAdminNav(): AdminNav {
  const v = useContext(AdminNavContext);
  if (!v) throw new Error("useAdminNav must be used inside the editor");
  return v;
}
