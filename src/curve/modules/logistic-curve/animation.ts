import {
  LOGISTIC_CURVE_REVEAL_SPEED,
  REVEAL_RESET_TIMEOUT_MS,
  type LogisticParams,
  getParamSignature,
  lerpSmoothParams,
  paramsFromValues,
  paramsSettled,
} from './geometry';
import type { ParamValues } from '../../types';

export type LogisticCurveAnimState = {
  smooth: LogisticParams;
  reveal: number;
  lastTargetSignature: string;
  lastRenderedSignature: string;
  pendingRevealReset: boolean;
  pendingRevealSince: number;
};

export function createLogisticCurveAnimState(
  params: ParamValues,
): LogisticCurveAnimState {
  const p = paramsFromValues(params);
  const signature = getParamSignature(p);
  return {
    smooth: { ...p },
    reveal: 1,
    lastTargetSignature: signature,
    lastRenderedSignature: signature,
    pendingRevealReset: false,
    pendingRevealSince: 0,
  };
}

export function resetLogisticCurveAnimState(
  params: ParamValues,
): LogisticCurveAnimState {
  return createLogisticCurveAnimState(params);
}

export function stepLogisticCurveAnimation(
  state: LogisticCurveAnimState,
  targetParams: ParamValues,
  deltaMs: number,
  nowMs: number,
): LogisticCurveAnimState {
  const target = paramsFromValues(targetParams);
  const signature = getParamSignature(target);

  let {
    smooth,
    reveal,
    lastTargetSignature,
    lastRenderedSignature,
    pendingRevealReset,
    pendingRevealSince,
  } = state;

  if (signature !== lastTargetSignature) {
    lastTargetSignature = signature;
    pendingRevealReset = signature !== lastRenderedSignature;
    pendingRevealSince = nowMs;
  }

  smooth = lerpSmoothParams(smooth, target);

  if (pendingRevealReset) {
    const settled = paramsSettled(smooth, target);
    const timedOut = nowMs - pendingRevealSince > REVEAL_RESET_TIMEOUT_MS;

    if (settled || timedOut) {
      if (signature !== lastRenderedSignature) {
        reveal = 0;
        lastRenderedSignature = signature;
      }
      pendingRevealReset = false;
      pendingRevealSince = 0;
    }
  }

  reveal = Math.min(1, reveal + (deltaMs / 1000) * LOGISTIC_CURVE_REVEAL_SPEED);

  return {
    smooth,
    reveal,
    lastTargetSignature,
    lastRenderedSignature,
    pendingRevealReset,
    pendingRevealSince,
  };
}
