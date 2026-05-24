import type { ParamValues } from '../../types';

export const REVEAL_SPEED = 0.004;
export const PARAM_LERP = 0.08;

export type AffineTransformPatternAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentRotationDeg: number;
  currentTranslation: number;
  previousRotationDeg: number;
  previousTranslation: number;
};

export function createAffineTransformPatternAnimState(
  defaultParams: ParamValues,
): AffineTransformPatternAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentRotationDeg: defaultParams.rotationDeg,
    currentTranslation: defaultParams.translation,
    previousRotationDeg: defaultParams.rotationDeg,
    previousTranslation: defaultParams.translation,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  const next = current + (target - current) * factor;
  if (Math.abs(next - target) < 0.05) return target;
  return next;
}

export function stepAffineTransformPatternAnimation(
  state: AffineTransformPatternAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
): AffineTransformPatternAnimState {
  const structureChanged =
    nextTarget.rotationDeg !== state.previousRotationDeg ||
    nextTarget.translation !== state.previousTranslation;

  let { revealProgress, isComplete, time, currentRotationDeg, currentTranslation } =
    state;
  const targetParams = { ...nextTarget };

  if (structureChanged) {
    revealProgress = 0;
    isComplete = false;
  }

  currentRotationDeg = lerpToward(
    currentRotationDeg,
    targetParams.rotationDeg,
    PARAM_LERP,
  );
  currentTranslation = lerpToward(
    currentTranslation,
    targetParams.translation,
    PARAM_LERP,
  );

  time += targetParams.evolutionSpeed;

  const params = {
    rotationDeg: currentRotationDeg,
    translation: currentTranslation,
    evolutionSpeed: targetParams.evolutionSpeed,
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
    currentRotationDeg,
    currentTranslation,
    previousRotationDeg: targetParams.rotationDeg,
    previousTranslation: targetParams.translation,
  };
}
