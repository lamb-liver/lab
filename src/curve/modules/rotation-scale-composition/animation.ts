import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';

export const REVEAL_SPEED = 0.004;
export const PARAM_LERP = 0.08;

export type RotationScaleCompositionAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentRotationStepDeg: number;
  currentScaleFactor: number;
  previousRotationStepDeg: number;
  previousScaleFactor: number;
  pendingRevealReset: boolean;
  pendingRevealSince: number;
};

export function createRotationScaleCompositionAnimState(
  defaultParams: ParamValues,
): RotationScaleCompositionAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentRotationStepDeg: defaultParams.rotationStepDeg,
    currentScaleFactor: defaultParams.scaleFactor,
    previousRotationStepDeg: defaultParams.rotationStepDeg,
    previousScaleFactor: defaultParams.scaleFactor,
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  const next = current + (target - current) * factor;
  if (Math.abs(next - target) < 0.0005) return target;
  return next;
}

export function stepRotationScaleCompositionAnimation(
  state: RotationScaleCompositionAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
  nowMs = 0,
): RotationScaleCompositionAnimState {
  const structureChanged =
    nextTarget.rotationStepDeg !== state.previousRotationStepDeg ||
    nextTarget.scaleFactor !== state.previousScaleFactor;

  let {
    revealProgress,
    isComplete,
    time,
    currentRotationStepDeg,
    currentScaleFactor,
    pendingRevealReset,
    pendingRevealSince,
  } = state;
  const targetParams = { ...nextTarget };

  if (structureChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
  }

  currentRotationStepDeg = lerpToward(
    currentRotationStepDeg,
    targetParams.rotationStepDeg,
    PARAM_LERP,
  );
  currentScaleFactor = lerpToward(
    currentScaleFactor,
    targetParams.scaleFactor,
    PARAM_LERP,
  );

  const scale = frameScale(deltaMs);
  time += targetParams.evolutionSpeed * scale;

  const params = {
    rotationStepDeg: currentRotationStepDeg,
    scaleFactor: currentScaleFactor,
    evolutionSpeed: targetParams.evolutionSpeed,
  };

  const settled =
    Math.abs(currentRotationStepDeg - targetParams.rotationStepDeg) < 0.0005 &&
    Math.abs(currentScaleFactor - targetParams.scaleFactor) < 0.0005;
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
    currentRotationStepDeg,
    currentScaleFactor,
    previousRotationStepDeg: targetParams.rotationStepDeg,
    previousScaleFactor: targetParams.scaleFactor,
    pendingRevealReset,
    pendingRevealSince,
  };
}
