import type { ParamValues } from '../../types';
import { frameScale, shouldCommitPendingReset } from '../animationTiming';
import { mathToCanvas, stepIfsPoint, type GrainPoint, type IfsMathPoint } from './geometry';
import {
  MAX_GRAINS,
  PARAM_LERP,
  POINTS_PER_FRAME,
  REVEAL_SPEED,
} from './geometry';

export type AffineIfsFractalAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentLeafBend: number;
  currentBranchHeight: number;
  previousLeafBend: number;
  previousBranchHeight: number;
  currentPoint: IfsMathPoint;
  grains: GrainPoint[];
  pendingRevealReset: boolean;
  pendingRevealSince: number;
};

export function createAffineIfsFractalAnimState(
  defaultParams: ParamValues,
): AffineIfsFractalAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentLeafBend: defaultParams.leafBend,
    currentBranchHeight: defaultParams.branchHeight,
    previousLeafBend: defaultParams.leafBend,
    previousBranchHeight: defaultParams.branchHeight,
    currentPoint: { x: 0, y: 0 },
    grains: [],
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  const next = current + (target - current) * factor;
  if (Math.abs(next - target) < 0.0005) return target;
  return next;
}

export type RandomFn = () => number;

export function stepAffineIfsFractalAnimation(
  state: AffineIfsFractalAnimState,
  nextTarget: ParamValues,
  random01: RandomFn,
  revealSpeed = REVEAL_SPEED,
  deltaMs?: number,
  nowMs = 0,
): AffineIfsFractalAnimState {
  const structureChanged =
    nextTarget.leafBend !== state.previousLeafBend ||
    nextTarget.branchHeight !== state.previousBranchHeight;

  let {
    revealProgress,
    isComplete,
    time,
    currentLeafBend,
    currentBranchHeight,
    currentPoint,
    grains,
    pendingRevealReset,
    pendingRevealSince,
  } = state;
  const targetParams = { ...nextTarget };

  if (structureChanged) {
    pendingRevealReset = true;
    pendingRevealSince = nowMs;
  }

  currentLeafBend = lerpToward(currentLeafBend, targetParams.leafBend, PARAM_LERP);
  currentBranchHeight = lerpToward(
    currentBranchHeight,
    targetParams.branchHeight,
    PARAM_LERP,
  );

  const scale = frameScale(deltaMs);
  time += targetParams.generationSpeed * scale;

  const settled =
    Math.abs(currentLeafBend - targetParams.leafBend) < 0.0005 &&
    Math.abs(currentBranchHeight - targetParams.branchHeight) < 0.0005;
  if (
    !structureChanged &&
    shouldCommitPendingReset(pendingRevealReset, settled, nowMs, pendingRevealSince)
  ) {
    revealProgress = 0;
    isComplete = false;
    grains = [];
    currentPoint = { x: 0, y: 0 };
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

  const shouldGenerate = grains.length < MAX_GRAINS;

  if (shouldGenerate) {
    const pulseOffset = Math.sin(time) * 0.02;
    const pointsThisFrame = Math.min(
      MAX_GRAINS - grains.length,
      Math.ceil(POINTS_PER_FRAME * scale),
    );
    for (let k = 0; k < pointsThisFrame; k++) {
      currentPoint = stepIfsPoint(
        currentPoint,
        currentLeafBend,
        currentBranchHeight,
        pulseOffset,
        random01,
      );
      grains.push(mathToCanvas(currentPoint.x, currentPoint.y));
    }
  }

  const params = {
    leafBend: currentLeafBend,
    branchHeight: currentBranchHeight,
    generationSpeed: targetParams.generationSpeed,
  };

  return {
    params,
    targetParams,
    revealProgress,
    isComplete,
    time,
    currentLeafBend,
    currentBranchHeight,
    previousLeafBend: targetParams.leafBend,
    previousBranchHeight: targetParams.branchHeight,
    currentPoint,
    grains,
    pendingRevealReset,
    pendingRevealSince,
  };
}
