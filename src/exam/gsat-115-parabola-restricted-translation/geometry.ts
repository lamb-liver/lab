export type Point2 = { x: number; y: number };

export const ORIGINAL_VERTEX: Point2 = { x: 0, y: 1 };
export const FIXED_POINT: Point2 = { x: 0.5, y: 0 };
export const TRANSLATED_VERTEX_H = 1.5;

export function translatedVertex(h: number): Point2 {
  return { x: h, y: 1 + 2 * h };
}

export function parabolaValue(x: number, h = 0): number {
  const vertex = translatedVertex(h);
  return -4 * (x - vertex.x) ** 2 + vertex.y;
}

export function fixedPointResidual(h: number): number {
  return parabolaValue(FIXED_POINT.x, h) - FIXED_POINT.y;
}

export function translationDistance(h: number): number {
  return Math.abs(h) * Math.sqrt(5);
}
