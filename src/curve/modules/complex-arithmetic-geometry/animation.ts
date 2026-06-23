import type { ParamValues } from '../../types';

export const PARAM_LERP = 0.08;
const TIME_SPEED = 0.012;
const DRIFT_AMP = 0.08;
const TAU = Math.PI * 2;

type ComplexArithmeticGeometryAnimState = {
  params: ParamValues;
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

function normalizeAngle(value: number): number {
  const wrapped = value % TAU;
  return wrapped < 0 ? wrapped + TAU : wrapped;
}

function lerpAngle(current: number, target: number, factor: number): number {
  const delta = ((((target - current + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
  return normalizeAngle(current + delta * factor);
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
    time,
    smoothR1: lerpToward(state.smoothR1, nextTarget.r1, PARAM_LERP),
    smoothR2: lerpToward(state.smoothR2, nextTarget.r2, PARAM_LERP),
    smoothTheta1: lerpAngle(state.smoothTheta1, nextTarget.theta1, PARAM_LERP),
    smoothTheta2: lerpAngle(state.smoothTheta2, driftTheta2, PARAM_LERP),
  };
}
