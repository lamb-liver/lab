import { asCurvePoints } from './curvePoints';
import type { AnimationState, CurveModule, CurvePoint, ParamValues } from './types';

export type MorphAnimStep = (
  state: AnimationState,
  nextTarget: ParamValues,
  revealSpeed: number,
) => AnimationState;

export type MorphDrawFrameResult = {
  state: AnimationState;
  points: ReadonlyArray<CurvePoint>;
};

export function getMorphDisplayPoints(
  module: CurveModule,
  params: ParamValues,
  step: number,
): ReadonlyArray<CurvePoint> {
  return asCurvePoints(module.sample(params, { step }));
}

export function executeMorphDrawFrame(
  module: CurveModule,
  animState: AnimationState,
  targetParams: ParamValues,
  sampleStep: number,
  stepAnimation: MorphAnimStep,
  revealSpeed: number,
): MorphDrawFrameResult {
  const nextState = stepAnimation(animState, targetParams, revealSpeed);
  const points = getMorphDisplayPoints(module, nextState.params, sampleStep);
  return { state: nextState, points };
}
