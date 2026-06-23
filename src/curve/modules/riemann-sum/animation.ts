import type { ParamValues } from '../../types';

export const REVEAL_SPEED = 0.004;
export const PARAM_LERP = 0.08;

type RiemannSumAnimState = {
  activeDomain: number;
  isComplete: boolean;
  time: number;
  currentPartitionCount: number;
  previousPartitionCount: number;
};

export function createRiemannSumAnimState(
  defaultParams: ParamValues,
): RiemannSumAnimState {
  return {
    activeDomain: 0,
    isComplete: false,
    time: 0,
    currentPartitionCount: defaultParams.partitionCount,
    previousPartitionCount: defaultParams.partitionCount,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  const next = current + (target - current) * factor;
  if (Math.abs(next - target) < 0.05) return target;
  return next;
}

export function stepRiemannSumAnimation(
  state: RiemannSumAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
): RiemannSumAnimState {
  const partitionChanged =
    Math.round(nextTarget.partitionCount) !==
    Math.round(state.previousPartitionCount);

  let { activeDomain, isComplete, time, currentPartitionCount } = state;

  if (partitionChanged) {
    activeDomain = 0;
    isComplete = false;
  }

  currentPartitionCount = lerpToward(
    currentPartitionCount,
    nextTarget.partitionCount,
    PARAM_LERP,
  );

  time += nextTarget.timeSpeed;

  if (!isComplete) {
    activeDomain += revealSpeed;
    if (activeDomain >= 1) {
      activeDomain = 1;
      isComplete = true;
    }
  }

  return {
    activeDomain,
    isComplete,
    time,
    currentPartitionCount,
    previousPartitionCount: nextTarget.partitionCount,
  };
}
