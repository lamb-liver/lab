import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { RATIO_LERP, REVEAL_SPEED } from './animation';
import { sampleConicEnvelopeOutline } from './geometry';

const paramSchema: ParamSchema = [
  {
    key: 'lineDensity',
    label: '直線密度',
    min: 10,
    max: 100,
    step: 1,
    default: 40,
  },
  {
    key: 'deformationRatio',
    label: '變形比例',
    min: 0.3,
    max: 2.5,
    step: 0.05,
    default: 1,
  },
  {
    key: 'timeSpeed',
    label: '時間速度 ω',
    min: 0.005,
    max: 0.06,
    step: 0.005,
    default: 0.02,
  },
];

export const conicEnvelopeModule: CurveModule = {
  id: 'conic-envelope',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step }) =>
    sampleConicEnvelopeOutline(params.deformationRatio, step),
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '二次曲線包絡',
      formula: 'x/x_A + y/y_B = 1',
      stats: [
        { key: 'density', label: 'lines', value: Math.round(params.lineDensity) },
        {
          key: 'ratio',
          label: 'ratio',
          value: smooth.deformationRatio.toFixed(2),
        },
        { key: 'omega', label: 'ω', value: params.timeSpeed.toFixed(3) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  sampleStep: 4,
  animation: { lerp: RATIO_LERP, revealSpeed: REVEAL_SPEED },
};

export { REVEAL_SPEED } from './animation';
