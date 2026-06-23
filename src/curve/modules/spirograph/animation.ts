import type { AnimationState, ParamValues } from '../../types';

export const MORPH_LERP = 0.08;

export function stepSpirographAnimation(
  state: AnimationState,
  nextTarget: ParamValues,
  revealSpeed: number,
): AnimationState {
  const prevTarget = state.targetParams;
  const radiusChanged =
    Math.round(prevTarget.R) !== Math.round(nextTarget.R) ||
    Math.round(prevTarget.r) !== Math.round(nextTarget.r);

  let { params, revealProgress, isComplete } = state;
  const targetParams = { ...nextTarget };

  if (radiusChanged) {
    revealProgress = 0;
    isComplete = false;
    params = { ...params, R: targetParams.R, r: targetParams.r };
  }

  let d = params.d ?? targetParams.d;
  d += (targetParams.d - d) * MORPH_LERP;
  if (Math.abs(d - targetParams.d) < 0.05) {
    d = targetParams.d;
  }

  params = { R: targetParams.R, r: targetParams.r, d };

  if (!isComplete) {
    revealProgress += revealSpeed;
    if (revealProgress >= 1) {
      revealProgress = 1;
      isComplete = true;
    }
  }

  return { params, targetParams, revealProgress, isComplete };
}
