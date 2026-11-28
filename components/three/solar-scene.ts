/**
 * Procedural 3D solar world, drawn with three.js. Nothing here is a photograph: the roof plant, the
 * charging canopy, the Easy Bikes, the ESS, the substation and the Case A IoT station are all built
 * from code, so every image on the site (and the stills used in the decks) is our own.
 *
 * Presets are camera views of two small worlds:
 *   site    - the Case C plant: factory roof array, ESS container, substation and the 100-bike canopy
 *   station - the Case A station: a small canopy, a 30 kWh cabinet, an ESP32 mast and a live dashboard
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Preset = "hub" | "plant" | "rooftop" | "fleet" | "charger" | "station";
export type Anchor = { id: string; x: number; y: number; on: boolean };
export type SceneOptions = {
  preset: Preset;
  motion: boolean;
  /** Shift the picture horizontally, as a fraction of the width (positive moves the subject right). */
  shift?: number;
  /** Widen (>1) or narrow the lens of the preset. */
  fovScale?: number;
  /** Draw the sun disc, halo and rays (stills); the live hero leaves the sun to the page sky. */
  sunDisc?: boolean;
  /** Where the sun sits in the picture, in normalised device coordinates (-1..1). */
  sun?: [number, number];
  /** Render a fixed frame for a screenshot (no loop, preserved drawing buffer). */
  still?: boolean;
  onFrame?: (anchors: Anchor[]) => void;
  onReady?: () => void;
};
export type SceneHandle = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  setActive: (on: boolean) => void;
  dispose: () => void;
};

type View = { pos: [number, number, number]; look: [number, number, number]; fov: number; push: [number, number, number]; sun: [number, number] };
const VIEWS: Record<Preset, View> = {
  hub: { pos: [17, 8.5, 27], look: [-1, 3.2, -1], fov: 34, push: [-5, -2.2, -8], sun: [0.55, 0.5] },
  plant: { pos: [38, 31, 40], look: [0, 1, -5], fov: 32, push: [-6, -6, -8], sun: [0.72, 0.9] },
  rooftop: { pos: [12, 14.5, 4], look: [-2, 6, -14], fov: 40, push: [-2, -1, -3], sun: [0.55, 0.5] },
  fleet: { pos: [-13, 2.3, 15.5], look: [3, 1.5, 5.5], fov: 38, push: [3, 0, -3], sun: [0.55, 0.5] },
  charger: { pos: [4.6, 1.9, 11.2], look: [1.1, 1.15, 5.6], fov: 34, push: [-1, 0, -1.5], sun: [0.62, 0.78] },
  station: { pos: [9, 5.2, 11.5], look: [0, 2.1, 0], fov: 36, push: [-2.5, -1.2, -3], sun: [0.5, 0.6] },
};

/* ------------------------------------------------------------------ small helpers */

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (g) draw(g);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function glowTexture(inner: string, outer: string) {
  return canvasTexture(256, 256, (g) => {
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, inner);
    r.addColorStop(0.25, outer);
    r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
  });
}

const std = (color: number, metalness = 0.2, roughness = 0.6, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
const glow = (color: number, intensity = 2) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, cast = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}
const rbox = (w: number, h: number, d: number, r = 0.06) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2));

/* ------------------------------------------------------------------ textures */

function panelTexture() {
  // JINKO Tiger Neo layout: 6 x 22 half cells, split in the middle
  return canvasTexture(330, 690, (g) => {
    g.fillStyle = "#0c1424";
    g.fillRect(0, 0, 330, 690);
    const cw = 330 / 6;
    const ch = 690 / 22.6;
    for (let c = 0; c < 6; c++) {
      for (let r = 0; r < 22; r++) {
        const x = c * cw + 2;
        const y = r * ch + (r >= 11 ? ch * 0.6 : 0) + 2;
        const grd = g.createLinearGradient(x, y, x + cw, y + ch);
        grd.addColorStop(0, "#26498c");
        grd.addColorStop(0.55, "#163570");
        grd.addColorStop(1, "#0f2552");
        g.fillStyle = grd;
        g.fillRect(x, y, cw - 4, ch - 4);
        g.strokeStyle = "rgba(190,205,230,0.28)";
        g.lineWidth = 1;
        for (let b = 1; b <= 4; b++) {
          g.beginPath();
          g.moveTo(x + ((cw - 4) * b) / 5, y);
          g.lineTo(x + ((cw - 4) * b) / 5, y + ch - 4);
          g.stroke();
        }
      }
    }
  });
}

