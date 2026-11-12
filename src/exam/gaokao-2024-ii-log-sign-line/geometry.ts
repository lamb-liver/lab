/**
 * 2024 高考數學新課標 II 卷第 8 題。
 * (x+a) ln(x+b) 在整個定義域上不為負，當且僅當兩個變號點重合，
 * 也就是 b−a=1。此時 a²+b² 是原點到這條直線的距離平方，最小值是 1/2，
 * 垂足是 (−1/2, 1/2)。
 * 滑桿只沿這條垂線移動：往原點走，距離平方小於 1/2，變號點分開。
 */

export const OFFSET_MIN = -0.55;
export const OFFSET_MAX = 1.05;
export const DEFAULT_OFFSET = 0;

const SQRT1_2 = Math.SQRT1_2;
const SQRT2 = Math.SQRT2;

export type LogSignReading = {
  offset: number;
  a: number;
  b: number;
  /** a²+b²，原點到 (a, b) 的距離平方。 */
  squared: number;
  /** 對數變號點減去一次變號點。重合時是 0。 */
  zeroGap: number;
  linearZero: number;
  logZero: number;
  /** 定義域的左端 x=−b，開區間。 */
  domainLeft: number;
  onLine: boolean;
  atMinimum: boolean;
};

function clampOffset(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_OFFSET;
  return Math.min(OFFSET_MAX, Math.max(OFFSET_MIN, value));
}

export function readLogSign(offset: number): LogSignReading {
  const d = clampOffset(offset);
  const a = -SQRT1_2 * (SQRT1_2 + d);
  const b = SQRT1_2 * (SQRT1_2 + d);
  const linearZero = -a;
  const logZero = 1 - b;
  return {
    offset: d,
    a,
    b,
    squared: (SQRT1_2 + d) * (SQRT1_2 + d),
    zeroGap: -d * SQRT2,
    linearZero,
    logZero,
    domainLeft: -b,
    onLine: Math.abs(d) < 0.008,
    atMinimum: Math.abs(d) < 0.005,
  };
}
