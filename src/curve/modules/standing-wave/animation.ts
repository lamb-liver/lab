import type { ParamValues } from '../../types';
import { frameScale } from '../animationTiming';

export const REVEAL_SPEED = 0.0024;
export const AMPLITUDE_LERP = 0.08;

type StandingWaveAnimState = {
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

  let { revealProgress, isComplete, time, currentAmplitude } = state;

  if (freqChanged) {
    revealProgress = 0;
    isComplete = false;
  }

  currentAmplitude += (nextTarget.amplitude - currentAmplitude) * AMPLITUDE_LERP;
  if (Math.abs(currentAmplitude - nextTarget.amplitude) < 0.05) {
    currentAmplitude = nextTarget.amplitude;
  }

  const scale = frameScale(deltaMs);
  time += nextTarget.timeSpeed * scale;

  if (!isComplete) {
    revealProgress += revealSpeed * scale;
    if (revealProgress >= 1) {
      revealProgress = 1;
      isComplete = true;
    }
  }

  return {
    revealProgress,
    isComplete,
    time,
    currentAmplitude,
    previousFrequency: spatialFrequency,
  };
}
