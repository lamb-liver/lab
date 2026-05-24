import type { ParamValues } from '../../types';

export const REVEAL_SPEED = 0.0025;
export const RATIO_LERP = 0.08;

export type ConicEnvelopeAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentRatio: number;
  previousDensity: number;
};

export function createConicEnvelopeAnimState(
  defaultParams: ParamValues,
): ConicEnvelopeAnimState {
  const lineDensity = Math.round(defaultParams.lineDensity);
  return {
    params: { ...defaultParams, lineDensity },
    targetParams: { ...defaultParams, lineDensity },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentRatio: defaultParams.deformationRatio,
    previousDensity: lineDensity,
  };
}

export function stepConicEnvelopeAnimation(
  state: ConicEnvelopeAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
): ConicEnvelopeAnimState {
  const lineDensity = Math.round(nextTarget.lineDensity);
  const densityChanged = lineDensity !== state.previousDensity;

  let {
    params,
    revealProgress,
    isComplete,
    time,
    currentRatio,
    previousDensity,
  } = state;

  const targetParams = { ...nextTarget, lineDensity };

  if (densityChanged) {
    revealProgress = 0;
    isComplete = false;
    previousDensity = lineDensity;
  }

  currentRatio += (targetParams.deformationRatio - currentRatio) * RATIO_LERP;
  if (Math.abs(currentRatio - targetParams.deformationRatio) < 0.001) {
    currentRatio = targetParams.deformationRatio;
  }

  time += targetParams.timeSpeed;

  params = {
    lineDensity,
    deformationRatio: currentRatio,
    timeSpeed: targetParams.timeSpeed,
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
    currentRatio,
    previousDensity,
  };
}
