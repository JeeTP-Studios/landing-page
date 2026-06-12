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
      { key: "texts", label: "Texts", Comp: TextsTab },
    ],
  },
  {
    label: "Pages",
    tabs: [
      { key: "home", label: "Home", Comp: HomeTab },
      { key: "about", label: "About Us", Comp: AboutTab },
      { key: "services", label: "Services", Comp: ServicesTab },
      { key: "casesPage", label: "Case Studies", Comp: CasesPageTab },
      { key: "contact", label: "Contact", Comp: ContactTab },
    ],
  },
  {
    label: "Clients",
    tabs: [{ key: "clients", label: "Clients", Comp: ClientsTab }],
  },
  {
    label: "Case Studies",
    tabs: [{ key: "projects", label: "Projects", Comp: ProjectsTab }],
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
        showToast("JSON imported");
      } catch {
        alert("The file is not valid JSON.");
      }
    };
    r.readAsText(file);
  };

  const ActiveTab = ALL_TABS.find((t) => t.key === tab)?.Comp ?? GlobalTab;

  return (
    <div className="admin">
      <div className="ad-top">
        <div>
          <h1>JeeTP · Content panel</h1>
          <div className="sub">
            {remoteLoaded ? "Remote JSON loaded" : "Using default content"}
            {hasLocalOverride ? " · you have unpublished local changes" : ""}
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
            Import JSON
          </button>
          <button
            className="ad-btn ghost"
            onClick={() => {
              exportJson();
              showToast("content.json downloaded");
            }}
          >
            Export JSON
          </button>
          <button
            className="ad-btn ghost"
            onClick={() => {
              if (
                confirm(
                  "Discard your local changes and reload the JSON from the bucket?"
                )
              )
                resetToRemote();
            }}
          >
            Reload remote
          </button>
          <button
            className="ad-btn warn"
            onClick={() => {
              if (confirm("Reset everything to default values?"))
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
            View site
          </button>
          <button
            className="ad-btn primary"
            onClick={() => {
              saveLocal();
              showToast("Saved locally");
            }}
          >
            Save
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
