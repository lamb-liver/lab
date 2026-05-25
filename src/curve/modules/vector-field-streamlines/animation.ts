import type { ParamValues } from '../../types';
import type { WorldPoint } from './geometry';
import { INTEGRATION_STEP_SIZE, buildAllStreamlines } from './geometry';

export type VectorFieldAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  time: number;
  streamlines: WorldPoint[][];
};

export function createVectorFieldAnimState(
  defaultParams: ParamValues,
): VectorFieldAnimState {
  const streamlines = buildAllStreamlines(
    defaultParams.streamlineCount,
    defaultParams.integrationSteps,
    INTEGRATION_STEP_SIZE,
    0,
  );
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    time: 0,
    streamlines,
  };
}

export function stepVectorFieldAnimation(
  state: VectorFieldAnimState,
  nextTarget: ParamValues,
): VectorFieldAnimState {
  const targetParams = { ...nextTarget };
  const time = state.time + targetParams.flowSpeed;
  const streamlines = buildAllStreamlines(
    targetParams.streamlineCount,
    targetParams.integrationSteps,
    INTEGRATION_STEP_SIZE,
    time,
  );

  return {
    params: { ...targetParams },
    targetParams,
    time,
    streamlines,
  };
}
