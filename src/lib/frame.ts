import { lerp } from "./math";

/**
 * One animation loop for everything that follows the scroll or the pointer.
 * Sections subscribe instead of each running their own requestAnimationFrame,
 * so scroll position, scroll velocity and pointer are read once per frame.
 *
 * Under prefers-reduced-motion the loop does not run at all: subscribers are
 * called once on load, on scroll and on resize, which is enough to keep the
 * static layout and the 3D stack in place.
 */
export interface FrameState {
  /** Scroll position. */
  y: number;
  vh: number;
  vw: number;
  /** Smoothed scroll velocity in px per frame. */
  vel: number;
  /** Pointer position. */
  mx: number;
  my: number;
  calm: boolean;
  /** True when the primary pointer hovers (mouse, trackpad). */
  fine: boolean;
}

type Subscriber = (t: number, s: FrameState) => void;

const media = (q: string) =>
  typeof window !== "undefined" && window.matchMedia(q).matches;

export const frame: FrameState = {
  y: 0,
  vh: 800,
  vw: 1200,
  vel: 0,
  mx: 0,
  my: 0,
  calm: media("(prefers-reduced-motion: reduce)"),
  fine: media("(hover: hover) and (pointer: fine)"),
};

const subs = new Set<Subscriber>();
let raf = 0;
let lastY = 0;
let running = false;

function onPointer(e: PointerEvent) {
  frame.mx = e.clientX;
  frame.my = e.clientY;
}

function step(t: number) {
  frame.y = window.scrollY;
  frame.vh = window.innerHeight;
  frame.vw = window.innerWidth;
  frame.vel = lerp(frame.vel, frame.y - lastY, 0.2);
  lastY = frame.y;
  subs.forEach((cb) => cb(t, frame));
}

function loop(t: number) {
  step(t);
  if (running) raf = requestAnimationFrame(loop);
}

const once = () => step(performance.now());

function start() {
  if (running) return;
  running = true;
  frame.mx = window.innerWidth / 2;
  frame.my = window.innerHeight / 2;
  lastY = window.scrollY;
  window.addEventListener("pointermove", onPointer, { passive: true });
  if (frame.calm) {
    window.addEventListener("scroll", once, { passive: true });
    window.addEventListener("resize", once);
    raf = requestAnimationFrame(once);
  } else {
    raf = requestAnimationFrame(loop);
  }
}

function stop() {
  running = false;
  cancelAnimationFrame(raf);
  window.removeEventListener("pointermove", onPointer);
  window.removeEventListener("scroll", once);
  window.removeEventListener("resize", once);
}

/** Calls `cb` every frame while subscribed. Returns the unsubscribe. */
export function subscribe(cb: Subscriber): () => void {
  subs.add(cb);
  start();
  return () => {
    subs.delete(cb);
    if (!subs.size) stop();
  };
}

/** Runs one frame now. For callers whose own state changed (a lazy module
 *  became ready) while the loop is idle under reduced motion. */
export function refresh() {
  if (running) once();
}
