import type { CurvePoint } from '../../types';

export type CanvasPoint = { x: number; y: number };

export const REGION_RATIO = 0.75;
export const ORIGIN_Y_OFFSET = 40;
export const Y_SCALE = 160;
const CURVE_SAMPLE_STEP = 0.004;
const EXTENSION_SAMPLE_STEP = 0.01;
export const COLLAPSE_START_DX = 0.4;

const TWO_PI = Math.PI * 2;

export function evaluateTangentFn(
  x: number,
  waveFrequency: number,
  time: number,
): number {
  return (
    0.25 * Math.sin(x * TWO_PI * waveFrequency + time) - 0.4 * (x - 0.5) ** 2
  );
}

export function mapRenderX(normalizedX: number, canvasWidth: number): number {
  const totalWidth = canvasWidth * REGION_RATIO;
  return -totalWidth / 2 + normalizedX * totalWidth;
}

export function mapRenderY(mathY: number): number {
  return -mathY * Y_SCALE;
}

export function tangentPointX(time: number): number {
  return 0.5 + 0.1 * Math.sin(time * 0.6);
}

export function buildFunctionCurvePoints(
  canvasWidth: number,
  waveFrequency: number,
  time: number,
  step = CURVE_SAMPLE_STEP,
): CanvasPoint[] {
  const points: CanvasPoint[] = [];
  for (let x = 0; x <= 1; x += step) {
    points.push({
      x: mapRenderX(x, canvasWidth),
      y: mapRenderY(evaluateTangentFn(x, waveFrequency, time)),
    });
  }
  return points;
}

export function buildSecantSegment(
  canvasWidth: number,
  waveFrequency: number,
  time: number,
  tangentX: number,
  dx: number,
): CanvasPoint[] {
  const pY = evaluateTangentFn(tangentX, waveFrequency, time);
  const qY = evaluateTangentFn(tangentX + dx, waveFrequency, time);
  return [
    { x: mapRenderX(tangentX, canvasWidth), y: mapRenderY(pY) },
    { x: mapRenderX(tangentX + dx, canvasWidth), y: mapRenderY(qY) },
  ];
}

export function buildSecantExtension(
  canvasWidth: number,
  waveFrequency: number,
  time: number,
  tangentX: number,
  dx: number,
  step = EXTENSION_SAMPLE_STEP,
): CanvasPoint[] {
  const pY = evaluateTangentFn(tangentX, waveFrequency, time);
  const qY = evaluateTangentFn(tangentX + dx, waveFrequency, time);
  const slope = dx !== 0 ? (qY - pY) / dx : 0;
  const points: CanvasPoint[] = [];

  for (let x = 0; x <= 1; x += step) {
    const y = slope * (x - tangentX) + pY;
    points.push({
      x: mapRenderX(x, canvasWidth),
      y: mapRenderY(y),
    });
  }

  return points;
}

export function sampleTangentApproximationCurve(
  canvasWidth: number,
  waveFrequency: number,
  time: number,
  step: number,
): CurvePoint[] {
  const pts = buildFunctionCurvePoints(
    canvasWidth,
    waveFrequency,
    time,
    Math.max(0.004, step * 0.004),
  );
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
