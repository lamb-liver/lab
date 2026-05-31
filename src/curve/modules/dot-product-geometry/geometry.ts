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

export type DotProductLayout = {
  origin: Vec2;
  scale: number;
  extent: number;
  plotMin: number;
  plotMax: number;
};

export const DOT_PRODUCT_DRAG_LIMIT = 6;
const EPS = 1e-6;

export function vectorFromParams(
  params: Pick<DotProductGeometryParams, 'ux' | 'uy' | 'vx' | 'vy'>,
): { u: Vec2; v: Vec2 } {
  return {
    u: { x: params.ux, y: params.uy },
    v: { x: params.vx, y: params.vy },
  };
}

export function dotVec(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function magnitude(v: Vec2): number {
  return Math.hypot(v.x, v.y);
}

export function scaleVec(v: Vec2, scalar: number): Vec2 {
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

export function computeDotProductExtent(params: DotProductGeometryParams): number {
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

export function sampleDotProductGeometryThumbnail(
  params: DotProductGeometryParams,
): ThumbnailSpec {
  const { u, v } = vectorFromParams(params);
  const metrics = computeDotProductMetrics(params);
  const origin = { x: 0, y: 0 };

  return {
    paths: [
      {
        points: [toCurvePoint(u, 0), toCurvePoint(metrics.projection, 1)],
        opacity: 0.24,
        strokeWidth: 0.8,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(metrics.projection, 1)],
        strokeWidth: 1.4,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(u, 1)],
        strokeWidth: 1.6,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(v, 1)],
        strokeWidth: 1.5,
      },
    ],
  };
}
