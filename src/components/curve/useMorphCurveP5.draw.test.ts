import { describe, expect, it, vi } from 'vitest';
import { harmonographModule } from '../../curve/modules/harmonograph';
import { stepHarmonographAnimation } from '../../curve/modules/harmonograph/animation';
import { createMorphPathCache } from '../../curve/morphPathCache';
import { executeMorphDrawFrame, type MorphAnimStep } from '../../curve/morphFrame';
import type { AnimationState } from '../../curve/types';

/**
 * 模擬 useMorphCurveP5 draw() 的 ref 解引用方式：
 * executeMorphDrawFrame(..., stepAnimationRef.current, ...)
 */
function simulateDrawLikeHook(
  stepAnimationRef: { current: MorphAnimStep },
  anim: AnimationState,
  target: AnimationState['targetParams'],
  cache = createMorphPathCache(harmonographModule),
) {
  return executeMorphDrawFrame(
    harmonographModule,
    cache,
    anim,
    target,
    0.01,
    stepAnimationRef.current,
    0.0015,
  );
}

describe('useMorphCurveP5 draw wiring', () => {
  it('dereferences stepAnimationRef.current on each draw invoke', () => {
    const stepA = vi.fn((state: AnimationState) => state);
    const stepB = vi.fn((state: AnimationState) => ({
      ...state,
      revealProgress: state.revealProgress + 0.01,
    }));
    const stepAnimationRef = { current: stepA as MorphAnimStep };
    const anim: AnimationState = {
      params: { ...harmonographModule.defaultParams },
      targetParams: { ...harmonographModule.defaultParams },
      revealProgress: 1,
      isComplete: true,
    };
    const target = { ...harmonographModule.defaultParams, d: 0.05 };

    simulateDrawLikeHook(stepAnimationRef, anim, target);
    expect(stepA).toHaveBeenCalledTimes(1);
    expect(stepB).not.toHaveBeenCalled();

    stepAnimationRef.current = stepB;
    const frame = simulateDrawLikeHook(stepAnimationRef, anim, target);
    expect(stepB).toHaveBeenCalledTimes(1);
    expect(frame.state.revealProgress).toBeCloseTo(1.01, 5);
  });

  it('uses stepHarmonographAnimation when ref points to it', () => {
    const stepAnimationRef = { current: stepHarmonographAnimation };
    const anim: AnimationState = {
      params: { ...harmonographModule.defaultParams },
      targetParams: { ...harmonographModule.defaultParams },
      revealProgress: 1,
      isComplete: true,
    };
    const target = { ...harmonographModule.defaultParams, d: 0.05 };

    const frame = simulateDrawLikeHook(stepAnimationRef, anim, target);
    expect(frame.points.length).toBeGreaterThan(0);
    expect(frame.state.params.d).toBeLessThan(0.05);
  });
});
