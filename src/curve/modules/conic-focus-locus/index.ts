import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { PARAM_LERP, REVEAL_SPEED } from './animation';
import { buildConicFocusLocusThumbnail, CURVE_DENSITY, sampleConicFocusLocusCurve } from './geometry';

const paramSchema: ParamSchema = [
  {
    key: 'semiMajorAxis',
    label: '半長軸 a',
    min: 60,
    max: 200,
    step: 1,
    default: 140,
  },
  {
    key: 'eccentricity',
    label: '離心率 e',
    min: 0.1,
    max: 0.95,
    step: 0.01,
    default: 0.6,
  },
  {
    key: 'orbitSpeed',
    label: '軌道速度 ω',
    min: 0.005,
    max: 0.06,
    step: 0.005,
    default: 0.02,
  },
];

export const conicFocusLocusModule: CurveModule = {
  id: 'conic-focus-locus',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose, step }) =>
    purpose === 'thumbnail'
      ? buildConicFocusLocusThumbnail(params.semiMajorAxis, params.eccentricity)
      : sampleConicFocusLocusCurve(
          params.semiMajorAxis,
          params.eccentricity,
          step,
        ),
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '焦點軌跡',
      formula: 'x = a cos(t), y = b sin(t), c = ae',
      stats: [
        { key: 'a', label: 'a', value: Math.round(smooth.semiMajorAxis) },
        { key: 'e', label: 'e', value: smooth.eccentricity.toFixed(2) },
        { key: 'omega', label: 'ω', value: params.orbitSpeed.toFixed(3) },
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
  sampleStep: CURVE_DENSITY,
  animation: { lerp: PARAM_LERP, revealSpeed: REVEAL_SPEED },
};

export { PARAM_LERP, REVEAL_SPEED } from './animation';
