import { describe, expect, it } from 'vitest';
import { A_VALUES, THETA_STEPS, f, isEven, isIncreasing } from './geometry';

describe('2026 高考數學新課標 I 卷第 13 題的偶函數相位', () => {
  it('偶函數只有 θ = π/2、3π/2', () => {
    for (const a of A_VALUES) {
      const even = [...Array(THETA_STEPS).keys()].filter((k) => isEven(a, (k * Math.PI) / 4));
      expect(even).toEqual([2, 6]);
    }
  });

  it('兩個條件同時成立只剩 θ = 3π/2，a = 1 或 2', () => {
    const ok: [number, number][] = [];
    for (const a of A_VALUES)
      for (let k = 0; k < THETA_STEPS; k += 1) {
        const t = (k * Math.PI) / 4;
        if (isEven(a, t) && isIncreasing(a, t)) ok.push([a, k]);
      }
    expect(ok).toEqual([
      [1, 6],
      [2, 6],
    ]);
    for (const [a] of ok) expect(f((2 * Math.PI) / 3, a, (3 * Math.PI) / 2)).toBeCloseTo(1, 10);
  });
});
