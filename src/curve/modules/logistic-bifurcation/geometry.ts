import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const LOGISTIC_VIEW = {
  width: 900,
  height: 900,
};

export const MODE_BIFURCATION = 0;
export const MODE_ORBIT = 1;
export const MODE_COBWEB = 2;
export const MODE_COMPARE = 3;

type LogisticMode = 'bifurcation' | 'orbit' | 'cobweb' | 'compare';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type BifurcationPoint = Point & {
  r: number;
  value: number;
};

type OrbitData = {
  orbit1: number[];
  orbit2: number[];
  divergence: number[];
  period: number | 'CHAOTIC';
};

export const FEIGENBAUM_MARKERS = [
  { r: 3, period: 2, exp: 1 },
  { r: 3.4494897428, period: 4, exp: 2 },
  { r: 3.5440903500, period: 8, exp: 3 },
  { r: 3.5644072661, period: 16, exp: 4 },
  { r: 3.5687594195, period: 32, exp: 5 },
];

export const LOGISTIC_LAYOUT = {
  chart: { x: 56, y: 74, width: 560, height: 620 },
  orbit: { x: 646, y: 74, width: 210, height: 160 },
  divergence: { x: 646, y: 266, width: 210, height: 140 },
  cobweb: { x: 646, y: 456, width: 210, height: 210 },
};

const EPSILON_FLOOR = 1e-10;

export function logisticModeFromValue(value: number | undefined): LogisticMode {
  const mode = Math.round(value ?? MODE_COMPARE);
  if (mode === MODE_ORBIT) return 'orbit';
  if (mode === MODE_COBWEB) return 'cobweb';
  if (mode === MODE_COMPARE) return 'compare';
  return 'bifurcation';
}

export function logistic(r: number, x: number): number {
  return r * x * (1 - x);
}

export function buildBifurcationPoints(
  params: ParamValues,
  revealProgress = 1,
  rSamples = 520,
  transient = 420,
  iterations = 100,
): BifurcationPoint[] {
  const bounds = LOGISTIC_LAYOUT.chart;
  const rMin = params.rMin ?? 2.5;
  const rMax = params.rMax ?? 4;
  const xMin = params.xMin ?? 0;
  const xMax = params.xMax ?? 1;
  const activeSamples = Math.max(1, Math.floor(rSamples * revealProgress));
  const points: BifurcationPoint[] = [];

  for (let i = 0; i < activeSamples; i += 1) {
    const r = mapRange(i, 0, rSamples - 1, rMin, rMax);
    let x = 0.5;
    for (let j = 0; j < transient; j += 1) x = logistic(r, x);
    for (let j = 0; j < iterations; j += 1) {
      x = logistic(r, x);
      if (x < xMin || x > xMax) continue;
      points.push({
        r,
        value: x,
        x: mapR(params, r, bounds),
        y: mapX(params, x, bounds),
      });
    }
  }

  return points;
}

export function buildOrbitData(params: ParamValues): OrbitData {
  const r = params.r ?? 3.5;
  const x0 = params.x0 ?? 0.2;
  const orbit1: number[] = [];
  const orbit2: number[] = [];
  const divergence: number[] = [];
  let x1 = x0;
  let x2 = x0 + 1e-6;

  for (let i = 0; i < 80; i += 1) {
    x1 = logistic(r, x1);
    x2 = logistic(r, x2);
  }

  for (let i = 0; i < 150; i += 1) {
    x1 = logistic(r, x1);
    x2 = logistic(r, x2);
    orbit1.push(x1);
    orbit2.push(x2);
    divergence.push(Math.log(Math.max(Math.abs(x1 - x2), EPSILON_FLOOR)));
  }

  return {
    orbit1,
    orbit2,
    divergence,
    period: detectPeriod(r),
  };
}

export function buildCobwebSteps(params: ParamValues, count = 70): Array<{ from: Point; vertical: Point; next: Point }> {
  const r = params.r ?? 3.5;
  let x = params.x0 ?? 0.2;
  const steps: Array<{ from: Point; vertical: Point; next: Point }> = [];
  for (let i = 0; i < count; i += 1) {
    const y = logistic(r, x);
    steps.push({
      from: { x, y: x },
      vertical: { x, y },
      next: { x: y, y },
    });
    x = y;
  }
  return steps;
}

function detectPeriod(r: number): number | 'CHAOTIC' {
  let x = 0.5;
  for (let i = 0; i < 800; i += 1) x = logistic(r, x);

  const unique: number[] = [];
  const epsilon = 1e-5;
  for (let i = 0; i < 128; i += 1) {
    x = logistic(r, x);
    if (!unique.some((value) => Math.abs(x - value) < epsilon)) {
      unique.push(x);
    }
    if (unique.length > 64) return 'CHAOTIC';
  }
  return unique.length;
}

export function buildLogisticThumbnail(params: ParamValues): ThumbnailSpec {
  const points = buildBifurcationPoints(params, 1, 230, 220, 26);
  const cloud: CurvePoint[] = [];
  for (const point of points) {
    cloud.push(
      { x: point.x, y: point.y, theta: point.r, arcLength: 0 },
      { x: point.x + 0.01, y: point.y, theta: point.r, arcLength: 0.01 },
      { x: Number.NaN, y: Number.NaN, theta: point.r, arcLength: 0.01 },
    );
  }
  return {
    coordinateSystem: 'canvas',
    paths: [
      {
        points: cloud,
        opacity: 0.88,
        strokeWidth: 0.72,
      },
    ],
  };
}

export function mapR(params: ParamValues, r: number, bounds = LOGISTIC_LAYOUT.chart): number {
  return mapRange(r, params.rMin ?? 2.5, params.rMax ?? 4, bounds.x, bounds.x + bounds.width);
}

function mapX(params: ParamValues, x: number, bounds = LOGISTIC_LAYOUT.chart): number {
  return mapRange(x, params.xMin ?? 0, params.xMax ?? 1, bounds.y + bounds.height, bounds.y);
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
