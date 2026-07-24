import {
  BASIS_OPTIONS,
  MAX_VISUAL_DELTA_MS,
  VIEW_LERP_PER_SEC,
  X_MAX,
  X_MIN,
} from './constants';
import type {
  BasisKind,
  CurvePoint,
  FunctionEquationsParams,
  FunctionEquationsSmooth,
  PlotRect,
  PolynomialParams,
  QuadraticParams,
  SceneLayout,
  TransformParams,
} from './types';

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function fmt(value: number) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 0.0005) return '0';
  const digits = Math.abs(value) >= 10 ? 1 : 2;
  return Number(value.toFixed(digits)).toString();
}

export function measureFunctionEquationsCanvas(host: HTMLElement): { width: number; height: number } {
  const w = Math.max(300, Math.round(host.clientWidth > 0 ? host.clientWidth : 640));
  const h =
    w >= 520
      ? Math.round(clamp(w * 0.72, 380, 520))
      : Math.round(clamp(w * 0.95, 360, 480));
  return { width: w, height: h };
}

export function computeSceneLayout(width: number, height: number): SceneLayout {
  const plotPadX = width < 560 ? 42 : 54;
  const plotTop = 18;
  const bottomReserve = 74;
  const plot: PlotRect = {
    x: plotPadX,
    y: plotTop,
    w: width - plotPadX - 24,
    h: Math.max(200, height - plotTop - bottomReserve),
  };

  return {
    plot,
    numberLine: { x: plot.x, y: plot.y + plot.h + 38, w: plot.w },
  };
}

export function stepViewHalfYSmoothing(
  smooth: FunctionEquationsSmooth,
  target: number,
  deltaMs: number,
): FunctionEquationsSmooth {
  const dtSec = Math.min(deltaMs, MAX_VISUAL_DELTA_MS) / 1000;
  const alpha = 1 - Math.exp(-VIEW_LERP_PER_SEC * dtSec);
  return {
    viewHalfY: smooth.viewHalfY + (target - smooth.viewHalfY) * alpha,
  };
}

export function baseValue(kind: BasisKind, x: number) {
  if (kind === 'linear') return x;
  if (kind === 'square') return x * x;
  if (kind === 'cubic') return x * x * x;
  if (kind === 'abs') return Math.abs(x);
  return x;
}

export function transformValue(transform: TransformParams, x: number) {
  return transform.a * baseValue(transform.basis, transform.b * (x - transform.h)) + transform.k;
}

export function sampleXs(a: number, b: number, step: number) {
  const xs: number[] = [];
  for (let x = a; x <= b + 1e-9; x += step) xs.push(x);
  return xs;
}

export function cleanQuadraticParams(q: QuadraticParams): QuadraticParams {
  const a = Math.abs(q.a) < 0.12 ? (q.a < 0 ? -0.12 : 0.12) : q.a;
  return { a, b: q.b, c: q.c };
}

export function sanitizeQuadraticA(value: number) {
  if (Math.abs(value) >= 0.12) return value;
  return value < 0 ? -0.12 : 0.12;
}

export function quadraticValue(q: QuadraticParams, x: number) {
  const clean = cleanQuadraticParams(q);
  return clean.a * x * x + clean.b * x + clean.c;
}

function quadraticDiscriminant(q: QuadraticParams) {
  const clean = cleanQuadraticParams(q);
  return clean.b * clean.b - 4 * clean.a * clean.c;
}

export function quadraticRoots(q: QuadraticParams) {
  const clean = cleanQuadraticParams(q);
  const { a, b, c } = clean;
  const d = b * b - 4 * a * c;
  if (d < -1e-8) return [];
  if (Math.abs(d) <= 1e-8) return [-b / (2 * a)];
  const s = Math.sqrt(Math.max(0, d));
  return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((u, v) => u - v);
}

export function quadraticVertex(q: QuadraticParams) {
  const clean = cleanQuadraticParams(q);
  const vx = -clean.b / (2 * clean.a);
  const vy = quadraticValue(clean, vx);
  return { x: vx, y: vy };
}

function quadraticPositiveIntervals(a: number, roots: number[]): [number, number][] {
  if (roots.length === 0) return a > 0 ? [[X_MIN, X_MAX] as [number, number]] : [];
  if (roots.length === 1) return a > 0 ? [[X_MIN, roots[0]], [roots[0], X_MAX]] : [];
  const [r1, r2] = roots;
  return a > 0
    ? ([
        [X_MIN, r1],
        [r2, X_MAX],
      ] as [number, number][])
    : ([[r1, r2]] as [number, number][]);
}