function groundTexture() {
  const t = canvasTexture(1024, 1024, (g) => {
    g.fillStyle = "#0c1320";
    g.fillRect(0, 0, 1024, 1024);
    // asphalt grain
    for (let i = 0; i < 9000; i++) {
      const v = 20 + Math.random() * 26;
      g.fillStyle = `rgba(${v},${v + 6},${v + 16},0.35)`;
      g.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }
    g.strokeStyle = "rgba(120,150,200,0.035)";
    g.lineWidth = 2;
    for (let k = 0; k <= 1024; k += 64) {
      g.beginPath();
      g.moveTo(k, 0);
      g.lineTo(k, 1024);
      g.moveTo(0, k);
      g.lineTo(1024, k);
      g.stroke();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 10);
  return t;
}

function radialAlpha() {
  return canvasTexture(
    512,
    512,
    (g) => {
      const r = g.createRadialGradient(256, 256, 40, 256, 256, 256);
      r.addColorStop(0, "#ffffff");
      r.addColorStop(0.55, "#bbbbbb");
      r.addColorStop(1, "#000000");
      g.fillStyle = r;
      g.fillRect(0, 0, 512, 512);
    },
    false
  );
}

function facadeTexture() {
  return canvasTexture(1024, 256, (g) => {
    g.fillStyle = "#3b4659";
    g.fillRect(0, 0, 1024, 256);
    // ribbed cladding
    for (let x = 0; x < 1024; x += 12) {
      g.fillStyle = "rgba(255,255,255,0.05)";
      g.fillRect(x, 0, 3, 256);
      g.fillStyle = "rgba(0,0,0,0.12)";
      g.fillRect(x + 6, 0, 2, 256);
    }
    // clerestory window band
    g.fillStyle = "#151d2c";
    g.fillRect(0, 34, 1024, 30);
    for (let x = 0; x < 1024; x += 64) {
      const lit = (x / 64) % 3 !== 1;
      g.fillStyle = lit ? "rgba(246,195,90,0.75)" : "rgba(40,55,80,0.9)";
      g.fillRect(x + 4, 38, 56, 22);
    }
    // two roller doors
    for (const x of [180, 700]) {
      g.fillStyle = "#283246";
      g.fillRect(x, 150, 150, 106);
      g.fillStyle = "rgba(255,255,255,0.06)";
      for (let y = 154; y < 256; y += 8) g.fillRect(x, y, 150, 2);
    }
  });
}

function essTexture(label: string, sub: string) {
  return canvasTexture(1024, 440, (g) => {
    g.fillStyle = "#e9edf3";
    g.fillRect(0, 0, 1024, 440);
    g.fillStyle = "#cfd6e0";
    for (let x = 0; x < 1024; x += 26) g.fillRect(x, 0, 9, 440);
    g.fillStyle = "#0a2540";
    g.fillRect(60, 60, 380, 150);
    g.fillStyle = "#f5a524";
    g.fillRect(60, 60, 14, 150);
    g.fillStyle = "#ffffff";
    g.font = "bold 64px Arial";
    g.fillText(label, 96, 140);
    g.font = "32px Arial";
    g.fillStyle = "#a9b8cc";
    g.fillText(sub, 96, 188);
    g.strokeStyle = "#9aa6b6";
    g.lineWidth = 4;
    g.strokeRect(560, 40, 190, 360);
    g.strokeRect(770, 40, 190, 360);
    g.fillStyle = "#7c8796";
    g.fillRect(730, 200, 10, 60);
    g.fillRect(780, 200, 10, 60);
  });
}

function dashboardTexture() {
  return canvasTexture(768, 448, (g) => {
    g.fillStyle = "rgba(8,18,36,0.92)";
    g.fillRect(0, 0, 768, 448);
    g.strokeStyle = "rgba(125,211,252,0.7)";
    g.lineWidth = 3;
    g.strokeRect(4, 4, 760, 440);
    g.fillStyle = "#7dd3fc";
    g.font = "bold 30px Arial";
    g.fillText("Station · live data", 30, 54);
    g.fillStyle = "#a9b8cc";
    g.font = "22px Arial";
    g.fillText("ESP32 → ThingSpeak", 30, 88);
    // PV bars
    const pv = [0, 0, 0.05, 0.2, 0.42, 0.63, 0.8, 0.92, 0.97, 0.9, 0.74, 0.52, 0.3, 0.1, 0];
    pv.forEach((v, i) => {
      g.fillStyle = "rgba(245,165,36,0.85)";
      g.fillRect(34 + i * 30, 380 - v * 220, 20, v * 220);
    });
    // SOC line
    g.strokeStyle = "#2dd4bf";
    g.lineWidth = 5;
    g.beginPath();
    const soc = [0.42, 0.4, 0.4, 0.43, 0.5, 0.58, 0.66, 0.73, 0.78, 0.8, 0.8, 0.79, 0.76, 0.72, 0.7];
    soc.forEach((v, i) => (i ? g.lineTo(44 + i * 30, 380 - v * 240) : g.moveTo(44, 380 - v * 240)));
    g.stroke();
    g.fillStyle = "#ffffff";
    g.font = "bold 64px Arial";
    g.fillText("78%", 520, 200);
    g.fillStyle = "#a9b8cc";
    g.font = "24px Arial";
    g.fillText("state of charge", 520, 236);
    g.fillStyle = "#2dd4bf";
    g.font = "bold 40px Arial";
    g.fillText("26.4 °C", 520, 320);
    g.fillStyle = "#a9b8cc";
    g.font = "24px Arial";
    g.fillText("pack temperature", 520, 352);
  });
}

/* ------------------------------------------------------------------ models */

type Mats = ReturnType<typeof makeMaterials>;
function makeMaterials() {
  const tex = panelTexture();
  return {
    panelTex: tex,
    glass: new THREE.MeshPhysicalMaterial({
      map: tex,
      emissiveMap: tex,
      emissive: 0xffffff,
      emissiveIntensity: 0.16,
      metalness: 0.3,
      roughness: 0.34,
      clearcoat: 0.45,
      clearcoatRoughness: 0.3,
    }),
    alu: std(0xc9d1dc, 0.9, 0.32),
    steel: std(0xe4e9f0, 0.55, 0.35),
    white: std(0xeef2f7, 0.15, 0.45),
    navy: std(0x0a2540, 0.3, 0.5),
    dark: std(0x1a1f29, 0.3, 0.75),
    rubber: std(0x0b0d11, 0, 0.92),
    chrome: std(0xd5dce6, 1, 0.22),
    concrete: std(0x566275, 0.05, 0.85),
    amber: glow(0xf5a524, 2.4),
    cyan: glow(0x38bdf8, 1.8),
    green: glow(0x34d399, 2.2),
    red: glow(0xef4444, 1.6),
    head: glow(0xfff4d6, 2.6),
    halo: new THREE.SpriteMaterial({ map: glowTexture("rgba(255,236,190,0.9)", "rgba(245,165,36,0.35)"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
    windshield: new THREE.MeshPhysicalMaterial({ color: 0x9fc6ff, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.32 }),
    foliage: std(0x1d5236, 0, 0.85, { flatShading: true }),
    foliage2: std(0x266b45, 0, 0.85, { flatShading: true }),
    trunk: std(0x3b2a1c, 0, 0.9),
  };
}

/** Instanced solar modules: aluminium frame plus cell glass. */
function panels(m: Mats, list: { p: THREE.Vector3; tilt: number; yaw?: number }[]) {
  const W = 1.134;
  const L = 2.382;
  const frameGeo = new THREE.BoxGeometry(W, 0.04, L);
  const glassGeo = new THREE.PlaneGeometry(W - 0.05, L - 0.05);
  glassGeo.rotateX(-Math.PI / 2);
  glassGeo.translate(0, 0.022, 0);
  const frame = new THREE.InstancedMesh(frameGeo, m.alu, list.length);
  const glass = new THREE.InstancedMesh(glassGeo, m.glass, list.length);
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const mat = new THREE.Matrix4();
  const one = new THREE.Vector3(1, 1, 1);
  list.forEach((it, i) => {
    e.set(it.tilt, it.yaw ?? 0, 0, "YXZ");
    q.setFromEuler(e);
    mat.compose(it.p, q, one);
    frame.setMatrixAt(i, mat);
    glass.setMatrixAt(i, mat);
  });
  frame.castShadow = glass.castShadow = true;
  frame.receiveShadow = true;
  glass.receiveShadow = false;
  const g = new THREE.Group();
  g.add(frame, glass);
  return g;
}

function easyBike(m: Mats, color: number) {
  // A Bangladeshi Easy Bike: rounded nose with one front wheel, driver bench, open passenger bay with a
  // painted skirt, rear panel with tail lights, and a full-length roof on chrome posts.
  const g = new THREE.Group();
  const paint = std(color, 0.5, 0.32);
  const roofPaint = std(color, 0.35, 0.4);
  g.add(mesh(rbox(1.02, 0.12, 2.55, 0.04), m.dark, 0, 0.4, -0.1));
  // painted skirt along the passenger bay
  for (const x of [0.5, -0.5]) g.add(mesh(rbox(0.06, 0.46, 1.75, 0.03), paint, x, 0.68, -0.42));
  g.add(mesh(rbox(1.06, 0.95, 0.08, 0.04), paint, 0, 0.92, -1.32));
  g.add(mesh(rbox(1.08, 0.1, 0.14, 0.04), m.chrome, 0, 0.48, -1.36));
  // nose fairing
  const nose = new THREE.CylinderGeometry(0.3, 0.4, 0.95, 28, 1, false, -Math.PI / 2, Math.PI);
  const n = mesh(nose, paint, 0, 0.86, 0.86);
  n.scale.set(1.2, 1, 0.9);
  g.add(n);
  g.add(mesh(rbox(0.96, 0.95, 0.12, 0.05), paint, 0, 0.86, 0.84));
  g.add(mesh(rbox(0.92, 0.1, 0.42, 0.04), m.dark, 0, 1.36, 0.92));
  // benches
  g.add(mesh(rbox(0.9, 0.12, 0.42, 0.04), m.dark, 0, 1.0, 0.45));
  g.add(mesh(rbox(0.9, 0.4, 0.08, 0.04), m.dark, 0, 1.22, 0.24));
  g.add(mesh(rbox(0.94, 0.12, 0.46, 0.04), m.dark, 0, 0.98, -0.62));
  g.add(mesh(rbox(0.94, 0.44, 0.08, 0.04), m.dark, 0, 1.2, -0.38));
  // windshield and roof
  const ws = mesh(new THREE.PlaneGeometry(0.86, 0.6), m.windshield, 0, 1.72, 1.02, false);
  ws.rotation.x = -0.22;
  g.add(ws);
  g.add(mesh(rbox(1.16, 0.08, 2.5, 0.04), roofPaint, 0, 2.04, -0.16));
  g.add(mesh(rbox(1.2, 0.03, 2.56, 0.015), m.white, 0, 1.99, -0.16));
  const post = new THREE.CylinderGeometry(0.024, 0.024, 1.0, 10);
  for (const [x, z] of [
    [0.52, -1.3],
    [-0.52, -1.3],
    [0.52, -0.2],
    [-0.52, -0.2],
    [0.4, 1.02],
    [-0.4, 1.02],
  ])
    g.add(mesh(post, m.chrome, x, 1.5, z));
  const bar = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.7, 8), m.chrome, 0, 1.46, 0.98);
  bar.rotation.z = Math.PI / 2;
  g.add(bar);
  // wheels with fenders
  const wheel = new THREE.CylinderGeometry(0.26, 0.26, 0.14, 28);
  wheel.rotateZ(Math.PI / 2);
  const hub = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 16);
  hub.rotateZ(Math.PI / 2);
  const fender = new THREE.CylinderGeometry(0.31, 0.31, 0.16, 20, 1, true, -Math.PI / 2, Math.PI);
  fender.rotateZ(Math.PI / 2);
  for (const [x, z] of [
    [0.58, -0.9],
    [-0.58, -0.9],
    [0, 1.28],
  ]) {
    g.add(mesh(wheel, m.rubber, x, 0.26, z));
    g.add(mesh(hub, m.chrome, x, 0.26, z));
    g.add(mesh(fender, paint, x, 0.27, z));
  }
  g.add(mesh(new THREE.CircleGeometry(0.08, 20), m.head, 0, 1.08, 1.235, false));
  for (const x of [0.4, -0.4]) g.add(mesh(new THREE.BoxGeometry(0.14, 0.08, 0.03), m.red, x, 1.0, -1.37, false));
  return g;
}

function pillar(m: Mats) {
  const g = new THREE.Group();
  g.add(mesh(rbox(0.62, 0.08, 0.44, 0.03), m.dark, 0, 0.04, 0));
  g.add(mesh(rbox(0.5, 1.56, 0.32, 0.08), m.white, 0, 0.82, 0));
  g.add(mesh(rbox(0.42, 1.0, 0.03, 0.02), m.navy, 0, 0.98, 0.162));
  const screen = mesh(new THREE.PlaneGeometry(0.28, 0.19), m.cyan, 0, 1.2, 0.18, false);
  g.add(screen);
  const ring = mesh(new THREE.TorusGeometry(0.07, 0.016, 10, 28), m.amber, 0, 0.82, 0.18, false);
  g.add(ring);
  const halo = new THREE.Sprite(m.halo);
  halo.scale.set(0.7, 0.7, 1);
  halo.position.set(0, 0.82, 0.22);
  g.add(halo);
  g.add(mesh(new THREE.BoxGeometry(0.035, 1.2, 0.02), m.amber, 0.255, 0.86, 0.1, false));
  return { g, ring };
}

function cable(m: Mats, a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().lerp(b, 0.5);
  mid.y -= 0.45;
  const curve = new THREE.CatmullRomCurve3([a, mid, b]);
  return mesh(new THREE.TubeGeometry(curve, 24, 0.022, 8, false), m.dark, 0, 0, 0);
}

function tree(m: Mats, s = 1) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.12 * s, 0.18 * s, 2.2 * s, 8), m.trunk, 0, 1.1 * s, 0));
  const leaf = new THREE.IcosahedronGeometry(1.0 * s, 1);
  g.add(mesh(leaf, m.foliage, 0, 2.9 * s, 0));
  g.add(mesh(leaf, m.foliage2, 0.62 * s, 2.45 * s, 0.25 * s));
  g.add(mesh(leaf, m.foliage2, -0.55 * s, 2.5 * s, -0.35 * s));
  return g;
}

