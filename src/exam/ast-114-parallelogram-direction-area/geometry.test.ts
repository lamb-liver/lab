import { describe, expect, it } from 'vitest';
import {
  ALL_SOLUTIONS,
  DIR_PARALLEL,
  DIR_PERP,
  OFFICIAL_AREA,
  PQ,
  UNIT_CROSS,
  cross2,
  nearestSolution,
  parallelogramArea,
  sideVectors,
  solveSideScales,
  solutionSnapTargets,
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

  it('nearestSolution 對每組解的專屬 snap 目標回傳該解', () => {
    // Shared corners can tie across solutions; probe with distinctive targets:
    // - diff± 的遠相鄰頂點
    // - sum± 的 P（同形時靠 P 區分 sign）
    const probes: Array<{ point: { x: number; y: number }; mode: 'sum' | 'diff'; sign: 1 | -1 }> = [
      { point: { x: 10, y: -1 }, mode: 'sum', sign: 1 },
      { point: { x: -10, y: 1 }, mode: 'sum', sign: -1 },
      { point: { x: 28, y: -13 }, mode: 'diff', sign: 1 },
      { point: { x: -28, y: 13 }, mode: 'diff', sign: -1 },
    ];
    for (const probe of probes) {
      expect(nearestSolution(probe.point)).toEqual({ mode: probe.mode, sign: probe.sign });
    }
  });

  it('每組解都有三個 snap 目標，且四組解齊全', () => {
    expect(ALL_SOLUTIONS).toHaveLength(4);
    for (const key of ALL_SOLUTIONS) {
      const scales = solveSideScales(key.mode, key.sign);
      expect(solutionSnapTargets({ x: 0, y: 0 }, scales)).toHaveLength(3);
    }
  });
});
