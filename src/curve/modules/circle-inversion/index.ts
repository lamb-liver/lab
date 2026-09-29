import type { CurveModule, CurvePoint, ParamSchema, ThumbnailSpec } from '../../types';
import {
  DEFAULT_CIRCLE_INVERSION,
  VIEW,
  invertCircle,
  invertLine,
  lineChord,
  type CircleInversionParams,
  type InversionImage,
  type Vec,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'radius', label: '反演圓半徑 R', min: 0.7, max: 1.6, step: 0.01, default: 1 },
];

const SCALE = 90;

function toPoint(p: Vec, arc = 0): CurvePoint {
  return { x: p.x * SCALE, y: p.y * SCALE, theta: arc, arcLength: arc };
}

function circlePoints(center: Vec, radius: number): CurvePoint[] {
  const steps = 72;
  const points: CurvePoint[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * Math.PI * 2;
    const p = { x: center.x + Math.cos(a) * radius, y: center.y + Math.sin(a) * radius };
    if (Math.abs(p.x) > VIEW || Math.abs(p.y) > VIEW) continue;
    points.push(toPoint(p, i));
  }
  return points;
}

function imagePoints(image: InversionImage | null): CurvePoint[] {
  if (!image) return [];
  if (image.kind === 'circle') return circlePoints(image.center, image.radius);
  const chord = lineChord(image);
  if (!chord) return [];
  return [toPoint(chord[0]), toPoint(chord[1], 1)];
}

export function sampleCircleInversion(params: CircleInversionParams): ThumbnailSpec {
  const line = invertLine({ x: params.ax, y: params.ay }, { x: params.bx, y: params.by }, params.radius);
  const circle = invertCircle({ x: params.cx, y: params.cy }, params.rho, params.radius);
  return {
    paths: [
      { points: circlePoints({ x: 0, y: 0 }, params.radius), stroke: '#ffffff', strokeWidth: 0.8, opacity: 0.45 },
      { points: imagePoints(line), stroke: '#ffffff', strokeWidth: 1.2 },
      { points: imagePoints(circle), stroke: '#ffffff', strokeWidth: 1.2 },
      {
        points: imagePoints({
          kind: 'line',
          point: { x: params.ax, y: params.ay },
          direction: unit(params.bx - params.ax, params.by - params.ay),
        }),
        stroke: '#d4b87a',
        strokeWidth: 1.4,
      },
      { points: circlePoints({ x: params.cx, y: params.cy }, params.rho), stroke: '#d4b87a', strokeWidth: 1.4 },
    ],
  };
}

function imageKind(image: InversionImage | null): string {
  if (!image) return '未定義';
  return image.kind === 'circle' ? '圓' : '直線';
}

function unit(x: number, y: number): Vec {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

export function circleInversionFromParams(values: Partial<CircleInversionParams>): CircleInversionParams {
  return { ...DEFAULT_CIRCLE_INVERSION, ...values };
}

export const circleInversionModule: CurveModule = {
  id: 'circle-inversion',
  paramSchema,
  defaultParams: { ...DEFAULT_CIRCLE_INVERSION },
  sample: (params) => sampleCircleInversion(circleInversionFromParams(params)),
  getMetadata: (params) => {
    const next = circleInversionFromParams(params);
    const line = invertLine({ x: next.ax, y: next.ay }, { x: next.bx, y: next.by }, next.radius);
    const circle = invertCircle({ x: next.cx, y: next.cy }, next.rho, next.radius);
    return {
      title: '圓反演',
      formula: "P' = R^2 P / |P|^2",
      stats: [
        { key: 'r', label: 'R', value: next.radius.toFixed(2) },
        { key: 'line', label: '直線的像', value: imageKind(line) },
        { key: 'circle', label: '圓的像', value: imageKind(circle) },
      ],
    };
  },
};
