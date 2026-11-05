/**
 * 2023 高考數學新課標 II 卷第 19 題：指標大於 c 判陽性。
 * 在 [95, 105] 內，患病者直方圖的頻率/組距是 0.002（95–100）、0.012（100–105）；
 * 未患病者是 0.01（95–100）、0.002（100–105）。100 以下另有未患病者 0.94，105 以上另有患病者 0.93。
 * 漏診率 p(c) = 患病者 ≤ c 的比例，誤診率 q(c) = 未患病者 > c 的比例。
 */

export const C_MIN = 95;
export const C_MAX = 105;
export const DEFAULT_C = 97.5;

export const ILL_BINS = [
  { from: 95, to: 100, density: 0.002 },
  { from: 100, to: 105, density: 0.012 },
] as const;

export const WELL_BINS = [
  { from: 95, to: 100, density: 0.01 },
  { from: 100, to: 105, density: 0.002 },
] as const;

/** 視窗外的比例：未患病者在 95 以下、患病者在 105 以上 */
export const WELL_BELOW_95 = 1 - 5 * 0.01 - 5 * 0.002;
export const ILL_ABOVE_105 = 1 - 5 * 0.002 - 5 * 0.012;

function massBelow(bins: readonly { from: number; to: number; density: number }[], c: number): number {
  let s = 0;
  for (const b of bins) s += b.density * Math.max(0, Math.min(c, b.to) - b.from);
  return s;
}

function massAbove(bins: readonly { from: number; to: number; density: number }[], c: number): number {
  let s = 0;
  for (const b of bins) s += b.density * Math.max(0, b.to - Math.max(c, b.from));
  return s;
}

export function missRate(c: number): number {
  return massBelow(ILL_BINS, clampC(c));
}

export function falseAlarmRate(c: number): number {
  return massAbove(WELL_BINS, clampC(c));
}

export function totalError(c: number): number {
  return missRate(c) + falseAlarmRate(c);
}

/** 第二問的分段式 */
export function totalErrorFormula(c: number): number {
  return c <= 100 ? -0.008 * c + 0.82 : 0.01 * c - 0.98;
}

export function clampC(c: number): number {
  if (!Number.isFinite(c)) return DEFAULT_C;
  return Math.min(C_MAX, Math.max(C_MIN, c));
}
