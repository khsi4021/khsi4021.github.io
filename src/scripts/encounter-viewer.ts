// DebriSolver showcase encounters in 3D (three.js).
// Illustration only: two-body propagation from the TCA states in
// results/phase4/showcase_cases.json; the verified numbers (Pc, ΔV) come
// from the project's own two-body + J2 propagation and are just displayed.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export type Encounter = {
  id: number;
  label: string;
  r1: number[];
  v1: number[];
  r2: number[];
  v2: number[];
  C: number[][];
  HBR: number;
  pcPre: number;
  missPre: number;
  dvMmS: number;
  pcPost: number;
  missPost: number;
  postInPreFrame: [number, number];
};

const MU = 3.986004418e14;
const RE = 6371e3;
type V3 = [number, number, number];

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: V3) => Math.sqrt(dot(a, a));
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function accel(r: V3): V3 {
  const rn = norm(r);
  return mul(r, -MU / (rn * rn * rn));
}

/** RK4 two-body propagation, returns positions every `dt` seconds over [t0, t1]. */
function propagate(r0: V3, v0: V3, t0: number, t1: number, n: number): V3[] {
  const out: V3[] = [];
  const h = (t1 - t0) / n;
  // integrate backwards to t0 first
  let r = r0,
    v = v0;
  const step = (r: V3, v: V3, h: number): [V3, V3] => {
    const k1v = accel(r),
      k1r = v;
    const k2v = accel(add(r, mul(k1r, h / 2))),
      k2r = add(v, mul(k1v, h / 2));
    const k3v = accel(add(r, mul(k2r, h / 2))),
      k3r = add(v, mul(k2v, h / 2));
    const k4v = accel(add(r, mul(k3r, h))),
      k4r = add(v, mul(k3v, h));
    return [
      add(r, mul(add(add(k1r, mul(k2r, 2)), add(mul(k3r, 2), k4r)), h / 6)),
      add(v, mul(add(add(k1v, mul(k2v, 2)), add(mul(k3v, 2), k4v)), h / 6)),
    ];
  };
  const nb = Math.round((-t0 / (t1 - t0)) * n);
  for (let i = 0; i < nb; i++) [r, v] = step(r, v, -h);
  for (let i = 0; i <= n; i++) {
    out.push(r);
    [r, v] = step(r, v, h);
  }
  return out;
}

/** Jacobi eigen-decomposition of a symmetric 3x3 matrix. */
function eig3(A: number[][]): { values: number[]; vectors: V3[] } {
  const a = A.map((r) => r.slice());
  const V = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  for (let sweep = 0; sweep < 50; sweep++) {
    let off = 0;
    for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) off += a[p][q] ** 2;
    if (off < 1e-18 * (a[0][0] ** 2 + a[1][1] ** 2 + a[2][2] ** 2)) break;
    for (let p = 0; p < 3; p++)
      for (let q = p + 1; q < 3; q++) {
        if (Math.abs(a[p][q]) < 1e-300) continue;
        const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1),
          s = t * c;
        for (let k = 0; k < 3; k++) {
          const akp = a[k][p],
            akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < 3; k++) {
          const apk = a[p][k],
            aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < 3; k++) {
          const vkp = V[k][p],
            vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
  }
  return {
    values: [a[0][0], a[1][1], a[2][2]],
    vectors: [0, 1, 2].map((j) => [V[0][j], V[1][j], V[2][j]] as V3),
  };
}

