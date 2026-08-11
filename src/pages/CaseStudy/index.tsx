import { useEffect, type CSSProperties } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useSite } from "@/content/ContentContext";
import { posterFit, projectPoster } from "@/lib/project";
import CaseSectionView from "@/sections/CaseSections";
import Footer from "@/components/layout/Footer";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CaseStudy() {
  const { id } = useParams();
  const c = useSite();
  const navigate = useNavigate();
  const idx = c.projects.findIndex((x) => x.id === id);
  const p = c.projects[idx];
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!p && id !== undefined && c.projects.length) navigate("/case-studies");
  }, [p, id, c.projects.length, navigate]);

  if (!p) return null;

  const next = c.projects[(idx + 1) % c.projects.length];
  const sections = (p.sections || []).filter((s) => s.enabled);
  const L = c.ui.caseStudy;
  const hero =
    p.heroMode === "custom" && p.heroImage ? p.heroImage : projectPoster(p);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <>
      <article
        className={`case v-${p.detailVariant || "standard"}`}
        style={{ "--accent": p.accent } as CSSProperties}
      >
        <div className="wrap">
          <Link className="case-back link" to="/case-studies">
            <ArrowLeft size={15} weight="bold" />
            {L.back}
          </Link>

          <motion.header className="case-top" {...enter(0.04)}>
            <div className="case-tags">
              {(p.tags || []).map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <h1>{p.name}</h1>
            <p className="lede">{p.desc}</p>
          </motion.header>

          <motion.div
            className="case-hero notch"
            data-fit={posterFit(hero)}
            {...enter(0.14)}
          >
            <span
              className="case-hero-wash"
              style={{
                background: `linear-gradient(150deg, ${p.gradA}55, transparent 60%)`,
              }}
            />
            {hero ? <img src={hero} alt={p.name} /> : null}
          </motion.div>

          <motion.dl className="case-specs" {...enter(0.2)}>
            <div>
              <dt>{L.specCategory}</dt>
              <dd>{p.category}</dd>
            </div>
            <div>
              <dt>{L.specDuration}</dt>
              <dd>{p.duration}</dd>
            </div>
            <div>
              <dt>{L.specMeta}</dt>
              <dd>
                {p.year} / {p.location}
              </dd>
            </div>
          </motion.dl>

          <div className="case-sections">
            {sections.map((s) => (
              <CaseSectionView key={s.id} section={s} project={p} />
            ))}
          </div>

          <Link className="up-next notch" to={`/case-studies/${next.id}`}>
            <div>
              <span className="up-next-label">{L.upNext}</span>
              <h3>{next.name}</h3>
            </div>
            <ArrowRight size={26} weight="bold" />
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
