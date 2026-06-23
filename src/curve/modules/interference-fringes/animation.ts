import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';

export const REVEAL_SPEED = 0.0024;
export const SOURCE_DISTANCE_LERP = 0.08;

type InterferenceFringesAnimState = {
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
    revealProgress,
    isComplete,
    time,
    currentSourceDistance,
    previousWavelength,
    previousSourceDistance,
    pendingRevealReset,
    pendingRevealSince,
  } = state;

  if (structureChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
    previousWavelength = nextTarget.wavelength;
    previousSourceDistance = nextTarget.sourceDistance;
  }

  currentSourceDistance +=
    (nextTarget.sourceDistance - currentSourceDistance) * SOURCE_DISTANCE_LERP;
  if (Math.abs(currentSourceDistance - nextTarget.sourceDistance) < 0.05) {
    currentSourceDistance = nextTarget.sourceDistance;
  }

  const scale = frameScale(deltaMs);
  time += nextTarget.timeSpeed * scale;

  const settled =
    Math.abs(currentSourceDistance - nextTarget.sourceDistance) < 0.05;
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
