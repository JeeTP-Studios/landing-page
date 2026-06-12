import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";

/**
 * Preview de servicios para el Home: lista interactiva a la derecha y una
 * media (imagen/icono) que cambia a la izquierda según el servicio activo.
 * Auto-avanza y responde al hover. Más ligero que el bloque de tarjetas.
 */
export default function ServicesPreview() {
  const c = useSite();
  const s = c.services;
  const [active, setActive] = useState(0);
  const hover = useRef(false);

  const items = s.items || [];
  const n = items.length;

  useEffect(() => {
    if (n <= 1) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;
    const id = setInterval(() => {
      if (hover.current) return;
      setActive((a) => (a + 1) % n);
    }, 3200);
    return () => clearInterval(id);
  }, [n]);

  if (!s.enabled || n === 0) return null;
  const cur = items[Math.min(active, n - 1)];

  return (
    <section className="blk svc-prev" id="servicios">
      <div className="blk-ov" style={{ background: grad(s), opacity: s.opacity }} />
      <div className="wrap">
        <div className="lbl reveal">{s.label}</div>
        <div className="head reveal">
          <h2>{s.title}</h2>
          <Link to="/services" className="ghost-btn">
            {c.ui.buttons.viewServices} <span>→</span>
          </Link>
        </div>

        <div
          className="svc-grid reveal"
          onMouseEnter={() => (hover.current = true)}
          onMouseLeave={() => (hover.current = false)}
        >
          {/* Media a la izquierda: cambia con el servicio activo */}
          <div className="svc-media">
            {items.map((it, i) => (
              <div
                className={`svc-media-layer ${i === active ? "on" : ""}`}
                key={i}
                style={{
                  background: `linear-gradient(150deg, ${it.color}, #06061a)`,
                }}
              >
                {it.img ? (
                  <img src={it.img} alt={it.h} />
                ) : (
                  <span className="svc-media-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
            ))}
            <div className="svc-media-tag">{cur.h}</div>
          </div>

          {/* Lista a la derecha */}
          <ul className="svc-list">
            {items.map((it, i) => (
              <li
                key={i}
                className={`svc-row ${i === active ? "on" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="svc-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="svc-body">
                  <span className="svc-h">{it.h}</span>
                  <span className="svc-sub">
                    {it.a}
                    {it.b ? ` · ${it.b}` : ""}
                  </span>
                </span>
                <span className="svc-arrow">↗</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
