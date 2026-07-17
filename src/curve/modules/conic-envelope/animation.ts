import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';

export const REVEAL_SPEED = 0.0025;
export const RATIO_LERP = 0.08;

type ConicEnvelopeAnimState = {
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentRatio: number;
  previousDensity: number;
  previousRatio: number;
  pendingRevealReset: boolean;
  pendingRevealSince: number;
};

export function createConicEnvelopeAnimState(
  defaultParams: ParamValues,
): ConicEnvelopeAnimState {
  const lineDensity = Math.round(defaultParams.lineDensity);
  return {
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentRatio: defaultParams.deformationRatio,
    previousDensity: lineDensity,
    previousRatio: defaultParams.deformationRatio,
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

export function stepConicEnvelopeAnimation(
  state: ConicEnvelopeAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
  nowMs = 0,
): ConicEnvelopeAnimState {
  const lineDensity = Math.round(nextTarget.lineDensity);
  const densityChanged = lineDensity !== state.previousDensity;
  const ratioChanged = nextTarget.deformationRatio !== state.previousRatio;

  let {
    revealProgress,
    isComplete,
    time,
    currentRatio,
    previousDensity,
    previousRatio,
    pendingRevealReset,
    pendingRevealSince,
  } = state;

  const targetParams: ParamValues = { ...nextTarget, lineDensity };

  if (densityChanged) {
    revealProgress = 0;
    isComplete = false;
    previousDensity = lineDensity;
    pendingRevealReset = false;
    pendingRevealSince = 0;
  }
  if (!densityChanged && ratioChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
    previousRatio = targetParams.deformationRatio;
  } else if (ratioChanged) {
    previousRatio = targetParams.deformationRatio;
  }

  currentRatio += (targetParams.deformationRatio - currentRatio) * RATIO_LERP;
  if (Math.abs(currentRatio - targetParams.deformationRatio) < 0.001) {
    currentRatio = targetParams.deformationRatio;
  }

  const scale = frameScale(deltaMs);
  time += targetParams.timeSpeed * scale;

  const settled = Math.abs(currentRatio - targetParams.deformationRatio) < 0.001;
  if (
    !ratioChanged &&
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
    currentRatio,
    previousDensity,
    previousRatio,
    pendingRevealReset,
    pendingRevealSince,
  };
}
