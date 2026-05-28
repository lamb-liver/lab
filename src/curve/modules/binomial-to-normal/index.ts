import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { MODE_X, buildBinormalThumbnail, deriveBinormalData, modeFromValue, percent } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'n', label: 'n', min: 5, max: 120, step: 1, default: 24 },
  { key: 'p', label: 'p %', min: 5, max: 95, step: 1, default: 50 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_X,
};

export const binomialToNormalModule: CurveModule = {
  id: 'binomial-to-normal',
  paramSchema,
  defaultParams,
  sample: () => buildBinormalThumbnail(),
  getMetadata: (params, runtime): CurveMetadata => {
    const data = deriveBinormalData(params);
    return {
      title: '二項分佈到常態分佈',
      formula: 'X ~ B(n,p), X ≈ N(np, np(1-p))',
      stats: [
        { key: 'mode', label: 'mode', value: modeFromValue(params.mode) },
        { key: 'n', label: 'n', value: data.n },
        { key: 'p', label: 'p', value: percent(data.p) },
        { key: 'mu', label: 'mu', value: data.mu.toFixed(2) },
        { key: 'sigma', label: 'sigma', value: data.sigma.toFixed(2) },
        { key: 'reveal', label: 'reveal', value: runtime ? `${runtime.revealPct}%` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.025, revealSpeed: 0.025 },
};

export { MODE_SIM, MODE_X, MODE_Z } from './geometry';
