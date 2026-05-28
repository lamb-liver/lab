import { PARAM_LERP, POINT_SPEED_PER_MS, REVEAL_SPEED_PER_SEC } from './constants';
import {
  buildEccentricityPaths,
  buildFocusScene,
  chooseEccentricityMetricPath,
  getFocusMovingPoint,
  getEccentricityKind,
} from './geometry';
import type { ConicMode, FocusCurveType, PathPoint } from './types';

export type ConicDynamicParams = {
  mode: ConicMode;
  focusCurve: FocusCurveType;
  eccentricity: number;
  showConstruction: boolean;
  animatePoint: boolean;
};

export type ConicDynamicAnimState = {
  params: ConicDynamicParams;
  targetParams: ConicDynamicParams;
  smoothE: number;
  lastTargetE: number;
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
    params: { ...params },
    targetParams: { ...params },
    smoothE: params.eccentricity,
    lastTargetE: params.eccentricity,
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
    lastTargetE,
    reveal,
    pointClock,
    lastMode,
    lastFocusCurve,
    activeMetricPoints,
    subtitle,
  } = state;

  const targetParams = { ...nextTarget };

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
    pointClock += deltaMs * POINT_SPEED_PER_MS;
  }

  reveal = Math.min(1, reveal + (deltaMs / 1000) * REVEAL_SPEED_PER_SEC);

  if (targetParams.mode === 'eccentricity') {
    const targetE = targetParams.eccentricity;

    if (Math.abs(targetE - lastTargetE) > 0.002) {
      reveal = 0;
      lastTargetE = targetE;
    }

    smoothE += (targetE - smoothE) * PARAM_LERP;

    const paths = buildEccentricityPaths(smoothE);
    const metricPath = chooseEccentricityMetricPath(paths, smoothE, pointClock);
    activeMetricPoints = metricPath;
    subtitle = getEccentricityKind(smoothE);
  } else {
    const scene = buildFocusScene(targetParams.focusCurve);
    const { point, metricPath } = getFocusMovingPoint(scene, pointClock);

    activeMetricPoints = metricPath;
    subtitle = scene.title;
  }

  return {
    params: targetParams,
    targetParams,
    smoothE,
    lastTargetE,
    reveal,
    pointClock,
    lastMode,
    lastFocusCurve,
    activeMetricPoints,
    subtitle,
  };
}
