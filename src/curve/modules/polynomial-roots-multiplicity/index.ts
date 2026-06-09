import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  LEAD_A_MAX,
  LEAD_A_MIN,
  ROOT_LABELS,
  ROOT_MAX,
  ROOT_MIN,
} from './constants';
import {
  buildPolynomialRootsMultiplicityThumbnail,
  asPolynomialRootsMultiplicityParams,
  fmt,
  polynomialMeta,
  positiveIntervalText,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'a', label: '最高係數 a', min: LEAD_A_MIN, max: LEAD_A_MAX, step: 0.05, default: 0.35 },
  { key: 'root0', label: `零點 ${ROOT_LABELS[0]}`, min: ROOT_MIN, max: ROOT_MAX, step: 0.05, default: -2.4 },
  { key: 'root1', label: `零點 ${ROOT_LABELS[1]}`, min: ROOT_MIN, max: ROOT_MAX, step: 0.05, default: 0.1 },
  { key: 'root2', label: `零點 ${ROOT_LABELS[2]}`, min: ROOT_MIN, max: ROOT_MAX, step: 0.05, default: 2.2 },
];

const sliderDefaults = defaultsFromSchema(paramSchema);

export const polynomialRootsMultiplicityModule: CurveModule = {
  id: 'polynomial-roots-multiplicity',
  paramSchema,
  defaultParams: {
    ...sliderDefaults,
    advanced: 0,
    mult0: 1,
    mult1: 2,
    mult2: 1,
  },
  sample: (_params, { purpose }) => {
    if (purpose === 'thumbnail') return buildPolynomialRootsMultiplicityThumbnail();
    return buildPolynomialRootsMultiplicityThumbnail().paths[1]?.points ?? [];
  },
  getMetadata: (params) => {
    const full = asPolynomialRootsMultiplicityParams(params);
    const meta = polynomialMeta(full);

    return {
      title: '多項式零點與重根',
      formula: 'f(x)=a∏(x-rᵢ)^mᵢ',
      stats: [
        { key: 'a', label: 'a', value: fmt(full.a) },
        { key: 'degree', label: 'n', value: String(meta.degree) },
        {
          key: 'roots',
          label: 'r',
          value: `(${full.roots.map(fmt).join(', ')})`,
        },
        {
          key: 'mult',
          label: 'm',
          value: `(${full.mult.join(', ')})`,
        },
        {
          key: 'positive',
          label: '正區間',
          value: positiveIntervalText(meta.intervals, 1),
        },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.12, revealSpeed: 0 },
};

export {
  DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS,
  applyPreset,
  asPolynomialRootsMultiplicityParams,
  isPresetActive,
  paramsForMetadata,
  sanitizeA,
  type Multiplicity,
  type PolynomialRootsMultiplicityParams,
} from './geometry';
