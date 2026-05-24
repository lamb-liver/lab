import type { ParamValues } from '../../types';
import type { CanvasPoint } from './geometry';
import {
  COLLAPSE_START_DX,
  buildFunctionCurvePoints,
} from './geometry';

export const COLLAPSE_SPEED = 0.005;
export const PARAM_LERP = 0.08;

export type TangentApproximationAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  collapseProgress: number;
  isComplete: boolean;
  time: number;
  snapshotTime: number;
  smoothDx: number;
  previousDx: number;
  previousWaveFrequency: number;
  ghostCurve: CanvasPoint[];
};

export function createTangentApproximationAnimState(
  defaultParams: ParamValues,
  canvasWidth: number,
): TangentApproximationAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    collapseProgress: 0,
    isComplete: false,
    time: 0,
    snapshotTime: 0,
    smoothDx: defaultParams.dx,
    previousDx: defaultParams.dx,
    previousWaveFrequency: defaultParams.waveFrequency,
    ghostCurve: buildFunctionCurvePoints(
      canvasWidth,
      defaultParams.waveFrequency,
      0,
    ),
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  const next = current + (target - current) * factor;
  if (Math.abs(next - target) < 0.0005) return target;
  return next;
}

export function stepTangentApproximationAnimation(
  state: TangentApproximationAnimState,
  nextTarget: ParamValues,
  canvasWidth: number,
  collapseSpeed: number,
): TangentApproximationAnimState {
  const dxChanged = nextTarget.dx !== state.previousDx;
  const frequencyChanged =
    nextTarget.waveFrequency !== state.previousWaveFrequency;

  let {
    collapseProgress,
    isComplete,
    time,
    snapshotTime,
    smoothDx,
    ghostCurve,
  } = state;
  const targetParams = { ...nextTarget };

  if (dxChanged) {
    collapseProgress = 0;
    isComplete = false;
  }

  if (frequencyChanged) {
    snapshotTime = time;
    ghostCurve = buildFunctionCurvePoints(
      canvasWidth,
      targetParams.waveFrequency,
      snapshotTime,
    );
  }

  time += targetParams.timeSpeed;

  if (!isComplete) {
    collapseProgress += collapseSpeed;
    if (collapseProgress >= 1) {
      collapseProgress = 1;
      isComplete = true;
    }
  }

  const targetDx = lerpToward(
    COLLAPSE_START_DX,
    targetParams.dx,
    collapseProgress,
  );
  smoothDx = lerpToward(smoothDx, targetDx, PARAM_LERP);

  const params = {
    dx: smoothDx,
    waveFrequency: targetParams.waveFrequency,
    timeSpeed: targetParams.timeSpeed,
  };

  return {
    params,
    targetParams,
    collapseProgress,
    isComplete,
    time,
    snapshotTime,
    smoothDx,
    previousDx: targetParams.dx,
    previousWaveFrequency: targetParams.waveFrequency,
    ghostCurve,
  };
}
