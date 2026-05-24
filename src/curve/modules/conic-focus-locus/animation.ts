import type { ParamValues } from '../../types';

export const REVEAL_SPEED = 0.004;
export const PARAM_LERP = 0.08;

export type ConicFocusLocusAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentSemiMajorAxis: number;
  currentEccentricity: number;
  previousSemiMajorAxis: number;
  previousEccentricity: number;
};

export function createConicFocusLocusAnimState(
  defaultParams: ParamValues,
): ConicFocusLocusAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentSemiMajorAxis: defaultParams.semiMajorAxis,
    currentEccentricity: defaultParams.eccentricity,
    previousSemiMajorAxis: defaultParams.semiMajorAxis,
    previousEccentricity: defaultParams.eccentricity,
  };
}

export function stepConicFocusLocusAnimation(
  state: ConicFocusLocusAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
): ConicFocusLocusAnimState {
  const structureChanged =
    nextTarget.semiMajorAxis !== state.previousSemiMajorAxis ||
    nextTarget.eccentricity !== state.previousEccentricity;

  let {
    params,
    revealProgress,
    isComplete,
    time,
    currentSemiMajorAxis,
    currentEccentricity,
    previousSemiMajorAxis,
    previousEccentricity,
  } = state;

  const targetParams = { ...nextTarget };

  if (structureChanged) {
    revealProgress = 0;
    isComplete = false;
    previousSemiMajorAxis = targetParams.semiMajorAxis;
    previousEccentricity = targetParams.eccentricity;
  }

  currentSemiMajorAxis +=
    (targetParams.semiMajorAxis - currentSemiMajorAxis) * PARAM_LERP;
  currentEccentricity +=
    (targetParams.eccentricity - currentEccentricity) * PARAM_LERP;

  if (Math.abs(currentSemiMajorAxis - targetParams.semiMajorAxis) < 0.05) {
    currentSemiMajorAxis = targetParams.semiMajorAxis;
  }
  if (Math.abs(currentEccentricity - targetParams.eccentricity) < 0.001) {
    currentEccentricity = targetParams.eccentricity;
  }

  time += targetParams.orbitSpeed;

  params = {
    semiMajorAxis: currentSemiMajorAxis,
    eccentricity: currentEccentricity,
    orbitSpeed: targetParams.orbitSpeed,
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
    currentSemiMajorAxis,
    currentEccentricity,
    previousSemiMajorAxis,
    previousEccentricity,
  };
}
