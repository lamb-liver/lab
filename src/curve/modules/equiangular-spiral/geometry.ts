export type WorldPoint = { x: number; y: number };

export const INITIAL_RADIUS_A = 4;
export const REVEAL_RATIO = 0.72;
const PARAM_STEP = 0.03;
export const PARAM_LERP = 0.08;

export function evaluateEquiangularSpiral(
  theta: number,
  a: number,
  b: number,
): WorldPoint & { r: number } {
  const r = a * Math.exp(b * theta);
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
    r,
  };
}

export function buildParametricCurve(
  fn: (t: number) => WorldPoint,
  tStart: number,
  tEnd: number,
  step = PARAM_STEP,
): WorldPoint[] {
  const end = Math.max(tEnd, tStart + 0.001);
  const points: WorldPoint[] = [];
  for (let t = tStart; t <= end; t += step) {
    points.push(fn(t));
  }
  return points;
}

export function computeRevealTheta(
  maxTheta: number,
  time: number,
  revealRatio = REVEAL_RATIO,
): number {
  const base = maxTheta * revealRatio;
  const wobble =
    Math.sin(time * 0.7) * maxTheta * 0.08;
  return Math.min(base + wobble, maxTheta);
}

export function computeSpiralExtent(
  a: number,
  b: number,
  maxTheta: number,
): number {
  const end = evaluateEquiangularSpiral(maxTheta, a, b);
  return Math.max(Math.abs(end.x), Math.abs(end.y), 1);
}
