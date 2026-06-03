import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";
import ScrollCue from "@/components/common/ScrollCue";

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
    const smooth = (e: number) => e * e * (3 - 2 * e);

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
      cur += (target - cur) * 0.09;
      if (Math.abs(target - cur) < 0.0008) cur = target;
      for (let i = 0; i < N; i++) {
        const d = cur - i;
        const ad = Math.min(Math.abs(d), 1);
        const op = 1 - smooth(ad);
        const p = panels[i];
        p.style.opacity = String(op);
        p.style.zIndex = String(Math.round(op * 1000));
        p.style.pointerEvents = op > 0.55 ? "auto" : "none";
        const em = p.querySelector<HTMLElement>(".emblem");
        if (em) em.style.transform = `translateY(${d * 55}px) scale(${1 - ad * 0.12})`;
        const gh = p.querySelector<HTMLElement>(".pname-ghost");
        if (gh) gh.style.transform = `translate(-50%,-50%) translateX(${d * -60}px)`;
        const mt = p.querySelector<HTMLElement>(".meta");
        if (mt) mt.style.transform = `translateY(${d * 70}px)`;
        const ds = p.querySelector<HTMLElement>(".desc");
        if (ds) ds.style.transform = `translateY(${d * 70}px)`;
      }
      const near = Math.round(cur);
      const frac = Math.abs(cur - near);
      if (navWrap) navWrap.style.opacity = String(Math.min(frac * 4, 1));
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
          <div className="hero-hud">
            <span className="corner c1" />
            <span className="corner c2" />
            <span className="corner c3" />
            <span className="corner c4" />
            <div className="col left">
              <span>
                62<sup>33</sup>
              </span>
              <span>59</span>
              <span>11</span>
              <span>49</span>
              <span>
                75<sup>23</sup>
              </span>
            </div>
            <div className="col right">
              <span>
                66<sup>74</sup>
              </span>
              <span>32</span>
              <span>15</span>
              <span>67</span>
              <span>
                33<sup>95</sup>
              </span>
            </div>
          </div>
          <div className="hero-center">
            <div className="eye">{c.hero.eyebrow}</div>
            <h1>{c.hero.title}</h1>
          </div>
          <ScrollCue id="cir" variant="home" />
        </div>

        {/* Panels de proyectos */}
        {projects.map((p) => (
          <div className="panel" key={p.id} data-href={`/case-studies/${p.id}`}>
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
