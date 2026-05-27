import { defaultsFromSchema } from '../../defaults';
import { BASE_POINT_STEP } from '../../constants';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { roseRenderPreset } from '../../../systems/rendering/presets';

const MAX_RADIUS = 210;
const K_LERP = 0.08;
const REVEAL_SPEED = 0.0024;

const paramSchema: ParamSchema = [
  { key: 'k', label: '花瓣數 k', min: 1, max: 12, step: 1, default: 6 },
];

/** 完整採樣週期：奇數 k → π，偶數 k → 2π（依整數 k，非 geometric normalize） */
export function getTotalAngle(k: number): number {
  const kInt = Math.round(k);
  return kInt % 2 === 1 ? Math.PI : 2 * Math.PI;
}

function getPetalCount(k: number): number {
  const rounded = Math.round(k);
  return rounded % 2 === 0 ? rounded * 2 : rounded;
}

function roseRadius(kInt: number, theta: number): number {
  return Math.cos(kInt * theta) * MAX_RADIUS;
}

function sampleRose(params: ParamValues, step: number): CurvePoint[] {
  const k = Math.round(params.k);
  if (k <= 0 || step <= 0) return [];

  const totalAngle = getTotalAngle(k);
  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let theta = 0; theta <= totalAngle; theta += step) {
    const r = roseRadius(k, theta);
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    if (points.length > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }

    points.push({ x, y, theta, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}

export const roseModule: CurveModule = {
  id: 'rose',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    const points = sampleRose(params, step);
    if (purpose === 'thumbnail') {
      const spec: ThumbnailSpec = {
        paths: [{ points, closed: true }],
      };
      return spec;
    }
    return points;
  },
  getMetadata: (params, runtime) => {
    const smooth = runtime?.smoothParams ?? params;
    const k = smooth.k ?? params.k;
    return {
      title: '玫瑰曲線',
      formula: 'r = cos(kθ)',
      stats: [
        { key: 'k', label: 'k', value: k.toFixed(2) },
        { key: 'petals', label: 'petals', value: getPetalCount(Math.round(k)) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  renderPreset: roseRenderPreset,
  cacheStrategy: { kind: 'integerBlend', paramKey: 'k' },
  sampleStep: BASE_POINT_STEP,
  animation: { lerp: K_LERP, revealSpeed: REVEAL_SPEED },
};
