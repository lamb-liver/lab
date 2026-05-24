import type { CurvePoint } from '../../types';
import { mulberry32 } from '../../prng';
export { mulberry32 } from '../../prng';

export type GrainPoint = { x: number; y: number };

export type IfsMathPoint = { x: number; y: number };

export const POINTS_PER_FRAME = 600;
export const MAX_GRAINS = 15000;
export const CANVAS_SCALE = 28;
export const ORIGIN_Y_RATIO = 0.85;
export const REVEAL_SPEED = 0.003;
export const PARAM_LERP = 0.08;

export function mathToCanvas(x: number, y: number): GrainPoint {
  return { x: x * CANVAS_SCALE, y: -y * CANVAS_SCALE };
}

export function stepIfsPoint(
  current: IfsMathPoint,
  leafBend: number,
  branchHeight: number,
  pulseOffset: number,
  random01: () => number,
): IfsMathPoint {
  const r = random01();
  const prevX = current.x;
  const prevY = current.y;

  if (r < 0.02) {
    return { x: 0, y: 0.16 * prevY };
  }
  if (r < 0.86) {
    return {
      x: 0.85 * prevX + leafBend * prevY,
      y: -leafBend * prevX + branchHeight * prevY + 1.6,
    };
  }
  if (r < 0.93) {
    return {
      x: 0.2 * prevX - 0.26 * prevY,
      y: 0.23 * prevX + (0.22 + pulseOffset) * prevY + 1.1,
    };
  }
  return {
    x: -0.15 * prevX + 0.28 * prevY,
    y: 0.26 * prevX + (0.24 - pulseOffset) * prevY + 0.44,
  };
}

export function generateGrainsBatch(
  count: number,
  leafBend: number,
  branchHeight: number,
  time: number,
  random01: () => number,
  startPoint: IfsMathPoint = { x: 0, y: 0 },
): { grains: GrainPoint[]; endPoint: IfsMathPoint } {
  const grains: GrainPoint[] = [];
  let current = startPoint;
  const pulseOffset = Math.sin(time) * 0.02;

  for (let k = 0; k < count; k++) {
    current = stepIfsPoint(current, leafBend, branchHeight, pulseOffset, random01);
    grains.push(mathToCanvas(current.x, current.y));
  }

  return { grains, endPoint: current };
}

/** 縮圖：固定種子迭代 */
export function sampleAffineIfsFractalCurve(
  leafBend: number,
  branchHeight: number,
  iterationCount: number,
  sampleStride: number,
): CurvePoint[] {
  const rand = mulberry32(42);
  let current: IfsMathPoint = { x: 0, y: 0 };
  const grains: GrainPoint[] = [];

  for (let i = 0; i < iterationCount; i++) {
    current = stepIfsPoint(current, leafBend, branchHeight, 0, rand);
    grains.push(mathToCanvas(current.x, current.y));
  }

  const points: CurvePoint[] = [];
  let arcLength = 0;

  for (let i = 0; i < grains.length; i += Math.max(1, sampleStride)) {
    const pt = grains[i]!;
    if (points.length > 0) {
      const prev = points[points.length - 1]!;
      arcLength += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    }
    points.push({ x: pt.x, y: pt.y, theta: i, arcLength });
  }

  return points;
}
