import type { ParamValues } from '../../types';
import type { WorldPoint } from './geometry';
import {
  PARAM_LERP,
  buildParametricCurve,
  evaluateTractrix,
  mirrorY,
} from './geometry';

export type CatenaryAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  time: number;
  smoothRopeLength: number;
  smoothMaxT: number;
  ghostUpper: WorldPoint[];
  ghostLower: WorldPoint[];
};

export function createCatenaryAnimState(
  defaultParams: ParamValues,
): CatenaryAnimState {
  const ghostUpper = buildGhostUpper(defaultParams.ropeLength, defaultParams.maxT);
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    time: 0,
    smoothRopeLength: defaultParams.ropeLength,
    smoothMaxT: defaultParams.maxT,
    ghostUpper,
    ghostLower: mirrorY(ghostUpper),
  };
}

function buildGhostUpper(ropeLength: number, maxT: number): WorldPoint[] {
  return buildParametricCurve(
    (t) => evaluateTractrix(t, ropeLength),
    0,
    maxT,
  );
}

function lerpToward(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function stepCatenaryAnimation(
  state: CatenaryAnimState,
  nextTarget: ParamValues,
): CatenaryAnimState {
  const targetParams = { ...nextTarget };

  let smoothRopeLength = lerpToward(
    state.smoothRopeLength,
    targetParams.ropeLength,
    PARAM_LERP,
  );
  let smoothMaxT = lerpToward(state.smoothMaxT, targetParams.maxT, PARAM_LERP);

  if (Math.abs(smoothRopeLength - targetParams.ropeLength) < 0.0001) {
    smoothRopeLength = targetParams.ropeLength;
  }
  if (Math.abs(smoothMaxT - targetParams.maxT) < 0.0001) {
    smoothMaxT = targetParams.maxT;
  }

  const geometryDirty =
    smoothRopeLength !== state.smoothRopeLength ||
    smoothMaxT !== state.smoothMaxT;

  let { ghostUpper, ghostLower } = state;
  if (geometryDirty) {
    ghostUpper = buildGhostUpper(smoothRopeLength, smoothMaxT);
    ghostLower = mirrorY(ghostUpper);
  }

  const time = state.time + targetParams.timeSpeed;

  const params = {
    ropeLength: smoothRopeLength,
    maxT: smoothMaxT,
    timeSpeed: targetParams.timeSpeed,
  };

  return {
    params,
    targetParams,
    time,
    smoothRopeLength,
    smoothMaxT,
    ghostUpper,
    ghostLower,
  };
}
