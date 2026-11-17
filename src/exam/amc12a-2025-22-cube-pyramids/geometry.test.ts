import { describe, expect, it } from 'vitest';
import {
  ONE_PYRAMID_VOLUME,
  SAMPLE_INSIDE_X,
  SAMPLE_INSIDE_Y,
  SAMPLE_INSIDE_Z,
  SAMPLE_OUTSIDE,
  TOTAL_PROBABILITY,
  baseCorners,
  clamp01,
  holds,
  pyramidOf,
  pyramidVolume,
} from './geometry';

describe('2025 AMC 12A #22 三塊錐體', () => {
  it('一塊的體積是 1/12，三塊合起來是 1/4', () => {
    expect(pyramidVolume()).toBe(ONE_PYRAMID_VOLUME);
    expect(3 * pyramidVolume()).toBe(TOTAL_PROBABILITY);
    expect(ONE_PYRAMID_VOLUME).toBeCloseTo(1 / 12, 12);
    expect(TOTAL_PROBABILITY).toBeCloseTo(1 / 4, 12);
  });

  it('截面積 (t/2)² 從 0 積到 1 也是 1/12', () => {
    const steps = 4000;
    let sum = 0;
    for (let i = 0; i < steps; i += 1) {
      const t = (i + 0.5) / steps;
      sum += (t / 2) ** 2;
    }
    expect(sum / steps).toBeCloseTo(1 / 12, 6);
  });

  it('樣本點落在對的那一塊，外面的點三塊都不算', () => {
    expect(pyramidOf(...SAMPLE_INSIDE_X)).toBe('x');
    expect(pyramidOf(...SAMPLE_INSIDE_Y)).toBe('y');
    expect(pyramidOf(...SAMPLE_INSIDE_Z)).toBe('z');
    expect(pyramidOf(...SAMPLE_OUTSIDE)).toBeNull();
    expect(holds(...SAMPLE_INSIDE_X)).toBe(true);
    expect(holds(0.8, 0.4, 0.2)).toBe(false);
  });

  it('三塊兩兩不相交：格子上每個點最多屬於一塊', () => {
    const n = 24;
    let hits = 0;
    let cells = 0;
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        for (let k = 0; k < n; k += 1) {
          const x = (i + 0.5) / n;
          const y = (j + 0.5) / n;
          const z = (k + 0.5) / n;
          const axis = pyramidOf(x, y, z);
          cells += 1;
          if (axis) hits += 1;
          const flags = [
            x > y && x > z && y < x / 2 && z < x / 2,
            y > x && y > z && x < y / 2 && z < y / 2,
            z > x && z > y && x < z / 2 && y < z / 2,
          ].filter(Boolean);
          expect(flags.length).toBeLessThanOrEqual(1);
        }
      }
    }
    expect(hits / cells).toBeCloseTo(1 / 4, 2);
  });

  it('底面是邊長 1/2 的正方形，貼在對應的面上', () => {
    for (const axis of ['x', 'y', 'z'] as const) {
      const corners = baseCorners(axis);
      expect(corners).toHaveLength(4);
      for (const corner of corners) {
        expect(corner[axis === 'x' ? 0 : axis === 'y' ? 1 : 2]).toBe(1);
      }
      const [a, b, c, d] = corners;
      expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeCloseTo(0.5, 12);
      expect(Math.hypot(b[0] - c[0], b[1] - c[1], b[2] - c[2])).toBeCloseTo(0.5, 12);
      expect(Math.hypot(a[0] - c[0], a[1] - c[1], a[2] - c[2])).toBeCloseTo(Math.SQRT1_2, 12);
      expect(d[0] + b[0]).toBeCloseTo(a[0] + c[0], 12);
    }
  });

  it('非有限值夾回 0，超出 [0,1] 夾到端點', () => {
    expect(clamp01(Number.NaN)).toBe(0);
    expect(clamp01(Number.POSITIVE_INFINITY)).toBe(0);
    expect(clamp01(-0.2)).toBe(0);
    expect(clamp01(1.4)).toBe(1);
    expect(clamp01(0.3)).toBe(0.3);
  });
});
