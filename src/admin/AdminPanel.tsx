import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "@/content/ContentContext";
import {
  AboutTab,
  CasesPageTab,
  ClientsTab,
  ContactTab,
  GlobalTab,
  HomeTab,
  ServicesTab,
  TextsTab,
} from "./tabs";
import ProjectsTab from "./CasesTab";

type TabDef = { key: string; label: string; Comp: () => JSX.Element };
type Group = { label: string; tabs: TabDef[] };

const GROUPS: Group[] = [
  {
    label: "General",
    tabs: [
      { key: "global", label: "Global", Comp: GlobalTab },
      { key: "texts", label: "Textos", Comp: TextsTab },
    ],
  },
  {
    label: "Páginas",
    tabs: [
      { key: "home", label: "Inicio", Comp: HomeTab },
      { key: "about", label: "About Us", Comp: AboutTab },
      { key: "services", label: "Services", Comp: ServicesTab },
      { key: "casesPage", label: "Case Studies", Comp: CasesPageTab },
      { key: "contact", label: "Contacto", Comp: ContactTab },
    ],
  },
  {
    label: "Clientes",
    tabs: [{ key: "clients", label: "Clientes", Comp: ClientsTab }],
  },
  {
    label: "Case Studies",
    tabs: [{ key: "projects", label: "Proyectos", Comp: ProjectsTab }],
  },
];

const ALL_TABS: TabDef[] = GROUPS.flatMap((g) => g.tabs);

export default function AdminPanel() {
  const {
    saveLocal,
    exportJson,
    importJson,
    resetToDefaults,
    resetToRemote,
    hasLocalOverride,
    remoteLoaded,
  } = useContent();
  const navigate = useNavigate();
  const [tab, setTab] = useState("global");
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [tab]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const onImport = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        importJson(String(r.result));
        showToast("JSON importado");
      } catch {
        alert("El archivo no es un JSON válido.");
      }
    };
    r.readAsText(file);
  };

  const ActiveTab = ALL_TABS.find((t) => t.key === tab)?.Comp ?? GlobalTab;

  return (
    <div className="admin">
      <div className="ad-top">
        <div>
          <h1>JeeTP · Panel de contenido</h1>
          <div className="sub">
            {remoteLoaded ? "JSON remoto cargado" : "Usando contenido por defecto"}
            {hasLocalOverride ? " · tienes cambios locales sin publicar" : ""}
          </div>
        </div>
        <div className="ad-actions">
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => onImport(e.target.files?.[0])}
          />
          <button
            className="ad-btn ghost"
            onClick={() => fileRef.current?.click()}
          >
            Importar JSON
          </button>
          <button
            className="ad-btn ghost"
            onClick={() => {
              exportJson();
              showToast("content.json descargado");
            }}
          >
            Exportar JSON
          </button>
          <button
            className="ad-btn ghost"
            onClick={() => {
              if (
                confirm(
                  "¿Descartar tus cambios locales y recargar el JSON del bucket?"
                )
              )
                resetToRemote();
            }}
          >
            Recargar remoto
          </button>
          <button
            className="ad-btn warn"
            onClick={() => {
              if (confirm("¿Restablecer todo a los valores por defecto?"))
                resetToDefaults();
            }}
          >
            Reset
          </button>
          <button
            className="ad-btn ghost"
            onClick={() => {
              saveLocal();
              navigate("/");
            }}
          >
            Ver sitio
          </button>
          <button
            className="ad-btn primary"
            onClick={() => {
              saveLocal();
              showToast("Guardado localmente");
            }}
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="ad-body">
        <nav className="ad-tabs">
          {GROUPS.map((g) => (
            <div className="ad-group" key={g.label}>
              <div className="ad-grouptitle">{g.label}</div>
              {g.tabs.map((t) => (
                <button
                  key={t.key}
                  className={`ad-tab ${t.key === tab ? "on" : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="ad-main" ref={mainRef}>
          <ActiveTab />
        </div>
      </div>

      <div className={`save-toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}
