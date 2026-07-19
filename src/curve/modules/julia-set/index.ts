import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { JULIA_CFG } from './config';
import { sampleJuliaSetThumbnail } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'cx', label: 'c 實部 Re(c)', min: -1.2, max: 0.2, step: 0.001, default: -0.727 },
  { key: 'cy', label: 'c 虛部 Im(c)', min: -0.5, max: 0.5, step: 0.001, default: 0.189 },
  {
    key: 'maxIter',
    label: '最大疊代',
    min: 80,
    max: 220,
    step: 10,
    default: JULIA_CFG.MAX_ITER,
  },
];

export const juliaSetModule: CurveModule = {
  id: 'julia-set',
  paramSchema,
  defaultParams: { ...defaultsFromSchema(paramSchema), autoDrift: 0 },
  sample: (params, { purpose }) => {
    const cx = params.cx;
    const cy = params.cy;
    const maxIter = Math.round(params.maxIter);
    if (purpose === 'thumbnail') {
      return sampleJuliaSetThumbnail(cx, cy, maxIter);
    }
    return sampleJuliaSetThumbnail(cx, cy, maxIter).paths[0]?.points ?? [];
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    const cx = smooth.cx ?? params.cx;
    const cy = smooth.cy ?? params.cy;
    return {
      title: '朱利亞集合',
      formula: 'z_{n+1} = z_n^2 + c',
      stats: [
        {
          key: 'mode',
          label: 'mode',
          value: Math.round(params.autoDrift) === 1 ? 'drift' : 'manual',
        },
        { key: 'cx', label: 'Re(c)', value: cx.toFixed(4) },
        { key: 'cy', label: 'Im(c)', value: cy.toFixed(4) },
        { key: 'iter', label: 'iter', value: Math.round(params.maxIter) },
        {
          key: 'progress',
          label: 'render',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      ],
    };
  },
  animation: { lerp: JULIA_CFG.LERP_F, revealSpeed: 0 },
};
