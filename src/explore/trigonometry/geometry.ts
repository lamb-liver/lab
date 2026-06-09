import { DEFAULT_TRIANGLE, MAX_VISUAL_DELTA_MS, SMOOTH_RATE_PER_SEC, TAU } from './constants';
import {
  clamp,
  circumcircleFromTriangle,
  computeTriangleSidesAngles,
  dist2,
  preventTriangleCollapse,
  sub,
  type TriangleVerts,
  type Vec2,
} from '../../lib/trigonometry/triangleGeometry';
import type {
  Circumcircle,
  CircleGeometry,
  PlotRect,
  TriangleMetrics,
  TriangleTransform,
  TrigExploreParams,
  TrigMode,
  TrigSmoothState,
  VisualDragKind,
} from './types';

export { preventTriangleCollapse };
export type { TriangleVerts, Vec2 };

export function normalizeAngle(a: number) {
  let v = a % TAU;
  if (v < 0) v += TAU;
  return v;
}

export function clampSignedAngle(a: number) {
  let v = ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;
  if (Object.is(v, -0)) v = 0;
  return v;
}

export function shortestAngleDelta(from: number, to: number) {
  return clampSignedAngle(to - from);
}

export { clamp, dist2, sub };

export function fmt(v: number, digits = 3) {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < 0.0005 || Object.is(v, -0)) return '0';
  return v
    .toFixed(digits)
    .replace(/\.0+$/, '')
    .replace(/(\.\d*?)0+$/, '$1');
}

export function deg(v: number) {
  return `${Math.round((v * 180) / Math.PI)}°`;
}

export function degLabel(v: number) {
  return `${Math.round((normalizeAngle(v) * 180) / Math.PI)}°`;
}

export function signedDegLabel(v: number) {
  const d = Math.round((clampSignedAngle(v) * 180) / Math.PI);
  return `${d > 0 ? '+' : ''}${d}°`;
}

export function measureTrigonometryCanvas(host: HTMLElement): { width: number; height: number } {
  const w = Math.max(280, Math.round(host.clientWidth > 0 ? host.clientWidth : 480));
  const h = Math.max(320, Math.min(Math.round(w * 0.78), 560));
  return { width: w, height: h };
}

export function plotRect(width: number, height: number): PlotRect {
  const m = width < 560 ? 24 : 32;
  return { x: m, y: m, w: width - m * 2, h: height - m * 2 };
}

export function circleGeometry(plot: PlotRect, advancedMix: number): CircleGeometry {
  const r = Math.min(plot.w, plot.h) * (plot.h < 390 ? 0.28 : 0.34);
  const cyNormal = plot.y + plot.h * 0.5;
  const cyAdvanced = plot.y + plot.h * 0.46;
  return {
    cx: plot.x + plot.w * 0.5,
    cy: cyNormal + (cyAdvanced - cyNormal) * advancedMix,
    r,
  };
}

export function triangleTransform(plot: PlotRect): TriangleTransform {
  const s = Math.min(plot.w * 0.3, plot.h * 0.3);
  return {
    cx: plot.x + plot.w * 0.5,
    cy: plot.y + plot.h * 0.5,
    s,
  };
}

export function worldToScreen(p: Vec2, T: TriangleTransform): Vec2 {
  return { x: T.cx + p.x * T.s, y: T.cy - p.y * T.s };
}

export function screenToWorld(p: Vec2, T: TriangleTransform): Vec2 {
  return { x: (p.x - T.cx) / T.s, y: -(p.y - T.cy) / T.s };
}

export function polarPoint(cx: number, cy: number, r: number, angle: number): Vec2 {
  return { x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r };
}

export function triangleMetrics(triangle: TriangleVerts): TriangleMetrics {
  return computeTriangleSidesAngles(triangle);
}

export function circumcircleWorld(A: Vec2, B: Vec2, C: Vec2): Circumcircle | null {
  return circumcircleFromTriangle(A, B, C);
}

export function resetTriangle(): TriangleVerts {
  return {
    A: { ...DEFAULT_TRIANGLE.A },
    B: { ...DEFAULT_TRIANGLE.B },
    C: { ...DEFAULT_TRIANGLE.C },
  };
}

export function setCircularTarget(current: number, normalizedValue: number) {
  const currentNorm = normalizeAngle(current);
  const delta = shortestAngleDelta(currentNorm, normalizedValue);
  return current + delta;
}

export function stepSmoothing(
  smooth: TrigSmoothState,
  params: TrigExploreParams,
  deltaMs: number,
): TrigSmoothState {
  const safeDelta = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : 16.67;
  const clampedDelta = Math.min(safeDelta, MAX_VISUAL_DELTA_MS);
  const dt = clampedDelta / 1000;
  const k = 1 - Math.exp(-dt * SMOOTH_RATE_PER_SEC);
  const targetAdvanced = params.advanced ? 1 : 0;

  return {
    theta: smooth.theta + (params.theta - smooth.theta) * k,
    alpha: smooth.alpha + (params.alpha - smooth.alpha) * k,
    beta: smooth.beta + (params.beta - smooth.beta) * k,
    advancedMix: smooth.advancedMix + (targetAdvanced - smooth.advancedMix) * k,
  };
}

function angleOnSignedArc(point: number, start: number, end: number) {
  const span = shortestAngleDelta(start, end);
  const offset = shortestAngleDelta(start, point);
  if (span >= 0) return offset >= 0 && offset <= span;
  return offset <= 0 && offset >= span;
}

export function getVisualCaption(mode: TrigMode): string {
  if (mode === 'circle') return '單位圓：座標先給出 sin、cos，tan 由比值讀出。';
  if (mode === 'triangle') return '三角形：邊長、角度與外接圓半徑互相轉換。';
  return '角度合成：旋轉先後作用，對應加法定理。';
}