export function polyValue(polynomial: PolynomialParams, x: number) {
  let y = 1;
  for (let i = 0; i < polynomial.roots.length; i++) {
    y *= Math.pow(x - polynomial.roots[i], polynomial.mult[i]);
  }
  return y;
}

function polynomialPositiveIntervals(polynomial: PolynomialParams) {
  const MIN_INTERVAL_WIDTH = 0.001;
  const ROOT_MERGE_EPS = 0.001;
  const rawBreaks = [X_MIN, ...polynomial.roots.map((r) => clamp(r, X_MIN, X_MAX)), X_MAX].sort(
    (a, b) => a - b,
  );
  const breaks: number[] = [];

  for (const value of rawBreaks) {
    if (!breaks.length || Math.abs(value - breaks[breaks.length - 1]) > ROOT_MERGE_EPS) {
      breaks.push(value);
    }
  }

  const intervals: [number, number][] = [];
  for (let i = 0; i < breaks.length - 1; i++) {
    const a = breaks[i];
    const b = breaks[i + 1];
    if (b - a <= MIN_INTERVAL_WIDTH) continue;

    const mid = (a + b) / 2;
    if (polyValue(polynomial, mid) > 1e-9) intervals.push([a, b]);
  }

  return intervals;
}

function signBoundaryX(a: CurvePoint, b: CurvePoint) {
  if (!Number.isFinite(a.y) || !Number.isFinite(b.y)) return b.x;
  const denom = Math.abs(a.y) + Math.abs(b.y);
  if (denom <= 1e-12) return (a.x + b.x) / 2;
  return a.x + (b.x - a.x) * (Math.abs(a.y) / denom);
}

function sampledSignIntervals(points: CurvePoint[], pred: (pt: CurvePoint) => boolean) {
  const intervals: [number, number][] = [];
  let inSeg = false;
  let start: number | null = null;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const previous = points[i - 1];
    const ok = pred(current);

    if (ok && !inSeg) {
      start = previous ? signBoundaryX(previous, current) : current.x;
      inSeg = true;
    }

    if (!ok && inSeg && start !== null) {
      const end = previous ? signBoundaryX(previous, current) : current.x;
      if (end - start > 0.001) intervals.push([start, end]);
      inSeg = false;
      start = null;
    }

    if (ok && inSeg && start !== null && i === points.length - 1) {
      const end = current.x;
      if (end - start > 0.001) intervals.push([start, end]);
      inSeg = false;
      start = null;
    }
  }

  return intervals;
}

function pushUniqueRoot(arr: number[], x: number) {
  if (!arr.some((v) => Math.abs(v - x) < 0.08)) arr.push(x);
}

export function rootsFromSample(points: CurvePoint[]) {
  const roots: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (!Number.isFinite(a.y) || !Number.isFinite(b.y)) continue;

    if (Math.abs(a.y) < 0.01) {
      pushUniqueRoot(roots, a.x);
    } else if (a.y * b.y < 0) {
      const t = Math.abs(a.y) / (Math.abs(a.y) + Math.abs(b.y));
      pushUniqueRoot(roots, a.x + (b.x - a.x) * t);
    }
  }
  return roots;
}

export function targetViewHalfYFromCurves(curves: CurvePoint[][]) {
  const vals: number[] = [];
  for (const curve of curves) {
    for (const pt of curve) {
      if (Number.isFinite(pt.y)) vals.push(Math.abs(pt.y));
    }
  }

  if (!vals.length) return 5;

  vals.sort((a, b) => a - b);
  const p90 = vals[Math.floor(vals.length * 0.9)] || 1;
  const maxAbs = vals[vals.length - 1] || 1;
  return clamp(Math.min(maxAbs * 1.05, p90 * 1.8), 3.6, 18);
}

export function niceYStep(half: number) {
  if (half <= 4) return 1;
  if (half <= 8) return 2;
  return 4;
}

export function worldToScreen(
  plot: PlotRect,
  viewHalfY: number,
  x: number,
  y: number,
): { x: number; y: number } {
  return {
    x: plot.x + ((x - X_MIN) / (X_MAX - X_MIN)) * plot.w,
    y: plot.y + plot.h - ((y + viewHalfY) / (viewHalfY * 2)) * plot.h,
  };
}

export function screenToWorldX(plot: PlotRect, screenX: number) {
  return X_MIN + ((screenX - plot.x) / plot.w) * (X_MAX - X_MIN);
}

