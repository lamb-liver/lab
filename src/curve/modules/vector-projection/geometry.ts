import type { CurvePoint, ThumbnailSpec } from '../../types';

export type Vec2 = { x: number; y: number };

export type ProjectionMode = 'a_on_b' | 'b_on_a';
export type ProjectionViewMode = 'projection' | 'basis';

export type VectorProjectionParams = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  projectionMode: ProjectionMode;
  viewMode: ProjectionViewMode;
};

export type ProjectionData = {
  valid: boolean;
  target: Vec2;
  base: Vec2;
  targetLabel: string;
  baseLabel: string;
  dot: number;
  denom: number;
  scalar: number;
  proj: Vec2;
  perp: Vec2;
  perpLen: number;
  perpDot: number;
  e1: Vec2;
  e2: Vec2;
  c1: number;
  c2: number;
  projLabel: string;
  perpLabel: string;
  fullProjLabel: string;
};

export type VectorProjectionLayout = {
  origin: Vec2;
  scale: number;
  extent: number;
  plotMin: number;
  plotMax: number;
};

export const VECTOR_PROJECTION_DRAG_LIMIT = 6;
const EPS = 1e-6;

export function vectorFromParams(
  params: Pick<VectorProjectionParams, 'ax' | 'ay' | 'bx' | 'by'>,
): { a: Vec2; b: Vec2 } {
  return {
    a: { x: params.ax, y: params.ay },
    b: { x: params.bx, y: params.by },
  };
}

export function dotVec(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function magnitude(v: Vec2): number {
  return Math.hypot(v.x, v.y);
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scaleVec(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function normalize(v: Vec2): Vec2 {
  const m = magnitude(v);
  if (m < EPS) return { x: 0, y: 0 };
  return { x: v.x / m, y: v.y / m };
}

export function rotateCCW(v: Vec2): Vec2 {
  return { x: -v.y, y: v.x };
}

export function lerpVec(a: Vec2, b: Vec2, t: number): Vec2 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

export function formatVector(v: Vec2): string {
  return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)})`;
}

export function formatNearZero(value: number): string {
  return Math.abs(value) < EPS ? '≈ 0' : value.toFixed(3);
}

export function getProjectionData(params: VectorProjectionParams): ProjectionData {
  const { a, b } = vectorFromParams(params);
  const swap = params.projectionMode === 'b_on_a';
  const target = swap ? b : a;
  const base = swap ? a : b;
  const targetLabel = swap ? 'b' : 'a';
  const baseLabel = swap ? 'a' : 'b';
  const dot = dotVec(target, base);
  const denom = dotVec(base, base);
  const valid = denom > EPS;
  const projLabel = `${targetLabel}∥`;
  const perpLabel = `${targetLabel}⊥`;
  const fullProjLabel = `proj_${baseLabel} ${targetLabel}`;

  if (!valid) {
    return {
      valid: false,
      target,
      base,
      targetLabel,
      baseLabel,
      dot,
      denom,
      scalar: 0,
      proj: { x: 0, y: 0 },
      perp: target,
      perpLen: magnitude(target),
      perpDot: 0,
      e1: { x: 0, y: 0 },
      e2: { x: 0, y: 0 },
      c1: 0,
      c2: 0,
      projLabel,
      perpLabel,
      fullProjLabel,
    };
  }

  const scalar = dot / denom;
  const proj = scaleVec(base, scalar);
  const perp = sub(target, proj);
  const e1 = normalize(base);
  const e2 = rotateCCW(e1);
  const c1 = dotVec(target, e1);
  const c2 = dotVec(target, e2);

  return {
    valid: true,
    target,
    base,
    targetLabel,
    baseLabel,
    dot,
    denom,
    scalar,
    proj,
    perp,
    perpLen: magnitude(perp),
    perpDot: dotVec(perp, base),
    e1,
    e2,
    c1,
    c2,
    projLabel,
    perpLabel,
    fullProjLabel,
  };
}

export function computeVectorProjectionExtent(params: VectorProjectionParams): number {
  const { a, b } = vectorFromParams(params);
  const data = getProjectionData(params);
  const maxMag = Math.max(
    magnitude(a),
    magnitude(b),
    magnitude(data.proj),
    magnitude(add(data.proj, data.perp)),
    1,
  );
  return Math.max(4.6, maxMag * 1.2);
}

export function createVectorProjectionLayout(
  width: number,
  height: number,
  params: VectorProjectionParams,
): VectorProjectionLayout {
  const base = Math.min(width, height);
  const plotMin = Math.max(28, base * 0.08);
  const plotMax = base - plotMin;
  const extent = computeVectorProjectionExtent(params);

  return {
    origin: { x: width * 0.5, y: height * 0.5 },
    scale: (plotMax - plotMin) / (extent * 2),
    extent,
    plotMin,
    plotMax,
  };
}

export function worldToScreen(layout: VectorProjectionLayout, point: Vec2): Vec2 {
  return {
    x: layout.origin.x + point.x * layout.scale,
    y: layout.origin.y - point.y * layout.scale,
  };
}

export function screenToWorld(layout: VectorProjectionLayout, point: Vec2): Vec2 {
  return {
    x: (point.x - layout.origin.x) / layout.scale,
    y: -(point.y - layout.origin.y) / layout.scale,
  };
}

export function screenUnitFromWorldVec(
  layout: VectorProjectionLayout,
  vec: Vec2,
): Vec2 {
  const origin = worldToScreen(layout, { x: 0, y: 0 });
  const point = worldToScreen(layout, vec);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.001) return { x: 1, y: 0 };
  return { x: dx / len, y: dy / len };
}

export function clampDragWorld(point: Vec2): Vec2 {
  return {
    x: Math.max(-VECTOR_PROJECTION_DRAG_LIMIT, Math.min(VECTOR_PROJECTION_DRAG_LIMIT, point.x)),
    y: Math.max(-VECTOR_PROJECTION_DRAG_LIMIT, Math.min(VECTOR_PROJECTION_DRAG_LIMIT, point.y)),
  };
}

function toCurvePoint(v: Vec2, theta: number, scale = 42): CurvePoint {
  return {
    x: v.x * scale,
    y: -v.y * scale,
    theta,
    arcLength: magnitude(v) * scale,
  };
}

export function sampleVectorProjectionThumbnail(
  params: VectorProjectionParams,
): ThumbnailSpec {
  const { a, b } = vectorFromParams(params);
  const data = getProjectionData(params);
  const origin = { x: 0, y: 0 };

  return {
    paths: [
      {
        points: [toCurvePoint(data.target, 0), toCurvePoint(data.proj, 1)],
        opacity: 0.24,
        strokeWidth: 0.8,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(data.proj, 1)],
        strokeWidth: 1.5,
      },
      {
        points: [toCurvePoint(data.proj, 0), toCurvePoint(data.target, 1)],
        strokeWidth: 1.2,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(a, 1)],
        strokeWidth: 1.6,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(b, 1)],
        strokeWidth: 1.4,
      },
    ],
  };
}
