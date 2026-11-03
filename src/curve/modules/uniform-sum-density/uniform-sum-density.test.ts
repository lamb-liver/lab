import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { densityAt, readUniformSum } from './geometry';
import { uniformSumDensityModule } from './index';

describe('uniform-sum-density module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = uniformSumDensityModule.sample(uniformSumDensityModule.defaultParams, {
      step: uniformSumDensityModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('峰高等於較長那段的倒數，平頂寬是兩段長度差', () => {
    for (const [a, b] of [
      [1.8, 0.9],
      [0.6, 0.6],
      [2.4, 0.6],
      [0.7, 2.1],
    ] as const) {
      const reading = readUniformSum({ a, b });
      expect(reading.peak).toBeCloseTo(1 / Math.max(a, b), 12);
      expect(reading.flat).toBeCloseTo(Math.abs(a - b), 12);
      expect(reading.support).toBeCloseTo(a + b, 12);
    }
  });

  it('密度在兩端外面是 0，中間對稱，等長時縮成三角形', () => {
    const a = 1.4;
    const b = 0.8;
    expect(densityAt(a, b, 0)).toBe(0);
    expect(densityAt(a, b, a + b)).toBe(0);
    expect(densityAt(a, b, -0.2)).toBe(0);
    expect(densityAt(a, b, 0.3)).toBeCloseTo(0.3 / (a * b), 12);
    expect(densityAt(a, b, 1.1)).toBeCloseTo(1 / a, 12);
    for (const z of [0.2, 0.7, 1.2, 1.9]) {
      expect(densityAt(a, b, z)).toBeCloseTo(densityAt(a, b, a + b - z), 12);
    }

    const equal = readUniformSum({ a: 1.2, b: 1.2 });
    expect(equal.flat).toBe(0);
    expect(densityAt(1.2, 1.2, 1.2)).toBeCloseTo(1 / 1.2, 12);
  });

  it('密度沿底邊積起來是 1', () => {
    const a = 1.8;
    const b = 0.9;
    const steps = 4000;
    const width = (a + b) / steps;
    let area = 0;
    for (let i = 1; i < steps; i += 1) area += densityAt(a, b, i * width) * width;
    expect(area).toBeCloseTo(1, 3);
  });
});
