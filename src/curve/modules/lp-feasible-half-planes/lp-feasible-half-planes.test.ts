import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { satisfiesAll } from '../../linearProgramming';
import type { ThumbnailSpec } from '../../types';
import {
  DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS,
  computeHalfPlanesMetrics,
  constraintsOf,
  patchConstraint,
  type LpFeasibleHalfPlanesParams,
} from './geometry';
import {
  lpFeasibleHalfPlanesModule,
  lpFeasibleHalfPlanesParamsForMetadata,
} from './index';

const DEFAULTS = DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS;

describe('約束半平面與可行域', () => {
  it('預設場景是有界的四邊形，且恰好有一條冗餘約束', () => {
    // 這一頁要示範「有些約束不參與圍出邊界」，預設就得看得到那條線。
    const metrics = computeHalfPlanesMetrics(DEFAULTS);
    expect(metrics.status).toBe('有界');
    expect(metrics.region.vertices).toHaveLength(4);
    expect(metrics.redundant).toHaveLength(1);
    expect(metrics.area).toBeGreaterThan(0);
  });

  it('移除冗餘約束後，原本的角點依然全部可行', () => {
    const metrics = computeHalfPlanesMetrics(DEFAULTS);
    const [redundant] = metrics.redundant;
    const without = constraintsOf(DEFAULTS).filter((_, index) => index !== redundant);

    for (const vertex of metrics.region.vertices) {
      expect(satisfiesAll(without, vertex.point)).toBe(true);
    }
  });

  it('每個角點都滿足全部五條約束', () => {
    const metrics = computeHalfPlanesMetrics(DEFAULTS);
    for (const vertex of metrics.region.vertices) {
      expect(satisfiesAll(metrics.constraints, vertex.point)).toBe(true);
    }
  });

  it('位移只平移約束線，不改變它的方向', () => {
    const moved: LpFeasibleHalfPlanesParams = { ...DEFAULTS, offset0: DEFAULTS.offset0 - 3 };
    const before = constraintsOf(DEFAULTS)[2];
    const after = constraintsOf(moved)[2];
    expect(after.a).toBeCloseTo(before.a, 9);
    expect(after.b).toBeCloseTo(before.b, 9);
    expect(after.c).toBeLessThan(before.c);

    // 半平面往內收，面積必定變小
    expect(computeHalfPlanesMetrics(moved).area).toBeLessThan(
      computeHalfPlanesMetrics(DEFAULTS).area,
    );
  });

  it('約束互相矛盾時回報無解', () => {
    const metrics = computeHalfPlanesMetrics({
      ...DEFAULTS,
      angle0: 30,
      offset0: 4,
      angle1: 210,
      offset1: -9,
    });
    expect(metrics.status).toBe('無解');
    expect(metrics.region.vertices).toHaveLength(0);
  });

  it('三條約束都背向第一象限時，可行域無界且沒有面積', () => {
    const metrics = computeHalfPlanesMetrics({
      ...DEFAULTS,
      angle0: 200,
      offset0: 0,
      angle1: 250,
      offset1: 0,
      angle2: 300,
      offset2: 0,
    });
    expect(metrics.status).toBe('無界');
    expect(metrics.area).toBe(0);
  });

  it('patchConstraint 只改到指定那一條', () => {
    expect(patchConstraint(1, { angle: 12 })).toEqual({ angle1: 12 });
    expect(patchConstraint(2, { offset: -4 })).toEqual({ offset2: -4 });
    expect(patchConstraint(0, { angle: 5, offset: 6 })).toEqual({ angle0: 5, offset0: 6 });
  });
});

describe('lpFeasibleHalfPlanesModule', () => {
  it('縮圖在整個滑桿範圍內都不超出設計舞台', () => {
    const half = BASE_CANVAS_SIZE / 2;
    const variants: LpFeasibleHalfPlanesParams[] = [DEFAULTS];
    for (const angle of [0, 90, 180, 270, 360]) {
      for (const offset of [-10, 0, 10]) {
        variants.push({ ...DEFAULTS, angle0: angle, offset0: offset });
        variants.push({ ...DEFAULTS, angle1: angle, offset1: offset });
        variants.push({ ...DEFAULTS, angle2: angle, offset2: offset });
      }
    }

    for (const params of variants) {
      const spec = lpFeasibleHalfPlanesModule.sample(lpFeasibleHalfPlanesParamsForMetadata(params), {
        step: BASE_POINT_STEP,
        purpose: 'thumbnail',
      }) as ThumbnailSpec;

      let maxExtent = 0;
      for (const path of spec.paths) {
        for (const point of path.points) {
          maxExtent = Math.max(maxExtent, Math.abs(point.x), Math.abs(point.y));
        }
      }
      expect(maxExtent, `out of stage at ${JSON.stringify(params)}`).toBeLessThanOrEqual(half);
    }
  });

  it('metadata 讀出可行域狀態與冗餘約束', () => {
    const meta = lpFeasibleHalfPlanesModule.getMetadata(
      lpFeasibleHalfPlanesModule.defaultParams,
    );
    expect(meta.stats).toHaveLength(5);
    expect(meta.stats.find((stat) => stat.key === 'status')?.value).toBe('有界');
    expect(meta.stats.find((stat) => stat.key === 'redundant')?.value).toBe('約束 3');
  });
});
