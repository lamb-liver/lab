/**
 * 2024 高考數學新課標 I 卷第 18 題。
 * f(x) = ln(x/(2−x)) + a x + b(x−1)³，定義域 (0, 2)。
 * 對每個 a、b，曲線關於 (1, a) 中心對稱：f(1+t) + f(1−t) = 2a。
 * 中心處的斜率是 2+a，立方項在那裡的導數是 0。
 * b = 0 時導數的最小值就是 2+a，所以導數不為負當且僅當 a ≥ −2。
 * 這一頁把 a 固定成 1，只拖 b。
 */

export const N_MIN = -30;
export const N_MAX = 30;
export const DEFAULT_N = 0;
export const FIXED_A = 1;
export const SAMPLE_T = 0.8;

export type BendReading = {
  n: number;
  a: number;
  b: number;
  leftX: number;
  rightX: number;
  leftY: number;
  rightY: number;
  midY: number;
  slope: number;
  atZero: boolean;
};

function clampN(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_N;
  return Math.min(N_MAX, Math.max(N_MIN, Math.round(value)));
}

export function valueAt(x: number, a: number, b: number): number {
  return Math.log(x / (2 - x)) + a * x + b * (x - 1) ** 3;
}

export function readBend(n: number): BendReading {
  const k = clampN(n);
  const a = FIXED_A;
  const b = k / 20;
  const leftX = 1 - SAMPLE_T;
  const rightX = 1 + SAMPLE_T;
  const leftY = valueAt(leftX, a, b);
  const rightY = valueAt(rightX, a, b);
  return {
    n: k,
    a,
    b,
    leftX,
    rightX,
    leftY,
    rightY,
    midY: (leftY + rightY) / 2,
    slope: 2 + a,
    atZero: k === 0,
  };
}
