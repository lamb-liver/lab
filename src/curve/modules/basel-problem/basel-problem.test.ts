import { describe, expect, it } from 'vitest';
import {
  PI2_OVER_6,
  buildPartialSeries,
  calculateBaselStats,
  estimateLimit,
} from './geometry';

describe('basel-problem 幾何', () => {
  it('PI2_OVER_6 為巴塞爾問題極限值', () => {
    expect(PI2_OVER_6).toBeCloseTo(1.6449340668, 9);
  });

  it('部分和單調遞增且收斂於 π²/6 之下', () => {
    const small = buildPartialSeries({ N: 10, p: 2 });
    const large = buildPartialSeries({ N: 80, p: 2 });
    expect(large.sum).toBeGreaterThan(small.sum);
    expect(large.sum).toBeLessThan(PI2_OVER_6);
    expect(PI2_OVER_6 - large.sum).toBeLessThan(0.02);
    expect(large.points).toHaveLength(80);
  });

  it('p=2 統計回報對 π²/6 的誤差', () => {
    const stats = calculateBaselStats({ N: 80, p: 2 });
    expect(stats.limit).toBe(PI2_OVER_6);
    expect(stats.error).toBeCloseTo(PI2_OVER_6 - stats.sum, 12);
    expect(stats.relErr).toBeGreaterThan(0);
  });

  it('estimateLimit：p=2 用解析值，p≤1 發散回傳 null', () => {
    expect(estimateLimit(2)).toBe(PI2_OVER_6);
    expect(estimateLimit(1)).toBeNull();
    expect(estimateLimit(3)).toBeCloseTo(1.2020569, 3);
  });
});
