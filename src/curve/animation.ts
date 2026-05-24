import type { AnimationState, ParamValues } from './types';

export function createInitialState(targetParams: ParamValues): AnimationState {
  return {
    params: { ...targetParams },
    targetParams: { ...targetParams },
    revealProgress: 0,
    isComplete: false,
  };
}

export function stepAnimation(
  state: AnimationState,
  nextTargetParams: ParamValues,
  lerpFactor: number,
  revealSpeed: number,
  /** 僅這些 key 變更時 reset reveal；預設全部 key（Rose 單參數 k 適用） */
  revealResetKeys?: string[],
): AnimationState {
  const keysToWatch =
    revealResetKeys ?? Object.keys(nextTargetParams);
  const targetChanged = keysToWatch.some(
    (key) => state.targetParams[key] !== nextTargetParams[key],
  );

  const targetParams = { ...nextTargetParams };
  let { params, revealProgress, isComplete } = state;

  if (targetChanged) {
    revealProgress = 0;
    isComplete = false;
  }

  for (const key of Object.keys(targetParams)) {
    const current = params[key] ?? targetParams[key];
    params[key] = current + (targetParams[key] - current) * lerpFactor;
  }

  if (!isComplete) {
    revealProgress += revealSpeed;
    if (revealProgress >= 1) {
      revealProgress = 1;
      isComplete = true;
    }
  }

  return { params, targetParams, revealProgress, isComplete };
}