/** Canopy with steel columns and a tilted deck of modules. Returns the group and the deck top height. */
function canopy(m: Mats, x0: number, x1: number, z: number, depthRows: number, h: number) {
  const g = new THREE.Group();
  const span = x1 - x0;
  const cols = Math.max(2, Math.round(span / 6) + 1);
  for (let i = 0; i < cols; i++) {
    const x = x0 + (span * i) / (cols - 1);
    g.add(mesh(new THREE.CylinderGeometry(0.13, 0.16, h, 14), m.steel, x, h / 2, z - 0.6));
    g.add(mesh(rbox(0.5, 0.1, 0.5, 0.03), m.concrete, x, 0.05, z - 0.6));
    const arm = mesh(rbox(0.16, 0.2, depthRows * 2.5 + 0.6, 0.04), m.steel, x, h + 0.05, z);
    arm.rotation.x = 0.1;
    g.add(arm);
  }
  g.add(mesh(rbox(span + 0.6, 0.22, 0.24, 0.04), m.steel, (x0 + x1) / 2, h - 0.05, z - 0.6));
  // LED strip under the beam
  g.add(mesh(new THREE.BoxGeometry(span, 0.04, 0.06), m.amber, (x0 + x1) / 2, h - 0.2, z - 0.45, false));
  const list: { p: THREE.Vector3; tilt: number }[] = [];
  const n = Math.floor(span / 1.16);
  for (let r = 0; r < depthRows; r++) {
    for (let i = 0; i <= n; i++) {
      const zz = z - ((depthRows - 1) * 2.42) / 2 + r * 2.42;
      list.push({ p: new THREE.Vector3(x0 + i * 1.16, h + 0.32 - (zz - z) * 0.1, zz), tilt: 0.1 });
    }
  }
  g.add(panels(m, list));
  return g;
}

