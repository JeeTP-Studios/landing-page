import { useState } from "react";
import { Link } from "react-router-dom";
import { isYouTube, youTubeThumb } from "@/lib/media";
import Lightbox from "@/components/common/Lightbox";
import type {
  CaseSection,
  ChallengeSection,
  ConclusionSection,
  CtaSection,
  GallerySection,
  MethodologySection,
  OverviewSection,
  ProcessSection,
  Project,
} from "@/types/content";
import type { ReactNode } from "react";
import { paragraphs } from "@/lib/style";

/** Resalta la(s) aparicion(es) del nombre del proyecto dentro del título
 *  usando el accent color del proyecto (no editable, automático). */
function highlightName(title: string, name: string, accent: string): ReactNode {
  if (!title) return null;
  if (!name || !title.includes(name)) return title;
  const parts = title.split(name);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <b key={i} style={{ color: accent }}>
            {name}
          </b>,
          part,
        ]
  );
}

/* ---------- Overview ---------- */
function Overview({ s, p }: { s: OverviewSection; p: Project }) {
  return (
    <div className="pd-section cs-overview reveal">
      <div className="pd-2col">
        <div>
          <h2>{highlightName(s.title, p.name, p.accent)}</h2>
        </div>
        <div>
          <div className="ov-lbl">{s.label}</div>
          {paragraphs(s.body).map((x, i) => (
            <p key={i}>{x}</p>
          ))}
        </div>
      </div>
      {s.image ? (
        <div className="cs-figure">
          <img src={s.image} alt={s.title} />
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Process ---------- */
function Process({ s }: { s: ProcessSection }) {
  return (
    <div className="pd-section cs-process reveal">
      <h2>{s.title}</h2>
      <div className="cs-steps">
        {s.steps.map(([n, t], i) => (
          <div className="cs-step" key={i}>
            <div className="n">{n}</div>
            <div className="t">{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Challenge ---------- */
function Challenge({ s }: { s: ChallengeSection }) {
  const hasCols = s.problems.length > 0 || s.approach.length > 0;
  return (
    <div className="pd-section cs-challenge reveal">
      <h2>{s.title}</h2>
      {s.intro ? <p className="cs-intro">{s.intro}</p> : null}
      {hasCols && (
        <div className="cs-cols">
          {s.problems.length > 0 && (
            <div>
              <h3>The challenge</h3>
              <ul>
                {s.problems.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          )}
          {s.approach.length > 0 && (
            <div>
              <h3>{s.approachTitle}</h3>
              <ul>
                {s.approach.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {s.images.length > 0 && (
        <div className="cs-imgs">
          {s.images.map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Methodology ---------- */
function Methodology({ s }: { s: MethodologySection }) {
  return (
    <div className="pd-section cs-method reveal">
      <h2>{s.title}</h2>
      <div className="cs-grid">
        {s.items.map((it, i) => (
          <div className="cs-item" key={i}>
            <h4>{it.heading}</h4>
            <p>{it.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Gallery ---------- */
function Gallery({ s }: { s: GallerySection }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!s.items.length) return null;
  return (
    <div className="pd-section cs-gallery reveal">
      <h2>{s.title}</h2>
      <div className={`cs-g ${s.layout}`}>
        {s.items.map((m, i) => {
          const isVideo = m.type === "video";
          const thumb =
            m.type === "image"
              ? m.url
              : m.poster || (isYouTube(m.url) ? youTubeThumb(m.url) : "");
          return (
            <button
              type="button"
              className={`cs-gitem ${isVideo ? "is-video" : ""}`}
              key={i}
              onClick={() => setOpen(i)}
              aria-label="Expandir"
            >
              {thumb ? (
                <img src={thumb} alt="" />
              ) : (
                <div className="cs-gph">video</div>
              )}
              {isVideo ? <span className="cs-play">▶</span> : null}
            </button>
          );
        })}
      </div>
      {open !== null && (
        <Lightbox media={s.items[open]} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}

/* ---------- Conclusion ---------- */
function Conclusion({ s }: { s: ConclusionSection }) {
  return (
    <div className="pd-section cs-conclusion reveal">
      <div className="pd-2col">
        <div>
          <h2>{s.title}</h2>
        </div>
        <div>
          {paragraphs(s.body).map((x, i) => (
            <p key={i}>{x}</p>
          ))}
        </div>
      </div>
      {s.image ? (
        <div className="cs-figure">
          <img src={s.image} alt={s.title} />
        </div>
      ) : null}
    </div>
  );
}

/* ---------- CTA ---------- */
function Cta({ s }: { s: CtaSection }) {
  return (
    <div className="hireus" style={{ marginBottom: 60 }}>
      <span>{s.text}</span>
      <Link to="/contact">{s.buttonLabel}</Link>
    </div>
  );
}

/** Renderiza la sección correspondiente según su tipo. */
export default function CaseSectionView({
  section,
  project,
}: {
  section: CaseSection;
  project: Project;
}) {
  switch (section.type) {
    case "overview":
      return <Overview s={section} p={project} />;
    case "process":
      return <Process s={section} />;
    case "challenge":
      return <Challenge s={section} />;
    case "methodology":
      return <Methodology s={section} />;
    case "gallery":
      return <Gallery s={section} />;
    case "conclusion":
      return <Conclusion s={section} />;
    case "cta":
      return <Cta s={section} />;
    default:
      return null;
  }
}
