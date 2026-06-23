import { PARAM_LERP, POINT_SPEED_PER_MS, REVEAL_SPEED_PER_SEC } from './constants';
import {
  buildEccentricityPaths,
  buildFocusScene,
  chooseEccentricityMetricPath,
  getFocusMovingPoint,
  getEccentricityKind,
} from './geometry';
import type { ConicMode, FocusCurveType, PathPoint } from './types';

const MAX_VISUAL_DELTA_MS = 50;

export type ConicDynamicParams = {
  mode: ConicMode;
  focusCurve: FocusCurveType;
  eccentricity: number;
  showConstruction: boolean;
  animatePoint: boolean;
};

type ConicDynamicAnimState = {
  targetParams: ConicDynamicParams;
  smoothE: number;
  reveal: number;
  pointClock: number;
  lastMode: ConicMode;
  lastFocusCurve: FocusCurveType;
  activeMetricPoints: PathPoint[];
  subtitle: string;
};

export function createConicDynamicAnimState(
  params: ConicDynamicParams,
): ConicDynamicAnimState {
  return {
    targetParams: { ...params },
    smoothE: params.eccentricity,
    reveal: 1,
    pointClock: 0,
    lastMode: params.mode,
    lastFocusCurve: params.focusCurve,
    activeMetricPoints: [],
    subtitle: '',
  };
}

export function stepConicDynamicAnimation(
  state: ConicDynamicAnimState,
  nextTarget: ConicDynamicParams,
  deltaMs: number,
): ConicDynamicAnimState {
  let {
    smoothE,
    reveal,
    pointClock,
    lastMode,
    lastFocusCurve,
    activeMetricPoints,
    subtitle,
  } = state;

  const targetParams = { ...nextTarget };
  const rawDeltaMs = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : 0;
  const clampedDeltaMs = Math.min(rawDeltaMs, MAX_VISUAL_DELTA_MS);

  if (
    targetParams.mode !== lastMode ||
    targetParams.focusCurve !== lastFocusCurve
  ) {
    reveal = 0;
    pointClock = 0;
    lastMode = targetParams.mode;
    lastFocusCurve = targetParams.focusCurve;
  }

  if (targetParams.animatePoint) {
    pointClock += clampedDeltaMs * POINT_SPEED_PER_MS;
  }

  reveal = Math.min(1, reveal + (clampedDeltaMs / 1000) * REVEAL_SPEED_PER_SEC);

  if (targetParams.mode === 'eccentricity') {
    const targetE = targetParams.eccentricity;

    smoothE += (targetE - smoothE) * PARAM_LERP;

    const paths = buildEccentricityPaths(smoothE);
    const metricPath = chooseEccentricityMetricPath(paths, smoothE, pointClock);
    activeMetricPoints = metricPath;
    subtitle = getEccentricityKind(smoothE);
  } else {
    const scene = buildFocusScene(targetParams.focusCurve);
    const { metricPath } = getFocusMovingPoint(scene, pointClock);

    activeMetricPoints = metricPath;
    subtitle = scene.title;
  }

  return {
    targetParams,
    smoothE,
    reveal,
    pointClock,
    lastMode,
    lastFocusCurve,
    activeMetricPoints,
    subtitle,
  };
}
