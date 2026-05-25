import type { ParamValues } from '../../types';
import type { WorldPoint } from './geometry';
import {
  INITIAL_RADIUS_A,
  PARAM_LERP,
  buildParametricCurve,
  computeRevealTheta,
  evaluateEquiangularSpiral,
} from './geometry';

export type EquiangularSpiralAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  time: number;
  smoothGrowthB: number;
  smoothMaxTheta: number;
  revealTheta: number;
  ghostPath: WorldPoint[];
  activePath: WorldPoint[];
  headPoint: WorldPoint;
};

function lerpToward(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

function buildSpiralPath(a: number, b: number, thetaEnd: number): WorldPoint[] {
  return buildParametricCurve(
    (theta) => evaluateEquiangularSpiral(theta, a, b),
    0,
    thetaEnd,
  );
}

export function createEquiangularSpiralAnimState(
  defaultParams: ParamValues,
): EquiangularSpiralAnimState {
  const revealTheta = computeRevealTheta(defaultParams.maxTheta, 0);
  const ghostPath = buildSpiralPath(
    INITIAL_RADIUS_A,
    defaultParams.growthB,
    defaultParams.maxTheta,
  );
  const activePath = buildSpiralPath(
    INITIAL_RADIUS_A,
    defaultParams.growthB,
    revealTheta,
  );
  const headPoint = evaluateEquiangularSpiral(
    revealTheta,
    INITIAL_RADIUS_A,
    defaultParams.growthB,
  );

  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    time: 0,
    smoothGrowthB: defaultParams.growthB,
    smoothMaxTheta: defaultParams.maxTheta,
    revealTheta,
    ghostPath,
    activePath,
    headPoint,
  };
}

export function stepEquiangularSpiralAnimation(
  state: EquiangularSpiralAnimState,
  nextTarget: ParamValues,
): EquiangularSpiralAnimState {
  const targetParams = { ...nextTarget };

  let smoothGrowthB = lerpToward(
    state.smoothGrowthB,
    targetParams.growthB,
    PARAM_LERP,
  );
  let smoothMaxTheta = lerpToward(
    state.smoothMaxTheta,
    targetParams.maxTheta,
    PARAM_LERP,
  );

  if (Math.abs(smoothGrowthB - targetParams.growthB) < 0.0001) {
    smoothGrowthB = targetParams.growthB;
  }
  if (Math.abs(smoothMaxTheta - targetParams.maxTheta) < 0.0001) {
    smoothMaxTheta = targetParams.maxTheta;
  }

  const geometryDirty =
    smoothGrowthB !== state.smoothGrowthB ||
    smoothMaxTheta !== state.smoothMaxTheta;

  const time = state.time + targetParams.rotationSpeed;
  const revealTheta = computeRevealTheta(smoothMaxTheta, time);

  let { ghostPath, activePath } = state;
  let headPoint = state.headPoint;

  if (geometryDirty || revealTheta !== state.revealTheta) {
    ghostPath = buildSpiralPath(
      INITIAL_RADIUS_A,
      smoothGrowthB,
      smoothMaxTheta,
    );
    activePath = buildSpiralPath(
      INITIAL_RADIUS_A,
      smoothGrowthB,
      revealTheta,
    );
    headPoint = evaluateEquiangularSpiral(
      revealTheta,
      INITIAL_RADIUS_A,
      smoothGrowthB,
    );
  }

  return {
    params: {
      growthB: smoothGrowthB,
      maxTheta: smoothMaxTheta,
      rotationSpeed: targetParams.rotationSpeed,
    },
    targetParams,
    time,
    smoothGrowthB,
    smoothMaxTheta,
    revealTheta,
    ghostPath,
    activePath,
    headPoint,
  };
}
