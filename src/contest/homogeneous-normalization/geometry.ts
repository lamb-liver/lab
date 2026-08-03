export type SimplexPoint = { a: number; b: number; c: number };

export type TriangleVertex = { x: number; y: number };

export type Triangle = {
  a: TriangleVertex;
  b: TriangleVertex;
  c: TriangleVertex;
};

export type HomogeneousMetrics = {
  s: number;
  q: number;
  r: number;
  lowerGap: number;
  upperGap: number;
};

export type StudyStage = 'degrees' | 'homogenize' | 'scale' | 'simplex';

export type SimplexLayer = 'q' | 'r' | 'lower' | 'upper';

export const SCALE_MIN = 0.25;
export const SCALE_MAX = 2;
export const SCALE_STEP = 0.05;
export const DEFAULT_SCALE = 1;
export const DEFAULT_SIMPLEX_POINT: SimplexPoint = {
  a: 1 / 3,
  b: 1 / 3,
  c: 1 / 3,
};
export const SCALE_EXAMPLE_POINT: SimplexPoint = { a: 0.5, b: 0.3, c: 0.2 };

export function getSimplexTriangle(width: number, height: number): Triangle {
  const padding = Math.max(28, Math.min(72, width * 0.1));
  const bottom = height - padding;
  const top = Math.max(padding + 32, height * 0.2);
  return {
    a: { x: width / 2, y: top },
    b: { x: padding, y: bottom },
    c: { x: width - padding, y: bottom },
  };
}

export function clampScale(value: number): number {
  return Math.min(SCALE_MAX, Math.max(SCALE_MIN, value));
}

export function normalizeSimplex(point: SimplexPoint): SimplexPoint {
  const a = Math.max(0, point.a);
  const b = Math.max(0, point.b);
  const c = Math.max(0, point.c);
  const total = a + b + c;
  if (total <= Number.EPSILON) return DEFAULT_SIMPLEX_POINT;
  return { a: a / total, b: b / total, c: c / total };
}

export function setSimplexA(point: SimplexPoint, a: number): SimplexPoint {
  const nextA = Math.min(1, Math.max(0, a));
  const remaining = 1 - nextA;
  const nextB = Math.min(point.b, remaining);
  return { a: nextA, b: nextB, c: remaining - nextB };
}

export function setSimplexB(point: SimplexPoint, b: number): SimplexPoint {
  const nextB = Math.min(1 - point.a, Math.max(0, b));
  return { a: point.a, b: nextB, c: 1 - point.a - nextB };
}

export function computeHomogeneousMetrics(point: SimplexPoint): HomogeneousMetrics {
  const { a, b, c } = normalizeSimplex(point);
  const s = a + b + c;
  const q = a * b + b * c + c * a;
  const r = a * b * c;
  return {
    s,
    q,
    r,
    lowerGap: s * q - 9 * r,
    upperGap: s ** 3 + 9 * r - 4 * s * q,
  };
}

export function scaleMetrics(metrics: HomogeneousMetrics, t: number): HomogeneousMetrics {
  const scale = clampScale(t);
  return {
    s: scale * metrics.s,
    q: scale ** 2 * metrics.q,
    r: scale ** 3 * metrics.r,
    lowerGap: scale ** 3 * metrics.lowerGap,
    upperGap: scale ** 3 * metrics.upperGap,
  };
}

export function simplexToCartesian(point: SimplexPoint, triangle: Triangle): TriangleVertex {
  const normalized = normalizeSimplex(point);
  return {
    x:
      normalized.a * triangle.a.x + normalized.b * triangle.b.x + normalized.c * triangle.c.x,
    y:
      normalized.a * triangle.a.y + normalized.b * triangle.b.y + normalized.c * triangle.c.y,
  };
}

export function cartesianToSimplex(point: TriangleVertex, triangle: Triangle): SimplexPoint {
  const denominator =
    (triangle.b.y - triangle.c.y) * (triangle.a.x - triangle.c.x) +
    (triangle.c.x - triangle.b.x) * (triangle.a.y - triangle.c.y);
  if (Math.abs(denominator) <= Number.EPSILON) return DEFAULT_SIMPLEX_POINT;

  const a =
    ((triangle.b.y - triangle.c.y) * (point.x - triangle.c.x) +
      (triangle.c.x - triangle.b.x) * (point.y - triangle.c.y)) /
    denominator;
  const b =
    ((triangle.c.y - triangle.a.y) * (point.x - triangle.c.x) +
      (triangle.a.x - triangle.c.x) * (point.y - triangle.c.y)) /
    denominator;
  return normalizeSimplex({ a, b, c: 1 - a - b });
}

export function formatNumber(value: number, digits = 3): string {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}