export function buildCircleStats(theta: number) {
  const t = normalizeAngle(theta);
  const s = Math.sin(t);
  const c = Math.cos(t);
  const tan = Math.abs(c) < 0.0001 ? null : s / c;

  return {
    stats: [
      `sin θ = ${fmt(s)}`,
      `cos θ = ${fmt(c)}`,
      `tan θ = ${tan === null ? '未定義' : fmt(tan)}`,
      `sin²θ + cos²θ = ${fmt(s * s + c * c)}`,
    ],
    formulas: ['P(θ) = (cosθ, sinθ)', 'tanθ = sinθ / cosθ'],
  };
}

export function buildTriangleStats(triangle: TriangleVerts) {
  const g = triangleMetrics(triangle);
  return {
    stats: [
      `a,b,c = ${fmt(g.a)}, ${fmt(g.b)}, ${fmt(g.c)}`,
      `A,B,C = ${deg(g.A)}, ${deg(g.B)}, ${deg(g.C)}`,
      `R = ${fmt(g.R)}`,
      `a/sinA ≈ ${fmt(g.a / Math.sin(g.A))}`,
    ],
    formulas: ['a/sinA = b/sinB = c/sinC = 2R', 'c² = a² + b² − 2ab cosC'],
  };
}

export function buildIdentityStats(alpha: number, beta: number) {
  const sum = normalizeAngle(alpha + beta);
  const s = Math.sin(sum);
  const c = Math.cos(sum);

  const stats = [
    `α + β = ${deg(sum)}`,
    `cos(α+β) = ${fmt(c)}`,
    `sin(α+β) = ${fmt(s)}`,
    `cos 2α = ${fmt(Math.cos(2 * alpha))}`,
  ];

  const formulas = [
    'cos(α+β)=cosαcosβ−sinαsinβ',
    'sin(α+β)=sinαcosβ+cosαsinβ',
  ];

  return { stats, formulas };
}

export function pickVisualDrag(
  mode: TrigMode,
  mx: number,
  my: number,
  plot: PlotRect,
  params: TrigExploreParams,
  smooth: TrigSmoothState,
): VisualDragKind | null {
  if (mode === 'circle') {
    const geo = circleGeometry(plot, smooth.advancedMix);
    const theta = normalizeAngle(smooth.theta);
    const P = polarPoint(geo.cx, geo.cy, geo.r, theta);
    const nearPoint = Math.hypot(mx - P.x, my - P.y) < 30;
    const nearCircle = Math.hypot(mx - geo.cx, my - geo.cy) < geo.r * 1.25;
    return nearPoint || nearCircle ? { type: 'theta' } : null;
  }

  if (mode === 'triangle') {
    const T = triangleTransform(plot);
    let best: 'A' | 'B' | 'C' | null = null;
    let bestD = 9999;

    for (const key of ['A', 'B', 'C'] as const) {
      const p = worldToScreen(params.triangle[key], T);
      const d = Math.hypot(mx - p.x, my - p.y);
      if (d < bestD) {
        bestD = d;
        best = key;
      }
    }

    return best && bestD < 28 ? { type: 'triangle', key: best } : null;
  }

  const geo = circleGeometry(plot, smooth.advancedMix);
  const alpha = normalizeAngle(smooth.alpha);
  const beta = clampSignedAngle(smooth.beta);
  const sumAngle = normalizeAngle(alpha + beta);
  const A = polarPoint(geo.cx, geo.cy, geo.r, alpha);
  const S = polarPoint(geo.cx, geo.cy, geo.r, sumAngle);
  const dA = Math.hypot(mx - A.x, my - A.y);
  const dS = Math.hypot(mx - S.x, my - S.y);
  const mouseAngle = normalizeAngle(Math.atan2(geo.cy - my, mx - geo.cx));
  const distFromCenter = Math.hypot(mx - geo.cx, my - geo.cy);
  const nearRim = Math.abs(distFromCenter - geo.r) < 26;

  if (dA < 30 && dA <= dS) return { type: 'alpha' };
  if (dS < 30) return { type: 'beta' };
  if (nearRim && Math.abs(beta) > 0.05 && angleOnSignedArc(mouseAngle, alpha, sumAngle)) {
    return { type: 'beta' };
  }
  return null;
}

export function applyVisualDrag(
  drag: VisualDragKind,
  mx: number,
  my: number,
  plot: PlotRect,
  params: TrigExploreParams,
  smooth: TrigSmoothState,
): Partial<TrigExploreParams> {
  if (drag.type === 'theta') {
    const geo = circleGeometry(plot, smooth.advancedMix);
    const angle = normalizeAngle(Math.atan2(geo.cy - my, mx - geo.cx));
    return { theta: setCircularTarget(params.theta, angle) };
  }

  if (drag.type === 'triangle') {
    const T = triangleTransform(plot);
    const p = screenToWorld({ x: mx, y: my }, T);
    const triangle = {
      ...params.triangle,
      [drag.key]: {
        x: clamp(p.x, -1.75, 1.75),
        y: clamp(p.y, -1.25, 1.35),
      },
    };
    return { triangle: preventTriangleCollapse(triangle, drag.key) };
  }

  const geo = circleGeometry(plot, smooth.advancedMix);

  if (drag.type === 'alpha') {
    const angle = normalizeAngle(Math.atan2(geo.cy - my, mx - geo.cx));
    return { alpha: setCircularTarget(params.alpha, angle) };
  }

  const sum = normalizeAngle(Math.atan2(geo.cy - my, mx - geo.cx));
  return { beta: shortestAngleDelta(normalizeAngle(params.alpha), sum) };
}
