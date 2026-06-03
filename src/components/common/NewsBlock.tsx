import { useSite } from "@/content/ContentContext";
import RowScroller from "./RowScroller";

/** Sección "En los medios" reutilizable. Toma los logos de about.news. */
export default function NewsBlock({
  enabled,
  title,
}: {
  enabled: boolean;
  title?: string;
}) {
  const { about } = useSite();
  if (!enabled) return null;
  const list = about.news.logos || [];
  return (
    <section className="sect">
      <div className="wrap">
        <div className="head reveal">
          <h2 style={{ fontSize: "clamp(28px,4vw,52px)" }}>
            {title || about.news.title}
          </h2>
        </div>
        <RowScroller className="whorow">
          {list.map((l, i) => (
            <div
              className="whocard"
              key={i}
              style={{
                flex: "0 0 clamp(220px,28vw,320px)",
                aspectRatio: "16/9",
                background: "#0d0726",
              }}
            >
              {l.img ? (
                <img src={l.img} alt={l.name} />
              ) : (
                <h3
                  style={{
                    fontSize: "clamp(20px,2.4vw,30px)",
                    color: "var(--muted)",
                  }}
                >
                  {l.name}
                </h3>
              )}
            </div>
          ))}
        </RowScroller>
      </div>
    </section>
  );
}
