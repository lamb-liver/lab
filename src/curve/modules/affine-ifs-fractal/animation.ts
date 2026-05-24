import type { ParamValues } from '../../types';
import type { GrainPoint, IfsMathPoint } from './geometry';
import {
  CANVAS_SCALE,
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
  } = state;
  const targetParams = { ...nextTarget };

  if (structureChanged) {
    revealProgress = 0;
    isComplete = false;
    grains = [];
    currentPoint = { x: 0, y: 0 };
  }

  currentLeafBend = lerpToward(currentLeafBend, targetParams.leafBend, PARAM_LERP);
  currentBranchHeight = lerpToward(
    currentBranchHeight,
    targetParams.branchHeight,
    PARAM_LERP,
  );

  time += targetParams.generationSpeed;

  if (!isComplete) {
    revealProgress += revealSpeed;
    if (revealProgress >= 1) {
      revealProgress = 1;
      isComplete = true;
    }
  }

  const shouldGenerate =
    revealProgress < 1 || grains.length < MAX_GRAINS;

  if (shouldGenerate) {
    const pulseOffset = Math.sin(time) * 0.02;
    for (let k = 0; k < POINTS_PER_FRAME; k++) {
      const r = random01();
      const prevX = currentPoint.x;
      const prevY = currentPoint.y;

      if (r < 0.02) {
        currentPoint = { x: 0, y: 0.16 * prevY };
      } else if (r < 0.86) {
        currentPoint = {
          x: 0.85 * prevX + currentLeafBend * prevY,
          y: -currentLeafBend * prevX + currentBranchHeight * prevY + 1.6,
        };
      } else if (r < 0.93) {
        currentPoint = {
          x: 0.2 * prevX - 0.26 * prevY,
          y: 0.23 * prevX + (0.22 + pulseOffset) * prevY + 1.1,
        };
      } else {
        currentPoint = {
          x: -0.15 * prevX + 0.28 * prevY,
          y: 0.26 * prevX + (0.24 - pulseOffset) * prevY + 0.44,
        };
      }

      grains.push({
        x: currentPoint.x * CANVAS_SCALE,
        y: -currentPoint.y * CANVAS_SCALE,
      });
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
  };
}
