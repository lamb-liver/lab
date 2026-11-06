/**
 * 2026 高考數學新課標 I 卷第 13 題：f(x) = 2sin(ax + θ)，a ∈ N，0 ≤ θ < 2π，
 * f 是偶函數且在 (0, π/2) 遞增，求 θ 與 f(2π/3)。
 * 偶函數要 sin θ = ±1，θ = π/2 或 3π/2。θ = π/2 時 f(0) = 2 是最大值，右邊只能往下；
 * θ = 3π/2 時 f = −2cos(ax)，在 (0, π/2) 遞增要 aπ/2 ≤ π，a = 1 或 2，兩者都給 f(2π/3) = 1。
 */

export const THETA_STEPS = 8; // θ = kπ/4，k = 0…7
export const A_VALUES = [1, 2, 3, 4] as const;
export const ANSWER_THETA = (3 * Math.PI) / 2;

export function f(x: number, a: number, theta: number): number {
  return 2 * Math.sin(a * x + theta);
}

export function isEven(a: number, theta: number): boolean {
  for (let x = 0.1; x < 3; x += 0.37) if (Math.abs(f(x, a, theta) - f(-x, a, theta)) > 1e-9) return false;
  return true;
}

/** 在 (0, π/2) 上是否遞增：f' = 2a cos(ax + θ) ≥ 0 */
export function isIncreasing(a: number, theta: number): boolean {
  const n = 400;
  for (let i = 1; i < n; i += 1) {
    const x = (i / n) * (Math.PI / 2);
    if (Math.cos(a * x + theta) < -1e-9) return false;
  }
  return true;
}

export function thetaLabel(k: number): string {
  const labels = ['0', 'π/4', 'π/2', '3π/4', 'π', '5π/4', '3π/2', '7π/4'];
  return labels[k];
}