/* ------------------------------------------------------------------ energy particles */

class Flow {
  points: THREE.Points;
  private curves: THREE.CatmullRomCurve3[];
  private seeds: Float32Array;
  private which: Uint16Array;
  private pos: Float32Array;
  constructor(curves: THREE.CatmullRomCurve3[], perCurve: number, color: number, size: number, tex: THREE.Texture) {
    this.curves = curves;
    const n = curves.length * perCurve;
    this.pos = new Float32Array(n * 3);
    this.seeds = new Float32Array(n);
    this.which = new Uint16Array(n);
    for (let i = 0; i < n; i++) {
      this.which[i] = Math.floor(i / perCurve);
      this.seeds[i] = (i % perCurve) / perCurve + Math.random() * 0.02;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    const mat = new THREE.PointsMaterial({ color, size, map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.update(0);
  }
  update(t: number) {
    const v = new THREE.Vector3();
    for (let i = 0; i < this.seeds.length; i++) {
      const c = this.curves[this.which[i]];
      const u = (this.seeds[i] + t * 0.12) % 1;
      c.getPointAt(u, v);
      this.pos[i * 3] = v.x;
      this.pos[i * 3 + 1] = v.y;
      this.pos[i * 3 + 2] = v.z;
    }
    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}

const P = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** A faint glowing conductor that the energy particles travel along. */
function wire(c: THREE.CatmullRomCurve3, r = 0.035, color = 0xf5a524) {
  const w = new THREE.Mesh(
    new THREE.TubeGeometry(c, 96, r, 6, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  return w;
}

/* ------------------------------------------------------------------ worlds */

type World = { root: THREE.Group; flows: Flow[]; pulses: THREE.Mesh[]; spin: THREE.Object3D[]; anchors: { id: string; p: THREE.Vector3 }[]; dash?: THREE.Mesh };

function siteWorld(m: Mats, spark: THREE.Texture): World {
  const root = new THREE.Group();
  const pulses: THREE.Mesh[] = [];
  // factory with the roof plant
  const facade = facadeTexture();
  facade.wrapS = THREE.RepeatWrapping;
  facade.repeat.set(1, 1);
  const wall = std(0x3a4559, 0.1, 0.8);
  const roofMat = std(0x2b3446, 0.1, 0.9);
  const front = new THREE.MeshStandardMaterial({ map: facade, emissiveMap: facade, emissive: 0xffffff, emissiveIntensity: 0.22, roughness: 0.8 });
  const building = new THREE.Mesh(new THREE.BoxGeometry(30, 6, 14), [wall, wall, roofMat, wall, front, wall]);
  building.position.set(0, 3, -14);
  building.castShadow = building.receiveShadow = true;
  root.add(building);
  for (const [x, z, w, d] of [
    [0, -7.15, 30.2, 0.3],
    [0, -20.85, 30.2, 0.3],
    [15.05, -14, 0.3, 14],
    [-15.05, -14, 0.3, 14],
  ])
    root.add(mesh(new THREE.BoxGeometry(w, 0.5, d), wall, x, 6.25, z));
  const roof: { p: THREE.Vector3; tilt: number }[] = [];
  for (let r = 0; r < 6; r++) for (let i = 0; i < 24; i++) roof.push({ p: P(-13.3 + i * 1.16, 6.55, -19 + r * 2.05), tilt: 0.26 });
  root.add(panels(m, roof));
  // inverters on the front wall
  for (let i = 0; i < 5; i++) {
    root.add(mesh(rbox(0.7, 0.9, 0.26, 0.04), m.white, 7 + i * 1.1, 2.4, -6.85));
    root.add(mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), m.green, 7 + i * 1.1, 2.62, -6.71, false));
  }
  // ESS container
  const ess = essTexture("ESS 100 kW", "hybrid storage");
  const essFront = new THREE.MeshStandardMaterial({ map: ess, roughness: 0.6, metalness: 0.2 });
  const essBox = new THREE.Mesh(new THREE.BoxGeometry(6, 2.6, 2.44), [m.white, m.white, m.white, m.white, essFront, m.white]);
  essBox.position.set(17, 1.3, -1.5);
  essBox.castShadow = essBox.receiveShadow = true;
  root.add(essBox);
  for (let i = 0; i < 3; i++) {
    const led = mesh(new THREE.BoxGeometry(0.1, 0.1, 0.02), m.green, 18.2 + i * 0.3, 2.2, -0.27, false);
    root.add(led);
    pulses.push(led);
  }
  // substation
  root.add(mesh(new THREE.BoxGeometry(5.6, 0.2, 4.6), m.concrete, 23, 0.1, -10));
  root.add(mesh(rbox(2.6, 2.3, 1.7, 0.06), std(0x8995a6, 0.5, 0.45), 23, 1.35, -10));
  for (let i = 0; i < 9; i++) root.add(mesh(new THREE.BoxGeometry(0.05, 1.8, 0.5), std(0x7a8698, 0.5, 0.5), 21.6 + i * 0.35, 1.3, -9.0));
  for (const x of [22.2, 23, 23.8]) {
    root.add(mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.8, 12), std(0xb45309, 0.1, 0.4), x, 2.9, -10));
  }
  for (const [x, z] of [
    [20.3, -12.2],
    [25.7, -12.2],
    [20.3, -7.8],
    [25.7, -7.8],
  ])
    root.add(mesh(new THREE.BoxGeometry(0.08, 2.0, 0.08), m.steel, x, 1.0, z));
  for (const [x, z, w, d] of [
    [23, -12.2, 5.4, 0.03],
    [23, -7.8, 5.4, 0.03],
    [20.3, -10, 0.03, 4.4],
    [25.7, -10, 0.03, 4.4],
  ])
    root.add(mesh(new THREE.BoxGeometry(w, 1.6, d), new THREE.MeshStandardMaterial({ color: 0x9fb2cc, transparent: true, opacity: 0.18, metalness: 0.6, roughness: 0.4 }), x, 1.0, z, false));
  // the 100-bike charging canopy
  root.add(canopy(m, -11.6, 11.6, 6.2, 2, 3.7));
  const colors = [0x14a38b, 0x2f6fd6, 0xe9edf3, 0x14a38b, 0x2f6fd6, 0x14a38b, 0xe9edf3, 0x2f6fd6, 0x14a38b, 0x2f6fd6];
  const plugged = [0, 1, 2, 4, 5, 7, 8, 9];
  for (let i = 0; i < 10; i++) {
    const x = -10.2 + i * 2.27;
    const { g, ring } = pillar(m);
    g.position.set(x, 0, 4.4);
    root.add(g);
    pulses.push(ring);
    if (plugged.includes(i)) {
      const b = easyBike(m, colors[i]);
      b.position.set(x, 0, 6.85);
      root.add(b);
      root.add(cable(m, P(x + 0.2, 0.9, 4.58), P(x + 0.35, 0.95, 5.72)));
    }
  }
  // parking bays
  for (let i = 0; i <= 10; i++) root.add(mesh(new THREE.BoxGeometry(0.06, 0.01, 3.2), new THREE.MeshBasicMaterial({ color: 0x3b4a66 }), -11.35 + i * 2.27, 0.012, 7.1, false));
  // trees and lamp posts
  for (const [x, z, s] of [
    [-19, -4, 1.1],
    [-21, 4, 1.3],
    [21, 9, 1.2],
    [27, 2, 1],
    [-24, -12, 1.4],
    [29, -16, 1.2],
  ]) {
    const t = tree(m, s);
    t.position.set(x, 0, z);
    root.add(t);
  }
  // energy routes: roof -> inverters -> ground conduit -> ESS and the charging row; canopy -> columns -> pillars
  const C = (pts: THREE.Vector3[]) => new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.05);
  const curves = [
    C([P(9, 6.9, -12), P(9, 6.7, -7.4), P(9, 6.3, -7.0), P(9, 3.0, -6.8)]),
    C([P(11.4, 1.9, -6.7), P(11.4, 0.2, -6.5), P(11.6, 0.12, -6.2), P(11.6, 0.12, -1.7), P(12, 0.12, -1.5), P(13.9, 0.5, -1.5)]),
    C([P(7, 1.9, -6.7), P(7, 0.2, -6.5), P(7, 0.12, -6.2), P(7, 0.12, 3.2), P(6.6, 0.12, 3.5), P(-10.5, 0.12, 3.5)]),
    C([P(-6, 3.8, 5.6), P(-6, 0.3, 5.6), P(-6, 0.12, 5.2), P(-5.6, 0.12, 4.0), P(-3.4, 0.12, 4.0)]),
    C([P(6, 3.8, 5.6), P(6, 0.3, 5.6), P(6, 0.12, 5.2), P(6.4, 0.12, 4.0), P(9.2, 0.12, 4.0)]),
  ];
  const grid = [C([P(23, 1.2, -9.1), P(23, 0.12, -7.4), P(22.6, 0.12, -7.0), P(17.4, 0.12, -7.0), P(17, 0.12, -6.6), P(17, 0.4, -2.8)])];
  const gridFlow = new Flow(grid, 14, 0x60a5fa, 0.45, spark);
  root.add(gridFlow.points);
  grid.forEach((c) => root.add(wire(c, 0.035, 0x4f86f7)));
  const flows = [new Flow(curves, 30, 0xfcd34d, 0.5, spark), gridFlow];
  flows.forEach((f) => root.add(f.points));
  curves.forEach((c) => root.add(wire(c)));
  return {
    root,
    flows,
    pulses,
    spin: [],
    anchors: [
      { id: "roof", p: P(-4, 7.6, -15) },
      { id: "ess", p: P(17, 2.9, -1.5) },
      { id: "points", p: P(-5.66, 2.2, 4.4) },
      { id: "substation", p: P(23, 3.4, -10) },
    ],
  };
}

function stationWorld(m: Mats, spark: THREE.Texture): World {
  const root = new THREE.Group();
  const pulses: THREE.Mesh[] = [];
  root.add(canopy(m, -2.4, 2.4, 0.6, 2, 3.0));
  const bikes = [0x14a38b, 0x2f6fd6];
  [-1.2, 1.2].forEach((x, i) => {
    const { g, ring } = pillar(m);
    g.position.set(x, 0, -0.9);
    root.add(g);
    pulses.push(ring);
    const b = easyBike(m, bikes[i]);
    b.position.set(x, 0, 1.55);
    root.add(b);
    root.add(cable(m, P(x + 0.2, 0.9, -0.72), P(x + 0.35, 0.95, 0.42)));
  });
  // 30 kWh battery cabinet
  const cab = essTexture("30 kWh", "Li-ion · 80% limit");
  const cabFront = new THREE.MeshStandardMaterial({ map: cab, roughness: 0.6 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 0.9), [m.white, m.white, m.white, m.white, cabFront, m.white]);
  box.position.set(-4.0, 1.0, -0.4);
  box.castShadow = box.receiveShadow = true;
  root.add(box);
  // ESP32 mast with signal rings
  root.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.4, 12), m.steel, 4.0, 1.7, -0.2));
  root.add(mesh(rbox(0.5, 0.6, 0.22, 0.04), m.navy, 4.0, 2.1, -0.05));
  root.add(mesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), m.green, 4.12, 2.28, 0.07, false));
  root.add(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 6), m.chrome, 4.0, 3.75, -0.2));
  const spin: THREE.Object3D[] = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.018, 8, 40, Math.PI * 0.7),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    ring.position.set(4.0, 4.1, -0.2);
    ring.rotation.z = Math.PI * 0.15;
    ring.userData.phase = i / 3;
    root.add(ring);
    spin.push(ring);
  }
  // floating dashboard
  const dash = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 1.75),
    new THREE.MeshBasicMaterial({ map: dashboardTexture(), transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false })
  );
  dash.position.set(1.6, 5.4, -1.8);
  dash.rotation.y = -0.32;
  root.add(dash);
  for (const [x, z, s] of [
    [-9, -6, 1.1],
    [9, -7, 1.2],
    [-10, 3, 0.9],
    [12, -1, 1],
  ]) {
    const t = tree(m, s);
    t.position.set(x, 0, z);
    root.add(t);
  }
  const C = (pts: THREE.Vector3[]) => new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.05);
  const curves = [
    C([P(-2.4, 3.2, 0.0), P(-2.4, 0.3, 0.0), P(-2.6, 0.12, -0.2), P(-3.3, 0.12, -0.4), P(-3.3, 0.6, -0.4)]),
    C([P(-3.3, 0.5, -0.9), P(-3.1, 0.12, -1.3), P(-1.4, 0.12, -1.3), P(-1.2, 0.4, -1.1)]),
    C([P(-1.2, 0.12, -1.3), P(1.0, 0.12, -1.3), P(1.2, 0.4, -1.1)]),
  ];
  const data = [C([P(4.0, 2.4, 0.0), P(3.9, 3.6, -0.6), P(3.2, 4.8, -1.4), P(2.6, 5.1, -1.7)])];
  const dataFlow = new Flow(data, 12, 0x7dd3fc, 0.3, spark);
  root.add(dataFlow.points);
  data.forEach((c) => root.add(wire(c, 0.015, 0x38bdf8)));
  const flows = [new Flow(curves, 22, 0xfcd34d, 0.32, spark), dataFlow];
  flows.forEach((f) => root.add(f.points));
  curves.forEach((c) => root.add(wire(c, 0.02)));
  return {
    root,
    flows,
    pulses,
    spin,
    dash,
    anchors: [
      { id: "panels", p: P(0, 3.6, 0.6) },
      { id: "battery", p: P(-4, 2.3, -0.4) },
      { id: "iot", p: P(4, 3.9, -0.2) },
    ],
  };
}

