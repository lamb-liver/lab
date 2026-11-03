import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import {
  reflectAcrossTangent,
  readEllipseTangent,
} from './geometry';
import { ellipseTangentFociModule } from './index';

describe('ellipse-tangent-foci module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = ellipseTangentFociModule.sample(ellipseTangentFociModule.defaultParams, {
      step: ellipseTangentFociModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('切線兩側夾角相等，焦半徑和是 2，反射後的焦點與另一焦點、切點共線', () => {
    for (const e of [0.25, 0.6, 0.85]) {
      for (const tDeg of [20, 55, 90, 160]) {
        const reading = readEllipseTangent({ e, tDeg });
        expect(reading.angle1).toBeCloseTo(reading.angle2, 8);
        expect(reading.angle1).toBeGreaterThan(1);
        expect(reading.angle1).toBeLessThan(90);
        expect(reading.sum).toBeCloseTo(2, 8);

        const image = reflectAcrossTangent(reading.f2, reading.p, reading.tangent);
        const cross =
          (reading.p.x - reading.f1.x) * (image.y - reading.f1.y) -
          (reading.p.y - reading.f1.y) * (image.x - reading.f1.x);
        expect(cross).toBeCloseTo(0, 8);
        expect(Math.hypot(image.x - reading.f1.x, image.y - reading.f1.y)).toBeCloseTo(2, 8);
      }
    }
  });

  it('頂點正上方的夾角是 arccos(e)', () => {
    const reading = readEllipseTangent({ e: 0.6, tDeg: 90 });
    const expected = (Math.acos(0.6) * 180) / Math.PI;
    expect(reading.angle1).toBeCloseTo(expected, 8);
    expect(reading.angle2).toBeCloseTo(expected, 8);
  });
});
