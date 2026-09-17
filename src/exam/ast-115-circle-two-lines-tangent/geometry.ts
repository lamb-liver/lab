export type Point2 = { x: number; y: number };

/** L1: y = (4/3)x  →  4x − 3y = 0 */
export const L1 = { a: 4, b: -3, c: 0 } as const;
/** L2: y = −(3/4)x  →  3x + 4y = 0 */
export const L2 = { a: 3, b: 4, c: 0 } as const;

const NORM = 5; // √(4²+3²) = √(3²+4²)

export function distancePointToLine(
  point: Point2,
  line: { a: number; b: number; c: number },
): number {
  return Math.abs(line.a * point.x + line.b * point.y + line.c) / NORM;
}

export function footOnLine(
  point: Point2,
  line: { a: number; b: number; c: number },
): Point2 {
  const denom = line.a * line.a + line.b * line.b;
  const t = (line.a * point.x + line.b * point.y + line.c) / denom;
  return { x: point.x - line.a * t, y: point.y - line.b * t };
}

/** Radius that makes d1 = 3 d2 when the circle stays off both lines. */
export function radiusForRatio(a: number): number {
  return Math.abs(a) / 2;
}

export function isNonIntersecting(a: number, radius: number): boolean {
  if (radius <= 0 || Math.abs(a) < 1e-9) return false;
  const center = { x: a, y: 0 };
  const d1 = distancePointToLine(center, L1);
  const d2 = distancePointToLine(center, L2);
  return d1 > radius + 1e-9 && d2 > radius + 1e-9;
}

export function minDistances(a: number, radius: number): { d1: number; d2: number } {
  const center = { x: a, y: 0 };
  return {
    d1: distancePointToLine(center, L1) - radius,
    d2: distancePointToLine(center, L2) - radius,
  };
}

export function ratioIsThreeToOne(a: number, radius: number, eps = 1e-6): boolean {
  const { d1, d2 } = minDistances(a, radius);
  if (d2 <= 0) return false;
  return Math.abs(d1 - 3 * d2) < eps;
}

/** Tangents from origin to circle (a,0), r=|a|/2 → slopes ±√3/3. */
export function tangentSlopesFromOrigin(a: number): number[] | null {
  const radius = radiusForRatio(a);
  if (!isNonIntersecting(a, radius)) return null;
  const m = Math.SQRT1_2 / Math.sqrt(1.5); // 1/√3
  return [m, -m];
}

export const OFFICIAL_TANGENT_SLOPE = Math.sqrt(3) / 3;

export function clampCenterA(a: number): number {
  if (Math.abs(a) < 0.8) return a >= 0 ? 0.8 : -0.8;
  if (a > 6) return 6;
  if (a < -6) return -6;
  return a;
}

export function nearCirclePointToward(
  center: Point2,
  foot: Point2,
  radius: number,
): Point2 {
  const dx = foot.x - center.x;
  const dy = foot.y - center.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: center.x + (dx / len) * radius,
    y: center.y + (dy / len) * radius,
  };
}
