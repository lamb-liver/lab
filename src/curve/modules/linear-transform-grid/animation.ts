import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';

export const REVEAL_SPEED = 0.005;
export const PARAM_LERP = 0.08;

type LinearTransformGridAnimState = {
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentShearX: number;
  currentScaleY: number;
  previousShearX: number;
  previousScaleY: number;
  pendingRevealReset: boolean;
  pendingRevealSince: number;
};

export function createLinearTransformGridAnimState(
  defaultParams: ParamValues,
): LinearTransformGridAnimState {
  return {
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentShearX: defaultParams.shearX,
    currentScaleY: defaultParams.scaleY,
    previousShearX: defaultParams.shearX,
    previousScaleY: defaultParams.scaleY,
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  const next = current + (target - current) * factor;
  if (Math.abs(next - target) < 0.0005) return target;
  return next;
}

export function stepLinearTransformGridAnimation(
  state: LinearTransformGridAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
  nowMs = 0,
): LinearTransformGridAnimState {
  const structureChanged =
    nextTarget.shearX !== state.previousShearX ||
    nextTarget.scaleY !== state.previousScaleY;

  let {
    revealProgress,
    isComplete,
    time,
    currentShearX,
    currentScaleY,
    pendingRevealReset,
    pendingRevealSince,
  } = state;
  const targetParams = nextTarget;

  if (structureChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
  }

  currentShearX = lerpToward(currentShearX, targetParams.shearX, PARAM_LERP);
  currentScaleY = lerpToward(currentScaleY, targetParams.scaleY, PARAM_LERP);

  const scale = frameScale(deltaMs);
  time += targetParams.transformSpeed * scale;

  const settled =
    Math.abs(currentShearX - targetParams.shearX) < 0.0005 &&
    Math.abs(currentScaleY - targetParams.scaleY) < 0.0005;
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
    currentShearX,
    currentScaleY,
    previousShearX: targetParams.shearX,
    previousScaleY: targetParams.scaleY,
    pendingRevealReset,
    pendingRevealSince,
  };
}
