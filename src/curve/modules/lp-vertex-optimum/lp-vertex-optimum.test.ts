import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { objectiveValue, satisfiesAll, vec2 } from '../../linearProgramming';
import type { ThumbnailSpec } from '../../types';
import {
  DEFAULT_LP_VERTEX_OPTIMUM_PARAMS,
  computeVertexOptimumMetrics,
  constraintsOf,
  edgeParallelAngle,
  nextVisiting,
  objectiveOf,
  type LpVertexOptimumParams,
} from './geometry';
import { lpVertexOptimumModule, lpVertexOptimumParamsForMetadata } from './index';

const DEFAULTS = DEFAULT_LP_VERTEX_OPTIMUM_PARAMS;

describe('頂點法求最優解', () => {
  it('四邊形有四個候選頂點，三角形有三個', () => {
    expect(computeVertexOptimumMetrics(DEFAULTS).candidates).toHaveLength(4);
    expect(
      computeVertexOptimumMetrics({ ...DEFAULTS, shape: 'triangle' }).candidates,
    ).toHaveLength(3);
  });

  it('候選表的 z 值就是把該頂點代進目標函數', () => {
    const metrics = computeVertexOptimumMetrics(DEFAULTS);
    const { p, q } = objectiveOf(DEFAULTS);
    for (const candidate of metrics.candidates) {
      expect(candidate.value).toBeCloseTo(objectiveValue(p, q, candidate.point), 9);
    }
  });

  it('表中最優那一列的 z，等於在可行域密集取樣的最大值', () => {
    // 頂點法的理論依據：有界可行域上的線性目標，最優必在角點取得。
    // 取樣是獨立對照——若候選表漏了一個角點，這裡會先紅。
    const metrics = computeVertexOptimumMetrics(DEFAULTS);
    const { p, q } = objectiveOf(DEFAULTS);
    const constraints = constraintsOf(DEFAULTS);

    let sampledBest = -Infinity;
    for (let x = 0; x <= 6; x += 0.02) {
      for (let y = 0; y <= 6; y += 0.02) {
        const point = vec2(x, y);
        if (!satisfiesAll(constraints, point)) continue;
        sampledBest = Math.max(sampledBest, objectiveValue(p, q, point));
      }
    }

    expect(metrics.best).not.toBeNull();
    expect(metrics.best!).toBeGreaterThanOrEqual(sampledBest - 1e-9);
    expect(metrics.best! - sampledBest).toBeLessThan(0.05);
  });

  it('排名第一那一列就是被標為最優的那一列', () => {
    const metrics = computeVertexOptimumMetrics(DEFAULTS);
    const first = metrics.candidates.find((candidate) => candidate.rank === 0);
    expect(first?.optimal).toBe(true);
    expect(first?.value).toBeCloseTo(metrics.best!, 9);
  });

  it('求最小值時最優換人，且就是求最大值時排最後的那一列', () => {
    const max = computeVertexOptimumMetrics(DEFAULTS);
    const min = computeVertexOptimumMetrics({ ...DEFAULTS, sense: 'min' });

    const lastOfMax = max.candidates.findIndex(
      (candidate) => candidate.rank === max.candidates.length - 1,
    );
    const firstOfMin = min.candidates.findIndex((candidate) => candidate.rank === 0);
    expect(firstOfMin).toBe(lastOfMax);
  });

  it('目標方向與某條邊平行時，兩列並列最優且 z 相同', () => {
    const angle = edgeParallelAngle('quad');
    const metrics = computeVertexOptimumMetrics({ ...DEFAULTS, angle });

    expect(metrics.tiedCount).toBe(2);
    const winners = metrics.candidates.filter((candidate) => candidate.optimal);
    expect(winners).toHaveLength(2);
    expect(winners[0].value).toBeCloseTo(winners[1].value, 6);
  });

  it('走訪走完一圈後回到整表模式', () => {
    const total = computeVertexOptimumMetrics(DEFAULTS).candidates.length;
    expect(nextVisiting({ ...DEFAULTS, visiting: -1 }, total)).toBe(0);
    expect(nextVisiting({ ...DEFAULTS, visiting: total - 2 }, total)).toBe(total - 1);
    expect(nextVisiting({ ...DEFAULTS, visiting: total - 1 }, total)).toBe(-1);
  });

  it('走訪索引超出候選數時視為沒有在走訪', () => {
    expect(computeVertexOptimumMetrics({ ...DEFAULTS, visiting: -1 }).visitingIndex).toBeNull();
    expect(computeVertexOptimumMetrics({ ...DEFAULTS, visiting: 99 }).visitingIndex).toBeNull();
    expect(computeVertexOptimumMetrics({ ...DEFAULTS, visiting: 2 }).visitingIndex).toBe(2);
  });

  it('每個候選頂點都在可行域內', () => {
    for (const shape of ['quad', 'triangle'] as const) {
      const params: LpVertexOptimumParams = { ...DEFAULTS, shape };
      const constraints = constraintsOf(params);
      for (const candidate of computeVertexOptimumMetrics(params).candidates) {
        expect(satisfiesAll(constraints, candidate.point)).toBe(true);
      }
    }
  });
});

describe('lpVertexOptimumModule', () => {
  it('縮圖在整個角度範圍內都不超出設計舞台', () => {
    const half = BASE_CANVAS_SIZE / 2;
    for (const shape of ['quad', 'triangle'] as const) {
      for (let angle = 0; angle <= 360; angle += 15) {
        const spec = lpVertexOptimumModule.sample(
          lpVertexOptimumParamsForMetadata({ ...DEFAULTS, shape, angle }),
          { step: BASE_POINT_STEP, purpose: 'thumbnail' },
        ) as ThumbnailSpec;

        let maxExtent = 0;
        for (const path of spec.paths) {
          for (const point of path.points) {
            maxExtent = Math.max(maxExtent, Math.abs(point.x), Math.abs(point.y));
          }
        }
        for (const circle of spec.circles ?? []) {
          maxExtent = Math.max(maxExtent, Math.abs(circle.x) + circle.r, Math.abs(circle.y) + circle.r);
        }
        expect(maxExtent, `out of stage at ${shape} ${angle}°`).toBeLessThanOrEqual(half);
      }
    }
  });

  it('metadata 讀出最優值與最優頂點', () => {
    const meta = lpVertexOptimumModule.getMetadata(lpVertexOptimumModule.defaultParams);
    expect(meta.stats).toHaveLength(5);
    expect(meta.stats.find((stat) => stat.key === 'count')?.value).toBe(4);
    expect(meta.stats.find((stat) => stat.key === 'best')?.value).not.toBe('不存在');
  });
});
