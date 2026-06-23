import type { CurvePoint, ThumbnailSpec } from '../../types';

export type Vec2 = { x: number; y: number };

export type VectorAdditionScalarParams = {
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  scalar: number;
};

type VectorAdditionScalarLayout = {
  origin: Vec2;
  scale: number;
  extent: number;
  plotMin: number;
  plotMax: number;
};

const VECTOR_DRAG_LIMIT = 3;
const GUIDE_STROKE = 'rgba(255, 255, 255, 0.26)';
const GOLD_STROKE = 'rgb(212, 184, 122)';
const BLUE_STROKE = 'rgba(130, 170, 220, 0.82)';
const SUM_FILL = 'rgba(212, 184, 122, 0.82)';
const VECTOR_FILL = 'rgba(130, 170, 220, 0.72)';

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function scaleVec(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function magnitude(v: Vec2): number {
  return Math.hypot(v.x, v.y);
}

export function vectorFromParams(
  params: Pick<VectorAdditionScalarParams, 'ux' | 'uy' | 'vx' | 'vy'>,
): { u: Vec2; v: Vec2 } {
  return {
    u: { x: params.ux, y: params.uy },
    v: { x: params.vx, y: params.vy },
  };
}

export function formatVector(v: Vec2): string {
  return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)})`;
}

function computeVectorExtent(params: VectorAdditionScalarParams): number {
  const { u, v } = vectorFromParams(params);
  const sum = add(u, v);
  const scaled = scaleVec(v, params.scalar);
  const maxMag = Math.max(
    magnitude(u),
    magnitude(v),
    magnitude(sum),
    magnitude(scaled),
    1,
  );
  return Math.max(2.4, maxMag * 1.18);
}

export function createVectorAdditionScalarLayout(
  width: number,
  height: number,
  params: VectorAdditionScalarParams,
): VectorAdditionScalarLayout {
  const base = Math.min(width, height);
  const plotMin = Math.max(28, base * 0.08);
  const plotMax = base - plotMin;
  const extent = computeVectorExtent(params);
  return {
    origin: { x: width * 0.5, y: height * 0.5 },
    scale: (plotMax - plotMin) / (extent * 2),
    extent,
    plotMin,
    plotMax,
  };
}

export function worldToScreen(layout: VectorAdditionScalarLayout, point: Vec2): Vec2 {
  return {
    x: layout.origin.x + point.x * layout.scale,
    y: layout.origin.y - point.y * layout.scale,
  };
}

export function screenToWorld(layout: VectorAdditionScalarLayout, point: Vec2): Vec2 {
  return {
    x: (point.x - layout.origin.x) / layout.scale,
    y: -(point.y - layout.origin.y) / layout.scale,
  };
}

export function clampDragWorld(point: Vec2): Vec2 {
  return {
    x: Math.max(-VECTOR_DRAG_LIMIT, Math.min(VECTOR_DRAG_LIMIT, point.x)),
    y: Math.max(-VECTOR_DRAG_LIMIT, Math.min(VECTOR_DRAG_LIMIT, point.y)),
  };
}

function toCurvePoint(v: Vec2, theta: number, scale = 82): CurvePoint {
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
  const size = 0.18;
  const wing = 0.11;

  return [
    toCurvePoint(to, theta),
    toCurvePoint({ x: to.x - ux * size - uy * wing, y: to.y - uy * size + ux * wing }, theta + 0.1),
    toCurvePoint({ x: to.x - ux * size + uy * wing, y: to.y - uy * size - ux * wing }, theta + 0.2),
  ];
}

function marker(v: Vec2, r = 3.2): { x: number; y: number; r: number; fill: string; opacity: number } {
  const point = toCurvePoint(v, 0);
  return { x: point.x, y: point.y, r, fill: GOLD_STROKE, opacity: 0.95 };
}

export function sampleVectorAdditionScalarThumbnail(
  params: VectorAdditionScalarParams,
): ThumbnailSpec {
  const { u, v } = vectorFromParams(params);
  const sum = add(u, v);
  const scaled = scaleVec(v, params.scalar);
  const origin = { x: 0, y: 0 };

  return {
    paths: [
      {
        points: [toCurvePoint(u, 0), toCurvePoint(sum, 1)],
        stroke: GUIDE_STROKE,
        opacity: 0.25,
        strokeWidth: 0.8,
      },
      {
        points: [toCurvePoint(v, 0), toCurvePoint(sum, 1)],
        stroke: GUIDE_STROKE,
        opacity: 0.25,
        strokeWidth: 0.8,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(u, 1)],
        stroke: BLUE_STROKE,
        strokeWidth: 1.2,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(v, 1)],
        stroke: BLUE_STROKE,
        strokeWidth: 1.2,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(sum, 1)],
        stroke: GOLD_STROKE,
        strokeWidth: 2.1,
      },
      {
        points: [toCurvePoint(origin, 0), toCurvePoint(scaled, 1)],
        stroke: 'rgba(255, 255, 255, 0.62)',
        strokeWidth: 1.5,
      },
      { points: arrowHead(origin, u, 2), closed: true, fill: VECTOR_FILL, opacity: 0.92 },
      { points: arrowHead(origin, v, 3), closed: true, fill: VECTOR_FILL, opacity: 0.92 },
      { points: arrowHead(origin, sum, 4), closed: true, fill: SUM_FILL, opacity: 0.98 },
      {
        points: arrowHead(origin, scaled, 5),
        closed: true,
        fill: 'rgba(255, 255, 255, 0.54)',
        opacity: 0.88,
      },
    ],
    circles: [
      { ...marker(origin, 2.4), fill: 'rgba(255, 255, 255, 0.72)' },
      marker(u),
      marker(v),
      marker(sum, 4.2),
    ],
  };
}
