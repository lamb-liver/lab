import { LATUS, VIEW_H } from './constants';
import type {
  ConicPath,
  FocusCurveType,
  FocusScene,
  PathPoint,
} from './types';

const TAU = Math.PI * 2;

export function cosh(x: number): number {
  return (Math.exp(x) + Math.exp(-x)) * 0.5;
}

export function sinh(x: number): number {
  return (Math.exp(x) - Math.exp(-x)) * 0.5;
}

export function getPointOnPath(
  points: ReadonlyArray<PathPoint>,
  progress: number,
): PathPoint | null {
  if (!points.length) return null;
  const i = Math.floor(progress * (points.length - 1));
  return points[Math.max(0, Math.min(i, points.length - 1))] ?? null;
}

export function revealPath(
  points: ReadonlyArray<PathPoint>,
  progress: number,
): PathPoint[] {
  if (!points.length) return [];
  const count = Math.max(2, Math.floor(points.length * progress));
  return points.slice(0, count);
}

function sampleCircle(radius: number): PathPoint[] {
  const pts: PathPoint[] = [];
  const count = 720;

  for (let i = 0; i <= count; i++) {
    const t = (i / count) * TAU;
    pts.push({
      x: radius * Math.cos(t),
      y: radius * Math.sin(t),
      t,
    });
  }

  return pts;
}

function samplePolarConic(e: number, L: number): PathPoint[] {
  const pts: PathPoint[] = [];
  const count = 900;

  for (let i = 0; i <= count; i++) {
    const t = (i / count) * TAU;
    const denom = 1 + e * Math.cos(t);

    if (Math.abs(denom) < 0.0001) continue;

    const r = L / denom;

    pts.push({
      x: r * Math.cos(t),
      y: r * Math.sin(t),
      t,
    });
  }

  return pts;
}

function sampleDirectrixParabola(L: number): PathPoint[] {
  const pts: PathPoint[] = [];
  const count = 620;
  const yMax = VIEW_H * 0.58;

  for (let i = 0; i <= count; i++) {
    const y = -yMax + (i / count) * (2 * yMax);
    const x = (L * L - y * y) / (2 * L);

    pts.push({
      x,
      y,
      t: i / count,
    });
  }

  return pts;
}

function sampleDirectrixHyperbola(e: number, L: number): ConicPath[] {
  const left: PathPoint[] = [];
  const right: PathPoint[] = [];

  const count = 680;
  const yMax = VIEW_H * 0.66;
  const A = 1 - e * e;

  for (let i = 0; i <= count; i++) {
    const y = -yMax + (i / count) * (2 * yMax);
    const disc = L * L - A * y * y;
    const root = Math.sqrt(Math.max(0, disc));

    const x1 = (-e * L + root) / A;
    const x2 = (-e * L - root) / A;

    left.push({ x: x1, y, t: i / count });
    right.push({ x: x2, y, t: i / count });
  }

  return [
    { type: 'hyperbola-left', closed: false, points: left },
    { type: 'hyperbola-right', closed: false, points: right },
  ];
}

export function buildEccentricityPaths(e: number): ConicPath[] {
  const L = LATUS;

  if (e < 0.025) {
    return [
      {
        type: 'circle-limit',
        closed: true,
        points: sampleCircle(L),
      },
    ];
  }

  if (e < 0.985) {
    return [
      {
        type: 'ellipse',
        closed: true,
        points: samplePolarConic(e, L),
      },
    ];
  }

  if (e <= 1.015) {
    return [
      {
        type: 'parabola',
        closed: false,
        points: sampleDirectrixParabola(L),
      },
    ];
  }

  return sampleDirectrixHyperbola(e, L);
}

export function chooseEccentricityMetricPath(
  paths: ConicPath[],
  e: number,
  pointClock: number,
): PathPoint[] {
  if (!paths.length) return [];

  if (e > 1.015 && paths.length > 1) {
    const branchIndex = Math.floor(pointClock * 2) % 2;
    return paths[branchIndex]!.points;
  }

  return paths[0]!.points;
}

export function getEccentricityKind(e: number): string {
  if (e < 0.045) return '圓（極限）';
  if (e < 0.985) return '橢圓';
  if (e <= 1.015) return '拋物線';
  return '雙曲線';
}

export function getDirectrixRatio(e: number, p: PathPoint | null): string {
  if (!p || e < 0.045) return '—';

  const d = LATUS / e;
  const pf = Math.hypot(p.x, p.y);
  const pd = Math.abs(d - p.x);

  if (pd < 0.0001) return '∞';

  return (pf / pd).toFixed(3);
}

export function buildFocusScene(type: FocusCurveType): FocusScene {
  if (type === 'ellipse') return buildEllipseFocusScene();
  if (type === 'parabola') return buildParabolaFocusScene();
  return buildHyperbolaFocusScene();
}

