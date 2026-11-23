import * as THREE from "three";
import { lerp, ease } from "@/lib/math";

/* ============================================================
   The WebGL scene: three glass slabs, each carrying one layer of a
   solution drawn on its face (the screen people use, the intelligence
   behind it, the data underneath). This module is the only one that imports
   three.js and is loaded lazily, so the library ships in its own chunk.
   ============================================================ */

export interface SceneParams {
  /** Assembly progress 0..1 (0 = pieces floating apart, 1 = locked stack). */
  progress: number;
  /** True when the stack sits at the footer instead of the hero. */
  foot: boolean;
  /** Smoothed scroll velocity, spins the stack. */
  vel: number;
  mx: number;
  my: number;
}

export interface SceneApi {
  resize(): void;
  /** Renders a frame; returns the screen position of each layer. */
  draw(t: number, p: SceneParams): [number, number][];
  dispose(): void;
}

const S = 1024;
type Ctx = CanvasRenderingContext2D;

const rr = (c: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
};

const FACES: ((c: Ctx) => void)[] = [
  // The app screen.
  (c) => {
    c.fillStyle = "#edf3ff";
    c.fillRect(0, 0, S, S);
    c.fillStyle = "#0a1a3a";
    rr(c, 150, 130, 724, 64, 32);
    c.fill();
    c.fillStyle = "#3fa9f5";
    [190, 236, 282].forEach((x) => {
      c.beginPath();
      c.arc(x, 162, 11, 0, 7);
      c.fill();
    });
    const g = c.createLinearGradient(150, 230, 874, 500);
    g.addColorStop(0, "#3fa9f5");
    g.addColorStop(1, "#1247e6");
    c.fillStyle = g;
    rr(c, 150, 230, 724, 270, 30);
    c.fill();
    c.fillStyle = "rgba(255,255,255,.95)";
    rr(c, 196, 280, 330, 34, 17);
    c.fill();
    c.fillStyle = "rgba(255,255,255,.6)";
    rr(c, 196, 336, 230, 22, 11);
    c.fill();
    c.fillStyle = "#fff";
    rr(c, 196, 400, 170, 54, 27);
    c.fill();
    [150, 398, 646].forEach((x, i) => {
      c.fillStyle = "#fff";
      rr(c, x, 540, 228, 180, 24);
      c.fill();
      c.fillStyle = i === 1 ? "#1247e6" : "#3fa9f5";
      rr(c, x + 26, 566, 70, 70, 18);
      c.fill();
      c.fillStyle = "#c4d3ee";
      rr(c, x + 26, 660, 150, 16, 8);
      c.fill();
      rr(c, x + 26, 688, 100, 16, 8);
      c.fill();
    });
    c.strokeStyle = "#1247e6";
    c.lineWidth = 14;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    [
      [170, 860],
      [300, 820],
      [430, 842],
      [560, 784],
      [690, 800],
      [850, 748],
    ].forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.stroke();
  },
  // The node network.
  (c) => {
    const g = c.createRadialGradient(512, 512, 40, 512, 512, 720);
    g.addColorStop(0, "#3a7bff");
    g.addColorStop(1, "#0b2aa8");
    c.fillStyle = g;
    c.fillRect(0, 0, S, S);
    const P: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      P.push([512 + Math.cos(a) * 330, 512 + Math.sin(a) * 330]);
    }
    const Q: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.3;
      Q.push([512 + Math.cos(a) * 175, 512 + Math.sin(a) * 175]);
    }
    c.strokeStyle = "rgba(255,255,255,.5)";
    c.lineWidth = 5;
    P.forEach((p, i) => {
      const q = Q[Math.floor(i / 2)];
      const n = P[(i + 1) % 10];
      c.beginPath();
      c.moveTo(p[0], p[1]);
      c.lineTo(q[0], q[1]);
      c.moveTo(p[0], p[1]);
      c.lineTo(n[0], n[1]);
      c.stroke();
    });
    Q.forEach((q, i) => {
      const n = Q[(i + 1) % 5];
      c.beginPath();
      c.moveTo(q[0], q[1]);
      c.lineTo(512, 512);
      c.moveTo(q[0], q[1]);
      c.lineTo(n[0], n[1]);
      c.stroke();
    });
    c.fillStyle = "#bfe3ff";
    P.forEach((p) => {
      c.beginPath();
      c.arc(p[0], p[1], 17, 0, 7);
      c.fill();
    });
    c.fillStyle = "#fff";
    Q.forEach((q) => {
      c.beginPath();
      c.arc(q[0], q[1], 24, 0, 7);
      c.fill();
    });
    c.save();
    c.translate(512, 512);
    c.rotate(Math.PI / 4);
    c.shadowColor = "#fff";
    c.shadowBlur = 60;
    rr(c, -62, -62, 124, 124, 22);
    c.fill();
    c.restore();
  },
  // The data grid.
  (c) => {
    c.fillStyle = "#07142e";
    c.fillRect(0, 0, S, S);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const on = (i * 7 + j * 13) % 5 === 0;
        const mid = (i * 3 + j * 5) % 4 === 0;
        c.fillStyle = on ? "#36d6ff" : mid ? "#1d55b8" : "#102a55";
        rr(c, 112 + i * 82, 112 + j * 82, 62, 62, 14);
        c.fill();
      }
    }
    c.strokeStyle = "#36d6ff";
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(143, 225);
    c.lineTo(471, 225);
    c.lineTo(471, 553);
    c.lineTo(881, 553);
    c.moveTo(307, 881);
    c.lineTo(307, 717);
    c.lineTo(717, 717);
    c.stroke();
  },
];

