/**
 * 2026 高考數學新課標 I 卷第 18 題：橢圓 x²/4 + y²/3 = 1，左焦點 F(−1,0)。
 * 過 F、斜率 k > 0 的直線交橢圓於 P、Q（Q 在第三象限），R 是 P 關於原點的對稱點。
 * QR 與 QP 的斜率積固定為 −b²/a² = −3/4，所以 tan∠PQR = 4k + 3/k ≥ 4√3。
 */

export const A2 = 4;
export const B2 = 3;
export const K_MIN = 0.2;
export const K_MAX = 4;
export const K_AREA = Math.sqrt(5) / 2;
export const K_MIN_TAN = Math.sqrt(3) / 2;
export const MIN_TAN = 4 * Math.sqrt(3);

export type Pt = { x: number; y: number };

/** 直線 y = k(x+1) 與橢圓的兩個交點：P 在 x > −1 那側，Q 在第三象限 */
export function intersections(k: number): { P: Pt; Q: Pt; R: Pt } {
  const a = 3 + 4 * k * k;
  const b = 8 * k * k;
  const c = 4 * k * k - 12;
  const disc = Math.sqrt(b * b - 4 * a * c);
  const x1 = (-b + disc) / (2 * a);
  const x2 = (-b - disc) / (2 * a);
  const P = { x: x1, y: k * (x1 + 1) };
  const Q = { x: x2, y: k * (x2 + 1) };
  return { P, Q, R: { x: -P.x, y: -P.y } };
}

export function slope(a: Pt, b: Pt): number {
  return (b.y - a.y) / (b.x - a.x);
}

/** tan∠PQR，由兩個向量直接算 */
export function tanPQR(k: number): number {
  const { P, Q, R } = intersections(k);
  const u = { x: P.x - Q.x, y: P.y - Q.y };
  const v = { x: R.x - Q.x, y: R.y - Q.y };
  const cross = Math.abs(u.x * v.y - u.y * v.x);
  const dot = u.x * v.x + u.y * v.y;
  return cross / dot;
}

export function tanFormula(k: number): number {
  return 4 * k + 3 / k;
}

function area(a: Pt, b: Pt, c: Pt): number {
  return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
}

/** △PQR 與 △PFO 的面積比，第 (i) 小題要它等於 3 */
export function areaRatio(k: number): number {
  const { P, Q, R } = intersections(k);
  return area(P, Q, R) / area(P, { x: -1, y: 0 }, { x: 0, y: 0 });
}
