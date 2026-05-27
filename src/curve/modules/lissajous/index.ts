import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';

const AMPLITUDE = 220;
const TWO_PI = 2 * Math.PI;
const REVEAL_SPEED = 0.0018;
const DELTA_LERP = 0.06;

const paramSchema: ParamSchema = [
  { key: 'a', label: '頻率 a', min: 1, max: 10, step: 1, default: 3 },
  { key: 'b', label: '頻率 b', min: 1, max: 10, step: 1, default: 2 },
];

function sampleLissajous(params: ParamValues, step: number): CurvePoint[] {
  const a = Math.round(params.a);
  const b = Math.round(params.b);
  if (a <= 0 || b <= 0 || step <= 0) return [];

  const delta = params.delta ?? 0;
  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let t = 0; t <= TWO_PI; t += step) {
    const x = AMPLITUDE * Math.sin(a * t + delta);
    const y = AMPLITUDE * Math.sin(b * t);

    if (points.length > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }

    points.push({ x, y, theta: t, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}

export const lissajousModule: CurveModule = {
  id: 'lissajous',
  paramSchema,
  defaultParams: {
    ...defaultsFromSchema(paramSchema),
    delta: Math.PI / 2,
  },
  sample: (params, { step, purpose }) => {
    const points = sampleLissajous(params, step);
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
    return {
      title: '利薩茹曲線',
      formula: 'x = A sin(at + δ) · y = B sin(bt)',
      stats: [
        { key: 'a', label: 'a', value: Math.round(params.a) },
        { key: 'b', label: 'b', value: Math.round(params.b) },
        {
          key: 'delta',
          label: 'δ',
          value: smooth.delta.toFixed(2),
        },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 0.003,
  animation: { lerp: DELTA_LERP, revealSpeed: REVEAL_SPEED },
};

export { DELTA_LERP, REVEAL_SPEED, TWO_PI as LISSAJOUS_TWO_PI };
