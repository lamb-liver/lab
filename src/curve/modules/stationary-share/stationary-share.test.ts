import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { arrowReach, readShare } from './geometry';
import { stationaryShareModule } from './index';

describe('stationary-share module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = stationaryShareModule.sample(stationaryShareModule.defaultParams, {
      step: stationaryShareModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('預設份額是 0.75，兩邊速率相同時各半', () => {
    const reading = readShare({ a: 0.2, b: 0.6 });
    expect(reading.shareA).toBeCloseTo(0.75, 10);
    expect(reading.shareB).toBeCloseTo(0.25, 10);
    expect(reading.flow).toBeCloseTo(0.2 * reading.shareA, 12);

    const even = readShare({ a: 0.5, b: 0.5 });
    expect(even.shareA).toBe(0.5);
    expect(even.shareB).toBe(0.5);
  });

  it('份額相加是 1，而且兩邊流量相等；離開得少的一邊份額較大', () => {
    for (const [a, b] of [
      [0.2, 0.6],
      [0.05, 1],
      [1, 0.05],
      [0.37, 0.37],
      [0.8, 0.15],
    ] as const) {
      const reading = readShare({ a, b });
      expect(reading.shareA + reading.shareB).toBeCloseTo(1, 12);
      expect(reading.a * reading.shareA).toBeCloseTo(reading.b * reading.shareB, 12);
      if (a < b) expect(reading.shareA).toBeGreaterThan(reading.shareB);
      if (a > b) expect(reading.shareA).toBeLessThan(reading.shareB);
    }
  });

  it('手機寬度上，預設速率的箭頭比下限長，最長仍短於線段', () => {
    const barSpan = 170;
    const shortest = arrowReach(0.05, barSpan);
    const leavingA = arrowReach(0.2, barSpan);
    const leavingB = arrowReach(0.6, barSpan);
    const longest = arrowReach(1, barSpan);
    expect(leavingA).toBeGreaterThan(shortest + 4);
    expect(leavingB).toBeGreaterThan(leavingA);
    expect(longest).toBeGreaterThan(leavingB);
    expect(longest).toBeLessThan(barSpan);
  });

  it('速率夾在 0.05 與 1，非數值回到下限', () => {
    expect(readShare({ a: 0, b: 2 })).toEqual(expect.objectContaining({ a: 0.05, b: 1 }));
    expect(readShare({ a: Number.NaN, b: -1 })).toEqual(
      expect.objectContaining({ a: 0.05, b: 0.05 }),
    );
  });
});
