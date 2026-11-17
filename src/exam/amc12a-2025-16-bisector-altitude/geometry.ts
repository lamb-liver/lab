/**
 * 2025 AMC 12A #16：AB = 80，BC = 45，AC = 75。
 * B 的角平分線交 AC 於 D，再與 AB 上的高交於 P。
 * AD = 48，CD = 27，BD = 48，PD = 27，BP = 21。
 */

export const AB = 80;
export const BC = 45;
export const AC = 75;
export const AD = 48;
export const CD = 27;
export const BD = 48;
export const PD = 27;
export const BP = 21;

export type Point2 = { x: number; y: number };

export function distance(a: Point2, b: Point2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** A 在原點，B 在 (80, 0)，C 在 AB 的上方。 */
export function trianglePoints(): {
  A: Point2;
  B: Point2;
  C: Point2;
  D: Point2;
  H: Point2;
  P: Point2;
} {
  const A = { x: 0, y: 0 };
  const B = { x: AB, y: 0 };
  const cx = (AB * AB + AC * AC - BC * BC) / (2 * AB);
  const C = { x: cx, y: Math.sqrt(AC * AC - cx * cx) };
  const along = AD / AC;
  const D = { x: C.x * along, y: C.y * along };
  const H = { x: C.x, y: 0 };
  const t = (C.x - B.x) / (D.x - B.x);
  const P = { x: B.x + t * (D.x - B.x), y: B.y + t * (D.y - B.y) };
  return { A, B, C, D, H, P };
}
