import { useMemo } from "react";
import { useContent } from "@/content/ContentContext";
import { Icon } from "./icons";
import { ALL_PAGES, OTHER_PAGES, PROJECTS_PAGE, SECTION_PAGES } from "./sections";
import { translationStats } from "./translation";

/** The left rail: pages, then projects, clients and site-wide texts. */
export default function Rail({ page, onPage }: { page: string; onPage: (key: string) => void }) {
  const { content } = useContent();

  // Spanish still to do, per page, shown as a small count.
  const missing = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of ALL_PAGES) m[p.key] = translationStats(content, p.sections.flatMap((s) => s.roots)).missing;
    m[PROJECTS_PAGE.key] = translationStats(content, ["projects"]).missing;
    return m;
  }, [content]);

  const item = (key: string, label: string, icon: Parameters<typeof Icon>[0]["name"]) => (
    <button
      key={key}
      type="button"
      className={`rail-item${page === key ? " on" : ""}`}
      aria-current={page === key ? "page" : undefined}
      title={label}
      onClick={() => onPage(key)}
    >
      <Icon name={icon} size={18} />
      <span className="rail-label">{label}</span>
      {missing[key] ? (
        <span className="rail-count" title={`${missing[key]} to translate`} aria-label={`${missing[key]} to translate`}>
          {missing[key]}
        </span>
      ) : null}
    </button>
  );

  return (
    <nav className="rail" aria-label="Sections of the site">
      <div className="rail-group">
        <div className="rail-title">Pages</div>
        {SECTION_PAGES.map((p) => item(p.key, p.label, p.icon))}
      </div>
      <div className="rail-group">
        <div className="rail-title">Library</div>
        {item(PROJECTS_PAGE.key, PROJECTS_PAGE.label, PROJECTS_PAGE.icon)}
        {item(OTHER_PAGES[0].key, OTHER_PAGES[0].label, OTHER_PAGES[0].icon)}
      </div>
      <div className="rail-group">
        <div className="rail-title">Site-wide</div>
        {OTHER_PAGES.slice(1).map((p) => item(p.key, p.label, p.icon))}
      </div>
    </nav>
  );
}
