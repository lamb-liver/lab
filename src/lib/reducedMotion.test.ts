import { afterEach, describe, expect, it } from 'vitest';
import { advanceReveal, lerpReveal, prefersReducedMotion } from './reducedMotion';

function stubReducedMotion(matches: boolean) {
  const previous = globalThis.window;
  const media = { matches, addEventListener() {}, removeEventListener() {} };
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      matchMedia: () => media,
    },
  });
  return () => {
    if (previous === undefined) {
      Reflect.deleteProperty(globalThis, 'window');
      return;
    }
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: previous,
    });
  };
}

describe('reducedMotion', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'window');
  });

  it('is off when window is missing', () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it('advances linearly when motion is allowed', () => {
    expect(advanceReveal(0.2, 0.1)).toBeCloseTo(0.3);
    expect(advanceReveal(0.95, 0.1)).toBe(1);
  });

  it('lerps toward 1 when motion is allowed', () => {
    expect(lerpReveal(0, 0.5)).toBeCloseTo(0.5);
    expect(lerpReveal(0.5, 0.5)).toBeCloseTo(0.75);
  });

  it('snaps reveal to 1 when reduced motion is set', () => {
    const restore = stubReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);
    expect(advanceReveal(0, 0.01)).toBe(1);
    expect(lerpReveal(0, 0.01)).toBe(1);
    restore();
  });
});