/* ------------------------------------------------------------------ scene */

export function createSolarScene(canvas: HTMLCanvasElement, opts: SceneOptions): SceneHandle {
  const still = !!opts.still;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: still });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, still ? 2 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.55;
  scene.fog = new THREE.Fog(0x0b1630, 55, 150);

  const m = makeMaterials();
  const spark = glowTexture("rgba(255,250,220,1)", "rgba(252,211,77,0.55)");
  const isStation = opts.preset === "station";
  const world = isStation ? stationWorld(m, spark) : siteWorld(m, spark);
  scene.add(world.root);

  // ground
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(isStation ? 40 : 90, 64),
    new THREE.MeshStandardMaterial({ map: groundTexture(), alphaMap: radialAlpha(), transparent: true, roughness: 1, metalness: 0, color: 0x9aa6bb })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // light: low golden sun behind and to the right, cool sky fill
  // the camera first, so the sun can be placed inside the picture
  const view = VIEWS[opts.preset];
  const camera = new THREE.PerspectiveCamera(view.fov, 16 / 9, 0.1, 400);
  const basePos = new THREE.Vector3(...view.pos);
  const push = new THREE.Vector3(...view.push);
  const look = new THREE.Vector3(...view.look);
  camera.position.copy(basePos);
  camera.lookAt(look);
  camera.updateMatrixWorld();
  const [su, sv] = opts.sun ?? view.sun;
  const sunPos = new THREE.Vector3(su, sv, 0.5).unproject(camera).sub(camera.position).normalize().multiplyScalar(150).add(camera.position);
  const sunDir = sunPos.clone().normalize().multiplyScalar(80);
  sunDir.y = Math.max(sunDir.y, 22);
  const sun = new THREE.DirectionalLight(0xffd59a, 3.0);
  sun.position.copy(sunDir);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -45;
  sc.right = 45;
  sc.top = 45;
  sc.bottom = -45;
  sc.near = 10;
  sc.far = 200;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  const key = new THREE.DirectionalLight(0xbfd4ff, 1.15);
  key.position.set(-30, 25, 40);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0x8fb4ff, 0x1a1208, 0.75));

  // sun disc, halo and rays
  const sunGroup = new THREE.Group();
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture("rgba(255,214,140,0.9)", "rgba(245,158,11,0.32)"), blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  halo.scale.set(90, 90, 1);
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture("rgba(255,255,245,1)", "rgba(255,226,160,0.95)"), blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  core.scale.set(14, 14, 1);
  sunGroup.add(halo, core);
  sunGroup.position.copy(sunPos);
  sunGroup.visible = opts.sunDisc !== false;
  scene.add(sunGroup);
  const rayTex = canvasTexture(64, 512, (g) => {
    const l = g.createLinearGradient(0, 0, 0, 512);
    l.addColorStop(0, "rgba(255,220,150,0.55)");
    l.addColorStop(1, "rgba(255,220,150,0)");
    g.fillStyle = l;
    g.fillRect(0, 0, 64, 512);
  });
  const rays = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const ray = new THREE.Mesh(
      new THREE.PlaneGeometry(3 + (i % 3) * 2.5, 150),
      new THREE.MeshBasicMaterial({ map: rayTex, transparent: true, opacity: 0.07 + (i % 2) * 0.04, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
    );
    ray.geometry.translate(0, -75, 0);
    ray.rotation.z = -0.55 + i * 0.16;
    ray.userData.base = ray.rotation.z;
    rays.add(ray);
  }
  rays.position.copy(sunGroup.position);
  rays.lookAt(0, 0, 0);
  rays.visible = opts.sunDisc !== false;
  scene.add(rays);

  // floating motes
  const moteN = 160;
  const motePos = new Float32Array(moteN * 3);
  for (let i = 0; i < moteN; i++) {
    motePos[i * 3] = (Math.random() - 0.5) * 60;
    motePos[i * 3 + 1] = Math.random() * 18;
    motePos[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: 0xffe2a0, size: 0.18, map: spark, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(motes);


  let progress = 0;
  let px = 0;
  let py = 0;
  let sx = 0;
  let sy = 0;
  let active = true;
  let raf = 0;
  let disposed = false;
  const clock = new THREE.Clock();

  const tmp = new THREE.Vector3();
  const anchors: Anchor[] = world.anchors.map((a) => ({ id: a.id, x: 0, y: 0, on: false }));

  function resize() {
    const w = canvas.clientWidth || canvas.width;
    const h = canvas.clientHeight || canvas.height;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole subject in frame on narrow screens
    camera.fov = view.fov * (opts.fovScale ?? 1) * (camera.aspect < 1 ? 1.35 : camera.aspect < 1.4 ? 1.12 : 1);
    const shift = camera.aspect > 1.2 ? opts.shift ?? 0 : 0;
    if (shift) camera.setViewOffset(w, h, -shift * w, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }

  function frame() {
    const t = opts.motion && !still ? clock.getElapsedTime() : 1.4;
    sx += (px - sx) * 0.05;
    sy += (py - sy) * 0.05;
    const orbit = opts.motion && !still ? Math.sin(t * 0.12) * 0.9 : 0;
    camera.position.copy(basePos).addScaledVector(push, progress);
    camera.position.x += orbit + sx * 1.6;
    camera.position.y += -sy * 0.8;
    camera.lookAt(look);

    world.flows.forEach((f) => f.update(t));
    world.pulses.forEach((p, i) => {
      const mat = p.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.6 + Math.sin(t * 3 + i * 0.7) * 0.9;
    });
    world.spin.forEach((r) => {
      const ph = ((t * 0.5 + (r.userData.phase as number)) % 1) as number;
      r.scale.setScalar(0.6 + ph * 1.6);
      ((r as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - ph);
    });
    if (world.dash) world.dash.position.y = 5.4 + Math.sin(t * 0.8) * 0.12;
    rays.children.forEach((r, i) => {
      r.rotation.z = (r.userData.base as number) + Math.sin(t * 0.2 + i) * 0.04;
    });
    for (let i = 0; i < moteN; i++) {
      motePos[i * 3 + 1] += 0.008;
      if (motePos[i * 3 + 1] > 18) motePos[i * 3 + 1] = 0;
    }
    (moteGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    // sun sets a little as the reader scrolls
    sunGroup.position.y = sunPos.y - progress * 12;
    halo.material.opacity = 1 - progress * 0.35;

    renderer.render(scene, camera);

    if (opts.onFrame) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      world.anchors.forEach((a, i) => {
        tmp.copy(a.p).project(camera);
        anchors[i].x = (tmp.x * 0.5 + 0.5) * w;
        anchors[i].y = (-tmp.y * 0.5 + 0.5) * h;
        anchors[i].on = tmp.z < 1 && tmp.x > -0.95 && tmp.x < 0.95 && tmp.y > -0.95 && tmp.y < 0.95;
      });
      opts.onFrame(anchors);
    }
  }

  function loop() {
    if (disposed) return;
    frame();
    raf = active && opts.motion && !still ? requestAnimationFrame(loop) : 0;
  }

  resize();
  frame();
  frame();
  opts.onReady?.();
  if (opts.motion && !still) raf = requestAnimationFrame(loop);

  return {
    setProgress(p) {
      progress = Math.min(1, Math.max(0, p));
      if (!raf && !disposed) frame();
    },
    setPointer(x, y) {
      px = x;
      py = y;
    },
    resize() {
      resize();
      if (!raf && !disposed) frame();
    },
    setActive(on) {
      if (on === active) return;
      active = on;
      if (on && opts.motion && !still && !raf && !disposed) {
        clock.getDelta();
        raf = requestAnimationFrame(loop);
      }
    },
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const any = o as THREE.Mesh;
        if (any.geometry) any.geometry.dispose();
        const mat = any.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      envRT.dispose();
      pmrem.dispose();
      // leave the context clean in case the same canvas is used again (React StrictMode mounts twice)
      const gl = renderer.getContext();
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      renderer.dispose();
    },
  };
}
