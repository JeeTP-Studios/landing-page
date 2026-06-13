import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import ScrollCue from "@/components/common/ScrollCue";
import Typewriter from "@/components/common/Typewriter";
import HeroHud from "./HeroHud";

/** Convierte un hex (#rgb / #rrggbb) a [r,g,b]. */
function hexRgb(hex: string): [number, number, number] {
  let h = (hex || "").replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((x) => x + x)
      .join("");
  const n = parseInt(h || "000000", 16);
  if (Number.isNaN(n)) return [10, 6, 30];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** Interpola dos colores hex y devuelve un rgb() css. */
function mix(a: string, b: string, t: number): string {
  const A = hexRgb(a);
  const B = hexRgb(b);
  const r = Math.round(A[0] + (B[0] - A[0]) * t);
  const g = Math.round(A[1] + (B[1] - A[1]) * t);
  const bl = Math.round(A[2] + (B[2] - A[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

export default function PinnedHero() {
  const c = useSite();
  const navigate = useNavigate();
  const pinRef = useRef<HTMLElement>(null);

  const projects = c.projects;
  const totalPanels = projects.length + 1;

  const goHref = (href: string) => {
    if (!href || href === "#") return;
    if (/^https?:\/\//.test(href)) {
      window.location.href = href;
    } else if (href.startsWith("/")) {
      navigate(href);
    } else {
      navigate(href.replace(/^#/, "/"));
    }
  };

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;
    const sticky = pin.querySelector<HTMLElement>(".pin-sticky")!;
    const bg = pin.querySelector<HTMLElement>(".pin-bg");
    const panels = [...pin.querySelectorAll<HTMLElement>(".panel")];
    const navWrap = pin.querySelector<HTMLElement>(".casenav");
    const navs = [...pin.querySelectorAll<HTMLElement>(".casenav a")];
    const N = panels.length;

    // Gradientes por panel (hero + proyectos) para interpolar el fondo continuo.
    const G = [
      { a: c.hero.gradA, b: c.hero.gradB, ang: c.hero.angle, op: c.hero.opacity },
      ...projects.map((p) => ({
        a: p.gradA,
        b: p.gradB,
        ang: p.angle,
        op: p.opacity,
      })),
    ];
    let cur = 0;
    let target = 0;
    let raf = 0;
    let alive = true;
    let running = false;

    // Cache de los últimos valores escritos al DOM: evita repintar/recalcular
    // cuando el valor no cambió respecto al frame anterior.
    const cache = panels.map(() => ({ t: "", z: "", pe: "", o: "" }));
    const subCache: { gh: string; em: string; mt: string; mto: string; ds: string; dso: string; hc: string; pbg: string }[] =
      panels.map(() => ({ gh: "", em: "", mt: "", mto: "", ds: "", dso: "", hc: "", pbg: "" }));
    let lastGradKey = -1;
    let lastNear = -1;

    // Cachea los nodos hijos una sola vez (evita querySelector por frame).
    const refs = panels.map((p) => ({
      pbg: p.querySelector<HTMLElement>(".panel-bg"),
      gh: p.querySelector<HTMLElement>(".pname-ghost"),
      em: p.querySelector<HTMLElement>(".emblem"),
      mt: p.querySelector<HTMLElement>(".meta"),
      ds: p.querySelector<HTMLElement>(".desc"),
      hc: p.querySelector<HTMLElement>(".hero-center"),
    }));

    if (navWrap) navWrap.style.opacity = "1";

    function read() {
      const r = pin!.getBoundingClientRect();
      const total = pin!.offsetHeight - sticky.offsetHeight;
      target =
        (total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 0) * (N - 1);
      ensureRunning();
    }
    function ensureRunning() {
      if (!running && alive) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    function frame() {
      if (!alive) {
        running = false;
        return;
      }
      if (!isFinite(cur)) cur = 0;
      if (!isFinite(target)) target = 0;
      cur += (target - cur) * 0.1;
      const settled = Math.abs(target - cur) < 0.0006;
      if (settled) cur = target;
      // Velocidad (con signo) para deformación tipo "estiramiento" del texto.
      const vel = Math.max(-1, Math.min(1, (target - cur) * 3.4));
      const av = Math.abs(vel);
      // FONDO CONTINUO: interpola el gradiente entre el panel actual y el
      // siguiente según `cur`. Repintar un gradiente a pantalla completa es
      // caro, así que cuantizamos `cur` (paso ~0.02) y solo reescribimos
      // cuando el resultado cambia de verdad.
      if (bg) {
        const gradKey = Math.round(cur * 50);
        if (gradKey !== lastGradKey) {
          lastGradKey = gradKey;
          const q = gradKey / 50;
          const i0 = Math.max(0, Math.min(N - 1, Math.floor(q)));
          const i1 = Math.min(N - 1, i0 + 1);
          const f = q - i0;
          const A = mix(G[i0].a, G[i1].a, f);
          const B = mix(G[i0].b, G[i1].b, f);
          const ang = G[i0].ang + (G[i1].ang - G[i0].ang) * f;
          bg.style.background = `linear-gradient(${ang.toFixed(1)}deg, ${A}, ${B})`;
          bg.style.opacity = (G[i0].op + (G[i1].op - G[i0].op) * f).toFixed(3);
        }
      }
      for (let i = 0; i < N; i++) {
        const d = cur - i; // >0 = ya pasó (izq), <0 = siguiente (der)
        const sd = Math.max(-1, Math.min(1, d)); // d acotado con signo
        const ad = Math.min(Math.abs(d), 1);
        const ease = ad * ad * (3 - 2 * ad); // smoothstep para escalas/opacidad
        const p = panels[i];
        const cc = cache[i];
        const sc = subCache[i];
        // SLIDE HORIZONTAL + PROFUNDIDAD: el panel se desliza, además se aleja
        // (escala), se inclina en 3D (rotateY) y se atenúa al salir/entrar.
        const x = -d * 100;
        const scale = 1 - ease * 0.16; // el activo 1, los vecinos retroceden
        const rotY = sd * 9; // giro 3D (entrante/saliente "voltean")
        const t = `translate3d(${x.toFixed(3)}%,0,0) scale(${scale.toFixed(
          3
        )}) rotateY(${rotY.toFixed(2)}deg)`;
        if (t !== cc.t) (cc.t = t), (p.style.transform = t);
        const z = String(1000 - Math.round(ad * 1000));
        if (z !== cc.z) (cc.z = z), (p.style.zIndex = z);
        const pe = ad < 0.5 ? "auto" : "none";
        if (pe !== cc.pe) (cc.pe = pe), (p.style.pointerEvents = pe);
        const o = (1 - ease * 0.55).toFixed(3);
        if (o !== cc.o) (cc.o = o), (p.style.opacity = o);
        // Media propia del proyecto (si existe): parallax lento de profundidad.
        const pbg = refs[i].pbg;
        if (pbg) {
          const v = `translateX(${(d * 40).toFixed(1)}px) scale(1.1)`;
          if (v !== sc.pbg) (sc.pbg = v), (pbg.style.transform = v);
        }
        // Texto fantasma de fondo: parallax MUY fuerte + estiramiento.
        const gh = refs[i].gh;
        if (gh) {
          const v = `translate(-50%,-50%) translateX(${(d * -300).toFixed(
            0
          )}px) skewX(${(vel * -9).toFixed(2)}deg) scaleX(${(
            1 + av * 0.18
          ).toFixed(3)})`;
          if (v !== sc.gh) (sc.gh = v), (gh.style.transform = v);
        }
        // Emblema (primer plano): parallax fuerte adelantado + escala + giro.
        const em = refs[i].em;
        if (em) {
          const v = `translateX(${(d * -170).toFixed(0)}px) scale(${(
            1 - ease * 0.22
          ).toFixed(3)}) rotate(${(sd * 4).toFixed(2)}deg)`;
          if (v !== sc.em) (sc.em = v), (em.style.transform = v);
        }
        // Meta (izq): entra con overshoot + skew + fade.
        const mt = refs[i].mt;
        if (mt) {
          const v = `translateX(${(d * -110).toFixed(0)}px) skewX(${(
            vel * -5
          ).toFixed(2)}deg)`;
          if (v !== sc.mt) (sc.mt = v), (mt.style.transform = v);
          const mo = (1 - ease).toFixed(3);
          if (mo !== sc.mto) (sc.mto = mo), (mt.style.opacity = mo);
        }
        const ds = refs[i].ds;
        if (ds) {
          const v = `translateX(${(d * 130).toFixed(0)}px) skewX(${(
            vel * -5
          ).toFixed(2)}deg)`;
          if (v !== sc.ds) (sc.ds = v), (ds.style.transform = v);
          const dOp = (1 - ease).toFixed(3);
          if (dOp !== sc.dso) (sc.dso = dOp), (ds.style.opacity = dOp);
        }
        const hc = refs[i].hc;
        if (hc) {
          const v = `translateX(${(d * -70).toFixed(0)}px) skewX(${(
            vel * -3
          ).toFixed(2)}deg)`;
          if (v !== sc.hc) (sc.hc = v), (hc.style.transform = v);
        }
      }
      const near = Math.round(cur);
      if (near !== lastNear) {
        lastNear = near;
        navs.forEach((a, idx) => a.classList.toggle("on", idx + 1 === near));
      }
      // Al asentarse, detenemos el bucle: no se recalcula ni repinta nada hasta
      // el próximo scroll/resize (que vuelve a llamar a ensureRunning()).
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    const onScroll = () => read();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    read();

    // click en nav: navega por scroll a ese panel
    const navClick = (a: HTMLElement) => {
      const i = Number(a.dataset.i);
      const total = pin!.offsetHeight - sticky.offsetHeight;
      window.scrollTo({
        top: pin!.offsetTop + (N > 1 ? i / (N - 1) : 0) * total,
        behavior: "smooth",
      });
    };
    const navHandlers = navs.map((a) => {
      const h = (e: Event) => {
        e.stopPropagation();
        navClick(a);
      };
      a.addEventListener("click", h);
      return [a, h] as const;
    });

    // click en sticky: abre el panel actual
    const stickyClick = () => {
      const a = Math.max(0, Math.min(N - 1, Math.round(cur) || 0));
      const el = panels[a];
      const href = el?.dataset.href;
      if (href) goHref(href);
    };
    sticky.addEventListener("click", stickyClick);

    // floating learn-more
    const fl = pin.querySelector<HTMLElement>(".floatlearn");
    const touch = window.matchMedia("(hover:none)").matches;
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    let flRaf = 0;
    if (fl) {
      if (touch) {
        fl.style.left = "50%";
        fl.style.top = "62%";
        const io = new IntersectionObserver(
          (es) =>
            es.forEach((x) => fl.classList.toggle("show", x.isIntersecting)),
          { threshold: 0.3 }
        );
        io.observe(sticky);
      } else {
        addEventListener("mousemove", onMove);
        let fx = mouse.x;
        let fy = mouse.y;
        const loop = () => {
          if (!alive) return;
          fx += (mouse.x - fx) * 0.18;
          fy += (mouse.y - fy) * 0.18;
          fl.style.left = fx + "px";
          fl.style.top = fy + "px";
          flRaf = requestAnimationFrame(loop);
        };
        const enter = () => fl.classList.add("show");
        const leave = () => fl.classList.remove("show");
        sticky.addEventListener("mouseenter", enter);
        sticky.addEventListener("mouseleave", leave);
        loop();
      }
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(flRaf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      removeEventListener("mousemove", onMove);
      sticky.removeEventListener("click", stickyClick);
      navHandlers.forEach(([a, h]) => a.removeEventListener("click", h));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, c.hero]);

  return (
    <section
      className="pin"
      id="trabajo"
      ref={pinRef}
      style={{ height: `${totalPanels * 112}vh` }}
    >
      <div className="pin-sticky">
        {/* Fondo continuo: un solo gradiente que se interpola entre proyectos. */}
        <div className="pin-bg" />
        <div className="casenav">
          <div className="casenav-inner">
            {projects.map((p, i) => (
              <a key={p.id} data-i={i + 1}>
                {p.name}
              </a>
            ))}
          </div>
        </div>

        {/* Panel 0: hero */}
        <div className="panel" data-href={c.hero.href}>
          <HeroHud />
          <div className="hero-center">
            <div className="eye">{c.hero.eyebrow}</div>
            <Typewriter
              texts={
                c.hero.titles && c.hero.titles.length
                  ? c.hero.titles
                  : [c.hero.title]
              }
            />
          </div>
          {c.hero.chips && c.hero.chips.length > 0 ? (
            <div className="hero-chips">
              {c.hero.chips.slice(0, 6).map((ch, i) => (
                <span className={`hero-chip hc-${i}`} key={i}>
                  {ch}
                </span>
              ))}
            </div>
          ) : null}
          <ScrollCue id="cir" variant="home" />
        </div>

        {/* Panels de proyectos */}
        {projects.map((p) => (
          <div className="panel" key={p.id} data-href={`/case-studies/${p.id}`}>
            {p.bg && p.bg.type !== "none" && p.bg.url ? (
              <div className="panel-bg">
                {p.bg.type === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={p.bg.poster || undefined}
                    src={p.bg.url}
                  />
                ) : (
                  <img src={p.bg.url} alt="" />
                )}
              </div>
            ) : null}
            <div className="pname-ghost">{p.ghost}</div>
            <div className="emblem">
              {p.img ? (
                <img src={p.img} alt="" />
              ) : (
                <div
                  className="mono"
                  style={{
                    background: `linear-gradient(140deg, ${p.accent}, ${p.gradB})`,
                  }}
                >
                  {p.mono}
                </div>
              )}
            </div>
            <div className="meta">
              <div className="plogo">
                {p.img ? <img src={p.img} alt="" /> : p.mono}
              </div>
              <div className="tags">
                {(p.tags || []).map((t, ti) => (
                  <span className="tag" key={ti}>
                    {t}
                  </span>
                ))}
              </div>
              <h2>{p.name}</h2>
            </div>
            <p className="desc">{p.desc}</p>
          </div>
        ))}

        <div className="floatlearn">
          <span className="ar">↗</span>
          <small>{c.ui.buttons.floatLearn}</small>
        </div>
      </div>
    </section>
  );
}
