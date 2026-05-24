import type { ParamValues } from '../../types';

export const REVEAL_SPEED = 0.004;
export const FOCAL_LERP = 0.08;

export type ParabolicReflectionAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentFocalLength: number;
  previousRayCount: number;
  previousFocalLength: number;
};

export function createParabolicReflectionAnimState(
  defaultParams: ParamValues,
): ParabolicReflectionAnimState {
  const rayCount = Math.round(defaultParams.rayCount);
  const focalLength = defaultParams.focalLength;
  return {
    params: { ...defaultParams, rayCount },
    targetParams: { ...defaultParams, rayCount },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentFocalLength: focalLength,
    previousRayCount: rayCount,
    previousFocalLength: focalLength,
  };
}

export function stepParabolicReflectionAnimation(
  state: ParabolicReflectionAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
): ParabolicReflectionAnimState {
  const rayCount = Math.round(nextTarget.rayCount);
  const focalLength = nextTarget.focalLength;
  const structureChanged =
    rayCount !== state.previousRayCount ||
    focalLength !== state.previousFocalLength;

  let {
    params,
    revealProgress,
    isComplete,
    time,
    currentFocalLength,
    previousRayCount,
    previousFocalLength,
  } = state;

  const targetParams = { ...nextTarget, rayCount };

  if (structureChanged) {
    revealProgress = 0;
    isComplete = false;
    previousRayCount = rayCount;
    previousFocalLength = focalLength;
  }

  currentFocalLength += (focalLength - currentFocalLength) * FOCAL_LERP;
  if (Math.abs(currentFocalLength - focalLength) < 0.05) {
    currentFocalLength = focalLength;
  }

  time += targetParams.scanSpeed;

  params = {
    focalLength: currentFocalLength,
    rayCount,
    scanSpeed: targetParams.scanSpeed,
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
    currentFocalLength,
    previousRayCount,
    previousFocalLength,
  };
}
