import { describe, expect, it } from 'vitest';
import {
  ORIGINAL_APEX_ANGLE,
  buildIsoscelesConstruction,
  distanceSquared,
} from './geometry';

describe('112 分科數甲選填 9 的 120° 等腰作圖', () => {
  it('用高中三角比與餘弦定理得到官方答案 13/3', () => {
    const construction = buildIsoscelesConstruction(ORIGINAL_APEX_ANGLE);

    expect(construction.baseAngle).toBe(30);
    expect(construction.AM).toBeCloseTo(Math.sqrt(21) / 3);
    expect(construction.AN).toBeCloseTo(1);
    expect(construction.angleMAN).toBeCloseTo(construction.angleBAC + 60);
    expect(construction.mnSquared).toBeCloseTo(13 / 3);
    expect(distanceSquared(construction.points.M, construction.points.N)).toBeCloseTo(13 / 3);
  });

  it('把互動輸入限制在可讀的 60° 到 150°', () => {
    expect(buildIsoscelesConstruction(20).apexAngle).toBe(60);
    expect(buildIsoscelesConstruction(170).apexAngle).toBe(150);
  });
});
