import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  RATIONAL_ASYMPTOTE_PARAM_META,
  RATIONAL_ASYMPTOTE_PRESETS,
  buildRationalAsymptoteModel,
  buildRationalAsymptoteThumbnail,
  fmt,
  paramsFromValues,
  presetById,
  valuesFromParams,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'preset', label: '預設模式', min: 0, max: RATIONAL_ASYMPTOTE_PRESETS.length - 1, step: 1, default: 0 },
  ...Object.entries(RATIONAL_ASYMPTOTE_PARAM_META).map(([key, meta]) => ({
    key,
    label: meta.label,
    min: meta.min,
    max: meta.max,
    step: meta.step,
    default: RATIONAL_ASYMPTOTE_PRESETS[0]!.params[key as keyof typeof RATIONAL_ASYMPTOTE_PRESETS[number]['params']],
  })),
];

export const rationalVerticalHorizontalAsymptotesModule: CurveModule = {
  id: 'rational-vertical-horizontal-asymptotes',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    const full = paramsFromValues(params);
    const thumbnail = buildRationalAsymptoteThumbnail(full.presetId, full.params);
    if (purpose === 'thumbnail') return thumbnail;
    return thumbnail.paths[0]?.points ?? [];
  },
  getMetadata: (params: ParamValues) => {
    const full = paramsFromValues(params);
    const preset = presetById(full.presetId);
    const model = buildRationalAsymptoteModel(preset, full.params);
    const zeros = model.zeros.length ? model.zeros.map((zero) => `x=${fmt(zero)}`).join('，') : '無';
    const verticals = model.verticals.length ? model.verticals.map((vertical) => `x=${fmt(vertical)}`).join('，') : '無';

    return {
      title: '垂直與水平漸近線',
      formula: model.expression,
      stats: [
        { key: 'mode', label: '狀態', value: model.family },
        { key: 'zero', label: '零點', value: zeros },
        { key: 'vertical', label: '垂直漸近線', value: verticals },
        { key: 'horizontal', label: '水平漸近線', value: model.horizontal.exists ? `y=${fmt(model.horizontal.value)}` : '無' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.12, revealSpeed: 0 },
};

export {
  RATIONAL_ASYMPTOTE_CONFIG,
  RATIONAL_ASYMPTOTE_PARAM_META,
  RATIONAL_ASYMPTOTE_PRESETS,
  buildCurveSegments,
  buildRationalAsymptoteModel,
  buildRationalAsymptoteThumbnail,
  clamp,
  createRationalAsymptotePlotRect,
  fmt,
  paramsFromValues,
  presetById,
  presetIdFromIndex,
  presetIndexFromId,
  valuesFromParams,
  xToScreen,
  yToScreen,
  yToScreenClamped,
  type GraphRect,
  type RationalAsymptoteModel,
  type RationalAsymptoteParamKey,
  type RationalAsymptoteParams,
  type RationalAsymptotePreset,
  type RationalAsymptotePresetId,
} from './geometry';
