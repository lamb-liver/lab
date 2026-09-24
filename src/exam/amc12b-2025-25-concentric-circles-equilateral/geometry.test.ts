import { describe, expect, it } from 'vitest';
import {
  OFFICIAL_SIDE_SQUARED,
  RADII,
  distance,
  equilateralDistanceIdentity,
  solutionBAngle,
  trialPoint,
  uniqueConfiguration,
} from './geometry';

describe('2025 AMC 12B #25 同心圓上的正三角形', () => {
  it('A 取在 (1,0) 時 C=(3/2, ±3√3/2)，s²=7', () => {
    const clockwise = uniqueConfiguration(0, -1);
    expect(clockwise.c.x).toBeCloseTo(1.5, 12);
    expect(clockwise.c.y).toBeCloseTo((3 * Math.sqrt(3)) / 2, 12);
    expect(clockwise.sideSquared).toBeCloseTo(OFFICIAL_SIDE_SQUARED, 12);
    const counter = uniqueConfiguration(0, 1);
    expect(counter.c.y).toBeCloseTo((-3 * Math.sqrt(3)) / 2, 12);
    expect(counter.sideSquared).toBeCloseTo(OFFICIAL_SIDE_SQUARED, 12);
  });

  it('A 在小圓上任何位置、兩個轉向，都得到三點分別在 1、2、3 圓上的正三角形，s²=7', () => {
    for (const turn of [1, -1] as const) {
      for (let i = 0; i < 36; i += 1) {
        const config = uniqueConfiguration((i * Math.PI) / 18, turn);
        const o = { x: 0, y: 0 };
        expect(distance(config.a, o)).toBeCloseTo(RADII[0], 10);
        expect(distance(config.b, o)).toBeCloseTo(RADII[1], 10);
        expect(distance(config.c, o)).toBeCloseTo(RADII[2], 10);
        expect(distance(config.a, config.b) ** 2).toBeCloseTo(7, 10);
        expect(distance(config.b, config.c) ** 2).toBeCloseTo(7, 10);
        expect(config.sideSquared).toBeCloseTo(7, 10);
      }
    }
  });

  it('像圓圓心離 O 恰為 1，半徑 2：與半徑 3 的圓內切', () => {
    const config = uniqueConfiguration(0.7, -1);
    expect(config.centerGap).toBeCloseTo(1, 12);
    expect(RADII[2] - config.rotatedRadius).toBeCloseTo(config.centerGap, 12);
  });

  it('試探點 B 只有在唯一解時，像 C′ 才落在半徑 3 的圓上', () => {
    const aAngle = 0.4;
    const target = solutionBAngle(aAngle, -1);
    expect(trialPoint(aAngle, target, -1).radius).toBeCloseTo(3, 10);
    for (let i = 1; i < 72; i += 1) {
      const radius = trialPoint(aAngle, target + (i * Math.PI) / 36, -1).radius;
      expect(radius).toBeLessThan(3 - 1e-6);
    }
  });

  it('代數檢查：(s²−7)² 型的重根', () => {
    expect(equilateralDistanceIdentity(7)).toBeCloseTo(0, 12);
    expect(equilateralDistanceIdentity(6.5)).not.toBeCloseTo(0, 3);
    expect(equilateralDistanceIdentity(7.5)).not.toBeCloseTo(0, 3);
  });
});
