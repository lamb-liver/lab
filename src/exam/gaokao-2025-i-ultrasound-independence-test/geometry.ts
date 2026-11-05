/**
 * 2025 高考數學新課標 I 卷第 15 題：1000 人的 2×2 列聯表。
 * 列合計（患病 200、未患病 800）與行合計（正常 800、不正常 200）固定時，
 * 表格只剩一個自由度：b = 患病且檢查不正常的人數。原題 b = 180。
 */

export const N = 1000;
export const ILL = 200;
export const WELL = 800;
export const NORMAL = 800;
export const ABNORMAL = 200;

export const B_MIN = 0;
export const B_MAX = 200;
export const OFFICIAL_B = 180;

/** 獨立時的期望次數：200·200/1000 */
export const INDEPENDENT_B = (ILL * ABNORMAL) / N;

export const CRITICAL = [
  { alpha: 0.05, k: 3.841 },
  { alpha: 0.01, k: 6.635 },
  { alpha: 0.001, k: 10.828 },
] as const;

export type Table = { a: number; b: number; c: number; d: number };

/** a 患病正常、b 患病不正常、c 未患病正常、d 未患病不正常 */
export function tableFor(b: number): Table {
  const bb = Math.round(Math.min(B_MAX, Math.max(B_MIN, b)));
  return { a: ILL - bb, b: bb, c: NORMAL - (ILL - bb), d: ABNORMAL - bb };
}

export function expectedTable(): Table {
  return {
    a: (ILL * NORMAL) / N,
    b: (ILL * ABNORMAL) / N,
    c: (WELL * NORMAL) / N,
    d: (WELL * ABNORMAL) / N,
  };
}

export function chiSquare(t: Table): number {
  const n = t.a + t.b + t.c + t.d;
  const num = n * (t.a * t.d - t.b * t.c) ** 2;
  const den = (t.a + t.b) * (t.c + t.d) * (t.a + t.c) * (t.b + t.d);
  return num / den;
}

/** 檢查不正常者患病的比例（第一問的 P 估計值） */
export function illGivenAbnormal(t: Table): number {
  return t.b / (t.b + t.d);
}

export function illGivenNormal(t: Table): number {
  return t.a / (t.a + t.c);
}

/** 在 α = 0.001 下拒絕「無關」所需的最小 |b − 40| */
export function smallestRejectingB(alphaK = 10.828): number {
  for (let b = Math.ceil(INDEPENDENT_B); b <= B_MAX; b += 1) {
    if (chiSquare(tableFor(b)) > alphaK) return b;
  }
  return B_MAX;
}

export function clampB(b: number): number {
  if (!Number.isFinite(b)) return OFFICIAL_B;
  return Math.round(Math.min(B_MAX, Math.max(B_MIN, b)));
}
