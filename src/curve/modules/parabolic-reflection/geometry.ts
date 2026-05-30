import type { CurvePoint } from '../../types';

export const REGION_RATIO = 0.8;
export const CURVE_STEP = 4;
export const ORIGIN_OFFSET_X = 80;
export const BASE_CANVAS = 600;

export type Point2 = { x: number; y: number };
export type RaySegment = { x1: number; y1: number; x2: number; y2: number };

export function parabolaX(y: number, p: number): number {
  return (y * y) / (4 * p);
}

export function focusPoint(p: number): Point2 {
  return { x: p, y: 0 };
}

export function scanOffset(time: number): number {
  return Math.sin(time) * 0.2;
}

export function buildParabolaCurve(
  canvasHeight: number,
  p: number,
  step = CURVE_STEP,
): Point2[] {
  const maxY = (canvasHeight * REGION_RATIO) / 2;
  const points: Point2[] = [];

  for (let y = -maxY; y <= maxY; y += step) {
    points.push({ x: parabolaX(y, p), y });
  }

  return points;
}

export function buildIncomingRay(
  focus: Point2,
  hitX: number,
  hitY: number,
  revealProgress: number,
): RaySegment {
  const progress = Math.min(revealProgress * 2, 1);
  return {
    x1: focus.x,
    y1: focus.y,
    x2: focus.x + (hitX - focus.x) * progress,
    y2: focus.y + (hitY - focus.y) * progress,
  };
}

export function buildReflectedRay(
  hitX: number,
  hitY: number,
  exitX: number,
  exitY: number,
  revealProgress: number,
): RaySegment {
  const progress = (revealProgress - 0.5) * 2;
  return {
    x1: hitX,
    y1: hitY,
    x2: hitX + (exitX - hitX) * progress,
    y2: hitY + (exitY - hitY) * progress,
  };
}

export function buildReflectionRays(opts: {
  canvasWidth: number;
  canvasHeight: number;
  currentFocalLength: number;
  rayCount: number;
  time: number;
  revealProgress: number;
}): RaySegment[] {
  const {
    canvasWidth,
    canvasHeight,
    currentFocalLength,
    rayCount,
    time,
    revealProgress,
  } = opts;

  const rays: RaySegment[] = [];
  const focus = focusPoint(currentFocalLength);
  const maxY = (canvasHeight * REGION_RATIO) / 2;
  const offset = scanOffset(time);
  const exitX = canvasWidth / 2 + ORIGIN_OFFSET_X;
  const count = Math.max(2, Math.round(rayCount));

  for (let i = 0; i < count; i++) {
    const ratio = (i / (count - 1) - 0.5) * 2;
    const hitY = ratio * maxY * (1 + offset);
    const hitX = parabolaX(hitY, currentFocalLength);

    rays.push(buildIncomingRay(focus, hitX, hitY, revealProgress));

    if (revealProgress > 0.5) {
      rays.push(
        buildReflectedRay(hitX, hitY, exitX, hitY, revealProgress),
      );
    }
  }

  return rays;
}

export function sampleParabolicReflectionCurve(
  focalLength: number,
  step: number,
  canvasSize = BASE_CANVAS,
): CurvePoint[] {
  const raw = buildParabolaCurve(canvasSize, focalLength, step);
  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let i = 0; i < raw.length; i++) {
    const { x, y } = raw[i]!;
    if (i > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }
    points.push({ x, y, theta: i * step, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}
