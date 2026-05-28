import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  MODE_SINGLE,
  buildCombinatorialThumbnail,
  buildPathCounts,
  choose,
  modeFromValue,
  normalizeSize,
} from './geometry';

export const COMBINATORIAL_PATH_SPEED = 0.035;

const paramSchema: ParamSchema = [
  { key: 'm', label: 'm / right steps', min: 2, max: 9, step: 1, default: 5 },
  { key: 'n', label: 'n / up steps', min: 2, max: 9, step: 1, default: 4 },
];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_SINGLE,
};

export const combinatorialPathCountingModule: CurveModule = {
  id: 'combinatorial-path-counting',
  paramSchema,
  defaultParams,
  sample: (params) => buildCombinatorialThumbnail(params),
  getMetadata: (params, runtime): CurveMetadata => {
    const m = normalizeSize(params.m);
    const n = normalizeSize(params.n);
    const counts = buildPathCounts(m, n);
    const total = choose(m + n, m);
    return {
      title: '組合的路徑計數',
      formula: 'N(m,n) = C(m+n,m)',
      stats: [
        { key: 'grid', label: 'grid', value: `${m}x${n}` },
        { key: 'mode', label: 'mode', value: modeFromValue(params.mode) },
        { key: 'total', label: 'paths', value: total },
        { key: 'target', label: 'P(m,n)', value: counts[m]![n]! },
        { key: 'pascal', label: 'pascal', value: `row ${m + n}, entry ${m}` },
        { key: 'reveal', label: 'reveal', value: runtime ? `${runtime.revealPct}%` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: COMBINATORIAL_PATH_SPEED, revealSpeed: COMBINATORIAL_PATH_SPEED },
};

export { MODE_COUNT, MODE_OVERLAY, MODE_SINGLE } from './geometry';
