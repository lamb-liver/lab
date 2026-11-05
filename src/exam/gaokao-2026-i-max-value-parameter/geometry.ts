/**
 * 2026 高考數學新課標 I 卷第 6 題：f(x) = (x+2)/(eˣ + a) 的最大值為 1，求 a。
 * f'(x) 的分子是 a − (x+1)eˣ。a > 0 時只有一個臨界點 x₀，滿足 a = (x₀+1)e^{x₀}，
 * 代回得 f(x₀) = e^{−x₀}：最大點落在曲線 y = e^{−x} 上。最大值 1 ⇔ x₀ = 0 ⇔ a = 1。
 */

export const A_MIN = 0.2;
export const A_MAX = 3;
export const OPTIONS = [
  { key: 'A', a: 0.5 },
  { key: 'B', a: 1 },
  { key: 'C', a: 1.5 },
  { key: 'D', a: 2 },
] as const;
export const ANSWER_A = 1;

export function f(x: number, a: number): number {
  return (x + 2) / (Math.exp(x) + a);
}

/** 解 (x+1)eˣ = a（x > −1 上單調遞增），用二分法 */
export function criticalX(a: number): number {
  let lo = -1;
  let hi = 5;
  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    if ((mid + 1) * Math.exp(mid) < a) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function maxValue(a: number): number {
  return f(criticalX(a), a);
}
