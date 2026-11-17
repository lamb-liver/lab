import { describe, expect, it } from 'vitest';
import { DEFAULT_N, N_MAX, N_MIN, readLead } from './geometry';

function step(n: number, k: number) {
  const row = readLead(n).steps.find((item) => item.k === k);
  if (!row) throw new Error(`missing k=${k}`);
  return row;
}

describe('readLead', () => {
  it('stops at p = 2/3 with gap ratio 4', () => {
    const reading = readLead(DEFAULT_N);
    expect(reading.p).toBeCloseTo(2 / 3, 12);
    expect(reading.q).toBeCloseTo(1 / 3, 12);
    expect(reading.atAnswer).toBe(true);
    expect(step(DEFAULT_N, 3).ahead).toBeCloseTo(reading.p ** 3, 12);
    expect(reading.goldGap).toBeCloseTo(3 * reading.p ** 3 * reading.q, 12);
    expect(reading.whiteGap).toBeCloseTo(3 * reading.q ** 3 * reading.p, 12);
    expect(reading.gapRatio).toBeCloseTo(4, 10);
  });

  it('keeps the gap ratio equal to the square of the odds', () => {
    for (const n of [N_MIN, 90, DEFAULT_N, 120, N_MAX]) {
      const reading = readLead(n);
      expect(reading.gapRatio).toBeCloseTo((reading.p / reading.q) ** 2, 8);
      expect(reading.goldGap).toBeGreaterThan(0);
      expect(reading.whiteGap).toBeGreaterThan(0);
    }
  });

  it('dips on odd counts and rises on the next even count', () => {
    for (const n of [N_MIN, DEFAULT_N, N_MAX]) {
      for (const m of [1, 2, 3]) {
        const even = step(n, 2 * m).difference;
        const odd = step(n, 2 * m + 1).difference;
        const next = step(n, 2 * m + 2).difference;
        expect(odd).toBeLessThan(even);
        expect(even).toBeLessThan(next);
      }
    }
  });

  it('counts a two-point lead from the binomial scores', () => {
    const reading = readLead(90);
    expect(step(90, 2).ahead).toBeCloseTo(reading.p ** 2, 12);
    expect(step(90, 2).behind).toBeCloseTo(reading.q ** 2, 12);
    for (const row of reading.steps) {
      expect(row.ahead + row.behind).toBeLessThanOrEqual(1);
      expect(row.difference).toBeCloseTo(row.ahead - row.behind, 12);
    }
  });

  it('matches the closed forms for the odd dip and the even rise', () => {
    const choose = (n: number, k: number) => {
      let c = 1;
      for (let i = 0; i < k; i += 1) c = (c * (n - i)) / (i + 1);
      return c;
    };
    for (const n of [N_MIN, DEFAULT_N, N_MAX]) {
      const { p, q } = readLead(n);
      for (const m of [1, 2, 3]) {
        const even = step(n, 2 * m).difference;
        const odd = step(n, 2 * m + 1).difference;
        const next = step(n, 2 * m + 2).difference;
        expect(odd - even).toBeCloseTo(-choose(2 * m, m + 1) * (p * q) ** m * (p - q), 12);
        expect(next - even).toBeCloseTo(choose(2 * m, m) * (p * q) ** m * (p - q), 12);
      }
    }
  });

  it('clamps non-finite and out-of-range stops', () => {
    expect(readLead(Number.NaN).n).toBe(DEFAULT_N);
    expect(readLead(Number.POSITIVE_INFINITY).atAnswer).toBe(true);
    expect(readLead(1).n).toBe(N_MIN);
    expect(readLead(999).n).toBe(N_MAX);
  });
});
