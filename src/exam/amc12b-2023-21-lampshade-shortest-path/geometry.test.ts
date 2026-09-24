import { describe, expect, it } from 'vitest';
import {
  APEX_HEIGHT,
  BOTTOM_RADIUS,
  BUG,
  FRUSTUM_HEIGHT,
  HONEY,
  INNER_RADIUS,
  OFFICIAL_LENGTH,
  OUTER_RADIUS,
  PATH_SPAN,
  SECTOR_ANGLE,
  SLANT,
  STRAIGHT_LENGTH,
  TANGENT_CONTACT,
  TOP_RADIUS,
  paperTo3d,
  pathMetrics,
  samplePath,
} from './geometry';

describe('2023 AMC 12B #21 燈罩最短路徑', () => {
  it('圓台展開成內半徑 6、外半徑 12 的半圓環', () => {
    expect(SLANT).toBeCloseTo(6, 12);
    expect(INNER_RADIUS).toBeCloseTo(6, 12);
    expect(OUTER_RADIUS).toBeCloseTo(12, 12);
    expect(SECTOR_ANGLE).toBeCloseTo(Math.PI, 12);
    expect(PATH_SPAN).toBeCloseTo(Math.PI / 2, 12);
  });

  it('直接連直線長 6√5，但會掉進內半徑以內（不在燈罩上）', () => {
    const straight = pathMetrics(PATH_SPAN);
    expect(straight.length).toBeCloseTo(STRAIGHT_LENGTH, 10);
    expect(straight.minRadius).toBeCloseTo(72 / Math.sqrt(180), 10);
    expect(straight.minRadius).toBeLessThan(INNER_RADIUS);
    expect(straight.valid).toBe(false);
  });

  it('與內緣相切時（a=π/3）得到官方答案 6√3+π ≈ 13.5339', () => {
    expect(TANGENT_CONTACT).toBeCloseTo(Math.PI / 3, 12);
    const best = pathMetrics(TANGENT_CONTACT);
    expect(best.valid).toBe(true);
    expect(best.chord).toBeCloseTo(6 * Math.sqrt(3), 10);
    expect(best.arc).toBeCloseTo(Math.PI, 10);
    expect(best.length).toBeCloseTo(OFFICIAL_LENGTH, 10);
    expect(best.length).toBeCloseTo(13.5339, 4);
  });

  it('所有合法路徑中，相切那條最短；越過切點就不合法', () => {
    let bestValid = Infinity;
    for (let i = 0; i <= 2000; i += 1) {
      const m = pathMetrics((PATH_SPAN * i) / 2000);
      if (m.valid) bestValid = Math.min(bestValid, m.length);
      else expect(m.contact).toBeGreaterThan(TANGENT_CONTACT);
    }
    expect(bestValid).toBeCloseTo(OFFICIAL_LENGTH, 5);
    expect(pathMetrics(TANGENT_CONTACT + 0.01).valid).toBe(false);
  });

  it('展開前的立體位置：蟲在下緣、蜂蜜在上緣正對面', () => {
    const bug = paperTo3d(BUG, 0);
    const honey = paperTo3d(HONEY, 0);
    expect(Math.hypot(bug.x, bug.y)).toBeCloseTo(BOTTOM_RADIUS, 10);
    expect(bug.z).toBeCloseTo(0, 10);
    expect(Math.hypot(honey.x, honey.y)).toBeCloseTo(TOP_RADIUS, 10);
    expect(honey.z).toBeCloseTo(FRUSTUM_HEIGHT, 10);
    const angle = Math.atan2(honey.y, honey.x) - Math.atan2(bug.y, bug.x);
    expect(Math.abs(angle)).toBeCloseTo(Math.PI, 10);
    expect(APEX_HEIGHT).toBeCloseTo(6 * Math.sqrt(3), 10);
  });

  it('捲起與攤平都是等距：路徑在立體上的長度不變', () => {
    const path = samplePath(TANGENT_CONTACT, 400, 400);
    for (const unroll of [0, 0.5, 1]) {
      let length = 0;
      for (let i = 1; i < path.length; i += 1) {
        const a = paperTo3d(path[i - 1], unroll);
        const b = paperTo3d(path[i], unroll);
        length += Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
      }
      expect(length).toBeCloseTo(OFFICIAL_LENGTH, 2);
    }
  });
});
