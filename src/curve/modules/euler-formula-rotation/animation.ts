import type { ParamValues } from '../../types';

export const PARAM_LERP = 0.08;
export const TIME_SPEED = 0.02;

export type EulerFormulaRotationAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  time: number;
  smoothPhase: number;
};

export function createEulerFormulaRotationAnimState(
  defaultParams: ParamValues,
): EulerFormulaRotationAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    time: 0,
    smoothPhase: defaultParams.phase,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function stepEulerFormulaRotationAnimation(
  state: EulerFormulaRotationAnimState,
  nextTarget: ParamValues,
): EulerFormulaRotationAnimState {
  return {
    params: { ...nextTarget },
    targetParams: { ...nextTarget },
    time: state.time + TIME_SPEED,
    smoothPhase: lerpToward(state.smoothPhase, nextTarget.phase, PARAM_LERP),
  };
}
