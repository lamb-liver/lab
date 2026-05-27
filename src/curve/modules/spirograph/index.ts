import { defaultsFromSchema } from '../../defaults';
import { MAX_SAMPLE_POINTS } from '../../constants';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { spirographRenderPreset } from '../../../systems/rendering/presets';

const SAMPLE_STEP = 0.02;
const REVEAL_SPEED = 0.0015;
const MORPH_LERP = 0.08;

const paramSchema: ParamSchema = [
  { key: 'R', label: '大圓 R', min: 50, max: 250, step: 1, default: 150 },
  { key: 'r', label: '小圓 r', min: 10, max: 150, step: 1, default: 52 },
  { key: 'd', label: '筆尖 d', min: 0, max: 200, step: 1, default: 70 },
];

function getGCD(a: number, b: number): number {
  const x = Math.round(a);
  const y = Math.round(b);
  return y === 0 ? x : getGCD(y, x % y);
}

function effectiveStep(maxT: number, requestedStep: number): number {
  const estimated = maxT / requestedStep;
  if (estimated <= MAX_SAMPLE_POINTS) return requestedStep;
  return maxT / MAX_SAMPLE_POINTS;
}

function sampleSpirograph(params: ParamValues, step: number): CurvePoint[] {
  const R = Math.round(params.R);
  const r = Math.round(params.r);
  const d = params.d;
  if (r <= 0 || step <= 0) return [];

  const gcdValue = getGCD(R, r);
  if (gcdValue <= 0) return [];

  const maxT = Math.PI * 2 * (r / gcdValue);
  const ratio = (R - r) / r;
  const dt = effectiveStep(maxT, step);

  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let t = 0; t <= maxT + dt; t += dt) {
    const x = (R - r) * Math.cos(t) + d * Math.cos(ratio * t);
    const y = (R - r) * Math.sin(t) - d * Math.sin(ratio * t);

    if (points.length > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }

    points.push({ x, y, theta: t, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}

export const spirographModule: CurveModule = {
  id: 'spirograph',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    const points = sampleSpirograph(params, step);
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
      title: '繁花曲線',
      formula:
        'x = (R-r)cos(t) + d·cos((R-r)t/r), y = (R-r)sin(t) - d·sin((R-r)t/r)',
      stats: [
        { key: 'R', label: 'R', value: Math.round(params.R) },
        { key: 'r', label: 'r', value: Math.round(params.r) },
        { key: 'd', label: 'd', value: smooth.d.toFixed(1) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  renderPreset: spirographRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: SAMPLE_STEP,
  animation: { lerp: MORPH_LERP, revealSpeed: REVEAL_SPEED },
};

export { MORPH_LERP, REVEAL_SPEED, SAMPLE_STEP };
