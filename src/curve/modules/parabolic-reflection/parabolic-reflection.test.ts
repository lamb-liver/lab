import { describe, expect, it } from 'vitest';
import { stepParabolicReflectionAnimation } from './animation';
import {
  buildParabolaCurve,
  buildReflectionRays,
  sampleParabolicReflectionCurve,
} from './geometry';
import { parabolicReflectionModule } from './index';

describe('buildParabolaCurve', () => {
  it('includes the vertex and opens to the right', () => {
    const points = buildParabolaCurve(600, 40);
    const xs = points.map((point) => point.x);
    expect(Math.min(...xs)).toBe(0);
    expect(xs[0]).toBeGreaterThan(Math.min(...xs));
  });
});

describe('buildReflectionRays', () => {
  it('includes reflected rays after 50% reveal', () => {
    const rays = buildReflectionRays({
      canvasWidth: 600,
      canvasHeight: 600,
      currentFocalLength: 40,
      rayCount: 6,
      time: 0,
      revealProgress: 0.75,
    });
    expect(rays.length).toBe(12);
  });

  it('contains only incoming rays before 50% reveal', () => {
    const rays = buildReflectionRays({
      canvasWidth: 600,
      canvasHeight: 600,
      currentFocalLength: 40,
      rayCount: 6,
      time: 0,
      revealProgress: 0.25,
    });
    expect(rays.length).toBe(6);
    expect(rays.every((ray) => ray.x1 === 40 && ray.x2 !== ray.x1)).toBe(true);
  });
});

describe('stepParabolicReflectionAnimation', () => {
  it('ray count change resets reveal', () => {
    const defaults = parabolicReflectionModule.defaultParams;
    const state = stepParabolicReflectionAnimation(
      {
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentFocalLength: defaults.focalLength,
        previousRayCount: defaults.rayCount,
        previousFocalLength: defaults.focalLength,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, rayCount: 20 },
      0.004,
    );
    expect(state.revealProgress).toBeCloseTo(0.004);
    expect(state.isComplete).toBe(false);
  });

  it('scan speed change does not reset reveal', () => {
    const defaults = parabolicReflectionModule.defaultParams;
    const state = stepParabolicReflectionAnimation(
      {
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentFocalLength: defaults.focalLength,
        previousRayCount: defaults.rayCount,
        previousFocalLength: defaults.focalLength,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, scanSpeed: 0.05 },
      0.004,
    );
    expect(state.revealProgress).toBeGreaterThan(0.5);
  });
});

describe('parabolicReflectionModule.sample', () => {
  it('returns parabola points for thumbnail', () => {
    const points = sampleParabolicReflectionCurve(40, 4);
    expect(points.length).toBeGreaterThan(10);
  });
});
