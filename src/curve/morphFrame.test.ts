import { describe, expect, it, vi } from 'vitest';
import { harmonographModule } from './modules/harmonograph';
import { stepHarmonographAnimation } from './modules/harmonograph/animation';
import { createMorphPathCache } from './morphPathCache';
import { executeMorphDrawFrame, getMorphDisplayPoints } from './morphFrame';
import { filterRevealed } from '../systems/rendering/reveal';
import type { AnimationState } from './types';

const BASE = { a: 3, b: 2, delta: Math.PI / 2 };
const SAMPLE_STEP = 0.01;
const REVEAL_SPEED = 0.0015;

const defaultAnim: AnimationState = {
  params: { ...harmonographModule.defaultParams },
  targetParams: { ...harmonographModule.defaultParams },
  revealProgress: 1,
  isComplete: true,
};

function morphFrame(
  anim: AnimationState,
  target: AnimationState['targetParams'],
  stepAnimation = stepHarmonographAnimation,
  cache = createMorphPathCache(harmonographModule),
) {
  return executeMorphDrawFrame(
    harmonographModule,
    cache,
    anim,
    target,
    SAMPLE_STEP,
    stepAnimation,
    REVEAL_SPEED,
  );
}

describe('getMorphDisplayPoints', () => {
  it('calls module.sample on every invocation when cacheStrategy is none', () => {
    const cache = createMorphPathCache(harmonographModule);
    const spy = vi.spyOn(harmonographModule, 'sample');

    getMorphDisplayPoints(harmonographModule, { ...BASE, d: 0.015 }, SAMPLE_STEP, cache);
    getMorphDisplayPoints(harmonographModule, { ...BASE, d: 0.05 }, SAMPLE_STEP, cache);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, { ...BASE, d: 0.015 }, { step: SAMPLE_STEP });
    expect(spy).toHaveBeenNthCalledWith(2, { ...BASE, d: 0.05 }, { step: SAMPLE_STEP });
    spy.mockRestore();
  });

  it('reflects different arc lengths for meaningfully different d', () => {
    const cache = createMorphPathCache(harmonographModule);
    const light = getMorphDisplayPoints(
      harmonographModule,
      { ...BASE, d: 0 },
      SAMPLE_STEP,
      cache,
    );
    const heavy = getMorphDisplayPoints(
      harmonographModule,
      { ...BASE, d: 0.2 },
      SAMPLE_STEP,
      cache,
    );

    expect(heavy.length).toBeLessThan(light.length);
    expect(heavy.at(-1)!.arcLength).not.toBeCloseTo(light.at(-1)!.arcLength, 2);
  });

  it('uses cache when cacheStrategy is not none', () => {
    const sample = vi.fn((params: { d: number }) => [
      { x: params.d, y: 0, theta: 0, arcLength: params.d * 100 },
    ]);
    const module = {
      sample,
      cacheStrategy: { kind: 'exact' as const, cacheKey: (p: { d: number }) => String(p.d) },
    };
    const cache = createMorphPathCache(module as never);

    const first = getMorphDisplayPoints(module as never, { d: 0.01 }, SAMPLE_STEP, cache);
    const second = getMorphDisplayPoints(module as never, { d: 0.01 }, SAMPLE_STEP, cache);

    expect(sample).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });
});

describe('executeMorphDrawFrame', () => {
  it('samples with params from the same stepAnimation call', () => {
    const cache = createMorphPathCache(harmonographModule);
    const spy = vi.spyOn(harmonographModule, 'sample');
    const target = { ...harmonographModule.defaultParams, d: 0.05 };

    spy.mockClear();
    const frame = morphFrame(defaultAnim, target, stepHarmonographAnimation, cache);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(frame.state.params, { step: SAMPLE_STEP });
    spy.mockRestore();
  });
});

describe('harmonograph d morph invariants', () => {
  it('keeps non-empty samples while damping lerps (reveal complete)', () => {
    let state: AnimationState = {
      params: { ...harmonographModule.defaultParams },
      targetParams: { ...harmonographModule.defaultParams },
      revealProgress: 1,
      isComplete: true,
    };
    const target = { ...harmonographModule.defaultParams, d: 0.05 };
    const cache = createMorphPathCache(harmonographModule);

    for (let i = 0; i < 120; i++) {
      const frame = morphFrame(state, target, stepHarmonographAnimation, cache);
      state = frame.state;
      expect(frame.points.length).toBeGreaterThan(0);
      expect(frame.points.at(-1)!.arcLength).toBeGreaterThan(0);
    }

    expect(state.params.d).toBeCloseTo(0.05, 3);
  });

  it('keeps reveal within current totalArc during gradual d morph at revealProgress=0.5', () => {
    let state: AnimationState = {
      params: { ...harmonographModule.defaultParams },
      targetParams: { ...harmonographModule.defaultParams },
      revealProgress: 0.5,
      isComplete: false,
    };
    const target = { ...harmonographModule.defaultParams, d: 0.05 };
    const cache = createMorphPathCache(harmonographModule);

    for (let i = 0; i < 120; i++) {
      const frame = morphFrame(state, target, stepHarmonographAnimation, cache);
      state = frame.state;

      const totalArc = frame.points.at(-1)!.arcLength ?? 0;
      const revealed = filterRevealed(frame.points, state.revealProgress, 'byArcLength');
      const threshold = totalArc * state.revealProgress;

      expect(revealed.length).toBeGreaterThan(0);
      expect(revealed.at(-1)!.arcLength).toBeLessThanOrEqual(threshold + 1e-6);
    }
  });

  it('handles sudden d jump during reveal at 0.3 without empty output', () => {
    const cache = createMorphPathCache(harmonographModule);
    let state: AnimationState = {
      params: { ...harmonographModule.defaultParams, d: 0.01 },
      targetParams: { ...harmonographModule.defaultParams, d: 0.01 },
      revealProgress: 0.3,
      isComplete: false,
    };

    const before = morphFrame(state, state.targetParams, stepHarmonographAnimation, cache);
    const arcBefore = before.points.at(-1)!.arcLength;

    const suddenTarget = { ...harmonographModule.defaultParams, d: 0.05 };
    const after = morphFrame(before.state, suddenTarget, stepHarmonographAnimation, cache);
    const arcAfter = after.points.at(-1)!.arcLength;
    const revealed = filterRevealed(after.points, after.state.revealProgress, 'byArcLength');
    const threshold = arcAfter * after.state.revealProgress;

    expect(arcAfter).toBeLessThan(arcBefore);
    expect(revealed.length).toBeGreaterThan(0);
    expect(revealed.at(-1)!.arcLength).toBeLessThanOrEqual(threshold + 1e-6);
    expect(after.state.revealProgress).toBeGreaterThan(0.3);
    expect(after.state.revealProgress).toBeLessThan(0.32);
  });
});
