import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { mandelbrotMapModule } from './index';
import { MANDEL_VIEW, cFromPixel, insetFrame, mapFrame, mandelbrotEscape } from './geometry';

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
    expect(inset.top).toBeLessThan(frame.top);
    expect(inset.left).toBeGreaterThan(frame.left + frame.w / 2);
    const ix = inset.left + inset.w / 2;
    const iy = inset.top + inset.h / 2;
    expect(iy).toBeGreaterThan(frame.top);
    expect(iy).toBeLessThan(frame.top + frame.h);
    expect(cFromPixel(ix, iy, frame, inset)).toBeNull();
    const throughInset = cFromPixel(ix, iy, frame, inset, true);
    expect(throughInset).not.toBeNull();
  });

  it('縮圖的 c 標記與點雲用同一個尺度', () => {
    const out = mandelbrotMapModule.sample(mandelbrotMapModule.defaultParams, {
      step: mandelbrotMapModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    if (Array.isArray(out) || !out.circles?.[0]) throw new Error('expected a thumbnail circle');
    const { cx, cy } = mandelbrotMapModule.defaultParams;
    const midX = (MANDEL_VIEW.cx0 + MANDEL_VIEW.cx1) / 2;
    const midY = (MANDEL_VIEW.cy0 + MANDEL_VIEW.cy1) / 2;
    const halfW = (MANDEL_VIEW.cx1 - MANDEL_VIEW.cx0) / 2;
    const halfH = (MANDEL_VIEW.cy1 - MANDEL_VIEW.cy0) / 2;
    const span = 240;
    expect(out.circles[0].x).toBeCloseTo(((cx - midX) / halfW) * span);
    expect(out.circles[0].y).toBeCloseTo(((cy - midY) / halfH) * span);
  });

  it('c = 0 留在內部，c = 1 逃逸', () => {
    expect(mandelbrotEscape(0, 0, 80)).toBe(80);
    expect(mandelbrotEscape(1, 0, 80)).toBeLessThan(80);
  });
});
