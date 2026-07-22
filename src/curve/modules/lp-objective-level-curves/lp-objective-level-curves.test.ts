import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { objectiveValue, vec2 } from '../../linearProgramming';
import type { ThumbnailSpec } from '../../types';
import {
  DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS,
  LEVEL_STEP,
  computeObjectiveMetrics,
  levelFromPoint,
  type LpObjectiveLevelCurvesParams,
} from './geometry';
import {
  lpObjectiveLevelCurvesModule,
  lpObjectiveLevelCurvesParamsForMetadata,
} from './index';

const DEFAULTS = DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS;

describe('目標函數等值線', () => {
  it('同一條等值線上的點，z 值都等於 k', () => {
    const metrics = computeObjectiveMetrics(DEFAULTS);
    expect(metrics.current).not.toBeNull();
    const [start, end] = metrics.current!;

    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const point = vec2(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t);
      expect(objectiveValue(DEFAULTS.p, DEFAULTS.q, point)).toBeCloseTo(DEFAULTS.k, 6);
    }
  });

  it('族線兩兩平行：法向與目前這條相同，只有 k 不同', () => {
    const metrics = computeObjectiveMetrics(DEFAULTS);
    expect(metrics.family.length).toBeGreaterThan(0);

    for (const line of metrics.family) {
      for (const point of line.segment) {
        expect(objectiveValue(DEFAULTS.p, DEFAULTS.q, point)).toBeCloseTo(line.k, 6);
      }
      expect(line.k).not.toBeCloseTo(DEFAULTS.k, 6);
    }
  });

  it('相鄰等值線的垂直間距是 Δk / ‖n‖', () => {
    // 這是「法向越長，同樣的 k 差擠得越近」的量化說法
    const metrics = computeObjectiveMetrics(DEFAULTS);
    expect(metrics.spacing).toBeCloseTo(LEVEL_STEP / Math.hypot(DEFAULTS.p, DEFAULTS.q), 9);

    const steeper = computeObjectiveMetrics({ ...DEFAULTS, p: DEFAULTS.p * 2, q: DEFAULTS.q * 2 });
    expect(steeper.spacing).toBeCloseTo(metrics.spacing / 2, 9);
  });

  it('係數同乘正數不改變等值線的方向', () => {
    const base = computeObjectiveMetrics(DEFAULTS);
    const scaled = computeObjectiveMetrics({
      ...DEFAULTS,
      p: DEFAULTS.p * 3,
      q: DEFAULTS.q * 3,
      k: DEFAULTS.k * 3,
    });

    expect(scaled.current).not.toBeNull();
    const dir = (segment: [{ x: number; y: number }, { x: number; y: number }]) =>
      Math.atan2(segment[1].y - segment[0].y, segment[1].x - segment[0].x);
    expect(Math.tan(dir(scaled.current!))).toBeCloseTo(Math.tan(dir(base.current!)), 6);
  });

  it('測試點的 z 值就是通過它那條等值線的 k', () => {
    const metrics = computeObjectiveMetrics(DEFAULTS);
    expect(metrics.testValue).toBeCloseTo(DEFAULTS.p * DEFAULTS.tx + DEFAULTS.q * DEFAULTS.ty, 9);
    expect(levelFromPoint(DEFAULTS, metrics.testPoint)).toBeCloseTo(metrics.testValue, 9);
  });

  it('係數皆為零時沒有等值線可畫', () => {
    const metrics = computeObjectiveMetrics({ ...DEFAULTS, p: 0, q: 0 });
    expect(metrics.degenerate).toBe(true);
    expect(metrics.current).toBeNull();
    expect(metrics.family).toHaveLength(0);
  });

  it('關掉族線只留目前那一條', () => {
    const metrics = computeObjectiveMetrics({ ...DEFAULTS, showFamily: false });
    expect(metrics.current).not.toBeNull();
    expect(metrics.family).toHaveLength(0);
  });
});

describe('lpObjectiveLevelCurvesModule', () => {
  it('縮圖在整個滑桿範圍內都不超出設計舞台', () => {
    const half = BASE_CANVAS_SIZE / 2;
    const variants: LpObjectiveLevelCurvesParams[] = [DEFAULTS];
    for (const coefficient of [-6, -1, 0, 1, 6]) {
      for (const k of [-30, 0, 30]) {
        variants.push({ ...DEFAULTS, p: coefficient, k });
        variants.push({ ...DEFAULTS, q: coefficient, k });
        variants.push({ ...DEFAULTS, p: coefficient, q: coefficient, k });
      }
    }

    for (const params of variants) {
      const spec = lpObjectiveLevelCurvesModule.sample(
        lpObjectiveLevelCurvesParamsForMetadata(params),
        { step: BASE_POINT_STEP, purpose: 'thumbnail' },
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

  it('metadata 讀出法向與測試點的 z', () => {
    const meta = lpObjectiveLevelCurvesModule.getMetadata(
      lpObjectiveLevelCurvesModule.defaultParams,
    );
    expect(meta.stats).toHaveLength(5);
    expect(meta.stats.find((stat) => stat.key === 'normal')?.value).toBe('(3.00, 2.00)');
    expect(meta.stats.find((stat) => stat.key === 'test')?.value).toBe('z = 18.00');
  });
});