function cssColor(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

export function boot(root: HTMLElement, cases: Encounter[]) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const stage = canvas.parentElement!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.001, 1e5);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reduce;
  controls.dampingFactor = 0.08;

  let view: "orbit" | "encounter" = "orbit";
  let current = cases[0];
  let group = new THREE.Group();
  scene.add(group);
  let animate: ((t: number) => void) | null = null;
  let visible = true;
  let needsRender = true;

  const colors = () => ({
    primary: cssColor("--accent", "#4c8dff"),
    secondary: cssColor("--viz-2", "#ffb547"),
    ok: cssColor("--ok", "#4ade9c"),
    line: cssColor("--border-strong", "#354055"),
    faint: cssColor("--text-faint", "#7c879a"),
    surface: cssColor("--surface", "#151b26"),
  });

  const lineFrom = (pts: THREE.Vector3[], color: THREE.Color, opacity = 1, dashed = false) => {
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = dashed
      ? new THREE.LineDashedMaterial({ color, dashSize: 0.15, gapSize: 0.12, transparent: opacity < 1, opacity })
      : new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
    const l = new THREE.Line(g, m);
    if (dashed) l.computeLineDistances();
    return l;
  };

  function dispose(obj: THREE.Object3D) {
    obj.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
  }

  function buildOrbit(c: Encounter) {
    const col = colors();
    const S = 1 / 1e6; // 1 unit = 1000 km
    const g = new THREE.Group();
    // Earth: dark sphere + graticule
    g.add(
      new THREE.Mesh(new THREE.SphereGeometry(RE * S, 48, 32), new THREE.MeshBasicMaterial({ color: col.surface })),
    );
    const grat: THREE.Vector3[] = [];
    const R = RE * S * 1.002;
    for (let lon = 0; lon < 180; lon += 30)
      for (let k = 0; k < 64; k++) {
        const a1 = (k / 64) * 2 * Math.PI,
          a2 = ((k + 1) / 64) * 2 * Math.PI,
          l = (lon * Math.PI) / 180;
        grat.push(
          new THREE.Vector3(R * Math.cos(a1) * Math.cos(l), R * Math.cos(a1) * Math.sin(l), R * Math.sin(a1)),
          new THREE.Vector3(R * Math.cos(a2) * Math.cos(l), R * Math.cos(a2) * Math.sin(l), R * Math.sin(a2)),
        );
      }
    for (let lat = -60; lat <= 60; lat += 30)
      for (let k = 0; k < 64; k++) {
        const a1 = (k / 64) * 2 * Math.PI,
          a2 = ((k + 1) / 64) * 2 * Math.PI,
          p = (lat * Math.PI) / 180;
        grat.push(
          new THREE.Vector3(R * Math.cos(p) * Math.cos(a1), R * Math.cos(p) * Math.sin(a1), R * Math.sin(p)),
          new THREE.Vector3(R * Math.cos(p) * Math.cos(a2), R * Math.cos(p) * Math.sin(a2), R * Math.sin(p)),
        );
      }
    g.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(grat),
        new THREE.LineBasicMaterial({ color: col.line, transparent: true, opacity: 0.6 }),
      ),
    );
    const period = (r: V3, v: V3) => {
      const a = 1 / (2 / norm(r) - dot(v, v) / MU);
      return 2 * Math.PI * Math.sqrt(a ** 3 / MU);
    };
    const T1 = period(c.r1 as V3, c.v1 as V3);
    const toV = (p: V3) => new THREE.Vector3(p[0] * S, p[1] * S, p[2] * S);
    const o1 = propagate(c.r1 as V3, c.v1 as V3, -T1 / 2, T1 / 2, 360).map(toV);
    const T2 = period(c.r2 as V3, c.v2 as V3);
    const o2 = propagate(c.r2 as V3, c.v2 as V3, -T2 / 2, T2 / 2, 360).map(toV);
    g.add(lineFrom(o1, col.primary, 0.9), lineFrom(o2, col.secondary, 0.9));
    const tca = toV(c.r1 as V3);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.11, 0.15, 32),
      new THREE.MeshBasicMaterial({ color: col.faint, side: THREE.DoubleSide }),
    );
    ring.position.copy(tca);
    ring.lookAt(0, 0, 0);
    g.add(ring);
    const dot1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 12),
      new THREE.MeshBasicMaterial({ color: col.primary }),
    );
    const dot2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 12),
      new THREE.MeshBasicMaterial({ color: col.secondary }),
    );
    g.add(dot1, dot2);
    // markers run from 25 min before TCA to 5 min after, then loop
    const n = 360;
    const idx = (frac: number, T: number) => Math.round(((frac * 1800 - 1500) / T) * n + n / 2);
    animate = (t: number) => {
      const f = reduce ? 1500 / 1800 : ((t / 1000) % 9) / 9;
      dot1.position.copy(o1[Math.min(n, Math.max(0, idx(f, T1)))]);
      dot2.position.copy(o2[Math.min(n, Math.max(0, idx(f, T2)))]);
    };
    animate(0);
    // camera: above the primary's orbit plane and toward the TCA side, so both
    // orbits read as ellipses rather than edge-on lines
    const dir = tca.clone().normalize();
    const hn = new THREE.Vector3(...cross(c.r1 as V3, c.v1 as V3)).normalize();
    camera.position.copy(dir.multiplyScalar(17).add(hn.multiplyScalar(25)));
    controls.target.copy(tca.clone().multiplyScalar(0.35));
    camera.near = 0.01;
    camera.far = 500;
    controls.minDistance = 8;
    controls.maxDistance = 80;
    return g;
  }

  function buildEncounter(c: Encounter) {
    const col = colors();
    const g = new THREE.Group();
    const r = sub(c.r2 as V3, c.r1 as V3);
    const v = sub(c.v2 as V3, c.v1 as V3);
    const z = mul(v, 1 / norm(v));
    const rperp = sub(r, mul(z, dot(r, z)));
    const x = mul(rperp, 1 / norm(rperp));
    const y = cross(z, x);
    const { values, vectors } = eig3(c.C);
    const sig = values.map((l) => Math.sqrt(Math.max(l, 0)));
    const span = Math.max(...sig) * 3.2;
    const S = 8 / span; // fit 3-sigma into ~8 units
    const toV = (p: V3) => new THREE.Vector3(p[0] * S, p[1] * S, p[2] * S);

    // 1- and 3-sigma combined covariance ellipsoids
    const basis = new THREE.Matrix4().makeBasis(
      toV(vectors[0]).normalize(),
      toV(vectors[1]).normalize(),
      toV(vectors[2]).normalize(),
    );
    for (const [k, op] of [
      [1, 0.28],
      [3, 0.1],
    ] as const) {
      const e = new THREE.Mesh(
        new THREE.SphereGeometry(1, 48, 24),
        new THREE.MeshBasicMaterial({
          color: col.primary,
          transparent: true,
          opacity: op,
          depthWrite: false,
          wireframe: k === 3,
        }),
      );
      e.applyMatrix4(new THREE.Matrix4().makeScale(k * sig[0] * S, k * sig[1] * S, k * sig[2] * S));
      e.applyMatrix4(basis);
      g.add(e);
    }
    // hard-body sphere at the primary
    g.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(Math.max(c.HBR * S, 0.03), 24, 16),
        new THREE.MeshBasicMaterial({ color: col.primary }),
      ),
    );
    // encounter plane disc
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(span * S * 1.05, 64),
      new THREE.MeshBasicMaterial({
        color: col.faint,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    disc.lookAt(new THREE.Vector3(...z));
    g.add(disc);
    // relative trajectory before the burn (straight line through the miss point)
    const L = span * 1.4;
    const pre = toV(rperp);
    g.add(lineFrom([toV(add(rperp, mul(z, -L))), toV(add(rperp, mul(z, L)))], col.secondary, 0.95));
    g.add(lineFrom([new THREE.Vector3(0, 0, 0), pre], col.secondary, 0.9, true));
    const preDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 12),
      new THREE.MeshBasicMaterial({ color: col.secondary }),
    );
    preDot.position.copy(pre);
    g.add(preDot);
    // miss point after the burn (encounter-plane coordinates of the pre-burn frame)
    const postP = add(mul(x, c.postInPreFrame[0]), mul(y, c.postInPreFrame[1]));
    const post = toV(postP);
    const postInView = norm(postP) * S < 40;
    if (postInView) {
      g.add(lineFrom([toV(add(postP, mul(z, -L))), toV(add(postP, mul(z, L)))], col.ok, 0.95));
      const postDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 16, 12),
        new THREE.MeshBasicMaterial({ color: col.ok }),
      );
      postDot.position.copy(post);
      g.add(postDot);
    }
    animate = null;
    const zv = toV(z).normalize();
    const xv = toV(x).normalize();
    camera.position.copy(
      zv.clone().multiplyScalar(-9).add(xv.clone().multiplyScalar(15)).add(toV(y).normalize().multiplyScalar(13)),
    );
    const look = postInView ? post.clone().multiplyScalar(0.35) : new THREE.Vector3();
    controls.target.copy(look);
    camera.near = 0.01;
    camera.far = 1000;
    controls.minDistance = 2;
    controls.maxDistance = 120;
    if (postInView) camera.position.add(look);
    return g;
  }

  function rebuild() {
    scene.remove(group);
    dispose(group);
    group = view === "orbit" ? buildOrbit(current) : buildEncounter(current);
    scene.add(group);
    camera.updateProjectionMatrix();
    controls.update();
    updateReadout();
    needsRender = true;
  }

  const fmtPc = (p: number) =>
    p
      .toExponential(1)
      .replace("e-", " × 10⁻")
      .replace(/⁻(\d+)/, (_, d: string) => "⁻" + [...d].map((ch) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+ch]).join(""));
  function updateReadout() {
    const set = (k: string, v: string) => {
      const el = root.querySelector(`[data-ro="${k}"]`);
      if (el) el.textContent = v;
    };
    set("pcPre", fmtPc(current.pcPre));
    set("missPre", `${Math.round(current.missPre).toLocaleString("en-US")} m`);
    set("dv", `${current.dvMmS.toFixed(1)} mm/s`);
    set("pcPost", fmtPc(current.pcPost));
    set("missPost", `${Math.round(current.missPost).toLocaleString("en-US")} m`);
    root.querySelectorAll<HTMLElement>("[data-legend]").forEach((el) => (el.hidden = el.dataset.legend !== view));
  }

  function resize() {
    const w = stage.clientWidth,
      h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    needsRender = true;
  }
  new ResizeObserver(resize).observe(stage);

  controls.addEventListener("change", () => (needsRender = true));
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(stage);

  const loop = (t: number) => {
    requestAnimationFrame(loop);
    if (!visible) return;
    if (controls.enableDamping) controls.update();
    if (animate && !reduce) {
      animate(t);
      needsRender = true;
    }
    if (needsRender) {
      renderer.render(scene, camera);
      needsRender = false;
    }
  };

  root.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (!b) return;
    if (b.dataset.case) {
      current = cases.find((c) => String(c.id) === b.dataset.case) ?? current;
      root
        .querySelectorAll<HTMLButtonElement>("[data-case]")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      rebuild();
    }
    if (b.dataset.view) {
      view = b.dataset.view as typeof view;
      root
        .querySelectorAll<HTMLButtonElement>("[data-view]")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      rebuild();
    }
  });
  document.addEventListener("themechange", rebuild);
  document.addEventListener("tabshown", () => {
    resize();
    needsRender = true;
  });

  resize();
  rebuild();
  root.querySelector("[data-loading]")?.remove();
  requestAnimationFrame(loop);
}
