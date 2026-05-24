import type { ParamValues } from '../../types';

export const REVEAL_SPEED = 0.005;
export const PARAM_LERP = 0.08;

export type LinearTransformGridAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentShearX: number;
  currentScaleY: number;
  previousShearX: number;
  previousScaleY: number;
};

export function createLinearTransformGridAnimState(
  defaultParams: ParamValues,
): LinearTransformGridAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentShearX: defaultParams.shearX,
    currentScaleY: defaultParams.scaleY,
    previousShearX: defaultParams.shearX,
    previousScaleY: defaultParams.scaleY,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  const next = current + (target - current) * factor;
  if (Math.abs(next - target) < 0.0005) return target;
  return next;
}

export function stepLinearTransformGridAnimation(
  state: LinearTransformGridAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
): LinearTransformGridAnimState {
  const structureChanged =
    nextTarget.shearX !== state.previousShearX ||
    nextTarget.scaleY !== state.previousScaleY;

  let { revealProgress, isComplete, time, currentShearX, currentScaleY } = state;
  const targetParams = { ...nextTarget };

  if (structureChanged) {
    revealProgress = 0;
    isComplete = false;
  }

  currentShearX = lerpToward(currentShearX, targetParams.shearX, PARAM_LERP);
  currentScaleY = lerpToward(currentScaleY, targetParams.scaleY, PARAM_LERP);

  time += targetParams.transformSpeed;

  const params = {
    shearX: currentShearX,
    scaleY: currentScaleY,
    transformSpeed: targetParams.transformSpeed,
  };

  if (!isComplete) {
    revealProgress += revealSpeed;
    if (revealProgress >= 1) {
      revealProgress = 1;
      isComplete = true;
    }
  }

  return {
    params,
    targetParams,
    revealProgress,
    isComplete,
    time,
    currentShearX,
    currentScaleY,
    previousShearX: targetParams.shearX,
    previousScaleY: targetParams.scaleY,
  };
}
