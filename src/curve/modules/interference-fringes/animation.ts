import type { ParamValues } from '../../types';

export const REVEAL_SPEED = 0.0024;
export const SOURCE_DISTANCE_LERP = 0.08;

export type InterferenceFringesAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentSourceDistance: number;
  previousWavelength: number;
  previousSourceDistance: number;
};

export function createInterferenceFringesAnimState(
  defaultParams: ParamValues,
): InterferenceFringesAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentSourceDistance: defaultParams.sourceDistance,
    previousWavelength: defaultParams.wavelength,
    previousSourceDistance: defaultParams.sourceDistance,
  };
}

export function stepInterferenceFringesAnimation(
  state: InterferenceFringesAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
): InterferenceFringesAnimState {
  const structureChanged =
    nextTarget.wavelength !== state.previousWavelength ||
    nextTarget.sourceDistance !== state.previousSourceDistance;

  let {
    params,
    revealProgress,
    isComplete,
    time,
    currentSourceDistance,
    previousWavelength,
    previousSourceDistance,
  } = state;

  const targetParams = { ...nextTarget };

  if (structureChanged) {
    revealProgress = 0;
    isComplete = false;
    previousWavelength = targetParams.wavelength;
    previousSourceDistance = targetParams.sourceDistance;
  }

  currentSourceDistance +=
    (targetParams.sourceDistance - currentSourceDistance) * SOURCE_DISTANCE_LERP;
  if (Math.abs(currentSourceDistance - targetParams.sourceDistance) < 0.05) {
    currentSourceDistance = targetParams.sourceDistance;
  }

  time += targetParams.timeSpeed;

  params = {
    sourceDistance: currentSourceDistance,
    wavelength: targetParams.wavelength,
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
    currentSourceDistance,
    previousWavelength,
    previousSourceDistance,
  };
}
