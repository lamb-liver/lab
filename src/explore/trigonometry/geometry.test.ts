import { describe, expect, it } from 'vitest';
import { DEFAULT_PARAMS, DEFAULT_TRIANGLE, MAX_VISUAL_DELTA_MS } from './constants';
import {
  buildCircleStats,
  buildTriangleStats,
  circleGeometry,
  circumcircleWorld,
  normalizeAngle,
  pickVisualDrag,
  plotRect,
  resetTriangle,
  setCircularTarget,
  stepSmoothing,
  triangleMetrics,
} from './geometry';

describe('trigonometry geometry', () => {
  it('normalizeAngle wraps to [0, 2π)', () => {
    expect(normalizeAngle(0)).toBeCloseTo(0);
    expect(normalizeAngle(Math.PI * 3)).toBeCloseTo(Math.PI);
    expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2);
  });

  it('setCircularTarget follows shortest arc', () => {
    const next = setCircularTarget(0.1, Math.PI * 2 - 0.05);
    expect(next).toBeCloseTo(-0.05, 2);
  });

  it('triangleMetrics satisfies law of sines ratio', () => {
    const g = triangleMetrics(DEFAULT_TRIANGLE);
    const ratioA = g.a / Math.sin(g.A);
    const ratioB = g.b / Math.sin(g.B);
    const ratioC = g.c / Math.sin(g.C);

    expect(ratioA).toBeCloseTo(ratioB, 3);
    expect(ratioB).toBeCloseTo(ratioC, 3);
    expect(g.R).toBeCloseTo(ratioA / 2, 3);
  });

  it('circumcircleWorld matches triangleMetrics R', () => {
    const { A, B, C } = DEFAULT_TRIANGLE;
    const cc = circumcircleWorld(A, B, C);
    const g = triangleMetrics(DEFAULT_TRIANGLE);

    expect(cc).not.toBeNull();
    expect(cc!.r).toBeCloseTo(g.R, 3);
  });

  it('buildCircleStats keeps sin²+cos²=1', () => {
    const { stats } = buildCircleStats(Math.PI / 3);
    expect(stats[3]).toBe('sin²θ + cos²θ = 1');
  });

  it('buildTriangleStats lists three side lengths', () => {
    const { stats } = buildTriangleStats(DEFAULT_TRIANGLE);
    expect(stats[0]).toMatch(/^a,b,c = /);
    expect(stats[1]).toMatch(/^A,B,C = /);
  });

  it('stepSmoothing moves toward targets', () => {
    const smooth = stepSmoothing(
      { theta: 0, alpha: 0, beta: 0, advancedMix: 0 },
      { ...DEFAULT_PARAMS, theta: 1, advanced: true },
      16.67,
    );

    expect(smooth.theta).toBeGreaterThan(0);
    expect(smooth.advancedMix).toBeGreaterThan(0);
  });

  it('stepSmoothing clamps large deltaMs like tab resume', () => {
    const normal = stepSmoothing(
      { theta: 0, alpha: 0, beta: 0, advancedMix: 0 },
      { ...DEFAULT_PARAMS, theta: 1 },
      16.67,
    );
    const tabResume = stepSmoothing(
      { theta: 0, alpha: 0, beta: 0, advancedMix: 0 },
      { ...DEFAULT_PARAMS, theta: 1 },
      5000,
    );
    const capped = stepSmoothing(
      { theta: 0, alpha: 0, beta: 0, advancedMix: 0 },
      { ...DEFAULT_PARAMS, theta: 1 },
      80,
    );

    expect(tabResume.theta).toBeCloseTo(capped.theta, 6);
    expect(tabResume.theta).toBeGreaterThan(normal.theta);
    expect(MAX_VISUAL_DELTA_MS).toBe(50);
  });

  it('pickVisualDrag in identity mode ignores empty circle rim away from beta arc', () => {
    const plot = plotRect(480, 560);
    const params = { ...DEFAULT_PARAMS, mode: 'identity' as const, alpha: Math.PI / 5, beta: Math.PI / 4 };
    const smooth = { theta: 0, alpha: params.alpha, beta: params.beta, advancedMix: 0 };
    const geo = circleGeometry(plot, smooth.advancedMix);

    const farRim = pickVisualDrag(
      'identity',
      geo.cx + geo.r,
      geo.cy,
      plot,
      params,
      smooth,
    );

    expect(farRim).toBeNull();
  });

  it('pickVisualDrag in identity mode hits beta near sum point', () => {
    const plot = plotRect(480, 560);
    const params = { ...DEFAULT_PARAMS, mode: 'identity' as const, alpha: Math.PI / 5, beta: Math.PI / 4 };
    const smooth = { theta: 0, alpha: params.alpha, beta: params.beta, advancedMix: 0 };
    const geo = circleGeometry(plot, smooth.advancedMix);
    const sum = normalizeAngle(params.alpha + params.beta);
    const sx = geo.cx + Math.cos(sum) * geo.r;
    const sy = geo.cy - Math.sin(sum) * geo.r;

    expect(pickVisualDrag('identity', sx, sy, plot, params, smooth)).toEqual({ type: 'beta' });
  });

  it('resetTriangle returns default vertices', () => {
    expect(resetTriangle()).toEqual(DEFAULT_TRIANGLE);
  });
});
