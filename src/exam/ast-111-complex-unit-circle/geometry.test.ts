import { describe, expect, it } from 'vitest';
import {
  buildComplexUnitCircleScene,
  FIXED_POINT,
  OFFICIAL_SOLUTION,
  OFFICIAL_THETA_DEGREES,
} from './geometry';

describe('111 分科數甲選填 11 的複數平面等距', () => {
  it('在官方解答處令 z² 等於固定點且兩段距離相等', () => {
    const scene = buildComplexUnitCircleScene(OFFICIAL_THETA_DEGREES);

    expect(scene.z.x).toBeCloseTo(OFFICIAL_SOLUTION.a, 12);
    expect(scene.z.y).toBeCloseTo(OFFICIAL_SOLUTION.b, 12);
    expect(scene.zSquared.x).toBeCloseTo(FIXED_POINT.x, 12);
    expect(scene.zSquared.y).toBeCloseTo(FIXED_POINT.y, 12);
    expect(scene.distanceGap).toBeCloseTo(0, 12);
  });

  it('限制滑桿在第一象限內，且 z、z³ 都留在單位圓', () => {
    for (const input of [-20, 40, 120]) {
      const scene = buildComplexUnitCircleScene(input);
      expect(scene.thetaDegrees).toBeGreaterThanOrEqual(5);
      expect(scene.thetaDegrees).toBeLessThanOrEqual(85);
      expect(Math.hypot(scene.z.x, scene.z.y)).toBeCloseTo(1, 12);
      expect(Math.hypot(scene.zCubed.x, scene.zCubed.y)).toBeCloseTo(1, 12);
    }
  });
});
