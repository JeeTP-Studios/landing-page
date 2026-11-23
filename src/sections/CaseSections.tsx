import { useState, type ReactNode } from "react";
import { Play } from "@phosphor-icons/react";
import { useSite } from "@/content/ContentContext";
import { mediaThumb } from "@/lib/project";
import { paragraphs } from "@/lib/text";
import Lightbox from "@/components/common/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import Pill from "@/components/ui/Pill";
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

/** Sets the project name inside a section title in the accent serif. */
function markName(title: string, name: string): ReactNode {
  if (!title || !name || !title.includes(name)) return title;
  return title.split(name).flatMap((part, i) =>
    i === 0 ? [part] : [<em key={i}>{name}</em>, part]
  );
}

function Overview({ s, p }: { s: OverviewSection; p: Project }) {
  return (
    <section className="cs">
      <div className="cs-split">
        <Reveal as="h2" className="h3">
          {markName(s.title, p.name)}
        </Reveal>
        <Reveal delay={0.06} className="prose">
          {paragraphs(s.body).map((x, i) => (
            <p key={i}>{x}</p>
          ))}
        </Reveal>
      </div>
      {s.image ? (
        <Reveal delay={0.1} className="cs-figure">
          <img src={s.image} alt="" loading="lazy" />
        </Reveal>
      ) : null}
    </section>
  );
}

function Process({ s }: { s: ProcessSection }) {
  return (
    <section className="cs">
      <Reveal as="h2" className="h3">
        {s.title}
      </Reveal>
      <ol className="cs-steps">
        {s.steps.map(([n, t], i) => (
          <Reveal as="li" key={i} delay={Math.min(i, 5) * 0.04}>
            <b>{n}</b>
            <span>{t}</span>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Challenge({ s }: { s: ChallengeSection }) {
  const { ui } = useSite();
  const hasCols = s.problems.length > 0 || s.approach.length > 0;
  return (
    <section className="cs">
      <Reveal as="h2" className="h3">
        {s.title}
      </Reveal>
      {s.intro ? (
        <Reveal delay={0.05} as="p" className="cs-intro">
          {s.intro}
        </Reveal>
      ) : null}
      {hasCols && (
        <div className="cs-cols">
          {s.problems.length > 0 && (
            <Reveal delay={0.08} className="cs-col">
              <h4>{ui.caseStudy.problemsTitle}</h4>
              <ul>
                {s.problems.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </Reveal>
          )}
          {s.approach.length > 0 && (
            <Reveal delay={0.14} className="cs-col cs-col-on">
              <h4>{s.approachTitle}</h4>
              <ul>
                {s.approach.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      )}
      {s.images.length > 0 && (
        <div className="cs-imgs">
          {s.images.map((src) => (
            <Reveal className="cs-figure" key={src}>
              <img src={src} alt="" loading="lazy" />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function Methodology({ s }: { s: MethodologySection }) {
  return (
    <section className="cs">
      <Reveal as="h2" className="h3">
        {s.title}
      </Reveal>
      <div className="cs-method">
        {s.items.map((it, i) => (
          <Reveal key={i} delay={Math.min(i, 5) * 0.05}>
            <h4>{it.heading}</h4>
            <p>{it.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gallery({ s }: { s: GallerySection }) {
  const { ui } = useSite();
  const [open, setOpen] = useState<number | null>(null);
  if (!s.items.length) return null;
  return (
    <section className="cs">
      <Reveal as="h2" className="h3">
        {s.title}
      </Reveal>
      <div className={`cs-g cs-g-${s.layout}`}>
        {s.items.map((m, i) => {
          const isVideo = m.type === "video";
          const thumb = mediaThumb(m);
          return (
            <Reveal key={m.url + i}>
              <button
                type="button"
                className={`cs-shot ${isVideo ? "is-video" : ""}`}
                onClick={() => setOpen(i)}
                aria-label={isVideo ? ui.caseStudy.playVideo : ui.caseStudy.openImage}
              >
                {thumb ? (
                  <img src={thumb} alt="" loading="lazy" />
                ) : (
                  <span className="cs-shot-empty">{ui.caseStudy.video}</span>
                )}
                {isVideo ? (
                  <span className="cs-play">
                    <Play size={18} weight="fill" />
                  </span>
                ) : null}
              </button>
            </Reveal>
          );
        })}
      </div>
      {open !== null && <Lightbox media={s.items[open]} onClose={() => setOpen(null)} />}
    </section>
  );
}

function Conclusion({ s }: { s: ConclusionSection }) {
  return (
    <section className="cs">
      <div className="cs-split">
        <Reveal as="h2" className="h3">
          {s.title}
        </Reveal>
        <Reveal delay={0.06} className="prose">
          {paragraphs(s.body).map((x, i) => (
            <p key={i}>{x}</p>
          ))}
        </Reveal>
      </div>
      {s.image ? (
        <Reveal delay={0.1} className="cs-figure">
          <img src={s.image} alt="" loading="lazy" />
        </Reveal>
      ) : null}
    </section>
  );
}

function Cta({ s }: { s: CtaSection }) {
  return (
    <Reveal className="cs cs-cta">
      <h3>{s.text}</h3>
      <Pill to="/contact">{s.buttonLabel}</Pill>
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
