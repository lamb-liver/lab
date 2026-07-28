import { describe, expect, it } from 'vitest';
import {
  OFFICIAL_ANSWERS,
  ORIGINAL_A_HEIGHT,
  buildParabolaFocalChordScene,
  distance,
} from './geometry';

describe('111 分科數甲多選 7 的拋物線焦弦投影', () => {
  it('只用拋物線定義與三角比得到官方答案 ③、⑤', () => {
    expect(OFFICIAL_ANSWERS).toEqual([3, 5]);

    for (const height of [2.2, ORIGINAL_A_HEIGHT, 4.4]) {
      const scene = buildParabolaFocalChordScene(height);
      const { A, B, F, AProjection, BProjection } = scene.points;

      expect(distance(A, AProjection)).toBeCloseTo(distance(A, F));
      expect(distance(B, BProjection)).toBeCloseTo(distance(B, F));
      expect((F.x - A.x) * (B.y - A.y) - (F.y - A.y) * (B.x - A.x)).toBeCloseTo(0);
      expect(scene.option3).toBeCloseTo(scene.ratio);
      expect(scene.option5).toBeCloseTo(scene.ratio);
    }
  });

  it('把互動高度限制在可讀的示意範圍', () => {
    expect(buildParabolaFocalChordScene(1).aHeight).toBe(2.2);
    expect(buildParabolaFocalChordScene(6).aHeight).toBe(4.4);
  });
});
