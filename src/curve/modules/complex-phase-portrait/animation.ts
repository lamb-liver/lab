import type { ParamValues } from '../../types';
import {
  PARAM_LERP,
  TIME_SPEED,
  appendHistoryBuffer,
  createHistoryBuffer,
  rebuildHistoryBuffer,
  toPhasorSampleParams,
  type HistoryBuffer,
} from './geometry';

export type ComplexPhasePortraitAnimState = {
  params: ParamValues;
  smoothPhase: number;
  time: number;
  history: HistoryBuffer;
  lastAmpA: number;
  lastFreqB: number;
};

export function createComplexPhasePortraitAnimState(
  defaultParams: ParamValues,
): ComplexPhasePortraitAnimState {
  const params = { ...defaultParams };
  const smoothPhase = defaultParams.phase;
  const phasor = toPhasorSampleParams(params.ampA, params.freqB, smoothPhase);
  const history = createHistoryBuffer();
  rebuildHistoryBuffer(history, phasor);

  return {
    params,
    smoothPhase,
    time: 0,
    history,
    lastAmpA: params.ampA,
    lastFreqB: phasor.freqB,
  };
}

function lerpToward(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function stepComplexPhasePortraitAnimation(
  state: ComplexPhasePortraitAnimState,
  nextTarget: ParamValues,
): void {
  state.params = nextTarget;
  const ampA = nextTarget.ampA;
  const freqB = Math.round(nextTarget.freqB);
  state.smoothPhase = lerpToward(state.smoothPhase, nextTarget.phase, PARAM_LERP);
  const phasor = toPhasorSampleParams(ampA, freqB, state.smoothPhase);

  const geometryChanged = state.lastAmpA !== ampA || state.lastFreqB !== freqB;

  if (geometryChanged) {
    state.time = 0;
    rebuildHistoryBuffer(state.history, phasor);
    state.lastAmpA = ampA;
    state.lastFreqB = freqB;
    return;
  }

  state.time += TIME_SPEED;
  appendHistoryBuffer(state.history, state.time, phasor);
}

export { PARAM_LERP, TIME_SPEED };
