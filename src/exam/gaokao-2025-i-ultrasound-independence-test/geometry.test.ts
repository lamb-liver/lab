import { describe, expect, it } from 'vitest';
import {
  INDEPENDENT_B,
  OFFICIAL_B,
  chiSquare,
  expectedTable,
  illGivenAbnormal,
  smallestRejectingB,
  tableFor,
} from './geometry';

describe('2025 高考數學新課標 I 卷第 15 題的獨立性檢定', () => {
  it('原題表格：20、180、780、20', () => {
    expect(tableFor(OFFICIAL_B)).toEqual({ a: 20, b: 180, c: 780, d: 20 });
  });

  it('第一問 P 的估計值是 9/10，不是 180/1000', () => {
    expect(illGivenAbnormal(tableFor(OFFICIAL_B))).toBeCloseTo(0.9, 12);
  });

  it('χ² = 765.625，遠大於 10.828', () => {
    expect(chiSquare(tableFor(OFFICIAL_B))).toBeCloseTo(765.625, 9);
  });

  it('固定合計時 χ² = (b − 40)² / 25.6', () => {
    for (const b of [0, 23, 40, 57, 120, 200]) {
      expect(chiSquare(tableFor(b))).toBeCloseTo((b - 40) ** 2 / 25.6, 9);
    }
  });

  it('獨立時 b = 40，χ² = 0；期望表與合計一致', () => {
    expect(INDEPENDENT_B).toBe(40);
    expect(chiSquare(tableFor(40))).toBe(0);
    expect(expectedTable()).toEqual({ a: 160, b: 40, c: 640, d: 160 });
  });

  it('b 到 57 就足以在 α = 0.001 下判定有關', () => {
    expect(smallestRejectingB()).toBe(57);
  });
});
