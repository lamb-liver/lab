import { describe, expect, it } from 'vitest';
import { deriveLogisticStats, logisticY, safeTAtFraction } from './geometry';

describe('logisticY', () => {
  const params = { L: 100, k: 0.75, a: 12 };

  it('matches y(0) = L/(1+a)', () => {
    expect(logisticY(0, params)).toBeCloseTo(100 / 13);
  });

  it('approaches L for large t', () => {
    expect(logisticY(20, params)).toBeCloseTo(100, 0);
  });
});

describe('deriveLogisticStats', () => {
  it('places inflection at L/2', () => {
    const stats = deriveLogisticStats({ L: 100, k: 0.75, a: 12 });
    expect(stats.yStar).toBe(50);
    expect(logisticY(stats.tStar, { L: 100, k: 0.75, a: 12 })).toBeCloseTo(50, 1);
  });
});

describe('safeTAtFraction', () => {
  it('returns finite values for interior fractions', () => {
    const params = { L: 100, k: 0.75, a: 12 };
    expect(Number.isFinite(safeTAtFraction(0.2, params))).toBe(true);
    expect(Number.isFinite(safeTAtFraction(0.8, params))).toBe(true);
  });
});
