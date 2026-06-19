import { defaultsFromSchema } from '../../defaults';
import type { CurveModule, ParamSchema } from '../../types';
import { resolveSmoothParams } from '../../resolveSmoothParams';
import { PARAM_LERP } from './animation';
import { sampleComplexPhasePortraitThumbnail } from './geometry';

const paramSchema: ParamSchema = [
  { key: 'ampA', label: '振幅 A', min: 0.5, max: 2, step: 0.05, default: 1.2 },
  { key: 'freqB', label: '頻率 B', min: 1, max: 6, step: 1, default: 3 },
  { key: 'phase', label: '相位 δ', min: 0, max: Math.PI * 2, step: 0.01, default: 0 },
];

export const complexPhasePortraitModule: CurveModule = {
  id: 'complex-phase-portrait',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { purpose }) => {
    const spec = sampleComplexPhasePortraitThumbnail(
      params.ampA,
      params.freqB,
      params.phase,
    );
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params, runtime) => {
    const smooth = resolveSmoothParams(params, runtime);
    return {
      title: '相位圖',
      formula: 'R(t) = P_A(t) + P_B(t)',
      stats: [
        { key: 'A', label: 'A', value: params.ampA.toFixed(2) },
        { key: 'b', label: 'b', value: Math.round(params.freqB).toString() },
        {
          key: 'delta',
          label: 'δ',
          value: `${((smooth.phase ?? params.phase) / Math.PI).toFixed(2)}π`,
        },
      ],
    };
  },
  animation: { lerp: PARAM_LERP, revealSpeed: 0 },
};

export { PARAM_LERP, TIME_SPEED } from './animation';

export function measureComplexPhasePortraitCanvas(host: HTMLElement): {
  width: number;
  height: number;
} {
  const w = host.clientWidth;
  const width = w > 0 ? Math.min(w, 720) : 720;
  const clamped = Math.max(280, width);
  return { width: clamped, height: clamped };
}
