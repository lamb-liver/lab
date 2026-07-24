import { describe, expect, it } from 'vitest';
import { dotVec3, subVec3, vec3 } from '../../curve/projection3d';
import {
  LINE_1,
  LINE_2,
  SKEW_LINE_METRICS,
  closestPointsOnLines,
  offsetPoints,
} from './geometry';

describe('112 學測數A選填 17 的歪斜線', () => {
  it('找出同時垂直兩直線的最短線段', () => {
    const common = subVec3(SKEW_LINE_METRICS.foot2, SKEW_LINE_METRICS.foot1);

    expect(dotVec3(common, LINE_1.direction)).toBeCloseTo(0);
    expect(dotVec3(common, LINE_2.direction)).toBeCloseTo(0);
    expect(SKEW_LINE_METRICS.lineDistance).toBeCloseTo(4 * Math.sqrt(2));
  });

  it('代入題目的兩段長 3 後得到 5√2', () => {
    expect(offsetPoints(3).distance).toBeCloseTo(5 * Math.sqrt(2));
  });

  it('拒絕以平行線套用歪斜線公式', () => {
    expect(() =>
      closestPointsOnLines(
        { point: vec3(0, 0, 0), direction: vec3(1, 0, 0) },
        { point: vec3(0, 1, 0), direction: vec3(2, 0, 0) },
      ),
    ).toThrow('歪斜線距離需要兩條不平行直線');
  });
});