/** Where each slab starts when the pieces float apart: x, y, z, rx, ry, rz. */
const FROM = [
  [-1.5, 1.25, -0.6, 0.7, 0.3, -0.5],
  [1.35, 0.1, 0.9, -0.4, 0.9, 0.35],
  [-0.5, -1.4, 0.4, 0.5, -0.6, 0.8],
];
const SIDES = [0xc9dbff, 0x1c5cf0, 0x0e2c6e];

export function createScene(canvas: HTMLCanvasElement): SceneApi {
  // The look was tuned in a build with linear output and no colour
  // management; keep that so the slabs read the same.
  THREE.ColorManagement.enabled = false;
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  r.outputColorSpace = THREE.LinearSRGBColorSpace;
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const sc = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  cam.position.set(0, 0, 9);

  const w = 1.05;
  const rd = 0.34;
  const sh = new THREE.Shape();
  sh.moveTo(-w + rd, -w);
  sh.lineTo(w - rd, -w);
  sh.quadraticCurveTo(w, -w, w, -w + rd);
  sh.lineTo(w, w - rd);
  sh.quadraticCurveTo(w, w, w - rd, w);
  sh.lineTo(-w + rd, w);
  sh.quadraticCurveTo(-w, w, -w, w - rd);
  sh.lineTo(-w, -w + rd);
  sh.quadraticCurveTo(-w, -w, -w + rd, -w);
  const geo = new THREE.ExtrudeGeometry(sh, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.07,
    bevelSegments: 10,
    curveSegments: 24,
  });
  geo.center();
  geo.rotateX(Math.PI / 2);

  const grp = new THREE.Group();
  const parts: THREE.Mesh[] = [];
  const disposables: { dispose(): void }[] = [geo];
  FACES.forEach((draw, i) => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = S;
    draw(cv.getContext("2d") as Ctx);
    const tx = new THREE.CanvasTexture(cv);
    tx.repeat.set(1 / (2 * w), 1 / (2 * w));
    tx.offset.set(0.5, 0.5);
    tx.anisotropy = r.capabilities.getMaxAnisotropy();
    const face = new THREE.MeshPhysicalMaterial({
      map: tx,
      emissive: 0xffffff,
      emissiveMap: tx,
      emissiveIntensity: 0.42,
      roughness: 0.22,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const side = new THREE.MeshPhysicalMaterial({
      color: SIDES[i],
      roughness: 0.16,
      metalness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    });
    disposables.push(tx, face, side);
    const m = new THREE.Mesh(geo, [face, side]);
    grp.add(m);
    parts.push(m);
  });
  sc.add(grp);

  // Light intensities are scaled by pi: current three.js uses physical units,
  // the values were tuned against the older convention.
  const PI = Math.PI;
  sc.add(new THREE.AmbientLight(0x2a49b8, 0.9 * PI));
  const d1 = new THREE.DirectionalLight(0xffffff, 1.5 * PI);
  d1.position.set(-3, 5, 6);
  sc.add(d1);
  const p1 = new THREE.PointLight(0x3fa9f5, 2.4 * PI * 0.8, 30, 0);
  p1.position.set(5, -2, 4);
  sc.add(p1);
  const p2 = new THREE.PointLight(0x1247e6, 3 * PI * 0.8, 30, 0);
  p2.position.set(-5, -4, -2);
  sc.add(p2);

  const v3 = new THREE.Vector3();
  let rotY = 0;
  let tiltX = 0;
  let tiltY = 0;

  const resize = () => {
    r.setSize(window.innerWidth, window.innerHeight, false);
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
  };
  resize();

  const draw = (t: number, p: SceneParams): [number, number][] => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const wide = W > 820;
    const a = ease(p.progress);
    const sp = wide ? 0.9 : 0.72;
    parts.forEach((m, i) => {
      const f = FROM[i];
      const fl = Math.sin(t * 0.0007 + i * 2.1) * 0.12 * (1 - a);
      m.position.set(f[0] * sp * (1 - a), lerp(f[1] * sp + fl, (1 - i) * 0.62, a), f[2] * (1 - a));
      m.rotation.set(
        f[3] * (1 - a),
        f[4] * (1 - a) + t * 0.00025 * (1 - a) * (i % 2 ? -1 : 1),
        f[5] * (1 - a)
      );
    });
    rotY += 0.0035 + p.vel * 0.0006;
    tiltX = lerp(tiltX, (p.my / H - 0.5) * 0.5, 0.05);
    tiltY = lerp(tiltY, (p.mx / W - 0.5) * 0.7, 0.05);
    grp.rotation.set(0.42 + tiltX, rotY + tiltY, -0.16);
    const halfW = (2.58 * W) / H;
    const s = (wide ? 0.8 : 0.4) * (p.foot ? 0.8 : 1);
    const gx = wide ? (p.foot ? halfW * 0.56 : halfW * 0.36) : a > 0.5 ? -0.45 * a : 0;
    grp.scale.setScalar(s);
    grp.position.set(gx, wide ? (p.foot ? 1.35 : 0.2) : p.foot ? 1.75 : 1.35, 0);
    grp.updateMatrixWorld();
    r.render(sc, cam);
    // Layer names sit beside the stack once it has locked together.
    return parts.map((m) => {
      v3.setFromMatrixPosition(m.matrixWorld).project(cam);
      return [
        (v3.x * 0.5 + 0.5) * W + ((s * 1.42) / (halfW * 2)) * W,
        (-v3.y * 0.5 + 0.5) * H,
      ];
    });
  };

  return {
    resize,
    draw,
    dispose() {
      disposables.forEach((d) => d.dispose());
      r.dispose();
    },
  };
}
