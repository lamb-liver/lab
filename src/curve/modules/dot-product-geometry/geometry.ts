import type { CurvePoint, ThumbnailSpec } from '../../types';

export type Vec2 = { x: number; y: number };

export type DotProductMode = 'dot' | 'work';

export type DotProductGeometryParams = {
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  mode: DotProductMode;
};

export type DotProductMetrics = {
  mode: DotProductMode;
  labelA: string;
  labelB: string;
  resultLabel: string;
  dot: number;
  lenU: number;
  lenV: number;
  hasAngle: boolean;
  cosTheta: number;
  theta: number;
  comp: number;
  projection: Vec2;
  relation: string;
  isPerpendicular: boolean;
};

type DotProductLayout = {
  origin: Vec2;
  scale: number;
  extent: number;
  plotMin: number;
  plotMax: number;
};

const DOT_PRODUCT_DRAG_LIMIT = 6;
const EPS = 1e-6;
const GUIDE_STROKE = 'rgba(255, 255, 255, 0.3)';
const GOLD_STROKE = 'rgb(212, 184, 122)';
const BLUE_STROKE = 'rgba(130, 170, 220, 0.82)';
const GOLD_FILL = 'rgba(212, 184, 122, 0.82)';
const BLUE_FILL = 'rgba(130, 170, 220, 0.72)';

export function vectorFromParams(
  params: Pick<DotProductGeometryParams, 'ux' | 'uy' | 'vx' | 'vy'>,
): { u: Vec2; v: Vec2 } {
  return {
    u: { x: params.ux, y: params.uy },
    v: { x: params.vx, y: params.vy },
  };
}

