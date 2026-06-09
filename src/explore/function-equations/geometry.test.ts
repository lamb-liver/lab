import { describe, expect, it } from 'vitest';
import {
  cleanQuadraticParams,
  polynomialPositiveIntervals,
  polyValue,
  quadraticPositiveIntervals,
  quadraticRoots,
  rootsFromSample,
  sanitizeQuadraticA,
  transformValue,
} from './geometry';
import { DEFAULT_PARAMS } from './constants';

describe('function-equations geometry', () => {
  it('quadraticRoots returns two sorted roots when Δ>0', () => {
    const roots = quadraticRoots({ a: 1, b: -1, c: -2 });
    expect(roots).toHaveLength(2);
    expect(roots[0]).toBeLessThan(roots[1]);
    expect(roots[0]).toBeCloseTo(-1, 2);
    expect(roots[1]).toBeCloseTo(2, 2);
  });

  it('quadraticRoots returns one root when Δ=0', () => {
    const roots = quadraticRoots({ a: 1, b: -2, c: 1 });
    expect(roots).toHaveLength(1);
    expect(roots[0]).toBeCloseTo(1, 3);
  });

  it('quadraticPositiveIntervals follows opening direction', () => {
    const roots = [-1, 2];
    expect(quadraticPositiveIntervals(1, roots)).toEqual([
      [-5, -1],
      [2, 5],
    ]);
    expect(quadraticPositiveIntervals(-1, roots)).toEqual([[-1, 2]]);
  });

  it('sanitizeQuadraticA avoids near-zero a', () => {
    expect(sanitizeQuadraticA(0)).toBe(0.12);
    expect(sanitizeQuadraticA(-0.01)).toBe(-0.12);
    expect(cleanQuadraticParams({ a: 0, b: 1, c: 0 }).a).toBe(0.12);
  });

  it('polynomialPositiveIntervals respects multiplicity 1 and 2', () => {
    const intervals = polynomialPositiveIntervals({
      roots: [-2, 0, 2],
      mult: [1, 2, 1],
    });
    expect(intervals.length).toBeGreaterThan(0);
    for (const [a, b] of intervals) {
      const mid = (a + b) / 2;
      expect(polyValue({ roots: [-2, 0, 2], mult: [1, 2, 1] }, mid)).toBeGreaterThan(0);
    }
  });

  it('transformValue matches base square at identity transform', () => {
    expect(
      transformValue({ basis: 'square', a: 1, b: 1, h: 0, k: 0 }, 3),
    ).toBeCloseTo(9, 6);
  });

  it('rootsFromSample finds sign changes', () => {
    const points = [
      { x: -1, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ];
    const roots = rootsFromSample(points);
    expect(roots.some((r) => Math.abs(r) < 0.1)).toBe(true);
  });

  it('default polynomial multiplicities are only 1 or 2', () => {
    for (const m of DEFAULT_PARAMS.polynomial.mult) {
      expect([1, 2]).toContain(m);
    }
  });
});
