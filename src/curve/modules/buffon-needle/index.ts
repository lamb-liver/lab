import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { buildBuffonThumbnail, deriveBuffonData } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'l', label: '針長 ℓ', min: 20, max: 100, step: 1, default: 70 },
  { key: 'd', label: '線距 d', min: 60, max: 140, step: 1, default: 100 },
  { key: 'speed', label: '每幀投擲數', min: 1, max: 80, step: 1, default: 12 },
];

const defaultParams: ParamValues = defaultsFromSchema(paramSchema);

export const buffonNeedleModule: CurveModule = {
  id: 'buffon-needle',
  paramSchema,
  defaultParams,
  sample: () => buildBuffonThumbnail(),
  getMetadata: (params, runtime): CurveMetadata => {
    const data = deriveBuffonData(params);
    return {
      title: '蒲豐投針',
      formula: 'P(hit) = 2l / (pi d)',
      stats: [
        { key: 'l', label: 'ℓ', value: data.l },
        { key: 'd', label: 'd', value: data.d },
        { key: 'speed', label: '速度', value: data.speed },
        { key: 'theory', label: 'P(相交)', value: data.theoreticalP.toFixed(4) },
        { key: 'reveal', label: 'reveal', value: runtime ? `${runtime.revealPct}%` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.025, revealSpeed: 0.025 },
};
