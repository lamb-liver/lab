import { describe, expect, it } from 'vitest';
import {
  ALL_SOLUTIONS,
  DIR_PARALLEL,
  DIR_PERP,
  OFFICIAL_AREA,
  PQ,
  UNIT_CROSS,
  cross2,
  arrowTips,
  nearestSolution,
  parallelogramArea,
  sideVectors,
  solveSideScales,
  vertexP,
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

  it('P = Q − PQ，所以 Q − P 正好是題目的 PQ=(10,-1)', () => {
    const q = { x: 0, y: 0 };
    const p = vertexP(q);
    expect(q.x - p.x).toBeCloseTo(PQ.x);
    expect(q.y - p.y).toBeCloseTo(PQ.y);
    for (const key of ALL_SOLUTIONS) {
      const scales = solveSideScales(key.mode, key.sign);
      const [vp] = verticesFromCenter(q, scales, key.sign);
      expect(vp.x).toBeCloseTo(-10);
      expect(vp.y).toBeCloseTo(1);
    }
  });

  it('四組符號解畫出同一個以 Q 為中心的平行四邊形', () => {
    const q = { x: 0, y: 0 };
    const key = (pts: { x: number; y: number }[]) =>
      pts.map((pt) => `${Math.round(pt.x)},${Math.round(pt.y)}`).sort().join(' ');
    const shapes = new Set<string>();
    for (const sol of ALL_SOLUTIONS) {
      const scales = solveSideScales(sol.mode, sol.sign);
      const [p, a, opp, b] = verticesFromCenter(q, scales, sol.sign);
      // 對角線互相平分於 Q
      expect((p.x + opp.x) / 2).toBeCloseTo(0);
      expect((p.y + opp.y) / 2).toBeCloseTo(0);
      expect((a.x + b.x) / 2).toBeCloseTo(0);
      expect((a.y + b.y) / 2).toBeCloseTo(0);
      // 邊分別平行兩個方向
      expect(cross2({ x: a.x - p.x, y: a.y - p.y }, DIR_PARALLEL)).toBeCloseTo(0);
      expect(cross2({ x: b.x - p.x, y: b.y - p.y }, DIR_PERP)).toBeCloseTo(0);
      expect(Math.abs(cross2({ x: a.x - p.x, y: a.y - p.y }, { x: b.x - p.x, y: b.y - p.y }))).toBeCloseTo(OFFICIAL_AREA);
      shapes.add(key([p, a, opp, b]));
    }
    expect(shapes.size).toBe(1);
  });

  it('拖箭頭尖端只翻轉被拖係數的正負號', () => {
    const q = { x: 0, y: 0 };
    const signs = (k: { mode: 'sum' | 'diff'; sign: 1 | -1 }) => {
      const s = solveSideScales(k.mode, k.sign);
      return [Math.sign(s.alpha), Math.sign(s.beta)];
    };
    const start = { mode: 'sum', sign: 1 } as const; // α>0, β>0
    const base = solveSideScales('sum', 1);
    const { uTip, vTip } = arrowTips(q, base);
    const p = vertexP(q);
    const flipU = { x: 2 * p.x - uTip.x, y: 2 * p.y - uTip.y };
    const flipV = { x: 2 * p.x - vTip.x, y: 2 * p.y - vTip.y };
    expect(signs(nearestSolution(uTip, start))).toEqual([1, 1]);
    expect(signs(nearestSolution(flipU, start))).toEqual([-1, 1]);
    expect(signs(nearestSolution(flipV, start))).toEqual([1, -1]);
    expect(signs(nearestSolution(flipV, nearestSolution(flipU, start)))).toEqual([-1, -1]);
    expect(sideVectors(base).u).toEqual({ x: 2, y: 10 });
  });
});
