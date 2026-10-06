import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import {
  angleSumDegrees,
  arcPoints,
  geodesicCircle,
  interiorAngle,
  tangentAngle,
  vertices,
} from './geometry';
import { poincareTriangleModule } from './index';

describe('poincare-triangle module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = poincareTriangleModule.sample(poincareTriangleModule.defaultParams, {
      step: poincareTriangleModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('邊與外圓垂直，畫面上的夾角等於內角公式，而且愈靠邊界內角和愈小', () => {
    for (const r of [0.2, 0.55, 0.85]) {
      const verts = vertices(r);
      const circle = geodesicCircle(verts[0], verts[1]);
      expect(circle.c.x ** 2 + circle.c.y ** 2 - circle.radius ** 2).toBeCloseTo(1, 8);
      const samples = arcPoints(circle, verts[0], verts[1], 16);
      for (const sample of samples) {
        expect(sample.x ** 2 + sample.y ** 2).toBeLessThanOrEqual(1 + 1e-9);
      }
      expect(tangentAngle(r)).toBeCloseTo(interiorAngle(r), 8);
      expect(angleSumDegrees(r)).toBeLessThan(180);
    }

    expect(angleSumDegrees(0.12)).toBeGreaterThan(170);
    expect(angleSumDegrees(0.9)).toBeLessThan(30);
    expect(angleSumDegrees(0.85)).toBeLessThan(angleSumDegrees(0.3));
  });
});
