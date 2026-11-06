import { describe, expect, it } from 'vitest';
import { ANSWER_A, OPTIONS, criticalX, f, maxValue } from './geometry';

describe('2026 高考數學新課標 I 卷第 6 題的最大值', () => {
  it('最大點滿足 f(x₀) = e^{−x₀}', () => {
    for (const a of [0.3, 0.5, 1, 1.5, 2, 2.8]) {
      const x0 = criticalX(a);
      expect(maxValue(a)).toBeCloseTo(Math.exp(-x0), 10);
      for (let x = -1.9; x < 6; x += 0.01) expect(f(x, a)).toBeLessThanOrEqual(maxValue(a) + 1e-12);
    }
  });

  it('只有 a = 1 讓最大值是 1', () => {
    expect(criticalX(ANSWER_A)).toBeCloseTo(0, 10);
    expect(maxValue(ANSWER_A)).toBeCloseTo(1, 10);
    for (const o of OPTIONS) if (o.a !== ANSWER_A) expect(Math.abs(maxValue(o.a) - 1)).toBeGreaterThan(0.05);
  });
});
