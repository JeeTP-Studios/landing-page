import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";
import ScrollCue from "@/components/common/ScrollCue";
import Typewriter from "@/components/common/Typewriter";
import HeroHud from "./HeroHud";

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
    const panels = [...pin.querySelectorAll<HTMLElement>(".panel")];
    const navWrap = pin.querySelector<HTMLElement>(".casenav");
    const navs = [...pin.querySelectorAll<HTMLElement>(".casenav a")];
    const N = panels.length;
    let cur = 0;
    let target = 0;
    let raf = 0;
    let alive = true;

    function read() {
      const r = pin!.getBoundingClientRect();
      const total = pin!.offsetHeight - sticky.offsetHeight;
      target =
        (total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 0) * (N - 1);
    }
    function frame() {
      if (!alive) return;
      if (!isFinite(cur)) cur = 0;
      if (!isFinite(target)) target = 0;
      cur += (target - cur) * 0.105;
      if (Math.abs(target - cur) < 0.0006) cur = target;
      // Velocidad (con signo) para la deformación tipo "estiramiento" del texto.
      const vel = Math.max(-1, Math.min(1, (target - cur) * 3.2));
      for (let i = 0; i < N; i++) {
        const d = cur - i; // >0 = ya pasó (a la izquierda), <0 = siguiente (a la derecha)
        const ad = Math.min(Math.abs(d), 1);
        const p = panels[i];
        // SLIDE HORIZONTAL: el panel activo en 0, el siguiente a la derecha (+100%),
        // el anterior a la izquierda (-100%). Al scrollear, todo se desliza der→izq.
        const x = -d * 100;
        p.style.transform = `translate3d(${x.toFixed(3)}%,0,0)`;
        p.style.zIndex = String(1000 - Math.round(ad * 1000));
        p.style.pointerEvents = ad < 0.5 ? "auto" : "none";
        p.style.opacity = ad < 0.999 ? "1" : "0.999";
        // Parallax interno + deformación direccional (estira al entrar/salir).
        const em = p.querySelector<HTMLElement>(".emblem");
        if (em)
          em.style.transform = `translateX(${d * -64}px) scale(${(
            1 - ad * 0.1
          ).toFixed(3)})`;
        const gh = p.querySelector<HTMLElement>(".pname-ghost");
        if (gh)
          gh.style.transform = `translate(-50%,-50%) translateX(${
            d * -150
          }px) skewX(${(vel * -7).toFixed(2)}deg) scaleX(${(
            1 + Math.abs(vel) * 0.14
          ).toFixed(3)})`;
        const mt = p.querySelector<HTMLElement>(".meta");
        if (mt)
          mt.style.transform = `translateX(${d * -70}px) skewX(${(
            vel * -4
          ).toFixed(2)}deg)`;
        const ds = p.querySelector<HTMLElement>(".desc");
        if (ds)
          ds.style.transform = `translateX(${d * 80}px) skewX(${(
            vel * -4
          ).toFixed(2)}deg)`;
        const hc = p.querySelector<HTMLElement>(".hero-center");
        if (hc)
          hc.style.transform = `translateX(${d * -48}px) skewX(${(
            vel * -3
          ).toFixed(2)}deg)`;
      }
      const near = Math.round(cur);
      // El nav de proyectos se ve desde el hero y durante toda la sección;
      // desaparece solo cuando el pin se despinea (después de los proyectos).
      if (navWrap) navWrap.style.opacity = "1";
      navs.forEach((a, idx) => a.classList.toggle("on", idx + 1 === near));
      raf = requestAnimationFrame(frame);
    }

    const onScroll = () => read();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    read();
    raf = requestAnimationFrame(frame);

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
          <div
            className="panel-ov"
            style={{ background: grad(c.hero), opacity: c.hero.opacity }}
          />
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
            <div
              className="panel-ov"
              style={{ background: grad(p), opacity: p.opacity }}
            />
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
