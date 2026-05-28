import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { buildBuffonThumbnail, deriveBuffonData } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'l', label: 'needle length l', min: 20, max: 100, step: 1, default: 70 },
  { key: 'd', label: 'line spacing d', min: 60, max: 140, step: 1, default: 100 },
  { key: 'speed', label: 'throws per frame', min: 1, max: 80, step: 1, default: 12 },
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
        { key: 'l', label: 'l', value: data.l },
        { key: 'd', label: 'd', value: data.d },
        { key: 'speed', label: 'speed', value: data.speed },
        { key: 'theory', label: 'P(hit)', value: data.theoreticalP.toFixed(4) },
        { key: 'reveal', label: 'reveal', value: runtime ? `${runtime.revealPct}%` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.025, revealSpeed: 0.025 },
};
