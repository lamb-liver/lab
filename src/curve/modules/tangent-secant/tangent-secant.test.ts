import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { format3, slantedSecant, upperTangent } from '../../circlePower';
import { tangentSecantModule } from './index';

describe('tangent-secant', () => {
  it('縮圖落在設計舞台內', () => {
    const out = tangentSecantModule.sample(tangentSecantModule.defaultParams, {
      step: tangentSecantModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('切線平方與割線乘積都由座標算出', () => {
    const p = 1.8;
    const tangent = upperTangent(p);
    const length = Math.hypot(tangent.point.x - p, tangent.point.y);
    expect(tangent.square).toBeCloseTo(length * length, 12);
    expect(tangent.point.x ** 2 + tangent.point.y ** 2).toBeCloseTo(1, 12);
    expect(tangent.point.y).toBeGreaterThan(0);
    const secant = slantedSecant(p, 18);
    expect(format3(tangent.square)).toBe(format3(secant.product));
    expect(format3(upperTangent(1.35).square)).toBe('0.823');
  });
});
