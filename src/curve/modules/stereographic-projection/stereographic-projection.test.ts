import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { crossVec3, lengthVec3, subVec3 } from '../../projection3d';
import { imageRadius, readStereo } from './geometry';
import { stereographicProjectionModule } from './index';

describe('stereographic-projection module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = stereographicProjectionModule.sample(stereographicProjectionModule.defaultParams, {
      step: stereographicProjectionModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('落點距離是 cot(θ/2)，赤道留在單位圓，南極落到原點', () => {
    for (const colat of [36, 62, 90, 120, 180]) {
      expect(imageRadius(colat)).toBeCloseTo(1 / Math.tan((colat * Math.PI) / 360), 12);
    }
    const equator = readStereo({ colat: 90, azim: 40 });
    expect(equator.radius).toBeCloseTo(1, 12);
    expect(equator.image.x).toBeCloseTo(equator.point.x, 12);
    expect(equator.image.y).toBeCloseTo(equator.point.y, 12);
    expect(equator.image.z).toBeCloseTo(equator.point.z, 12);
    const south = readStereo({ colat: 180, azim: 10 });
    expect(south.radius).toBeCloseTo(0, 12);
    expect(south.image.x).toBeCloseTo(0, 12);
    expect(south.image.y).toBeCloseTo(0, 12);
    expect(south.point.z).toBeCloseTo(-1, 12);
  });

  it('球面點、北極與落點共線，球面點長度是 1', () => {
    for (const [colat, azim] of [
      [36, 0],
      [62, 40],
      [90, 200],
      [140, 300],
      [180, 15],
    ] as const) {
      const reading = readStereo({ colat, azim });
      expect(lengthVec3(reading.point)).toBeCloseTo(1, 12);
      const cross = crossVec3(subVec3(reading.point, reading.north), subVec3(reading.image, reading.north));
      expect(lengthVec3(cross)).toBeCloseTo(0, 8);
      expect(reading.image.z).toBe(0);
      expect(Math.hypot(reading.image.x, reading.image.y)).toBeCloseTo(reading.radius, 12);
    }
  });

  it('角度被夾在畫面還裝得下的範圍', () => {
    expect(readStereo({ colat: 0, azim: -20 }).colat).toBe(36);
    expect(readStereo({ colat: 0, azim: -20 }).azim).toBe(0);
    expect(readStereo({ colat: 240, azim: 400 }).colat).toBe(180);
    expect(readStereo({ colat: 240, azim: 400 }).azim).toBe(360);
    expect(readStereo({ colat: Number.NaN, azim: Number.NaN })).toMatchObject({ colat: 36, azim: 0 });
  });
});
