import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { PARAM_LERP } from './animation';
import { sampleComplexPolarFormThumbnail } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'r', label: '模長 r', min: 0.3, max: 2.5, step: 0.05, default: 1.5 },
  { key: 'theta', label: '幅角 θ', min: 0, max: Math.PI * 2, step: 0.01, default: 0.9 },
];

export const complexPolarFormModule: CurveModule = {
  id: 'complex-polar-form',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    if (purpose === 'thumbnail') {
      return sampleComplexPolarFormThumbnail(params.r, params.theta);
    }
    return sampleComplexPolarFormThumbnail(params.r, params.theta).paths[1]?.points ?? [];
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    const zx = smooth.r * Math.cos(smooth.theta);
    const zy = smooth.r * Math.sin(smooth.theta);
    const im = zy >= 0 ? `+${zy.toFixed(3)}` : zy.toFixed(3);
    return {
      title: '複數極座標',
      formula: 'z = r · e^(iθ)',
      stats: [
        { key: 'r', label: 'r', value: smooth.r.toFixed(2) },
        {
          key: 'theta',
          label: 'θ',
          value: `${(smooth.theta / Math.PI).toFixed(3)}π`,
        },
        { key: 'z', label: 'z', value: `${zx.toFixed(3)}${im}i` },
      ],
    };
  },
  animation: { lerp: PARAM_LERP, revealSpeed: 0 },
};
