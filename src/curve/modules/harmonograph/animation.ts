import type { AnimationState, ParamValues } from '../../types';
import { MORPH_LERP } from './index';

export function stepHarmonographAnimation(
  state: AnimationState,
  nextTarget: ParamValues,
  revealSpeed: number,
): AnimationState {
  const prevTarget = state.targetParams;
  const freqChanged =
    Math.round(prevTarget.a) !== Math.round(nextTarget.a) ||
    Math.round(prevTarget.b) !== Math.round(nextTarget.b);

  let { params, revealProgress, isComplete } = state;
  const targetParams = { ...nextTarget };

  if (freqChanged) {
    revealProgress = 0;
    isComplete = false;
    params = { ...params, a: targetParams.a, b: targetParams.b };
  }

  let delta = params.delta ?? targetParams.delta;
  let d = params.d ?? targetParams.d;

  delta += (targetParams.delta - delta) * MORPH_LERP;
  d += (targetParams.d - d) * MORPH_LERP;

  if (Math.abs(delta - targetParams.delta) < 0.001) {
    delta = targetParams.delta;
  }
  if (Math.abs(d - targetParams.d) < 0.0001) {
    d = targetParams.d;
  }

  params = { a: targetParams.a, b: targetParams.b, delta, d };

  if (!isComplete) {
    revealProgress += revealSpeed;
    if (revealProgress >= 1) {
      revealProgress = 1;
      isComplete = true;
    }
  }

  return { params, targetParams, revealProgress, isComplete };
}
