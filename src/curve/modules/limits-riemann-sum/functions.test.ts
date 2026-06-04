import { describe, expect, it } from 'vitest';
import {
  clampForwardH,
  computeForwardSecant,
  getFunctionDef,
  isHViable,
  scaleToForwardH,
  scaleToPartitionCount,
} from './functions';
import type { FnKey } from './types';

describe('limits-riemann-sum helpers', () => {
  it('maps scale to a bounded monotonic partition count', () => {
    expect(scaleToPartitionCount(0)).toBe(6);
    expect(scaleToPartitionCount(1)).toBe(160);
    expect(scaleToPartitionCount(0.25)).toBeLessThan(scaleToPartitionCount(0.5));
    expect(scaleToPartitionCount(0.5)).toBeLessThan(scaleToPartitionCount(0.75));
    expect(scaleToPartitionCount(-1)).toBe(6);
    expect(scaleToPartitionCount(2)).toBe(160);
  });

  it('maps scale to a visible decreasing local span', () => {
    const fn = getFunctionDef('x2');
    const h0 = scaleToForwardH(fn, 0);
    const h1 = scaleToForwardH(fn, 0.5);
    const h2 = scaleToForwardH(fn, 1);

    expect(h0).toBeGreaterThan(h1);
    expect(h1).toBeGreaterThan(h2);
    expect(h2).toBeGreaterThanOrEqual((fn.b - fn.a) * 0.035);
  });

  it('clamps forward h at the right boundary only', () => {
    const fn = getFunctionDef('x2');

    expect(clampForwardH(fn, 0.2, 0.1)).toBeCloseTo(0.1, 6);
    expect(clampForwardH(fn, 0.95, 0.2)).toBeCloseTo(0.05, 6);
    expect(clampForwardH(fn, 0.5, -1)).toBe(0);
  });

  it('uses a relative h viability threshold', () => {
    const fn = getFunctionDef('sin');
    const threshold = (fn.b - fn.a) * 1e-4;

    expect(isHViable(fn, threshold * 0.9)).toBe(false);
    expect(isHViable(fn, threshold)).toBe(true);
  });

  it('computes a forward secant that approaches the derivative of x squared', () => {
    const fn = getFunctionDef('x2');
    const x = 0.42;
    const coarse = computeForwardSecant(fn, x, 0.2);
    const fine = computeForwardSecant(fn, x, 0.001);
    const exact = fn.df(x);

    expect(coarse.viable).toBe(true);
    expect(fine.viable).toBe(true);
    expect(Math.abs(fine.slope - exact)).toBeLessThan(Math.abs(coarse.slope - exact));
    expect(fine.slope).toBeCloseTo(exact, 2);
  });

  it('keeps every built-in comparison point away from boundaries', () => {
    const keys: FnKey[] = ['x2', 'sin', 'exp'];

    for (const key of keys) {
      const fn = getFunctionDef(key);
      const x = fn.a + (fn.b - fn.a) * fn.comparisonT;
      const h = scaleToForwardH(fn, 0.35);
      const secant = computeForwardSecant(fn, x, h);

      expect(fn.comparisonT).toBeGreaterThan(0.05);
      expect(fn.comparisonT).toBeLessThan(0.85);
      expect(secant.viable).toBe(true);
      expect(secant.x2).toBeLessThanOrEqual(fn.b);
      expect(Math.abs(secant.slope)).toBeGreaterThan(0.05);
    }
  });
});
