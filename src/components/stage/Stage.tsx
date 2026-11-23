import { useEffect, useRef } from "react";
import { useSite } from "@/content/ContentContext";
import { refresh, subscribe } from "@/lib/frame";
import { clamp } from "@/lib/math";
import { stageTargets } from "./stageStore";
import type { SceneApi } from "./scene";

/**
 * Fixed WebGL backdrop, mounted once in the layout.
 *
 * Home: three glass slabs float apart in the hero, lock into a stack while the
 * manifesto is pinned, disappear behind the opaque middle of the page and come
 * back assembled at the footer. Other pages: the assembled stack appears only
 * at the footer. If WebGL is missing or fails, the canvas is dropped and the
 * blue glow stays on its own.
 */
export default function Stage() {
  const { stack } = useSite();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const glow = glowRef.current!;
    const tags = Array.from(tagsRef.current!.children) as HTMLElement[];
    let scene: SceneApi | null = null;
    let dead = false;
    let failed = false;

    // three.js is a separate chunk; fetch it once the page has settled.
    const load = () =>
      import("./scene")
        .then((m) => {
          if (dead) return;
          scene = m.createScene(canvas);
          refresh();
        })
        .catch(() => {
          failed = true;
          canvas.style.display = "none";
        });
    // Plain timeout: requestIdleCallback is missing in Safari.
    const timer = window.setTimeout(load, 150);

    const unsub = subscribe((t, s) => {
      const { hero, mani, footer } = stageTargets;
      const { y, vh } = s;
      const fr = footer?.getBoundingClientRect();
      const inFoot = !!fr && fr.top < vh * 0.75;

      let endFade = 0;
      let progress = 0;
      if (hero) {
        const anchor = (mani ?? hero).getBoundingClientRect();
        endFade = clamp((anchor.bottom - vh * 0.55) / (vh * 0.4), 0, 1);
        progress = mani
          ? clamp((y - vh * 0.25) / Math.max(1, mani.offsetHeight + hero.offsetHeight - vh * 1.9), 0, 1)
          : clamp(y / (vh * 0.7), 0, 1);
      }
      const vis = inFoot ? clamp((vh * 0.75 - fr!.top) / (vh * 0.4), 0, 1) : endFade;
      if (inFoot) progress = 1;
      if (s.calm) progress = 1;

      glow.style.opacity = String(vis);
      glow.style.setProperty("--gx", s.vw > 820 ? "72%" : "50%");
      glow.style.setProperty("--gy", s.vw > 820 ? "48%" : "32%");
      if (failed || !scene) {
        canvas.style.opacity = "0";
        return;
      }
      canvas.style.opacity = String(vis);
      if (vis < 0.02) {
        tags.forEach((el) => (el.style.opacity = "0"));
        return;
      }
      const pos = scene.draw(t, {
        progress,
        foot: inFoot,
        vel: s.vel,
        mx: s.mx,
        my: s.my,
      });
      const lo = inFoot ? 0 : vis * clamp((progress - 0.86) / 0.12, 0, 1);
      tags.forEach((el, i) => {
        el.style.opacity = String(lo);
        if (lo < 0.01 || !pos[i]) return;
        el.style.transform = `translate3d(${pos[i][0]}px,${pos[i][1]}px,0) translateY(-50%)`;
      });
    });

    const onResize = () => scene?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      dead = true;
      unsub();
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
      scene?.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="stage-gl" aria-hidden="true" />
      <div ref={glowRef} className="stage-glow" aria-hidden="true" />
      <div ref={tagsRef} className="stage-tags" aria-hidden="true">
        {stack.labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </>
  );
}
