import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { MODE_SQUARE, buildBinomialThumbnail, modeFromValue, normalizeLen } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'a', label: '邊長 a', min: 1, max: 10, step: 1, default: 4 },
  { key: 'b', label: '邊長 b', min: 1, max: 10, step: 1, default: 3 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_SQUARE,
};

export const binomialExpansionGeometryModule: CurveModule = {
  id: 'binomial-expansion-geometry',
  paramSchema,
  defaultParams,
  sample: (params) => buildBinomialThumbnail(params),
  getMetadata: (params, runtime): CurveMetadata => {
    const a = normalizeLen(params.a);
    const b = normalizeLen(params.b);
    const mode = modeFromValue(params.mode);
    return {
      title: '二項式展開的幾何意義',
      formula: mode === 'square' ? '(a+b)^2 = a^2 + 2ab + b^2' : '(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3',
      stats: [
        { key: 'mode', label: '模式', value: mode === 'square' ? '平方' : '立方' },
        { key: 'a', label: 'a', value: a },
        { key: 'b', label: 'b', value: b },
        { key: 'sum', label: 'a+b', value: a + b },
        { key: 'power', label: '(a+b)ⁿ', value: mode === 'square' ? (a + b) ** 2 : (a + b) ** 3 },
        { key: 'reveal', label: 'reveal', value: runtime ? `${runtime.revealPct}%` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.05, revealSpeed: 0.05 },
};

export { MODE_CUBE, MODE_SQUARE } from './geometry';
