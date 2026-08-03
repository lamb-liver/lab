import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SIMPLEX_POINT,
  SCALE_EXAMPLE_POINT,
  SCALE_MAX,
  SCALE_MIN,
  cartesianToSimplex,
  clampScale,
  computeHomogeneousMetrics,
  formatNumber,
  normalizeSimplex,
  scaleMetrics,
  setSimplexA,
  setSimplexB,
  simplexToCartesian,
} from './geometry';

const triangle = {
  a: { x: 0, y: 0 },
  b: { x: 1, y: 0 },
  c: { x: 0, y: 1 },
};

describe('homogeneous normalization geometry', () => {
  it('keeps both normalized gaps non-negative', () => {
    const samples = [
      { a: 1, b: 0, c: 0 },
      { a: 0.5, b: 0.5, c: 0 },
      { a: 0.2, b: 0.3, c: 0.5 },
      DEFAULT_SIMPLEX_POINT,
    ];

    for (const sample of samples) {
      const metrics = computeHomogeneousMetrics(sample);
      expect(metrics.lowerGap).toBeGreaterThanOrEqual(-1e-12);
      expect(metrics.upperGap).toBeGreaterThanOrEqual(-1e-12);
    }
  });

  it('scales both cubic gaps by t cubed', () => {
    const metrics = computeHomogeneousMetrics(SCALE_EXAMPLE_POINT);
    const t = 1.7;
    const scaled = scaleMetrics(metrics, t);
    expect(metrics.lowerGap).toBeGreaterThan(0);
    expect(metrics.upperGap).toBeGreaterThan(0);
    expect(scaled.lowerGap).toBeCloseTo(metrics.lowerGap * t ** 3);
    expect(scaled.upperGap).toBeCloseTo(metrics.upperGap * t ** 3);
  });

  it('matches equality locations for lower and upper gaps', () => {
    const center = computeHomogeneousMetrics(DEFAULT_SIMPLEX_POINT);
    expect(center.lowerGap).toBeCloseTo(0);
    expect(center.upperGap).toBeCloseTo(0);

    for (const vertex of [
      { a: 1, b: 0, c: 0 },
      { a: 0, b: 1, c: 0 },
      { a: 0, b: 0, c: 1 },
    ]) {
      const metrics = computeHomogeneousMetrics(vertex);
      expect(metrics.lowerGap).toBeCloseTo(0);
      expect(metrics.upperGap).toBeGreaterThan(0);
    }

    for (const midpoint of [
      { a: 0.5, b: 0.5, c: 0 },
      { a: 0, b: 0.5, c: 0.5 },
      { a: 0.5, b: 0, c: 0.5 },
    ]) {
      const metrics = computeHomogeneousMetrics(midpoint);
      expect(metrics.lowerGap).toBeGreaterThan(0);
      expect(metrics.upperGap).toBeCloseTo(0);
    }
  });

  it('normalizes points to the closed simplex', () => {
    for (const point of [
      { a: -1, b: 2, c: 0 },
      { a: 0.3, b: 0.8, c: 0.4 },
      { a: 0, b: 0, c: 0 },
    ]) {
      const normalized = normalizeSimplex(point);
      expect(normalized.a).toBeGreaterThanOrEqual(0);
      expect(normalized.b).toBeGreaterThanOrEqual(0);
      expect(normalized.c).toBeGreaterThanOrEqual(0);
      expect(normalized.a + normalized.b + normalized.c).toBeCloseTo(1);
    }
  });

  it('keeps keyboard updates in the simplex', () => {
    const afterA = setSimplexA(DEFAULT_SIMPLEX_POINT, 0.9);
    const afterB = setSimplexB(afterA, 0.8);
    expect(afterA.a + afterA.b + afterA.c).toBeCloseTo(1);
    expect(afterB.a + afterB.b + afterB.c).toBeCloseTo(1);
    expect(afterB.b).toBeLessThanOrEqual(1 - afterB.a);
  });

  it('round-trips barycentric coordinates', () => {
    const point = { a: 0.2, b: 0.3, c: 0.5 };
    const canvasPoint = simplexToCartesian(point, triangle);
    expect(cartesianToSimplex(canvasPoint, triangle)).toEqual({
      a: expect.closeTo(point.a),
      b: expect.closeTo(point.b),
      c: expect.closeTo(point.c),
    });
  });

  it('clamps and formats scale values', () => {
    expect(clampScale(-1)).toBe(SCALE_MIN);
    expect(clampScale(3)).toBe(SCALE_MAX);
    expect(formatNumber(1.5, 2)).toBe('1.5');
    expect(formatNumber(1, 2)).toBe('1');
    expect(formatNumber(-1e-12)).toBe('0');
  });
});
