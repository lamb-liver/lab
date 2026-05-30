import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';

export const REVEAL_SPEED = 0.004;
export const PARAM_LERP = 0.08;

export type AffineTransformPatternAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentRotationDeg: number;
  currentTranslation: number;
  previousRotationDeg: number;
  previousTranslation: number;
  pendingRevealReset: boolean;
  pendingRevealSince: number;
};

export function createAffineTransformPatternAnimState(
  defaultParams: ParamValues,
): AffineTransformPatternAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentRotationDeg: defaultParams.rotationDeg,
    currentTranslation: defaultParams.translation,
    previousRotationDeg: defaultParams.rotationDeg,
    previousTranslation: defaultParams.translation,
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  const next = current + (target - current) * factor;
  if (Math.abs(next - target) < 0.05) return target;
  return next;
}

export function stepAffineTransformPatternAnimation(
  state: AffineTransformPatternAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
  nowMs = 0,
): AffineTransformPatternAnimState {
  const structureChanged =
    nextTarget.rotationDeg !== state.previousRotationDeg ||
    nextTarget.translation !== state.previousTranslation;

  let {
    revealProgress,
    isComplete,
    time,
    currentRotationDeg,
    currentTranslation,
    pendingRevealReset,
    pendingRevealSince,
  } = state;
  const targetParams = { ...nextTarget };

  if (structureChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
  }

  currentRotationDeg = lerpToward(
    currentRotationDeg,
    targetParams.rotationDeg,
    PARAM_LERP,
  );
  currentTranslation = lerpToward(
    currentTranslation,
    targetParams.translation,
    PARAM_LERP,
  );

  const scale = frameScale(deltaMs);
  time += targetParams.evolutionSpeed * scale;

  const params = {
    rotationDeg: currentRotationDeg,
    translation: currentTranslation,
    evolutionSpeed: targetParams.evolutionSpeed,
  };

  const settled =
    Math.abs(currentRotationDeg - targetParams.rotationDeg) < 0.05 &&
    Math.abs(currentTranslation - targetParams.translation) < 0.05;
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
    currentRotationDeg,
    currentTranslation,
    previousRotationDeg: targetParams.rotationDeg,
    previousTranslation: targetParams.translation,
    pendingRevealReset,
    pendingRevealSince,
  };
}