function buildEllipseFocusScene(): FocusScene {
  const a = 165;
  const b = 105;
  const c = Math.sqrt(a * a - b * b);
  const pts: PathPoint[] = [];
  const count = 780;

  for (let i = 0; i <= count; i++) {
    const t = (i / count) * TAU;
    pts.push({
      x: a * Math.cos(t),
      y: b * Math.sin(t),
      t,
    });
  }

  return {
    type: 'ellipse',
    title: '橢圓',
    formula: 'PF₁ + PF₂ = constant',
    constantText: `constant ≈ ${(2 * a).toFixed(1)}`,
    foci: [
      { x: -c, y: 0 },
      { x: c, y: 0 },
    ],
    paths: [{ type: 'ellipse-focus', closed: true, points: pts }],
  };
}

function buildParabolaFocusScene(): FocusScene {
  const p = 75;
  const pts: PathPoint[] = [];
  const count = 620;
  const yMax = VIEW_H * 0.56;

  for (let i = 0; i <= count; i++) {
    const y = -yMax + (i / count) * (2 * yMax);
    const x = (y * y) / (4 * p);

    pts.push({ x, y, t: i / count });
  }

  return {
    type: 'parabola',
    title: '拋物線',
    formula: 'PF = Pd',
    constantText: 'focus distance equals directrix distance',
    focus: { x: p, y: 0 },
    directrixX: -p,
    paths: [{ type: 'parabola-focus', closed: false, points: pts }],
  };
}

function buildHyperbolaFocusScene(): FocusScene {
  const a = 88;
  const b = 80;
  const c = Math.sqrt(a * a + b * b);

  const left: PathPoint[] = [];
  const right: PathPoint[] = [];

  const count = 560;
  const uMax = 1.48;

  for (let i = 0; i <= count; i++) {
    const u = -uMax + (i / count) * (2 * uMax);
    const x = a * cosh(u);
    const y = b * sinh(u);

    right.push({ x, y, t: i / count });
    left.push({ x: -x, y, t: i / count });
  }

  return {
    type: 'hyperbola',
    title: '雙曲線',
    formula: '|PF₁ - PF₂| = constant',
    constantText: `constant ≈ ${(2 * a).toFixed(1)}`,
    foci: [
      { x: -c, y: 0 },
      { x: c, y: 0 },
    ],
    paths: [
      { type: 'hyperbola-focus-left', closed: false, points: left },
      { type: 'hyperbola-focus-right', closed: false, points: right },
    ],
  };
}

export function getFocusMovingPoint(
  scene: FocusScene,
  pointClock: number,
): { point: PathPoint | null; metricPath: PathPoint[] } {
  if (scene.type === 'hyperbola') {
    const branchIndex = Math.floor(pointClock * 2) % 2;
    const localProgress = (pointClock * 2) % 1;
    const path = scene.paths[branchIndex]!.points;

    return {
      point: getPointOnPath(path, localProgress),
      metricPath: path,
    };
  }

  const path = scene.paths[0]!.points;
  return {
    point: getPointOnPath(path, pointClock % 1),
    metricPath: path,
  };
}

export function getFocusRelationValue(
  scene: FocusScene,
  p: PathPoint | null,
): string {
  if (!p) return '—';

  if (scene.type === 'ellipse' && scene.foci) {
    const [f1, f2] = scene.foci;
    const d1 = Math.hypot(p.x - f1.x, p.y - f1.y);
    const d2 = Math.hypot(p.x - f2.x, p.y - f2.y);

    return `PF₁ + PF₂ ≈ ${(d1 + d2).toFixed(2)}`;
  }

  if (scene.type === 'hyperbola' && scene.foci) {
    const [f1, f2] = scene.foci;
    const d1 = Math.hypot(p.x - f1.x, p.y - f1.y);
    const d2 = Math.hypot(p.x - f2.x, p.y - f2.y);

    return `|PF₁ - PF₂| ≈ ${Math.abs(d1 - d2).toFixed(2)}`;
  }

  if (scene.focus != null && scene.directrixX != null) {
    const pf = Math.hypot(p.x - scene.focus.x, p.y - scene.focus.y);
    const pd = Math.abs(p.x - scene.directrixX);

    return `PF ≈ ${pf.toFixed(2)} · Pd ≈ ${pd.toFixed(2)}`;
  }

  return '—';
}

export function screenToWorld(
  px: number,
  py: number,
  width: number,
  height: number,
): { x: number; y: number } {
  const s = currentScale(width, height);

  return {
    x: (px - width * 0.5) / s,
    y: -(py - height * 0.53) / s,
  };
}

export function currentScale(width: number, height: number): number {
  return Math.min((width * 0.78) / VIEW_W, (height * 0.76) / VIEW_H);
}

export function pickPointClockFromWorld(
  world: { x: number; y: number },
  metricPoints: ReadonlyArray<PathPoint>,
  mode: 'eccentricity' | 'focus',
  focusCurve: FocusCurveType,
): number {
  let bestIndex = 0;
  let bestDist = Infinity;

  for (let i = 0; i < metricPoints.length; i += 3) {
    const pt = metricPoints[i]!;
    const d = (world.x - pt.x) ** 2 + (world.y - pt.y) ** 2;

    if (d < bestDist) {
      bestDist = d;
      bestIndex = i;
    }
  }

  const progress = bestIndex / Math.max(1, metricPoints.length - 1);

  if (mode === 'focus' && focusCurve === 'hyperbola') {
    return progress * 0.5;
  }

  return progress;
}
