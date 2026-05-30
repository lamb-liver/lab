import { describe, expect, it } from 'vitest';
import { stepParabolicReflectionAnimation } from './animation';
import {
  buildIncomingRay,
  buildReflectionRays,
  focusPoint,
  parabolaX,
  sampleParabolicReflectionCurve,
} from './geometry';
import { parabolicReflectionModule } from './index';

describe('parabolaX', () => {
  it('satisfies y² = 4px at vertex', () => {
    expect(parabolaX(0, 40)).toBe(0);
  });

  it('opens to the right', () => {
    expect(parabolaX(20, 40)).toBeGreaterThan(0);
  });
});

describe('buildIncomingRay', () => {
  it('grows from focus with reveal', () => {
    const focus = focusPoint(40);
    const atHalf = buildIncomingRay(focus, 100, 20, 0.25);
    expect(atHalf.x2).toBeGreaterThan(focus.x);
    expect(atHalf.x2).toBeLessThan(100);
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
});

describe('stepParabolicReflectionAnimation', () => {
  it('ray count change resets reveal', () => {
    const defaults = parabolicReflectionModule.defaultParams;
    const state = stepParabolicReflectionAnimation(
      {
        params: defaults,
        targetParams: defaults,
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
        params: defaults,
        targetParams: defaults,
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
