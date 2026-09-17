import { describe, expect, it } from 'vitest';
import { dotVec3, subVec3 } from '../../curve/projection3d';
import {
  LINE_1,
  LINE_2,
  OFFICIAL_DISTANCE,
  PARALLEL_DIRECTION,
  PARALLEL_METRICS,
  parallelLineDistance,
} from './geometry';

describe('114 分科數甲選填 10 的平面截平行線距離', () => {
  it('共同方向必須是 (0,1,0)', () => {
    expect(PARALLEL_DIRECTION).toEqual({ x: 0, y: 1, z: 0 });
    expect(LINE_1.point.x).toBe(0);
    expect(LINE_2.point.z).toBe(0);
  });

  it('公垂線垂直方向向量，距離為 √185', () => {
    const common = subVec3(PARALLEL_METRICS.foot2, PARALLEL_METRICS.foot1);
    expect(dotVec3(common, PARALLEL_DIRECTION)).toBeCloseTo(0);
    expect(PARALLEL_METRICS.distance).toBeCloseTo(OFFICIAL_DISTANCE, 12);
    expect(PARALLEL_METRICS.distance).toBeCloseTo(Math.sqrt(8 * 8 + 11 * 11), 12);
  });

  it('平行線距離公式與腳點計算一致', () => {
    expect(parallelLineDistance(LINE_1, LINE_2).distance).toBeCloseTo(Math.sqrt(185));
  });
});
