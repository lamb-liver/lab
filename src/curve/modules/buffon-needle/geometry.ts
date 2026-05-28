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
  const points: CurvePoint[] = [
    { x: 130, y: 430, theta: 0, arcLength: 0 },
    { x: 690, y: 430, theta: 1, arcLength: 1 },
    { x: Number.NaN, y: Number.NaN, theta: 2, arcLength: 2 },
    { x: 130, y: 530, theta: 3, arcLength: 3 },
    { x: 690, y: 530, theta: 4, arcLength: 4 },
    { x: Number.NaN, y: Number.NaN, theta: 5, arcLength: 5 },
    { x: 220, y: 465, theta: 6, arcLength: 6 },
    { x: 280, y: 505, theta: 7, arcLength: 7 },
  ];
  return { coordinateSystem: 'canvas', paths: [{ points, opacity: 0.8, strokeWidth: 0.9 }] };
}
