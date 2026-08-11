import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "@phosphor-icons/react";
import { mediaThumb } from "@/lib/project";
import { paragraphs } from "@/lib/style";
import Lightbox from "@/components/common/Lightbox";
import { Reveal, RevealItem, RevealList } from "@/components/common/Reveal";
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

/** Marks the project name inside a section title with the project accent. */
function markName(title: string, name: string, accent: string): ReactNode {
  if (!title) return null;
  if (!name || !title.includes(name)) return title;
  return title.split(name).flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <em key={i} style={{ color: accent, fontStyle: "normal" }}>
            {name}
          </em>,
          part,
        ]
  );
}

function Overview({ s, p }: { s: OverviewSection; p: Project }) {
  return (
    <section className="cs cs-overview">
      <div className="cs-split">
        <Reveal as="h2">{markName(s.title, p.name, p.accent)}</Reveal>
        <Reveal delay={0.06} className="cs-prose">
          {paragraphs(s.body).map((x) => (
            <p key={x.slice(0, 24)}>{x}</p>
          ))}
        </Reveal>
      </div>
      {s.image ? (
        <Reveal delay={0.1} className="cs-figure notch">
          <img src={s.image} alt="" loading="lazy" />
        </Reveal>
      ) : null}
    </section>
  );
}

function Process({ s }: { s: ProcessSection }) {
  return (
    <section className="cs cs-process">
      <Reveal as="h2">{s.title}</Reveal>
      <RevealList className="cs-steps" amount={0.15}>
        {s.steps.map(([n, t]) => (
          <RevealItem className="cs-step" key={n + t}>
            <span className="num">{n}</span>
            <span>{t}</span>
          </RevealItem>
        ))}
      </RevealList>
    </section>
  );
}

function Challenge({ s }: { s: ChallengeSection }) {
  const hasCols = s.problems.length > 0 || s.approach.length > 0;
  return (
    <section className="cs cs-challenge">
      <Reveal as="h2">{s.title}</Reveal>
      {s.intro ? (
        <Reveal delay={0.05}>
          <p className="cs-intro">{s.intro}</p>
        </Reveal>
      ) : null}
      {hasCols && (
        <div className="cs-cols">
          {s.problems.length > 0 && (
            <Reveal delay={0.08} className="cs-col">
              <h4>What was in the way</h4>
              <ul>
                {s.problems.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Reveal>
          )}
          {s.approach.length > 0 && (
            <Reveal delay={0.14} className="cs-col cs-col-accent">
              <h4>{s.approachTitle}</h4>
              <ul>
                {s.approach.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      )}
      {s.images.length > 0 && (
        <RevealList className="cs-imgs" amount={0.12}>
          {s.images.map((src) => (
            <RevealItem className="notch" key={src}>
              <img src={src} alt="" loading="lazy" />
            </RevealItem>
          ))}
        </RevealList>
      )}
    </section>
  );
}

function Methodology({ s }: { s: MethodologySection }) {
  return (
    <section className="cs cs-method">
      <Reveal as="h2">{s.title}</Reveal>
      <RevealList className="cs-method-grid" amount={0.12}>
        {s.items.map((it) => (
          <RevealItem className="cs-method-item" key={it.heading}>
            <h4>{it.heading}</h4>
            <p>{it.body}</p>
          </RevealItem>
        ))}
      </RevealList>
    </section>
  );
}

function Gallery({ s }: { s: GallerySection }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!s.items.length) return null;
  return (
    <section className="cs cs-gallery">
      <Reveal as="h2">{s.title}</Reveal>
      <RevealList className={`cs-g cs-g-${s.layout}`} amount={0.08}>
        {s.items.map((m, i) => {
          const isVideo = m.type === "video";
          const thumb = mediaThumb(m);
          return (
            <RevealItem key={m.url}>
              <button
                type="button"
                className={`cs-shot notch ${isVideo ? "is-video" : ""}`}
                onClick={() => setOpen(i)}
                aria-label={isVideo ? "Play video" : "Open image"}
              >
                {thumb ? (
                  <img src={thumb} alt="" loading="lazy" />
                ) : (
                  <span className="cs-shot-empty">Video</span>
                )}
                {isVideo ? (
                  <span className="cs-play">
                    <Play size={18} weight="fill" />
                  </span>
                ) : null}
              </button>
            </RevealItem>
          );
        })}
      </RevealList>
      {open !== null && (
        <Lightbox media={s.items[open]} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}

function Conclusion({ s }: { s: ConclusionSection }) {
  return (
    <section className="cs cs-conclusion">
      <div className="cs-split">
        <Reveal as="h2">{s.title}</Reveal>
        <Reveal delay={0.06} className="cs-prose">
          {paragraphs(s.body).map((x) => (
            <p key={x.slice(0, 24)}>{x}</p>
          ))}
        </Reveal>
      </div>
      {s.image ? (
        <Reveal delay={0.1} className="cs-figure notch">
          <img src={s.image} alt="" loading="lazy" />
        </Reveal>
      ) : null}
    </section>
  );
}

function Cta({ s }: { s: CtaSection }) {
  return (
    <Reveal className="cs cs-cta notch">
      <h3>{s.text}</h3>
      <Link to="/contact" className="btn">
        {s.buttonLabel}
        <ArrowRight size={16} weight="bold" />
      </Link>
    </Reveal>
  );
}

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
