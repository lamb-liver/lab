import { describe, expect, it } from 'vitest';
import {
  DIR_PARALLEL,
  DIR_PERP,
  OFFICIAL_AREA,
  PQ,
  UNIT_CROSS,
  cross2,
  parallelogramArea,
  sideVectors,
  solveSideScales,
  verticesFromCenter,
} from './geometry';

describe('114 分科數甲選填 11 的平行四邊形面積', () => {
  it('兩邊方向的外積絕對值為 17', () => {
    expect(UNIT_CROSS).toBe(17);
    expect(Math.abs(cross2(DIR_PARALLEL, DIR_PERP))).toBe(17);
  });

  it.each([
    ['sum', 1],
    ['sum', -1],
    ['diff', 1],
    ['diff', -1],
  ] as const)('mode=%s sign=%s 時面積為官方答案 204', (mode, sign) => {
    const scales = solveSideScales(mode, sign);
    expect(Math.abs(scales.alpha * scales.beta)).toBeCloseTo(12, 10);
    expect(parallelogramArea(scales)).toBeCloseTo(OFFICIAL_AREA, 10);
  });

  it('中心到頂點重建 PQ=(10,-1)', () => {
    const scales = solveSideScales('sum', 1);
    const [p] = verticesFromCenter({ x: 0, y: 0 }, scales);
    expect(p.x).toBeCloseTo(PQ.x);
    expect(p.y).toBeCloseTo(PQ.y);
    const { u, v } = sideVectors(scales);
    expect(Math.abs(cross2(u, v))).toBeCloseTo(204);
  });
});