export function snapStep(value: number, step: number) {
  if (!step) return value;
  return Math.round(value / step) * step;
}

export function pickPolynomialRootHandle(
  params: FunctionEquationsParams,
  layout: SceneLayout,
  viewHalfY: number,
  mouseX: number,
  mouseY: number,
): number | null {
  if (params.mode !== 'polynomial') return null;

  for (let i = 0; i < params.polynomial.roots.length; i++) {
    const s = worldToScreen(layout.plot, viewHalfY, params.polynomial.roots[i], 0);
    if (Math.abs(mouseX - s.x) <= 13 && Math.abs(mouseY - s.y) <= 13) return i;
  }

  return null;
}

export function rootFromScreenX(screenX: number, plot: PlotRect) {
  const x = screenToWorldX(plot, screenX);
  return snapStep(clamp(x, -4.5, 4.5), 0.05);
}

export function buildStatsLines(params: FunctionEquationsParams): string[] {
  if (params.mode === 'transform') {
    const p = params.transform;
    const base = BASIS_OPTIONS.find((b) => b.id === p.basis)?.text || 'f(x)';
    const curve = sampleXs(X_MIN, X_MAX, 0.04).map((x) => ({
      x,
      y: transformValue(p, x),
    }));
    return [base, 'g(x)=a f(b(x-h))+k', `零點數 ≈ ${rootsFromSample(curve).length}`, 'g(x)>0：看下方金線'];
  }

  if (params.mode === 'quadratic') {
    const q = cleanQuadraticParams(params.quadratic);
    const d = quadraticDiscriminant(q);
    const roots = quadraticRoots(q);
    const vertex = quadraticVertex(q);
    return [
      'f(x)=ax²+bx+c',
      `Δ=${fmt(d)}，實根 ${roots.length} 個`,
      `V=(${fmt(vertex.x)}, ${fmt(vertex.y)})`,
      'f(x)>0：看下方金線',
    ];
  }

  const deg = params.polynomial.mult.reduce((sum, v) => sum + v, 0);
  return [
    'p(x)=∏(x-rᵢ)^mᵢ',
    `次數 n=${deg}`,
    `r=(${params.polynomial.roots.map(fmt).join(', ')})`,
    `m=(${params.polynomial.mult.join(', ')})`,
  ];
}

export function bottomCaption(params: FunctionEquationsParams): string {
  if (params.mode === 'transform') {
    return 'ghost 為原函數 f(x)，金線為 g(x)=a f(b(x-h))+k';
  }

  if (params.mode === 'quadratic') {
    const q = cleanQuadraticParams(params.quadratic);
    const disc = quadraticDiscriminant(q);
    const vertex = quadraticVertex(q);
    return `Δ=${fmt(disc)}；V=(${fmt(vertex.x)}, ${fmt(vertex.y)})`;
  }

  return 'm=1 穿過 x 軸；m=2 碰觸後折回';
}

export function signLineLabel(params: FunctionEquationsParams) {
  if (params.mode === 'transform') return 'g(x)>0';
  if (params.mode === 'quadratic') return 'f(x)>0';
  return 'p(x)>0';
}

export function positiveIntervals(params: FunctionEquationsParams): [number, number][] {
  if (params.mode === 'transform') {
    const curve = sampleXs(X_MIN, X_MAX, 0.035).map((x) => ({
      x,
      y: transformValue(params.transform, x),
    }));
    return sampledSignIntervals(curve, (pt) => pt.y > 0);
  }

  if (params.mode === 'quadratic') {
    const q = cleanQuadraticParams(params.quadratic);
    return quadraticPositiveIntervals(q.a, quadraticRoots(q));
  }

  return polynomialPositiveIntervals(params.polynomial);
}

export function curvesForView(params: FunctionEquationsParams): CurvePoint[][] {
  if (params.mode === 'transform') {
    const p = params.transform;
    const xs = sampleXs(X_MIN, X_MAX, 0.035);
    const ghost = xs.map((x) => ({ x, y: baseValue(p.basis, x) }));
    const curve = xs.map((x) => ({ x, y: transformValue(p, x) }));
    return [ghost, curve];
  }

  if (params.mode === 'quadratic') {
    const xs = sampleXs(X_MIN, X_MAX, 0.035);
    return [xs.map((x) => ({ x, y: quadraticValue(params.quadratic, x) }))];
  }

  const xs = sampleXs(X_MIN, X_MAX, 0.025);
  return [xs.map((x) => ({ x, y: polyValue(params.polynomial, x) }))];
}
