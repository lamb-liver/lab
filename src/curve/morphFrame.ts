import type { MorphPathCache } from './morphPathCache';
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

/** cacheStrategy `none` 時每幀 resample；其餘走 morph 快取 */
export function getMorphDisplayPoints(
  module: CurveModule,
  params: ParamValues,
  step: number,
  cache: MorphPathCache,
): ReadonlyArray<CurvePoint> {
  if (module.cacheStrategy?.kind === 'none') {
    return module.sample(params, { step });
  }
  return cache.getPoints(params, step);
}

export function executeMorphDrawFrame(
  module: CurveModule,
  cache: MorphPathCache,
  animState: AnimationState,
  targetParams: ParamValues,
  sampleStep: number,
  stepAnimation: MorphAnimStep,
  revealSpeed: number,
): MorphDrawFrameResult {
  const nextState = stepAnimation(animState, targetParams, revealSpeed);
  const points = getMorphDisplayPoints(module, nextState.params, sampleStep, cache);
  return { state: nextState, points };
}
