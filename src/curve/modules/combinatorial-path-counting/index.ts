import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
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
  { key: 'm', label: '向右步數 m', min: 2, max: 9, step: 1, default: 5 },
  { key: 'n', label: '向上步數 n', min: 2, max: 9, step: 1, default: 4 },
];

const MODE_LABELS: Record<ReturnType<typeof modeFromValue>, string> = {
  single: '單一路徑',
  overlay: '路徑疊合',
  count: '計數場',
};

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_SINGLE,
};

export const combinatorialPathCountingModule: CurveModule = {
  id: 'combinatorial-path-counting',
  paramSchema,
  defaultParams,
  sample: (params) => buildCombinatorialThumbnail(params),
  getMetadata: (params): CurveMetadata => {
    const m = normalizeSize(params.m);
    const n = normalizeSize(params.n);
    const counts = buildPathCounts(m, n);
    const total = choose(m + n, m);
    return {
      title: '組合的路徑計數',
      formula: 'N(m,n) = C(m+n,m)',
      stats: [
        { key: 'grid', label: '格點', value: `${m}×${n}` },
        { key: 'mode', label: '模式', value: MODE_LABELS[modeFromValue(params.mode)] },
        { key: 'total', label: '路徑數', value: total },
        { key: 'target', label: 'P(m,n)', value: counts[m]![n]! },
      ],
    };
  },
  sampleStep: 1,
  animation: { lerp: COMBINATORIAL_PATH_SPEED, revealSpeed: COMBINATORIAL_PATH_SPEED },
};

export { MODE_COUNT, MODE_OVERLAY, MODE_SINGLE } from './geometry';
