import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import {
  LAMBDA_MAJOR,
  LAMBDA_MINOR,
  PHI_DEG,
  multiplyA,
  readDominant,
  type Vec,
} from './geometry';
import { dominantDirectionModule } from './index';

function worldSteps(thetaDeg: number, steps: number): Vec {
  const t = (thetaDeg * Math.PI) / 180;
  let v = { x: Math.cos(t), y: Math.sin(t) };
  for (let k = 0; k < steps; k += 1) {
    const next = multiplyA(v);
    const len = Math.hypot(next.x, next.y);
    v = { x: next.x / len, y: next.y / len };
  }
  return v;
}

describe('dominant-direction module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = dominantDirectionModule.sample(dominantDirectionModule.defaultParams, {
      step: dominantDirectionModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('閉式方向與逐次乘上再取單位長度相同', () => {
    for (const thetaDeg of [0, 28, 70, 118, 180]) {
      for (const steps of [0, 1, 3, 8]) {
        const reading = readDominant({ thetaDeg, steps });
        const walked = worldSteps(thetaDeg, steps);
        expect(reading.u.x).toBeCloseTo(walked.x, 8);
        expect(reading.u.y).toBeCloseTo(walked.y, 8);
        expect(reading.stretch).toBeGreaterThanOrEqual(LAMBDA_MINOR - 1e-8);
        expect(reading.stretch).toBeLessThanOrEqual(LAMBDA_MAJOR + 1e-8);
        expect(reading.angleDeg).toBeGreaterThanOrEqual(0);
        expect(reading.angleDeg).toBeLessThanOrEqual(90);
        expect(reading.trail).toHaveLength(steps + 1);
      }
    }
  });

  it('兩條特徵直線自己不動，其餘方向的夾角隨次數下降', () => {
    for (const steps of [0, 3, 8]) {
      const onMajor = readDominant({ thetaDeg: PHI_DEG, steps });
      expect(onMajor.angleDeg).toBeCloseTo(0, 8);
      expect(onMajor.stretch).toBeCloseTo(LAMBDA_MAJOR, 8);

      const onMinor = readDominant({ thetaDeg: PHI_DEG + 90, steps });
      expect(onMinor.angleDeg).toBeCloseTo(90, 8);
      expect(onMinor.stretch).toBeCloseTo(LAMBDA_MINOR, 8);
    }

    const angles = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(
      (steps) => readDominant({ thetaDeg: 70, steps }).angleDeg,
    );
    for (let i = 1; i < angles.length; i += 1) {
      expect(angles[i]).toBeLessThan(angles[i - 1] ?? 0);
    }
    expect(angles[8]).toBeLessThan(1);
  });

  it('相差 180° 的起點走到同一條直線的兩側', () => {
    const forward = readDominant({ thetaDeg: 0, steps: 8 });
    const backward = readDominant({ thetaDeg: 180, steps: 8 });
    expect(forward.angleDeg).toBeCloseTo(backward.angleDeg, 8);
    const dot = forward.u.x * backward.u.x + forward.u.y * backward.u.y;
    expect(dot).toBeCloseTo(-1, 6);
  });
});
