import { describe, expect, it } from 'vitest';
import { CENTER, HEXAGON, LIMITS, OPTIONS, TETRAHEDRON, diskPoints, distance, fits } from './geometry';

describe('2023 高考數學新課標 I 卷第 12 題的正方體容器', () => {
  it('內接正四面體的六條棱都是 √2', () => {
    for (let i = 0; i < 4; i += 1)
      for (let j = i + 1; j < 4; j += 1) expect(distance(TETRAHEDRON[i], TETRAHEDRON[j])).toBeCloseTo(Math.SQRT2, 12);
  });

  it('六條棱中點圍成邊長 √2/2 的正六邊形，內切圓直徑 √6/2', () => {
    for (let i = 0; i < 6; i += 1) {
      const p = HEXAGON[i];
      expect(p[0] + p[1] + p[2]).toBeCloseTo(1.5, 12);
      expect(distance(p, HEXAGON[(i + 1) % 6])).toBeCloseTo(Math.SQRT2 / 2, 12);
    }
    expect(LIMITS.disk).toBeCloseTo(1.2247, 4);
  });

  it('直徑 1.2 的圓盤放在六邊形平面上，整圈都在正方體內', () => {
    for (const q of diskPoints(0.6, 360)) {
      for (const c of q) {
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThanOrEqual(1);
      }
      expect(distance(q, CENTER)).toBeCloseTo(0.6, 12);
    }
  });

  it('答案是 ABD：只有 1.8 的細長圓柱超過體對角線 √3', () => {
    expect(OPTIONS.filter(fits).map((o) => o.key)).toEqual(['A', 'B', 'D']);
    expect(LIMITS.rod).toBeLessThan(1.8);
  });
});
