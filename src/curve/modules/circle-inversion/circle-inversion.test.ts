import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { circleInversionModule } from './index';
import { DEFAULT_CIRCLE_INVERSION, invertCircle, invertLine, invertPoint, moveHandle } from './geometry';

describe('circle-inversion module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = circleInversionModule.sample(circleInversionModule.defaultParams, {
      step: circleInversionModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'default',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('反演兩次是自己，圓上的點不動，距離乘積是 R²', () => {
    const p = { x: 1.2, y: -0.4 };
    const once = invertPoint(p, 1.3);
    const twice = invertPoint(once!, 1.3);
    expect(twice!.x).toBeCloseTo(p.x);
    expect(twice!.y).toBeCloseTo(p.y);

    const onCircle = { x: 0.6, y: 0.8 };
    const fixed = invertPoint(onCircle, 1);
    expect(fixed!.x).toBeCloseTo(onCircle.x);
    expect(fixed!.y).toBeCloseTo(onCircle.y);

    const image = invertPoint({ x: 2, y: 0 }, 1.5)!;
    const op = 2;
    const op2 = Math.hypot(image.x, image.y);
    expect(op * op2).toBeCloseTo(1.5 * 1.5);
  });

  it('不過圓心的直線變成通過圓心的圓', () => {
    const image = invertLine({ x: -2, y: 1 }, { x: 2, y: 1 }, 1);
    expect(image).toEqual({ kind: 'circle', center: { x: 0, y: 0.5 }, radius: 0.5 });
  });

  it('不過圓心的圓仍是圓，過圓心的圓變成直線', () => {
    const circle = invertCircle({ x: 1.5, y: 0 }, 0.5, 1);
    expect(circle?.kind).toBe('circle');
    if (circle?.kind !== 'circle') return;
    expect(circle.center.x).toBeCloseTo(0.75);
    expect(circle.center.y).toBeCloseTo(0);
    expect(circle.radius).toBeCloseTo(0.25);

    const back = invertCircle(circle.center, circle.radius, 1);
    expect(back?.kind).toBe('circle');
    if (back?.kind !== 'circle') return;
    expect(back.center.x).toBeCloseTo(1.5);
    expect(back.radius).toBeCloseTo(0.5);

    const line = invertCircle({ x: 1, y: 0 }, 1, 1);
    expect(line?.kind).toBe('line');
    if (line?.kind !== 'line') return;
    expect(line.point.x).toBeCloseTo(0.5);
    expect(line.point.y).toBeCloseTo(0);
    expect(Math.abs(line.direction.x)).toBeLessThan(1e-12);
  });

  it('半徑把手留在畫面內，兩點重合時直線的像是未定義', () => {
    const parked = moveHandle({ ...DEFAULT_CIRCLE_INVERSION, cx: 2.2, rho: 0.45 }, 'center', { x: 5, y: 0 });
    expect(parked.cx).toBeCloseTo(1.15);
    expect(parked.cx + parked.rho).toBeCloseTo(1.6);
    const widened = moveHandle({ ...DEFAULT_CIRCLE_INVERSION, cx: 1, rho: 0.3 }, 'rim', { x: 10, y: 0 });
    expect(widened.rho).toBeCloseTo(0.6);
    expect(widened.cx + widened.rho).toBeCloseTo(1.6);

    const meta = circleInversionModule.getMetadata({ ...DEFAULT_CIRCLE_INVERSION, ax: 0.2, ay: 0.2, bx: 0.2, by: 0.2 });
    expect(meta.stats.find((stat) => stat.key === 'line')?.value).toBe('未定義');
  });
});
