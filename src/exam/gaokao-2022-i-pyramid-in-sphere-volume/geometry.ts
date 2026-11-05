/**
 * 2022 高考數學新課標 I 卷第 8 題：正四棱錐頂點都在半徑 3 的球面上（球體積 36π），
 * 側棱長 l ∈ [3, 3√3]。高 h = l²/6，底面對角線的一半 d = √(l² − h²)，
 * 體積 V = (1/3)·2d²·h，在 l = 2√6 時最大 64/3，最小值在 l = 3 時 27/4。
 */

export const R = 3;
export const L_MIN = 3;
export const L_MAX = 3 * Math.sqrt(3);
export const L_PEAK = 2 * Math.sqrt(6);
export const DEFAULT_L = 4;

export type PyramidReading = {
  l: number;
  height: number;
  /** 底面對角線的一半 */
  halfDiagonal: number;
  /** 底面邊長 */
  side: number;
  volume: number;
};

export function readPyramid(lInput: number): PyramidReading {
  const l = clampL(lInput);
  const height = (l * l) / 6;
  const halfDiagonal = Math.sqrt(Math.max(0, l * l - height * height));
  const baseArea = 2 * halfDiagonal * halfDiagonal;
  return {
    l,
    height,
    halfDiagonal,
    side: Math.sqrt(baseArea),
    volume: (baseArea * height) / 3,
  };
}

export function volumeAt(l: number): number {
  return readPyramid(l).volume;
}

export function clampL(l: number): number {
  if (!Number.isFinite(l)) return DEFAULT_L;
  return Math.min(L_MAX, Math.max(L_MIN, l));
}

export const V_MIN = 27 / 4;
export const V_MAX = 64 / 3;
export const V_AT_L_MAX = 81 / 4;
