import { describe, expect, it } from 'vitest';
import {
  fixedPointResidual,
  ORIGINAL_VERTEX,
  parabolaValue,
  TRANSLATED_VERTEX_H,
  translatedVertex,
  translationDistance,
} from './geometry';

describe('115 學測數A選填 16 的拋物線受限平移', () => {
  it('原圖通過 x 軸上的正負二分之一，頂點是 P=(0,1)', () => {
    expect(parabolaValue(-0.5)).toBe(0);
    expect(parabolaValue(0.5)).toBe(0);
    expect(translatedVertex(0)).toEqual(ORIGINAL_VERTEX);
  });

  it.each([-1, 0, 0.75, TRANSLATED_VERTEX_H])(
    '頂點參數 h=%s 時仍在 y=1+2x 上',
    (h) => {
      const vertex = translatedVertex(h);
      expect(vertex.y).toBe(1 + 2 * vertex.x);
    },
  );

  it('通過固定點的兩個候選為 h=0 與 h=3/2', () => {
    expect(fixedPointResidual(0)).toBe(0);
    expect(fixedPointResidual(TRANSLATED_VERTEX_H)).toBe(0);
    expect(fixedPointResidual(0.75)).not.toBe(0);
  });

  it('排除 P=Q 後，官方答案為 3√5/2', () => {
    const q = translatedVertex(TRANSLATED_VERTEX_H);
    expect(q).toEqual({ x: 1.5, y: 4 });
    expect(translationDistance(TRANSLATED_VERTEX_H)).toBeCloseTo(
      (3 * Math.sqrt(5)) / 2,
      12,
    );
  });
});
