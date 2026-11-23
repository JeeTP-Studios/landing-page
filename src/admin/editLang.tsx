import { createContext, useContext } from "react";
import type { Lang } from "@/content/i18n";

/** Language the admin is editing. In "es", text fields read and write the
 *  Spanish overlay; every other kind of field edits the shared base. */
export const EditLangContext = createContext<Lang>("en");

export const useEditLang = (): Lang => useContext(EditLangContext);
