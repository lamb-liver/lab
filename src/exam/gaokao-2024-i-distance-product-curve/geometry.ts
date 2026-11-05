/**
 * 2024 高考數學新課標 I 卷第 11 題：曲線 C 上的點 x > −2，到 F(2, 0) 的距離乘上到直線 x = a 的距離等於 4。
 * C 過原點，所以 a = −2，方程是 √((x−2)² + y²)·(x + 2) = 4，也就是 y² = 16/(x+2)² − (x−2)²。
 */

export const F = { x: 2, y: 0 } as const;
export const A = -2;
export const PRODUCT = 4;
export const X_RIGHT = 2 * Math.SQRT2;
export const X_LEFT = -1.2;
export const DEFAULT_X = 2;

/** 上半支的 y（x 不在曲線範圍時回傳 null） */
export function upperY(x: number): number | null {
  if (x <= A) return null;
  const y2 = 16 / (x + 2) ** 2 - (x - 2) ** 2;
  if (y2 < -1e-12) return null;
  return Math.sqrt(Math.max(0, y2));
}

export function distanceToF(x: number, y: number): number {
  return Math.hypot(x - F.x, y - F.y);
}

export function distanceToLine(x: number): number {
  return x - A;
}

export function bound(x: number): number {
  return 4 / (x + 2);
}

/** 第一象限 y 的最大值（數值掃描） */
export function firstQuadrantMax(steps = 20000): { x: number; y: number } {
  let best = { x: 0, y: 0 };
  for (let i = 1; i <= steps; i += 1) {
    const x = (X_RIGHT * i) / steps;
    const y = upperY(x);
    if (y !== null && y > best.y) best = { x, y };
  }
  return best;
}

export function clampX(x: number): number {
  if (!Number.isFinite(x)) return DEFAULT_X;
  return Math.min(X_RIGHT, Math.max(X_LEFT, x));
}
