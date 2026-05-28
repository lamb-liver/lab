import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const BUFFON_VIEW = {
  width: 900,
  height: 900,
};

export function normalizeLength(value: number | undefined): number {
  return Math.max(20, Math.min(100, Math.round(value ?? 70)));
}

export function normalizeSpacing(value: number | undefined): number {
  return Math.max(60, Math.min(140, Math.round(value ?? 100)));
}

export function normalizeSpeed(value: number | undefined): number {
  return Math.max(1, Math.min(80, Math.round(value ?? 12)));
}

export function deriveBuffonData(params: ParamValues) {
  const d = normalizeSpacing(params.d);
  const l = Math.min(normalizeLength(params.l), d);
  const speed = normalizeSpeed(params.speed);
  const theoreticalP = (2 * l) / (Math.PI * d);
  return { l, d, speed, theoreticalP };
}

export function estimatePi(l: number, d: number, totalThrows: number, hitCount: number): number {
  if (hitCount <= 0) return 0;
  return (2 * l * totalThrows) / (d * hitCount);
}

export function getFieldRect() {
  return { x: 90, y: 380, w: 650, h: 330 };
}

export function generateNeedle(
  data: ReturnType<typeof deriveBuffonData>,
  randomFn = Math.random,
): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  hit: boolean;
} {
  const field = getFieldRect();
  const usablePeriods = Math.floor(field.h / data.d);
  const usableH = usablePeriods * data.d;
  const cx = field.x + 20 + randomFn() * Math.max(1, field.w - 40);
  const cy = field.y + randomFn() * Math.max(1, usableH);
  const theta = randomFn() * Math.PI;
  const dx = Math.cos(theta) * data.l * 0.5;
  const dy = Math.sin(theta) * data.l * 0.5;
  const x1 = cx - dx;
  const y1 = cy - dy;
  const x2 = cx + dx;
  const y2 = cy + dy;
  const topIndex = Math.floor((Math.min(y1, y2) - field.y) / data.d);
  const bottomIndex = Math.floor((Math.max(y1, y2) - field.y) / data.d);
  return { x1, y1, x2, y2, cx, cy, hit: topIndex !== bottomIndex };
}

export function percent(v: number): string {
  return `${(v * 100).toFixed(2)}%`;
}

export function buildBuffonThumbnail(): ThumbnailSpec {
  const grid: CurvePoint[] = [];
  const dimNeedles: CurvePoint[] = [];
  const hitNeedles: CurvePoint[] = [];
  const lineYs = [280, 360, 440, 520, 600];
  for (let i = 0; i < lineYs.length; i += 1) {
    grid.push(
      { x: 140, y: lineYs[i]!, theta: i, arcLength: i },
      { x: 760, y: lineYs[i]!, theta: i + 0.2, arcLength: i + 0.2 },
      { x: Number.NaN, y: Number.NaN, theta: i + 0.3, arcLength: i + 0.3 },
    );
  }
  const dimSegments = [
    [220, 315, 272, 352],
    [318, 398, 372, 432],
    [470, 330, 522, 365],
    [590, 420, 642, 455],
    [256, 520, 309, 553],
    [504, 548, 560, 575],
    [660, 560, 710, 596],
  ];
  for (let i = 0; i < dimSegments.length; i += 1) {
    const [x1, y1, x2, y2] = dimSegments[i]!;
    dimNeedles.push(
      { x: x1, y: y1, theta: i, arcLength: i },
      { x: x2, y: y2, theta: i + 0.2, arcLength: i + 0.2 },
      { x: Number.NaN, y: Number.NaN, theta: i + 0.3, arcLength: i + 0.3 },
    );
  }
  const hitSegments = [
    [406, 332, 440, 390],
    [548, 484, 592, 536],
    [688, 344, 732, 404],
  ];
  for (let i = 0; i < hitSegments.length; i += 1) {
    const [x1, y1, x2, y2] = hitSegments[i]!;
    hitNeedles.push(
      { x: x1, y: y1, theta: i, arcLength: i },
      { x: x2, y: y2, theta: i + 0.2, arcLength: i + 0.2 },
      { x: Number.NaN, y: Number.NaN, theta: i + 0.3, arcLength: i + 0.3 },
    );
  }
  return {
    coordinateSystem: 'canvas',
    paths: [
      { points: grid, opacity: 0.46, strokeWidth: 0.78 },
      { points: dimNeedles, opacity: 0.56, strokeWidth: 0.85 },
      { points: hitNeedles, opacity: 0.92, strokeWidth: 1.1 },
    ],
  };
}
