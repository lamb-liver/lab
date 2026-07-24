import { defaultsFromSchema } from '../../defaults';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import type { CurveModule, ParamSchema } from '../../types';
import { PARAM_LERP } from './animation';
import { sampleComplexArithmeticGeometryThumbnail } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'r1', label: 'Z₁ 模長 r₁', min: 0.5, max: 2, step: 0.05, default: 1.2 },
  { key: 'theta1', label: 'Z₁ 幅角 θ₁', min: 0, max: Math.PI * 2, step: 0.01, default: 0.5 },
  { key: 'r2', label: 'Z₂ 模長 r₂', min: 0.5, max: 2, step: 0.05, default: 1 },
  { key: 'theta2', label: 'Z₂ 幅角 θ₂', min: 0, max: Math.PI * 2, step: 0.01, default: 1.2 },
];

export const complexArithmeticGeometryModule: CurveModule = {
  id: 'complex-arithmetic-geometry',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    if (purpose === 'thumbnail') {
      return sampleComplexArithmeticGeometryThumbnail(
        params.r1,
        params.theta1,
        params.r2,
        params.theta2,
      );
    }
    return sampleComplexArithmeticGeometryThumbnail(
      params.r1,
      params.theta1,
      params.r2,
      params.theta2,
    ).paths[1]?.points ?? [];
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '複數四則運算',
      formula: 'z₁ + z₂ · z₁ × z₂',
      stats: [
        { key: 'r1', label: 'r₁', value: smooth.r1.toFixed(2) },
        {
          key: 't1',
          label: 'θ₁',
          value: `${(smooth.theta1 / Math.PI).toFixed(2)}π`,
        },
        { key: 'r2', label: 'r₂', value: smooth.r2.toFixed(2) },
        {
          key: 't2',
          label: 'θ₂',
          value: `${(smooth.theta2 / Math.PI).toFixed(2)}π`,
        },
      ],
    };
  },
  animation: { lerp: PARAM_LERP, revealSpeed: 0 },
};
