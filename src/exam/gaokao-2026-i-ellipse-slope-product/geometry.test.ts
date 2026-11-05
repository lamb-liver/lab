import { describe, expect, it } from 'vitest';
import { A2, B2, K_AREA, K_MIN_TAN, MIN_TAN, areaRatio, intersections, slope, tanFormula, tanPQR } from './geometry';

describe('2026 高考數學新課標 I 卷第 18 題的橢圓斜率積', () => {
  it('P、Q 在橢圓上，Q 在第三象限', () => {
    for (const k of [0.3, 1, 2.5]) {
      const { P, Q } = intersections(k);
      for (const pt of [P, Q]) expect(pt.x ** 2 / A2 + pt.y ** 2 / B2).toBeCloseTo(1, 10);
      expect(Q.x).toBeLessThan(0);
      expect(Q.y).toBeLessThan(0);
    }
  });

  it('k_QP · k_QR = −3/4', () => {
    for (const k of [0.3, 0.866, 1.7, 3]) {
      const { P, Q, R } = intersections(k);
      expect(slope(Q, P) * slope(Q, R)).toBeCloseTo(-3 / 4, 10);
      expect(tanPQR(k)).toBeCloseTo(tanFormula(k), 8);
    }
  });

  it('(i) k = √5/2 時面積比為 3', () => {
    expect(areaRatio(K_AREA)).toBeCloseTo(3, 10);
  });

  it('(ii) 最小值 4√3 在 k = √3/2', () => {
    expect(tanPQR(K_MIN_TAN)).toBeCloseTo(MIN_TAN, 10);
    for (let k = 0.1; k < 5; k += 0.01) expect(tanPQR(k)).toBeGreaterThanOrEqual(MIN_TAN - 1e-9);
  });
});
