import type { CurvePoint } from '../../types';

export type WorldPoint = { x: number; y: number };
export type ScreenPoint = { x: number; y: number };
export type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export const SAMPLE_STEP = 0.01;
export const PARAM_LERP = 0.08;

export function evaluateTractrix(t: number, ropeLength: number): WorldPoint {
  if (t <= 0) {
    return { x: 0, y: ropeLength };
  }

  const eT = Math.exp(t);
  const eNegT = Math.exp(-t);
  const sech = 2 / (eT + eNegT);
  const tanh = (eT - eNegT) / (eT + eNegT);

  return {
    x: ropeLength * (t - tanh),
    y: ropeLength * sech,
  };
}

export function buildParametricCurve(
  fn: (t: number) => WorldPoint,
  tStart: number,
  tEnd: number,
  step = SAMPLE_STEP,
): WorldPoint[] {
  const points: WorldPoint[] = [];
  for (let t = tStart; t <= tEnd; t += step) {
    points.push(fn(t));
  }
  return points;
}

export function mirrorY(points: ReadonlyArray<WorldPoint>): WorldPoint[] {
  return points.map((pt) => ({ x: pt.x, y: -pt.y }));
}

export function pullingOscillation(time: number): number {
  return 0.5 * (1 - Math.cos(time));
}

export function computeTractrixBounds(
  ropeLength: number,
  maxT: number,
  dynamicT: number,
): Bounds {
  const objectPoint = evaluateTractrix(dynamicT, ropeLength);
  const pullerPoint = { x: ropeLength * dynamicT, y: 0 };

  return {
    minX: 0,
    maxX: Math.max(objectPoint.x, pullerPoint.x, ropeLength * maxT),
    minY: -ropeLength,
    maxY: ropeLength,
  };
}

export function sampleCatenaryCurve(
  ropeLength: number,
  maxT: number,
  step: number,
): CurvePoint[] {
  const upper = buildParametricCurve(
    (t) => evaluateTractrix(t, ropeLength),
    0,
    maxT,
    Math.max(SAMPLE_STEP, step * SAMPLE_STEP),
  );

  const curve: CurvePoint[] = [];
  let arcLength = 0;

  for (let i = 0; i < upper.length; i++) {
    const pt = upper[i]!;
    if (curve.length > 0) {
      const prev = curve[curve.length - 1]!;
      arcLength += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    }
    curve.push({ x: pt.x, y: pt.y, theta: i, arcLength });
  }

  return curve;
}
