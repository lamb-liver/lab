import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE } from '../../constants';
import type { ThumbnailSpec } from '../../types';
import {
  DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS,
  computeGradientMetrics,
  gradientAt,
  sampleLevel,
  valueAt,
  type GradientLevelCurvesParams,
  type SurfaceKind,
} from './geometry';
import {
  gradientLevelCurvesModule,
  gradientLevelCurvesParamsForMetadata,
} from './index';

const DEFAULTS = DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS;
const KINDS: SurfaceKind[] = ['paraboloid', 'saddle', 'product'];

describe('梯度與等位線', () => {
  it('同一條等位線上的點，函數值都等於 f(P)', () => {
    for (const kind of KINDS) {
      const metrics = computeGradientMetrics({ ...DEFAULTS, kind });
      expect(metrics.current.length).toBeGreaterThan(0);
      for (const path of metrics.current) {
        for (const point of path.points) {
          expect(valueAt(kind, point.x, point.y), kind).toBeCloseTo(metrics.value, 6);
        }
      }
    }
  });

  it('梯度垂直於等位線切線，並指向 f 增加的方向', () => {
    for (const kind of KINDS) {
      const metrics = computeGradientMetrics({ ...DEFAULTS, kind });
      expect(metrics.critical).toBe(false);
      expect(
        metrics.unitGradient.x * metrics.unitTangent.x +
          metrics.unitGradient.y * metrics.unitTangent.y,
      ).toBeCloseTo(0, 10);

      const ahead = {
        x: metrics.point.x + metrics.unitGradient.x * 0.05,
        y: metrics.point.y + metrics.unitGradient.y * 0.05,
      };
      expect(valueAt(kind, ahead.x, ahead.y)).toBeGreaterThan(metrics.value);
    }
  });

  it('原點是三個函數的臨界點', () => {
    for (const kind of KINDS) {
      const metrics = computeGradientMetrics({ ...DEFAULTS, kind, px: 0, py: 0 });
      expect(metrics.critical).toBe(true);
      expect(metrics.gradientLength).toBe(0);
      expect(valueAt(kind, 0, 0)).toBe(0);
    }
  });

  it('關掉族線只留通過測試點的等位線', () => {
    const metrics = computeGradientMetrics({ ...DEFAULTS, showFamily: false });
    expect(metrics.current.length).toBeGreaterThan(0);
    expect(metrics.family).toHaveLength(0);
  });

  it('圓等位線的半徑平方等於 c', () => {
    const path = sampleLevel('paraboloid', 4);
    expect(path).toHaveLength(1);
    expect(path[0]!.closed).toBe(true);
    for (const point of path[0]!.points) {
      expect(point.x * point.x + point.y * point.y).toBeCloseTo(4, 8);
    }
  });

  it('梯度公式與偏導數一致', () => {
    const point = { x: 1.6, y: 1.1 };
    expect(gradientAt('paraboloid', point.x, point.y)).toEqual({ x: 3.2, y: 2.2 });
    expect(gradientAt('saddle', point.x, point.y)).toEqual({ x: 3.2, y: -2.2 });
    expect(gradientAt('product', point.x, point.y)).toEqual({ x: 1.1, y: 1.6 });
  });
});

describe('gradientLevelCurvesModule', () => {
  it('縮圖在預設與三種函數下都不超出設計舞台', () => {
    const half = BASE_CANVAS_SIZE / 2;
    const variants: GradientLevelCurvesParams[] = KINDS.flatMap((kind) => [
      { ...DEFAULTS, kind },
      { ...DEFAULTS, kind, px: 3.5, py: -2.5 },
      { ...DEFAULTS, kind, px: 0, py: 0 },
    ]);

    for (const params of variants) {
      const spec = gradientLevelCurvesModule.sample(
        gradientLevelCurvesParamsForMetadata(params),
        { step: 1, purpose: 'thumbnail' },
      ) as ThumbnailSpec;

      let maxExtent = 0;
      for (const path of spec.paths) {
        for (const point of path.points) {
          maxExtent = Math.max(maxExtent, Math.abs(point.x), Math.abs(point.y));
        }
      }
      expect(maxExtent, `out of stage at ${JSON.stringify(params)}`).toBeLessThanOrEqual(half);
    }
  });

  it('metadata 讀出測試點與梯度', () => {
    const meta = gradientLevelCurvesModule.getMetadata(gradientLevelCurvesModule.defaultParams);
    expect(meta.stats.find((stat) => stat.key === 'point')?.value).toBe('(1.60, 1.10)');
    expect(meta.stats.find((stat) => stat.key === 'value')?.value).toBe('3.77');
    expect(meta.stats.find((stat) => stat.key === 'grad')?.value).toBe('(3.20, 2.20)');
  });
});
