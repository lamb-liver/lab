import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';

export const REVEAL_SPEED = 0.004;
export const PARAM_LERP = 0.08;

type ConicFocusLocusAnimState = {
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentSemiMajorAxis: number;
  currentEccentricity: number;
  previousSemiMajorAxis: number;
  previousEccentricity: number;
  pendingRevealReset: boolean;
  pendingRevealSince: number;
};

export function createConicFocusLocusAnimState(
  defaultParams: ParamValues,
): ConicFocusLocusAnimState {
  return {
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentSemiMajorAxis: defaultParams.semiMajorAxis,
    currentEccentricity: defaultParams.eccentricity,
    previousSemiMajorAxis: defaultParams.semiMajorAxis,
    previousEccentricity: defaultParams.eccentricity,
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

export function stepConicFocusLocusAnimation(
  state: ConicFocusLocusAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
  nowMs = 0,
): ConicFocusLocusAnimState {
  const structureChanged =
    nextTarget.semiMajorAxis !== state.previousSemiMajorAxis ||
    nextTarget.eccentricity !== state.previousEccentricity;

  let {
    revealProgress,
    isComplete,
    time,
    currentSemiMajorAxis,
    currentEccentricity,
    previousSemiMajorAxis,
    previousEccentricity,
    pendingRevealReset,
    pendingRevealSince,
  } = state;

  const targetParams = { ...nextTarget };

  if (structureChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
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

  const scale = frameScale(deltaMs);
  time += targetParams.orbitSpeed * scale;

  const settled =
    Math.abs(currentSemiMajorAxis - targetParams.semiMajorAxis) < 0.05 &&
    Math.abs(currentEccentricity - targetParams.eccentricity) < 0.001;
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
    currentSemiMajorAxis,
    currentEccentricity,
    previousSemiMajorAxis,
    previousEccentricity,
    pendingRevealReset,
    pendingRevealSince,
  };
}
