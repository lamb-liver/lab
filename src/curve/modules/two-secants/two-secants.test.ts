import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import {
  TANGENT_MARGIN,
  format3,
  horizontalSecant,
  slantedSecant,
  thetaMaxDeg,
  settle,
} from '../../circlePower';
import { twoSecantsModule } from './index';

describe('two-secants', () => {
  it('縮圖落在設計舞台內', () => {
    const out = twoSecantsModule.sample(twoSecantsModule.defaultParams, {
      step: twoSecantsModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('兩條線的乘積各自用交點距離算出，再四捨五入成同一個數', () => {
    const p = 1.8;
    const horizontal = horizontalSecant(p);
    const origin = { x: p, y: 0 };
    expect(horizontal.product).toBeCloseTo(
      Math.hypot(horizontal.nearPoint.x - origin.x, horizontal.nearPoint.y - origin.y) *
        Math.hypot(horizontal.farPoint.x - origin.x, horizontal.farPoint.y - origin.y),
      12,
    );
    expect(horizontal.product).toBeCloseTo((p - 1) * (p + 1), 12);

    for (const theta of [8, 18, thetaMaxDeg(p)]) {
      const slanted = slantedSecant(p, theta);
      const near = Math.hypot(slanted.nearPoint.x - origin.x, slanted.nearPoint.y - origin.y);
      const far = Math.hypot(slanted.farPoint.x - origin.x, slanted.farPoint.y - origin.y);
      expect(slanted.near).toBeCloseTo(near, 12);
      expect(slanted.far).toBeCloseTo(far, 12);
      expect(slanted.product).toBeCloseTo(near * far, 12);
      expect(slanted.near).toBeLessThan(slanted.far);
      expect(slanted.nearPoint.y).toBeGreaterThan(0);
      expect(format3(slanted.product)).toBe(format3(horizontal.product));
    }

    const low = slantedSecant(p, 8);
    const high = slantedSecant(p, thetaMaxDeg(p));
    expect(low.near).not.toBeCloseTo(high.near, 2);
    expect(format3(horizontalSecant(1.35).product)).toBe('0.823');
    expect(format3(horizontal.product)).toBe('2.240');
  });

  it('偏角有下限，上限停在切線前的裕度', () => {
    expect(settle(1.8, 0).thetaDeg).toBe(8);
    const max = thetaMaxDeg(2.4);
    expect(settle(2.4, 90).thetaDeg).toBeCloseTo(max, 8);
    expect(2.4 * Math.sin((max * Math.PI) / 180)).toBeCloseTo(TANGENT_MARGIN, 8);
    expect(max).toBeGreaterThan(8);
  });
});
