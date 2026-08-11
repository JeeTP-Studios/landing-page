import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "@/content/ContentContext";
import { posterFit, projectPoster } from "@/lib/project";
import PageHero from "@/components/common/PageHero";
import Footer from "@/components/layout/Footer";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Column spans, cycled so no two rows have the same rhythm. */
const SPANS = [7, 5, 5, 7, 6, 6];

export default function Cases() {
  const c = useSite();
  const cs = c.cases;
  const [filter, setFilter] = useState("*");
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allTags = useMemo(
    () => [...new Set(c.projects.flatMap((p) => p.tags || []))],
    [c.projects]
  );

  const shown = useMemo(
    () =>
      c.projects.filter(
        (p) =>
          filter === "*" ||
          (p.tags || []).map((t) => t.toLowerCase()).includes(filter)
      ),
    [c.projects, filter]
  );

  return (
    <>
      <PageHero eyebrow={cs.label} title={cs.title}>
        <div className="filters" role="group" aria-label="Filter by discipline">
          <button
            type="button"
            className={`filter ${filter === "*" ? "is-on" : ""}`}
            onClick={() => setFilter("*")}
          >
            {c.ui.buttons.allWork}
          </button>
          {allTags.map((t) => {
            const key = t.toLowerCase();
            return (
              <button
                type="button"
                key={key}
                className={`filter ${filter === key ? "is-on" : ""}`}
                onClick={() => setFilter(key)}
              >
                {t}
              </button>
            );
          })}
        </div>
      </PageHero>

      <section className="sect-tight">
        <div className="wrap">
          {shown.length === 0 ? (
            <div className="empty">
              <h3>Nothing filed under that discipline yet.</h3>
              <p>
                It is on the roadmap. In the meantime, the full archive is a
                click away.
              </p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setFilter("*")}
              >
                {c.ui.buttons.allWork}
              </button>
            </div>
          ) : (
            <div className="case-grid">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((p, i) => {
                  const poster = projectPoster(p);
                  return (
                    <motion.article
                      key={p.id}
                      layout={!reduce}
                      className="case-card"
                      style={{ ["--span" as string]: SPANS[i % SPANS.length] }}
                      initial={reduce ? false : { opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(i, 5) * 0.05,
                        ease: EASE,
                      }}
                    >
                      <Link to={`/case-studies/${p.id}`}>
                        <span
                          className="case-media notch"
                          data-fit={posterFit(poster)}
                        >
                          <span
                            className="case-fill"
                            style={{
                              background: `linear-gradient(152deg, ${p.gradA}, ${p.gradB})`,
                            }}
                          />
                          {p.pattern && p.pattern !== "none" ? (
                            <span
                              className={`case-pattern pat-${p.pattern}`}
                              style={{ opacity: p.patternOpacity ?? 0.25 }}
                            />
                          ) : null}
                          {poster ? <img src={poster} alt={p.name} loading="lazy" /> : null}
                        </span>
                        <div className="case-foot">
                          <div>
                            <h3>{p.name}</h3>
                            <p>{(p.tags || []).slice(0, 3).join(" / ")}</p>
                          </div>
                          <ArrowUpRight size={20} weight="bold" />
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
