import type { CurvePoint } from '../../types';

export const REGION_RATIO = 0.8;
export const BASE_CANVAS = 600;
export const ENVELOPE_SAMPLE_STEPS = 64;

export type Point2 = { x: number; y: number };
export type LineSegment = { x1: number; y1: number; x2: number; y2: number };

export type EnvelopeGeometry = {
  fullLines: LineSegment[];
  visibleLines: LineSegment[];
};

export function breathingScale(time: number): number {
  return 1 + 0.15 * Math.cos(time);
}

export function envelopePoint(
  ratio: number,
  size: number,
  breathing: number,
  currentRatio: number,
): Point2 {
  return {
    x: (size / 2) * ratio * breathing * currentRatio,
    y: (size / 2) * (1 - ratio) * breathing,
  };
}

export function buildSymmetricLines(point: Point2): LineSegment[] {
  return [
    { x1: point.x, y1: 0, x2: 0, y2: point.y },
    { x1: -point.x, y1: 0, x2: 0, y2: point.y },
    { x1: point.x, y1: 0, x2: 0, y2: -point.y },
    { x1: -point.x, y1: 0, x2: 0, y2: -point.y },
  ];
}

export function buildEnvelopeGeometry(opts: {
  canvasWidth: number;
  lineDensity: number;
  currentRatio: number;
  time: number;
  revealProgress: number;
}): EnvelopeGeometry {
  const { canvasWidth, lineDensity, currentRatio, time, revealProgress } = opts;
  const size = canvasWidth * REGION_RATIO;
  const breathing = breathingScale(time);
  const fullLines: LineSegment[] = [];
  const density = Math.max(1, Math.round(lineDensity));

  for (let i = 0; i <= density; i++) {
    const ratio = i / density;
    const point = envelopePoint(ratio, size, breathing, currentRatio);
    fullLines.push(...buildSymmetricLines(point));
  }

  const visibleCount = Math.floor(fullLines.length * revealProgress);
  const visibleLines = fullLines.slice(0, visibleCount);

  return { fullLines, visibleLines };
}

/** 包絡線輪廓（四象限），供列表縮圖 */
export function sampleConicEnvelopeOutline(
  deformationRatio: number,
  step: number,
  canvasSize = BASE_CANVAS,
): CurvePoint[] {
  const size = canvasSize * REGION_RATIO;
  const a = (size / 2) * deformationRatio;
  const b = size / 2;
  const raw: Point2[] = [];
  const tStep = step / ENVELOPE_SAMPLE_STEPS;

  for (let t = 0; t <= 1; t += tStep) {
    const x = a * t * t;
    const y = b * (1 - t) * (1 - t);
    raw.push({ x, y }, { x: -x, y }, { x, y: -y }, { x: -x, y: -y });
  }

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
