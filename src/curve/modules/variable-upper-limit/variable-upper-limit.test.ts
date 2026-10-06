import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { variableUpperLimitModule } from './index';
import { area, deltaRatio, f } from './geometry';

describe('variable-upper-limit module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = variableUpperLimitModule.sample(variableUpperLimitModule.defaultParams, {
      step: variableUpperLimitModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('面積的閉式在端點成立，而且細條愈窄愈靠近高度', () => {
    expect(area(0)).toBeCloseTo(0);
    expect(area(Math.PI)).toBeCloseTo(Math.PI + 1);

    for (const x of [0.5, 2, 4]) {
      expect(deltaRatio(x, 1e-4)).toBeCloseTo(f(x), 4);
      const wide = Math.abs(deltaRatio(x, 1) - f(x));
      const narrow = Math.abs(deltaRatio(x, 0.05) - f(x));
      expect(narrow).toBeLessThan(wide);
    }
  });
});
