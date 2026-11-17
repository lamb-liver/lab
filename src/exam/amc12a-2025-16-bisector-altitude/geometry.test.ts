import { describe, expect, it } from 'vitest';
import { AB, AC, AD, BC, BD, BP, CD, PD, distance, trianglePoints } from './geometry';

describe('2025 AMC 12A #16 角平分線與高', () => {
  const { A, B, C, D, H, P } = trianglePoints();

  it('三邊與角平分線定理給出的分段', () => {
    expect(distance(A, B)).toBeCloseTo(AB, 10);
    expect(distance(B, C)).toBeCloseTo(BC, 10);
    expect(distance(A, C)).toBeCloseTo(AC, 10);
    expect(distance(A, D) / distance(D, C)).toBeCloseTo(AB / BC, 10);
    expect(distance(A, D)).toBeCloseTo(AD, 10);
    expect(distance(D, C)).toBeCloseTo(CD, 10);
  });

  it('D 在 AC 上，H 是 C 到 AB 的垂足，P 在 BD 上也在高上', () => {
    const cross = (D.x - A.x) * (C.y - A.y) - (D.y - A.y) * (C.x - A.x);
    expect(cross).toBeCloseTo(0, 8);
    expect(H.y).toBe(0);
    expect(H.x).toBeCloseTo(C.x, 10);
    const onBisector = (P.x - B.x) * (D.y - B.y) - (P.y - B.y) * (D.x - B.x);
    expect(onBisector).toBeCloseTo(0, 8);
    expect(P.x).toBeCloseTo(C.x, 10);
    expect(P.y).toBeGreaterThan(0);
    expect(P.y).toBeLessThan(C.y);
  });

  it('BD = 48，PD = 27，BP = 21', () => {
    expect(distance(B, D)).toBeCloseTo(BD, 10);
    expect(distance(P, D)).toBeCloseTo(PD, 10);
    expect(distance(B, P)).toBeCloseTo(BP, 10);
    expect(distance(B, P) + distance(P, D)).toBeCloseTo(distance(B, D), 10);
    expect(BC - CD).toBe(18);
    expect(BD - PD).toBe(BP);
  });
});
