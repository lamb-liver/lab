import { describe, expect, it } from 'vitest';
import { FIXED_A, N_MAX, N_MIN, readBend, valueAt } from './geometry';

function gap(t: number, b: number): number {
  return Math.log((1 + t) / (1 - t)) - 2 * t + b * t ** 3;
}

describe('2024 高考數學新課標 I 卷第 18 題的對稱中心', () => {
  it('a 固定為 1 時，一對點的中點是 (1, 1)，中心斜率是 3', () => {
    for (let n = N_MIN; n <= N_MAX; n += 1) {
      const reading = readBend(n);
      expect(reading.a).toBe(FIXED_A);
      expect(reading.b).toBeCloseTo(n / 20, 10);
      expect(reading.midY).toBeCloseTo(FIXED_A, 8);
      expect(reading.leftY + reading.rightY).toBeCloseTo(2 * FIXED_A, 8);
      expect(reading.slope).toBe(3);
      expect(valueAt(1, reading.a, reading.b)).toBeCloseTo(FIXED_A, 10);
    }
  });

  it('對稱中心是 (1, a)，換 a 或 b 都不改', () => {
    for (const a of [-2, -0.5, 0, 1, 2.5]) {
      for (const b of [-1.5, -2 / 3, 0, 0.4, 1.5]) {
        for (const t of [0.1, 0.4, 0.8]) {
          expect(valueAt(1 + t, a, b) + valueAt(1 - t, a, b)).toBeCloseTo(2 * a, 8);
        }
      }
    }
  });

  it('b = 0 時，導數的最小值是 2 + a，門檻是 a = −2', () => {
    const derivative = (x: number, a: number) => 2 / (x * (2 - x)) + a;
    for (const a of [-3, -2, -1, 0, 1]) {
      let least = Infinity;
      for (let i = 1; i < 40; i += 1) {
        const x = i / 20;
        least = Math.min(least, derivative(x, a));
      }
      expect(least).toBeGreaterThanOrEqual(2 + a - 1e-9);
      expect(derivative(1, a)).toBeCloseTo(2 + a, 10);
      expect(least < 0).toBe(a < -2);
    }
  });

  it('a = −2 時，右側高於 −2 的門檻是 b = −2/3', () => {
    for (const t of [0.05, 0.2, 0.55, 0.9]) {
      expect(gap(t, -2 / 3)).toBeGreaterThan(0);
    }
    expect(gap(0.05, -2 / 3 - 0.05)).toBeLessThan(0);
  });

  it('滑桿出界時夾回整數格', () => {
    expect(readBend(Number.NaN).n).toBe(0);
    expect(readBend(Number.POSITIVE_INFINITY).n).toBe(0);
    expect(readBend(-100).n).toBe(N_MIN);
    expect(readBend(100).n).toBe(N_MAX);
    expect(readBend(1.6).n).toBe(2);
  });
});
