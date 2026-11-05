import { describe, expect, it } from 'vitest';
import { MATCHINGS, distribution, score } from './geometry';

describe('2024 高考數學新課標 I 卷第 14 題的配對', () => {
  it('24 種配對，得分分佈 1、11、11、1、0', () => {
    expect(MATCHINGS).toHaveLength(24);
    expect(distribution()).toEqual([1, 11, 11, 1, 0]);
  });

  it('得分至少 2 的機率是 1/2，期望 3/2', () => {
    const d = distribution();
    expect((d[2] + d[3]) / 24).toBe(1 / 2);
    expect(MATCHINGS.reduce((s, m) => s + score(m), 0) / 24).toBe(3 / 2);
    expect(score([3, 0, 1, 2])).toBe(3);
  });
});
