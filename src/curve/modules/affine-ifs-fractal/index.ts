import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { buildPointCloudStroke } from '../../thumbnailPointCloud';
import { PARAM_LERP, REVEAL_SPEED, sampleAffineIfsFractalCurve } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'leafBend', label: '葉片彎曲 b', min: -0.15, max: 0.15, step: 0.01, default: 0.04 },
  {
    key: 'branchHeight',
    label: '側枝高度 d',
    min: 0.7,
    max: 0.93,
    step: 0.01,
    default: 0.85,
  },
  {
    key: 'generationSpeed',
    label: '生成速度 ω',
    min: 0.005,
    max: 0.06,
    step: 0.005,
    default: 0.02,
  },
];

export const affineIfsFractalModule: CurveModule = {
  id: 'affine-ifs-fractal',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    if (purpose === 'thumbnail') {
      const points = sampleAffineIfsFractalCurve(
        params.leafBend,
        params.branchHeight,
        6000,
        1,
      );
      const spec: ThumbnailSpec = {
        paths: [
          {
            points: buildPointCloudStroke(points, { flipY: true, epsilon: 0.35 }),
            strokeWidth: 0.9,
          },
        ],
      };
      return spec;
    }
    return sampleAffineIfsFractalCurve(
      params.leafBend,
      params.branchHeight,
      4000,
      Math.max(1, Math.round(step * 40)),
    );
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '碎形仿射疊代',
      formula: "x' = ax + by + tx",
      stats: [
        { key: 'b', label: 'b', value: smooth.leafBend.toFixed(2) },
        { key: 'd', label: 'd', value: smooth.branchHeight.toFixed(2) },
        { key: 'omega', label: 'ω', value: params.generationSpeed.toFixed(3) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  sampleStep: 2,
  animation: { lerp: PARAM_LERP, revealSpeed: REVEAL_SPEED },
};

export { PARAM_LERP, REVEAL_SPEED } from './geometry';
