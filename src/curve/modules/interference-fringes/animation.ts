import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';

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
  pendingRevealReset: boolean;
  pendingRevealSince: number;
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
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

export function stepInterferenceFringesAnimation(
  state: InterferenceFringesAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
  nowMs = 0,
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
    pendingRevealReset,
    pendingRevealSince,
  } = state;

  const targetParams = { ...nextTarget };

  if (structureChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
    previousWavelength = targetParams.wavelength;
    previousSourceDistance = targetParams.sourceDistance;
  }

  currentSourceDistance +=
    (targetParams.sourceDistance - currentSourceDistance) * SOURCE_DISTANCE_LERP;
  if (Math.abs(currentSourceDistance - targetParams.sourceDistance) < 0.05) {
    currentSourceDistance = targetParams.sourceDistance;
  }

  const scale = frameScale(deltaMs);
  time += targetParams.timeSpeed * scale;

  params = {
    sourceDistance: currentSourceDistance,
    wavelength: targetParams.wavelength,
    timeSpeed: targetParams.timeSpeed,
  };

  const settled =
    Math.abs(currentSourceDistance - targetParams.sourceDistance) < 0.05;
  if (
    !structureChanged &&
    shouldCommitPendingReset(pendingRevealReset, settled, nowMs, pendingRevealSince)
  ) {
    revealProgress = 0;
    isComplete = false;
    pendingRevealReset = false;
    pendingRevealSince = 0;
  }

  if (!isComplete) {
    revealProgress += revealSpeed * scale;
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
    pendingRevealReset,
    pendingRevealSince,
  };
}
