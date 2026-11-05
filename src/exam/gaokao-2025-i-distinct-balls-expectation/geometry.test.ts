import { describe, expect, it } from 'vitest';
import {
  DISTRIBUTION,
  EMPTY_TALLY,
  EXPECTATION,
  HIT_PROBABILITY,
  TOTAL_OUTCOMES,
  addRound,
  averageX,
  distinctCount,
  makeRng,
  runRounds,
} from './geometry';

describe('2025 高考數學新課標 I 卷第 14 題的不同球數', () => {
  it('每顆球被取到的機率是 61/125，E(X) = 61/25', () => {
    expect(HIT_PROBABILITY).toBeCloseTo(61 / 125, 12);
    expect(EXPECTATION).toBeCloseTo(61 / 25, 12);
  });

  it('列分佈也得到同一個期望值', () => {
    expect(DISTRIBUTION[1] + DISTRIBUTION[2] + DISTRIBUTION[3]).toBe(TOTAL_OUTCOMES);
    const e = (1 * DISTRIBUTION[1] + 2 * DISTRIBUTION[2] + 3 * DISTRIBUTION[3]) / TOTAL_OUTCOMES;
    expect(e).toBeCloseTo(EXPECTATION, 12);
  });

  it('逐一列舉 125 種結果，X 的分佈相符', () => {
    const count = { 1: 0, 2: 0, 3: 0 } as Record<number, number>;
    for (let a = 1; a <= 5; a += 1)
      for (let b = 1; b <= 5; b += 1) for (let c = 1; c <= 5; c += 1) count[distinctCount([a, b, c])] += 1;
    expect(count).toEqual({ 1: 5, 2: 60, 3: 60 });
  });

  it('一輪記錄各球是否出現，X 等於亮燈數', () => {
    const t = addRound(EMPTY_TALLY, [2, 2, 5]);
    expect(t.hits).toEqual([0, 1, 0, 0, 1]);
    expect(t.sumX).toBe(2);
    expect(t.sumX).toBe(t.hits.reduce((s, h) => s + h, 0));
  });

  it('模擬多輪後平均值接近 61/25', () => {
    const t = runRounds(EMPTY_TALLY, makeRng(7), 20000);
    expect(Math.abs((averageX(t) ?? 0) - EXPECTATION)).toBeLessThan(0.03);
  });
});
