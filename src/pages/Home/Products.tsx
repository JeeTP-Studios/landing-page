import { useSite } from "@/content/ContentContext";
import { Reveal } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/** Raster logos are flat wordmarks (set in white, name included); SVG marks
 *  keep their colours and sit beside the product name. */
const isMark = (logo: string) => /\.svg(\?|$)/i.test(logo);

/** Our own products, as cards lit by a glow that follows the cursor. */
export default function Products() {
  const { products } = useSite();
  if (!products.items.length) return null;
  return (
    <section className="labs g">
      <SectionHeading
        title={products.title}
        accent={products.accent}
        aside={products.intro}
        asideClass="lede"
      />
      <div className="cards">
        {products.items.map((p, i) => (
          <Reveal
            as="article"
            className="card"
            key={i}
            onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
            }}
          >
            <div className="mk">
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={isMark(p.logo) ? "" : p.name}
                  className={isMark(p.logo) ? "is-mark" : ""}
                />
              ) : null}
              {!p.logo || isMark(p.logo) ? p.name : null}
            </div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.linkLabel}
              </a>
            ) : null}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
