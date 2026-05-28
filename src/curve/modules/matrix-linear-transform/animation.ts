import { PARAM_LERP } from './constants';
import {
  lerpMatrix,
  matrixIdentity,
  targetMatrixFromParams,
  type MatrixLinearTargetInput,
} from './matrix';
import type { Matrix2, MatrixMode } from './types';

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
  currentMatrix = lerpMatrix(currentMatrix, targetMatrix, PARAM_LERP);

  return { currentMatrix, targetMatrix, lastMode };
}
