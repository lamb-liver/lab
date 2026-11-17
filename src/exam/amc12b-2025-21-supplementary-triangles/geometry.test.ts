import { describe, expect, it } from 'vitest';
import {
  COS_PAIR,
  acuteTheta,
  apex,
  integerThirdSides,
  obtuseTheta,
  thirdSide,
  triangleArea,
} from './geometry';

describe('2025 AMC 12B #21 補角三角形', () => {
  it('cos = 1/6 時第三邊是 11 與 13，平方和 290', () => {
    expect(thirdSide(acuteTheta())).toBeCloseTo(11, 10);
    expect(thirdSide(obtuseTheta())).toBeCloseTo(13, 10);
    expect(11 ** 2 + 13 ** 2).toBe(290);
    expect(145 - 144 * COS_PAIR).toBe(121);
    expect(145 + 144 * COS_PAIR).toBe(169);
  });

  it('兩塊面積都是 6√35，補角不改變 sin', () => {
    const area = triangleArea(acuteTheta());
    expect(area).toBeCloseTo(6 * Math.sqrt(35), 10);
    expect(triangleArea(obtuseTheta())).toBeCloseTo(area, 10);
    expect(Math.sin(obtuseTheta())).toBeCloseTo(Math.sin(acuteTheta()), 12);
  });

  it('開區間 (1, 17) 裡只有一對整數', () => {
    expect(integerThirdSides()).toEqual([[11, 13]]);
    expect(thirdSide(0)).toBeCloseTo(1, 10);
    expect(thirdSide(Math.PI)).toBeCloseTo(17, 10);
    expect(triangleArea(0)).toBeCloseTo(0, 12);
  });

  it('任意夾角與它的補角面積相同，第三邊不同', () => {
    for (const degrees of [20, 50, 80, 110, 150]) {
      const theta = (degrees * Math.PI) / 180;
      expect(triangleArea(Math.PI - theta)).toBeCloseTo(triangleArea(theta), 10);
      expect(thirdSide(Math.PI - theta)).not.toBeCloseTo(thirdSide(theta), 4);
    }
  });

  it('頂點到原點的距離是 8', () => {
    const point = apex(acuteTheta());
    expect(Math.hypot(point.x, point.y)).toBeCloseTo(8, 10);
    expect(point.x).toBeCloseTo(8 * COS_PAIR, 10);
  });
});
