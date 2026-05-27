import type { ParamValues } from '../../types';

export const PARAM_LERP = 0.08;
export const TIME_SPEED = 0.012;
export const DRIFT_AMP = 0.08;

export type ComplexArithmeticGeometryAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  time: number;
  smoothR1: number;
  smoothR2: number;
  smoothTheta1: number;
  smoothTheta2: number;
};

export function createComplexArithmeticGeometryAnimState(
  defaultParams: ParamValues,
): ComplexArithmeticGeometryAnimState {
  return {
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    time: 0,
    smoothR1: defaultParams.r1,
    smoothR2: defaultParams.r2,
    smoothTheta1: defaultParams.theta1,
    smoothTheta2: defaultParams.theta2,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function stepComplexArithmeticGeometryAnimation(
  state: ComplexArithmeticGeometryAnimState,
  nextTarget: ParamValues,
): ComplexArithmeticGeometryAnimState {
  const time = state.time + TIME_SPEED;
  const driftTheta2 =
    nextTarget.theta2 + Math.sin(time * 0.5) * DRIFT_AMP;

  return {
    params: { ...nextTarget },
    targetParams: { ...nextTarget },
    time,
    smoothR1: lerpToward(state.smoothR1, nextTarget.r1, PARAM_LERP),
    smoothR2: lerpToward(state.smoothR2, nextTarget.r2, PARAM_LERP),
    smoothTheta1: lerpToward(state.smoothTheta1, nextTarget.theta1, PARAM_LERP),
    smoothTheta2: lerpToward(state.smoothTheta2, driftTheta2, PARAM_LERP),
  };
}