function dotVec(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

function magnitude(v: Vec2): number {
  return Math.hypot(v.x, v.y);
}

function scaleVec(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function formatVector(v: Vec2): string {
  return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)})`;
}

export function formatAngle(rad: number): string {
  return `${((rad * 180) / Math.PI).toFixed(1)}°`;
}

export function computeDotProductMetrics(params: DotProductGeometryParams): DotProductMetrics {
  const { u, v } = vectorFromParams(params);
  const dot = dotVec(u, v);
  const lenU = magnitude(u);
  const lenV = magnitude(v);
  const hasAngle = lenU > EPS && lenV > EPS;
  const cosTheta = hasAngle
    ? Math.max(-1, Math.min(1, dot / (lenU * lenV)))
    : 0;
  const theta = hasAngle ? Math.acos(cosTheta) : 0;
  const comp = lenV > EPS ? dot / lenV : 0;
  const projection = lenV > EPS ? scaleVec(v, dot / dotVec(v, v)) : { x: 0, y: 0 };
  const isPerpendicular = hasAngle && Math.abs(cosTheta) < 0.025;
  const labelA = params.mode === 'work' ? 'F' : 'u';
  const labelB = params.mode === 'work' ? 'd' : 'v';
  const resultLabel = params.mode === 'work' ? 'W' : 'u · v';

  let relation = '零向量：角度未定義';
  if (hasAngle && isPerpendicular) relation = `${labelA} ⟂ ${labelB}`;
  else if (hasAngle && dot > 0) relation = '銳角：內積為正';
  else if (hasAngle) relation = '鈍角：內積為負';

  return {
    mode: params.mode,
    labelA,
    labelB,
    resultLabel,
    dot,
    lenU,
    lenV,
    hasAngle,
    cosTheta,
    theta,
    comp,
    projection,
    relation,
    isPerpendicular,
  };
}

function computeDotProductExtent(params: DotProductGeometryParams): number {
  const { u, v } = vectorFromParams(params);
  const metrics = computeDotProductMetrics(params);
  const maxMag = Math.max(
    magnitude(u),
    magnitude(v),
    magnitude(metrics.projection),
    1,
  );
  return Math.max(4.2, maxMag * 1.2);
}

export function createDotProductLayout(
  width: number,
  height: number,
  params: DotProductGeometryParams,
): DotProductLayout {
  const base = Math.min(width, height);
  const plotMin = Math.max(28, base * 0.08);
  const plotMax = base - plotMin;
  const extent = computeDotProductExtent(params);

  return {
    origin: { x: width * 0.5, y: height * 0.5 },
    scale: (plotMax - plotMin) / (extent * 2),
    extent,
    plotMin,
    plotMax,
  };
}

export function worldToScreen(layout: DotProductLayout, point: Vec2): Vec2 {
  return {
    x: layout.origin.x + point.x * layout.scale,
    y: layout.origin.y - point.y * layout.scale,
  };
}

export function screenToWorld(layout: DotProductLayout, point: Vec2): Vec2 {
  return {
    x: (point.x - layout.origin.x) / layout.scale,
    y: -(point.y - layout.origin.y) / layout.scale,
  };
}

export function clampDragWorld(point: Vec2): Vec2 {
  return {
    x: Math.max(-DOT_PRODUCT_DRAG_LIMIT, Math.min(DOT_PRODUCT_DRAG_LIMIT, point.x)),
    y: Math.max(-DOT_PRODUCT_DRAG_LIMIT, Math.min(DOT_PRODUCT_DRAG_LIMIT, point.y)),
  };
}

export function shortestAngleDelta(a: number, b: number): number {
  const tau = Math.PI * 2;
  return ((((b - a + Math.PI) % tau) + tau) % tau) - Math.PI;
}

function toCurvePoint(v: Vec2, theta: number, scale = 42): CurvePoint {
  return {
    x: v.x * scale,
    y: -v.y * scale,
    theta,
    arcLength: magnitude(v) * scale,
  };
}

function arrowHead(from: Vec2, to: Vec2, theta: number): CurvePoint[] {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const size = 0.34;
  const wing = 0.2;

  return [
    toCurvePoint(to, theta),
    toCurvePoint({ x: to.x - ux * size - uy * wing, y: to.y - uy * size + ux * wing }, theta + 0.1),
    toCurvePoint({ x: to.x - ux * size + uy * wing, y: to.y - uy * size - ux * wing }, theta + 0.2),
  ];
}

function marker(v: Vec2, fill = GOLD_STROKE, r = 0.09): { x: number; y: number; r: number; fill: string; opacity: number } {
  const point = toCurvePoint(v, 0);
  return { x: point.x, y: point.y, r: r * 42, fill, opacity: 0.95 };
}

export function sampleDotProductGeometryThumbnail(
  params: DotProductGeometryParams,
): ThumbnailSpec {
  const { u, v } = vectorFromParams(params);
  const metrics = computeDotProductMetrics(params);
  const origin = { x: 0, y: 0 };
  const vAxisStart = scaleVec(v, -0.16);
  const vAxisEnd = scaleVec(v, 1.18);

  return {
    paths: [
      {
        points: [toCurvePoint(u, 0), toCurvePoint(metrics.projection, 1)],
        stroke: GUIDE_STROKE,
        opacity: 0.34,
        strokeWidth: 0.8,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(metrics.projection, 1)],
        stroke: GOLD_STROKE,
        strokeWidth: 2,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(u, 1)],
        stroke: BLUE_STROKE,
        strokeWidth: 1.6,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(v, 1)],
        stroke: 'rgba(255, 255, 255, 0.66)',
        strokeWidth: 1.5,
      },
      {
        points: [toCurvePoint(vAxisStart, 0), toCurvePoint(vAxisEnd, 1)],
        stroke: 'rgba(255, 255, 255, 0.18)',
        strokeWidth: 0.7,
        opacity: 0.9,
      },
      { points: arrowHead(origin, metrics.projection, 2), closed: true, fill: GOLD_FILL, opacity: 0.96 },
      { points: arrowHead(origin, u, 3), closed: true, fill: BLUE_FILL, opacity: 0.92 },
      {
        points: arrowHead(origin, v, 4),
        closed: true,
        fill: 'rgba(255, 255, 255, 0.58)',
        opacity: 0.88,
      },
    ],
    circles: [
      marker(origin, 'rgba(255, 255, 255, 0.72)', 0.07),
      marker(metrics.projection, GOLD_STROKE, 0.1),
      marker(u, BLUE_STROKE, 0.09),
    ],
  };
}
