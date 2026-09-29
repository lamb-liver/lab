import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { mandelbrotMapModule } from './index';
import { cFromPixel, insetFrame, mapFrame, mandelbrotEscape } from './geometry';

describe('mandelbrot-map module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = mandelbrotMapModule.sample(mandelbrotMapModule.defaultParams, {
      step: mandelbrotMapModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'default',
    });
    const points = (Array.isArray(out) ? out : out.paths.flatMap((path) => path.points)).filter(
      (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
    );
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('地圖中心是 c = (−0.7, 0)，角落小圖不接受點選', () => {
    const frame = mapFrame(800, 800);
    const inset = insetFrame(800, 800);
    const center = cFromPixel(frame.left + frame.w / 2, frame.top + frame.h / 2, frame, inset);
    expect(center?.cx).toBeCloseTo(-0.7);
    expect(center?.cy).toBeCloseTo(0);
    expect(cFromPixel(inset.left + 4, inset.top + 4, frame, inset)).toBeNull();
    const throughInset = cFromPixel(inset.left + inset.w / 2, inset.top + inset.h / 2, frame, inset, true);
    expect(throughInset).not.toBeNull();
  });

  it('c = 0 留在內部，c = 1 逃逸', () => {
    expect(mandelbrotEscape(0, 0, 80)).toBe(80);
    expect(mandelbrotEscape(1, 0, 80)).toBeLessThan(80);
  });
});
