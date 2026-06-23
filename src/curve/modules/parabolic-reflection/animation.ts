import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';

export const REVEAL_SPEED = 0.004;
export const FOCAL_LERP = 0.08;

type ParabolicReflectionAnimState = {
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentFocalLength: number;
  previousRayCount: number;
  previousFocalLength: number;
  pendingRevealReset: boolean;
  pendingRevealSince: number;
};

export function createParabolicReflectionAnimState(
  defaultParams: ParamValues,
): ParabolicReflectionAnimState {
  const rayCount = Math.round(defaultParams.rayCount);
  const focalLength = defaultParams.focalLength;
  return {
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentFocalLength: focalLength,
    previousRayCount: rayCount,
    previousFocalLength: focalLength,
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

export function stepParabolicReflectionAnimation(
  state: ParabolicReflectionAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
  nowMs = 0,
): ParabolicReflectionAnimState {
  const rayCount = Math.round(nextTarget.rayCount);
  const focalLength = nextTarget.focalLength;
  const rayCountChanged = rayCount !== state.previousRayCount;
  const focalLengthChanged = focalLength !== state.previousFocalLength;

  let {
    revealProgress,
    isComplete,
    time,
    currentFocalLength,
    previousRayCount,
    previousFocalLength,
    pendingRevealReset,
    pendingRevealSince,
  } = state;

  if (rayCountChanged) {
    revealProgress = 0;
    isComplete = false;
    previousRayCount = rayCount;
    pendingRevealReset = false;
    pendingRevealSince = 0;
  }
  if (!rayCountChanged && focalLengthChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
    previousFocalLength = focalLength;
  } else if (focalLengthChanged) {
    previousFocalLength = focalLength;
  }

  currentFocalLength += (focalLength - currentFocalLength) * FOCAL_LERP;
  if (Math.abs(currentFocalLength - focalLength) < 0.05) {
    currentFocalLength = focalLength;
  }

  const scale = frameScale(deltaMs);
  time += nextTarget.scanSpeed * scale;

  const settled = Math.abs(currentFocalLength - focalLength) < 0.05;
  if (
    !focalLengthChanged &&
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
    currentFocalLength,
    previousRayCount,
    previousFocalLength,
    pendingRevealReset,
    pendingRevealSince,
  };
}
