import { PARAM_LERP } from './constants';
import {
  lerpMatrix,
  matrixIdentity,
  targetMatrixFromParams,
  type MatrixLinearTargetInput,
} from './matrix';
import type { Matrix2, MatrixMode } from './types';

const FRAME_MS_60FPS = 1000 / 60;

export type MatrixLinearParams = MatrixLinearTargetInput & {
  composeAngleDeg: number;
  composeShear: number;
};

export type MatrixLinearAnimState = {
  currentMatrix: Matrix2;
  targetMatrix: Matrix2;
  lastMode: MatrixMode;
};

export function createMatrixLinearAnimState(): MatrixLinearAnimState {
  const id = matrixIdentity();
  return {
    currentMatrix: id,
    targetMatrix: id,
    lastMode: 'free',
  };
}

export function stepMatrixLinearAnimation(
  state: MatrixLinearAnimState,
  params: MatrixLinearParams,
  deltaMs = FRAME_MS_60FPS,
): MatrixLinearAnimState {
  let { currentMatrix, targetMatrix, lastMode } = state;

  if (params.mode !== lastMode) {
    currentMatrix = matrixIdentity();
    targetMatrix = matrixIdentity();
    lastMode = params.mode;
  }

  if (params.mode === 'compose') {
    return { currentMatrix, targetMatrix, lastMode };
  }

  targetMatrix = targetMatrixFromParams(params);
  const safeDeltaMs = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : FRAME_MS_60FPS;
  const frameScale = safeDeltaMs / FRAME_MS_60FPS;
  const alpha = 1 - Math.pow(1 - PARAM_LERP, frameScale);
  currentMatrix = lerpMatrix(currentMatrix, targetMatrix, alpha);

  return { currentMatrix, targetMatrix, lastMode };
}
