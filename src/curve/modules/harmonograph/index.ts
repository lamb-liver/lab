import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';
import { harmonographRenderPreset } from '../../../systems/rendering/presets';

const AMPLITUDE = 250;
const MAX_T = Math.PI * 10;
const SAMPLE_STEP = 0.01;
/** 衰減後振幅低於此值（px）時不再採樣 */
const AMP_FLOOR = 1;
const REVEAL_SPEED = 0.0015;
const MORPH_LERP = 0.08;

const paramSchema: ParamSchema = [
  { key: 'a', label: '頻率 a', min: 1, max: 10, step: 1, default: 3 },
  { key: 'b', label: '頻率 b', min: 1, max: 10, step: 1, default: 2 },
];

function maxTHarmonograph(d: number): number {
  if (d <= 0) return MAX_T;
  return Math.min(MAX_T, -Math.log(AMP_FLOOR / AMPLITUDE) / d);
}

function sampleHarmonograph(params: ParamValues, step: number): CurvePoint[] {
  const a = Math.round(params.a);
  const b = Math.round(params.b);
  if (a <= 0 || b <= 0 || step <= 0) return [];

  const delta = params.delta ?? 0;
  const d = Math.max(0, params.d ?? 0);
  const tMax = maxTHarmonograph(d);
  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let t = 0; t <= tMax; t += step) {
    const decay = Math.exp(-d * t);
    const x = AMPLITUDE * Math.sin(a * t + delta) * decay;
    const y = AMPLITUDE * Math.sin(b * t) * decay;

    if (points.length > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }

    points.push({ x, y, theta: t, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}

export const harmonographModule: CurveModule = {
  id: 'harmonograph',
  paramSchema,
  defaultParams: {
    ...defaultsFromSchema(paramSchema),
    delta: Math.PI / 2,
    d: 0.015,
  },
  sample: (params, { step, purpose }) => {
    const points = sampleHarmonograph(params, step);
    if (purpose === 'thumbnail') {
      const spec: ThumbnailSpec = {
        paths: [{ points }],
      };
      return spec;
    }
    return points;
  },
  getMetadata: (params, runtime) => {
    const smooth = runtime?.smoothParams ?? params;
    return {
      title: '諧振圖',
      formula: 'x = A sin(at + δ)e^(-dt), y = B sin(bt)e^(-dt)',
      stats: [
        { key: 'a', label: 'a', value: Math.round(params.a) },
        { key: 'b', label: 'b', value: Math.round(params.b) },
        { key: 'delta', label: 'δ', value: smooth.delta.toFixed(2) },
        { key: 'd', label: 'd', value: smooth.d.toFixed(3) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  renderPreset: harmonographRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: SAMPLE_STEP,
  animation: { lerp: MORPH_LERP, revealSpeed: REVEAL_SPEED },
};

export { MORPH_LERP, REVEAL_SPEED, SAMPLE_STEP };
