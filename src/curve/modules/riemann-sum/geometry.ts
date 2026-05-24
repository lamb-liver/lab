import type { CurvePoint } from '../../types';

export type CanvasPoint = { x: number; y: number };

export type RiemannRect = {
  leftX: number;
  topY: number;
  rightX: number;
};

export const REGION_RATIO = 0.75;
export const SAMPLE_STEP = 2;
export const ORIGIN_Y_OFFSET = 60;
export const Y_SCALE = 120;

export function evaluateRiemannFn(
  normalizedX: number,
  waveFrequency: number,
  time: number,
): number {
  return (
    1 +
    0.65 *
      Math.sin(normalizedX * Math.PI * waveFrequency + time) *
      Math.cos(normalizedX * Math.PI)
  );
}

export function mapRenderX(
  normalizedX: number,
  canvasWidth: number,
): number {
  const totalWidth = canvasWidth * REGION_RATIO;
  return -totalWidth / 2 + normalizedX * totalWidth;
}

export function mapRenderY(mathY: number): number {
  return -mathY * Y_SCALE;
}

export function buildRiemannRectangles(
  canvasWidth: number,
  partitionCount: number,
  waveFrequency: number,
  time: number,
  activeDomain: number,
): RiemannRect[] {
  const n = Math.floor(partitionCount);
  if (n <= 0) return [];

  const logicalWidth = 1 / n;
  const totalWidth = canvasWidth * REGION_RATIO;
  const rectCanvasWidth = logicalWidth * totalWidth;
  const rects: RiemannRect[] = [];

  for (let i = 0; i < n; i++) {
    const normalizedX = i * logicalWidth;
    if (normalizedX > activeDomain) break;

    const mathY = evaluateRiemannFn(normalizedX, waveFrequency, time);
    const leftX = mapRenderX(normalizedX, canvasWidth);
    const topY = mapRenderY(mathY);

    rects.push({
      leftX,
      topY,
      rightX: leftX + rectCanvasWidth,
    });
  }

  return rects;
}

export function buildRiemannCurvePoints(
  canvasWidth: number,
  waveFrequency: number,
  time: number,
  activeDomain: number,
  sampleStep = SAMPLE_STEP,
): CanvasPoint[] {
  const totalWidth = canvasWidth * REGION_RATIO;
  const maxOffset = totalWidth * activeDomain;
  const points: CanvasPoint[] = [];

  for (let offset = 0; offset <= maxOffset; offset += sampleStep) {
    const normalizedX = offset / totalWidth;
    points.push({
      x: mapRenderX(normalizedX, canvasWidth),
      y: mapRenderY(evaluateRiemannFn(normalizedX, waveFrequency, time)),
    });
  }

  return points;
}

export function sampleRiemannSumCurve(
  canvasWidth: number,
  waveFrequency: number,
  time: number,
  step: number,
): CurvePoint[] {
  const pts = buildRiemannCurvePoints(canvasWidth, waveFrequency, time, 1, step);
  const curve: CurvePoint[] = [];
  let arcLength = 0;

  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i]!;
    if (curve.length > 0) {
      const prev = curve[curve.length - 1]!;
      arcLength += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    }
    curve.push({ x: pt.x, y: pt.y, theta: i, arcLength });
  }

  return curve;
}
