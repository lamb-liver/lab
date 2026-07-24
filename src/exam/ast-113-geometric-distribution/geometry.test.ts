import { describe, expect, it } from 'vitest';
import {
  atLeastOneProbability,
  generateGeometricSamples,
  geometricProbability,
  summarizeGeometricSamples,
  trialsForChanceAbove,
} from './geometry';

describe('113 分科數甲多選 4 的幾何分佈', () => {
  it('計算等待次數、有限次中獎率與嚴格超過 90% 的門檻', () => {
    expect(geometricProbability(1)).toBeCloseTo(0.1);
    expect(geometricProbability(2)).toBeCloseTo(0.09);
    expect(atLeastOneProbability(2)).toBeCloseTo(0.19);
    expect(trialsForChanceAbove(0.9)).toBe(22);
    expect(atLeastOneProbability(21)).toBeLessThanOrEqual(0.9);
    expect(atLeastOneProbability(22)).toBeGreaterThan(0.9);
  });

  it('固定 seed 的一萬次模擬可重現並收斂到期望值 10', () => {
    const samples = generateGeometricSamples(10_000);
    const repeated = generateGeometricSamples(10_000);
    const summary = summarizeGeometricSamples(samples, samples.length);

    expect(samples).toEqual(repeated);
    expect(summary.count).toBe(10_000);
    expect(summary.bins.reduce((sum, count) => sum + count, 0)).toBe(10_000);
    expect(summary.mean).toBeCloseTo(10, 0);
  });
});
