import { describe, expect, it } from 'vitest';
import {
  OFFICIAL_TANGENT_SLOPE,
  L1,
  L2,
  clampCenterA,
  distancePointToLine,
  isNonIntersecting,
  minDistances,
  radiusForRatio,
  ratioIsThreeToOne,
  tangentSlopesFromOrigin,
} from './geometry';

describe('115 分科數甲選填 10 的圓與兩垂線', () => {
  it('L1、L2 互相垂直且過原點', () => {
    expect(L1.a * L2.a + L1.b * L2.b).toBe(0);
    expect(distancePointToLine({ x: 0, y: 0 }, L1)).toBe(0);
    expect(distancePointToLine({ x: 0, y: 0 }, L2)).toBe(0);
  });

  it.each([2, -2, 4, -3])('a=%s 時 d1:d2=3:1 且不相交', (a) => {
    const r = radiusForRatio(a);
    expect(isNonIntersecting(a, r)).toBe(true);
    expect(ratioIsThreeToOne(a, r)).toBe(true);
    const { d1, d2 } = minDistances(a, r);
    expect(d1).toBeCloseTo(3 * d2, 10);
  });

  it('過原點切線斜率為官方答案 ±√3/3', () => {
    const slopes = tangentSlopesFromOrigin(2);
    expect(slopes).not.toBeNull();
    expect(slopes![0]).toBeCloseTo(OFFICIAL_TANGENT_SLOPE, 12);
    expect(slopes![1]).toBeCloseTo(-OFFICIAL_TANGENT_SLOPE, 12);
    expect(Math.abs(slopes![0])).toBeCloseTo(Math.sqrt(3) / 3, 12);
  });

  it('把中心夾在不相交的可行區間內', () => {
    expect(Math.abs(clampCenterA(0))).toBe(0.8);
    expect(clampCenterA(10)).toBe(6);
  });
});
