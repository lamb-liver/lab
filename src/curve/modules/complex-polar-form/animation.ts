import type { ParamValues } from '../../types';

export const PARAM_LERP = 0.08;
const TIME_SPEED = 0.015;
const DRIFT_AMP = 0.012;
const DRIFT_SPD = 0.3;

type ComplexPolarFormAnimState = {
  time: number;
  smoothR: number;
  smoothTheta: number;
};

export function createComplexPolarFormAnimState(
  defaultParams: ParamValues,
): ComplexPolarFormAnimState {
  return {
    time: 0,
    smoothR: defaultParams.r,
    smoothTheta: defaultParams.theta,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function stepComplexPolarFormAnimation(
  state: ComplexPolarFormAnimState,
  nextTarget: ParamValues,
): ComplexPolarFormAnimState {
  const time = state.time + TIME_SPEED;
  const driftTheta = nextTarget.theta + Math.sin(time * DRIFT_SPD) * DRIFT_AMP;

  return {
    time,
    smoothR: lerpToward(state.smoothR, nextTarget.r, PARAM_LERP),
    smoothTheta: lerpToward(state.smoothTheta, driftTheta, PARAM_LERP),
  };
}
