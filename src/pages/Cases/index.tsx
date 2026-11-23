import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { useLanguage } from "@/content/LanguageContext";
import { posterFit, projectPoster } from "@/lib/project";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import Pill from "@/components/ui/Pill";
import Footer from "@/components/layout/Footer";

/** Column spans on a 12-column grid, cycled so no two rows share a rhythm. */
const SPANS = [7, 5, 5, 7, 6, 6];

export default function Cases() {
  const c = useSite();
  const { lang } = useLanguage();
  const [filter, setFilter] = useState("*");

  // Tags are translated, so a filter chosen in one language means nothing in the other.
  useEffect(() => setFilter("*"), [lang]);

  const allTags = useMemo(
    () => [...new Set(c.projects.flatMap((p) => p.tags || []))],
    [c.projects]
  );
  const shown = useMemo(
    () => c.projects.filter((p) => filter === "*" || (p.tags || []).includes(filter)),
    [c.projects, filter]
  );

  return (
    <>
      <main className="page">
        <PageHero editKey="cases-hero" eyebrow={c.cases.label} title={c.cases.title} accent={c.cases.accent}>
          <div className="filters" role="group" aria-label={c.ui.casesIndex.filterLabel}>
            <button
              type="button"
              className={`chip ${filter === "*" ? "is-on" : ""}`}
              onClick={() => setFilter("*")}
            >
              {c.ui.buttons.allWork}
            </button>
            {allTags.map((t) => (
              <button
                type="button"
                key={t}
                className={`chip ${filter === t ? "is-on" : ""}`}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </PageHero>

        <section className="g case-index">
          {shown.length === 0 ? (
            <div className="empty">
              <h3>{c.ui.casesIndex.emptyTitle}</h3>
              <p>{c.ui.casesIndex.emptyBody}</p>
              <Pill onClick={() => setFilter("*")}>{c.ui.buttons.allWork}</Pill>
            </div>
          ) : (
            <div className="case-grid">
              {shown.map((p, i) => {
                const poster = projectPoster(p);
                return (
                  <Reveal
                    as="article"
                    className="case-card"
                    data-edit={`project:${p.id}`}
                    key={p.id}
                    style={{ ["--span" as string]: SPANS[i % SPANS.length] }}
                  >
                    <Link to={`/case-studies/${p.id}`}>
                      <span className="case-media" data-fit={posterFit(poster)}>
                        {poster ? <img src={poster} alt={p.name} loading="lazy" /> : null}
                      </span>
                      <span className="case-foot">
                        <span>
                          <h3>{p.name}</h3>
                          <small>{p.tagline || p.category}</small>
                        </span>
                        <i aria-hidden="true">→</i>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
