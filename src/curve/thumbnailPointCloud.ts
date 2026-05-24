import type { CurvePoint } from './types';

export function buildPointCloudStroke(
  points: CurvePoint[],
  options?: { flipY?: boolean; epsilon?: number },
): CurvePoint[] {
  const flipY = options?.flipY ?? false;
  const epsilon = options?.epsilon ?? 0.02;
  const out: CurvePoint[] = [];

  for (const point of points) {
    const base = flipY ? { ...point, y: -point.y } : point;
    out.push(base);
    out.push({ ...base, x: base.x + epsilon, theta: base.theta + epsilon });
    out.push({ x: Number.NaN, y: Number.NaN, theta: Number.NaN, arcLength: Number.NaN });
  }

  return out;
}
