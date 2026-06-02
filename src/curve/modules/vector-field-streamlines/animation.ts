import type { ParamValues } from '../../types';
import type { WorldPoint } from './geometry';
import { INTEGRATION_STEP_SIZE, buildAllStreamlines } from './geometry';

const STREAMLINE_REBUILD_FRAME_INTERVAL = 3;

export type VectorFieldAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  time: number;
  streamlines: WorldPoint[][];
  streamlineSignature: string;
  framesSinceBuild: number;
};

function getStreamlineSignature(params: ParamValues): string {
  const roundedStreamlineCount = Math.round(params.streamlineCount);
  const roundedIntegrationSteps = Math.round(params.integrationSteps);
  return `${roundedStreamlineCount}|${roundedIntegrationSteps}`;
}

export function createVectorFieldAnimState(
  defaultParams: ParamValues,
): VectorFieldAnimState {
  const streamlineSignature = getStreamlineSignature(defaultParams);
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
    streamlineSignature,
    framesSinceBuild: 0,
  };
}

export function stepVectorFieldAnimation(
  state: VectorFieldAnimState,
  nextTarget: ParamValues,
): VectorFieldAnimState {
  const targetParams = { ...nextTarget };
  const time = state.time + targetParams.flowSpeed;
  const streamlineSignature = getStreamlineSignature(targetParams);
  const shouldRebuild =
    state.streamlines.length === 0 ||
    streamlineSignature !== state.streamlineSignature ||
    state.framesSinceBuild >= STREAMLINE_REBUILD_FRAME_INTERVAL;

  const streamlines = shouldRebuild
    ? buildAllStreamlines(
        targetParams.streamlineCount,
        targetParams.integrationSteps,
        INTEGRATION_STEP_SIZE,
        time,
      )
    : state.streamlines;

  return {
    params: { ...targetParams },
    targetParams,
    time,
    streamlines,
    streamlineSignature,
    framesSinceBuild: shouldRebuild ? 0 : state.framesSinceBuild + 1,
  };
}
