import type { ParamValues } from '../../types';
import { frameScale } from '../animationTiming';

export const REVEAL_SPEED = 0.004;
export const MODE_LERP = 0.08;

export type ChladniAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentM: number;
  currentN: number;
  previousM: number;
  previousN: number;
  resetParticles: boolean;
};

export function createChladniAnimState(defaultParams: ParamValues): ChladniAnimState {
  const modeM = Math.round(defaultParams.modeM);
  const modeN = Math.round(defaultParams.modeN);
  return {
    params: { ...defaultParams, modeM, modeN },
    targetParams: { ...defaultParams, modeM, modeN },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentM: modeM,
    currentN: modeN,
    previousM: modeM,
    previousN: modeN,
    resetParticles: false,
  };
}

export function stepChladniAnimation(
  state: ChladniAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
): ChladniAnimState {
  const modeM = Math.round(nextTarget.modeM);
  const modeN = Math.round(nextTarget.modeN);
  const structureChanged = modeM !== state.previousM || modeN !== state.previousN;

  let {
    params,
    revealProgress,
    isComplete,
    time,
    currentM,
    currentN,
    previousM,
    previousN,
  } = state;

  const targetParams = { ...nextTarget, modeM, modeN };
  let resetParticles = false;

  if (structureChanged) {
    revealProgress = 0;
    isComplete = false;
    previousM = modeM;
    previousN = modeN;
    resetParticles = true;
  }

  currentM += (modeM - currentM) * MODE_LERP;
  currentN += (modeN - currentN) * MODE_LERP;
  if (Math.abs(currentM - modeM) < 0.05) currentM = modeM;
  if (Math.abs(currentN - modeN) < 0.05) currentN = modeN;

  const scale = frameScale(deltaMs);
  time += targetParams.vibrationSpeed * scale;

  params = {
    modeM: currentM,
    modeN: currentN,
    vibrationSpeed: targetParams.vibrationSpeed,
  };

  if (!isComplete) {
    revealProgress += revealSpeed * scale;
    if (revealProgress >= 1) {
      revealProgress = 1;
      isComplete = true;
    }
  }

  return {
    params,
    targetParams,
    revealProgress,
    isComplete,
    time,
    currentM,
    currentN,
    previousM,
    previousN,
    resetParticles,
  };
}
