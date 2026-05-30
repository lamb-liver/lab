import type { ParamValues } from '../../types';
import { frameScale } from '../animationTiming';

export const REVEAL_SPEED = 0.0024;
export const AMPLITUDE_LERP = 0.08;

export type StandingWaveAnimState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
  time: number;
  currentAmplitude: number;
  previousFrequency: number;
};

export function createStandingWaveAnimState(
  defaultParams: ParamValues,
): StandingWaveAnimState {
  const spatialFrequency = Math.round(defaultParams.spatialFrequency);
  return {
    params: { ...defaultParams, spatialFrequency },
    targetParams: { ...defaultParams, spatialFrequency },
    revealProgress: 0,
    isComplete: false,
    time: 0,
    currentAmplitude: defaultParams.amplitude,
    previousFrequency: spatialFrequency,
  };
}

export function stepStandingWaveAnimation(
  state: StandingWaveAnimState,
  nextTarget: ParamValues,
  revealSpeed: number,
  deltaMs?: number,
): StandingWaveAnimState {
  const spatialFrequency = Math.round(nextTarget.spatialFrequency);
  const freqChanged = spatialFrequency !== state.previousFrequency;

  let { params, revealProgress, isComplete, time, currentAmplitude } = state;
  const targetParams = { ...nextTarget, spatialFrequency };

  if (freqChanged) {
    revealProgress = 0;
    isComplete = false;
  }

  currentAmplitude += (targetParams.amplitude - currentAmplitude) * AMPLITUDE_LERP;
  if (Math.abs(currentAmplitude - targetParams.amplitude) < 0.05) {
    currentAmplitude = targetParams.amplitude;
  }

  const scale = frameScale(deltaMs);
  time += targetParams.timeSpeed * scale;

  params = {
    amplitude: currentAmplitude,
    spatialFrequency,
    timeSpeed: targetParams.timeSpeed,
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
    currentAmplitude,
    previousFrequency: spatialFrequency,
  };
}
