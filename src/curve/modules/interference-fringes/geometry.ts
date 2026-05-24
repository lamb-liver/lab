import type { CurvePoint } from '../../types';

export const CURVE_WIDTH_RATIO = 0.8;
export const DEFAULT_SAMPLE_STEP = 4;
export const HYPERBOLA_T_STEP = 0.03;
export const BASE_CANVAS = 600;
export const WAVE_DISTANCE_SCALE = 0.05;

export type Point2 = { x: number; y: number };

export type HyperbolaParams =
  | { isCenterLine: true; a: number; c: number }
  | { isCenterLine: false; a: number; b: number; c: number };

export type InterferenceGeometry = {
  fringes: Point2[][];
  envelopes: Point2[][];
};

export type InterferenceBuildOpts = {
  canvasWidth: number;
  canvasHeight: number;
  currentSourceDistance: number;
  wavelength: number;
  time: number;
  revealProgress: number;
  curveWidthRatio?: number;
  sampleStep?: number;
  hyperbolaStep?: number;
};

export function pathDifference(order: number, wavelength: number): number {
  return order * wavelength;
}

export function hyperbolaParameters(
  pathDiff: number,
  currentSourceDistance: number,
): HyperbolaParams | null {
  const a = pathDiff / 2;
  const c = currentSourceDistance / 2;

  if (Math.abs(a) < 0.1) {
    return { isCenterLine: true, a, c };
  }

  if (Math.abs(a) >= c) {
    return null;
  }

  const b = Math.sqrt(c * c - a * a);
  return { isCenterLine: false, a, b, c };
}

export function waveModulation(x: number, y: number, time: number): number {
  const distance = Math.hypot(x, y);
  return Math.cos(distance * WAVE_DISTANCE_SCALE - time);
}

function buildCenterLine(
  opts: InterferenceBuildOpts,
  fringePoints: Point2[],
  envelopePoints: Point2[],
): void {
  const {
    canvasHeight,
    time,
    revealProgress,
    curveWidthRatio = CURVE_WIDTH_RATIO,
    sampleStep = DEFAULT_SAMPLE_STEP,
  } = opts;

  const visibleHeight = canvasHeight * curveWidthRatio * revealProgress;
  const modulation = Math.cos(-time);

  for (let y = -visibleHeight / 2; y <= visibleHeight / 2; y += sampleStep) {
    fringePoints.push({ x: 0, y: y * modulation });
    envelopePoints.push({ x: 0, y });
  }
}

function buildHyperbolaBranch(
  opts: InterferenceBuildOpts,
  fringePoints: Point2[],
  envelopePoints: Point2[],
  params: Extract<HyperbolaParams, { isCenterLine: false }>,
): void {
  const { a, b } = params;
  const { time, revealProgress, hyperbolaStep = HYPERBOLA_T_STEP } = opts;
  const maxT = 1.2 * revealProgress;

  for (let t = -maxT; t <= maxT; t += hyperbolaStep) {
    const x = (a * (Math.exp(t) + Math.exp(-t))) / 2;
    const y = (b * (Math.exp(t) - Math.exp(-t))) / 2;
    const modulation = waveModulation(x, y, time);

    fringePoints.push({ x, y: y * modulation });
    envelopePoints.push({ x, y });
  }
}

export function buildInterferenceGeometry(
  opts: InterferenceBuildOpts,
): InterferenceGeometry {
  const { currentSourceDistance, wavelength } = opts;
  const fringes: Point2[][] = [];
  const envelopes: Point2[][] = [];

  const maxOrder = Math.floor(currentSourceDistance / wavelength);

  for (let order = -maxOrder; order <= maxOrder; order++) {
    const fringePoints: Point2[] = [];
    const envelopePoints: Point2[] = [];
    const pathDiff = pathDifference(order, wavelength);
    const params = hyperbolaParameters(pathDiff, currentSourceDistance);

    if (!params) continue;

    if (params.isCenterLine) {
      buildCenterLine(opts, fringePoints, envelopePoints);
    } else {
      buildHyperbolaBranch(opts, fringePoints, envelopePoints, params);
    }

    if (fringePoints.length > 0) {
      fringes.push(fringePoints);
      envelopes.push(envelopePoints);
    }
  }

  return { fringes, envelopes };
}

export function sampleInterferenceFringesCurve(
  sourceDistance: number,
  wavelength: number,
  step: number,
  time = 0,
  revealProgress = 1,
): CurvePoint[] {
  const geometry = buildInterferenceGeometry({
    canvasWidth: BASE_CANVAS,
    canvasHeight: BASE_CANVAS,
    currentSourceDistance: sourceDistance,
    wavelength,
    time,
    revealProgress,
    sampleStep: step,
  });

  const envelope =
    geometry.envelopes.find((curve) => curve.length > 8) ?? geometry.envelopes[0] ?? [];

  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let i = 0; i < envelope.length; i++) {
    const { x, y } = envelope[i]!;
    if (i > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }
    points.push({ x, y, theta: i * step, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}
