import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  RATIONAL_OBLIQUE_MODES,
  RATIONAL_OBLIQUE_PARAM_META,
  buildRationalObliqueModel,
  buildRationalObliqueThumbnail,
  modeById,
  paramsFromValues,
  rationalObliqueDefaultParams,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'mode', label: '模式', min: 0, max: RATIONAL_OBLIQUE_MODES.length - 1, step: 1, default: 0 },
  ...Object.entries(RATIONAL_OBLIQUE_PARAM_META).map(([key, meta]) => ({
    key,
    label: meta.label,
    min: meta.min,
    max: meta.max,
    step: meta.step,
    default: rationalObliqueDefaultParams[key as keyof typeof rationalObliqueDefaultParams],
  })),
];

export const rationalObliqueAsymptoteModule: CurveModule = {
  id: 'rational-oblique-asymptote',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    const full = paramsFromValues(params);
    const thumbnail = buildRationalObliqueThumbnail(full.modeId, full.params);
    if (purpose === 'thumbnail') return thumbnail;
    return thumbnail.paths[0]?.points ?? [];
  },
  getMetadata: (params: ParamValues) => {
    const full = paramsFromValues(params);
    const model = buildRationalObliqueModel(modeById(full.modeId), full.params);
    return {
      title: '斜漸近線與多項式除法',
      formula: model.expression,
      stats: [
        { key: 'mode', label: '狀態', value: model.family },
        { key: 'guide', label: model.guide.type === 'oblique' ? '斜漸近線' : '水平漸近線', value: model.guide.label },
        { key: 'vertical', label: '垂直漸近線', value: model.stats[1]?.replace('垂直漸近線：', '') ?? '—' },
        { key: 'remainder', label: '餘式項', value: model.remainder },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.12, revealSpeed: 0 },
};

export {
  RATIONAL_OBLIQUE_CONFIG,
  RATIONAL_OBLIQUE_MODES,
  RATIONAL_OBLIQUE_PARAM_META,
  buildFunctionSegments,
  buildRationalObliqueModel,
  buildRationalObliqueThumbnail,
  clamp,
  createRationalObliquePlotRect,
  fmt,
  modeById,
  modeIdFromIndex,
  modeIndexFromId,
  paramsFromValues,
  rationalObliqueDefaultParams,
  rightEdgeLabelDataPoint,
  valuesFromParams,
  xToScreen,
  yToScreen,
  yToScreenClamped,
  type GraphRect,
  type RationalObliqueMode,
  type RationalObliqueModeId,
  type RationalObliqueModel,
  type RationalObliqueParamKey,
  type RationalObliqueParams,
} from './geometry';
