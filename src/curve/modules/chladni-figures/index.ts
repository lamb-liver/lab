import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ThumbnailSpec } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { buildPointCloudStroke } from '../../thumbnailPointCloud';
import { MODE_LERP, REVEAL_SPEED } from './animation';
import { sampleChladniNodalLines, sampleChladniParticleCloud } from './geometry';

const THUMBNAIL_PARTICLE_COUNT = 2200;
const THUMBNAIL_ITERATIONS = 700;

const paramSchema: ParamSchema = [
  { key: 'modeM', label: '模態 m', min: 1, max: 10, step: 1, default: 3 },
  { key: 'modeN', label: '模態 n', min: 1, max: 10, step: 1, default: 2 },
  {
    key: 'vibrationSpeed',
    label: '振動速度 ω',
    min: 0.01,
    max: 0.1,
    step: 0.005,
    default: 0.05,
  },
];

export const chladniFiguresModule: CurveModule = {
  id: 'chladni-figures',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    const m = Math.round(params.modeM);
    const n = Math.round(params.modeN);
    if (purpose === 'thumbnail') {
      const points = sampleChladniParticleCloud(
        m,
        n,
        THUMBNAIL_PARTICLE_COUNT,
        THUMBNAIL_ITERATIONS,
      );
      const spec: ThumbnailSpec = {
        paths: [{ points: buildPointCloudStroke(points, { epsilon: 0.35 }), strokeWidth: 0.9 }],
      };
      return spec;
    }
    return sampleChladniNodalLines(m, n, step);
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '克拉尼圖形',
      formula: 'Z = sin(mx)sin(ny) − sin(nx)sin(my)',
      stats: [
        { key: 'm', label: 'm', value: Math.round(smooth.modeM) },
        { key: 'n', label: 'n', value: Math.round(smooth.modeN) },
        { key: 'omega', label: 'ω', value: params.vibrationSpeed.toFixed(3) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  sampleStep: 4,
  animation: { lerp: MODE_LERP, revealSpeed: REVEAL_SPEED },
};

export { MODE_LERP, REVEAL_SPEED } from './animation';
