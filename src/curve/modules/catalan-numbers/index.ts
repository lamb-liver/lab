import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  MODE_PATH,
  buildCatalanNumbers,
  buildCatalanThumbnail,
  modeFromValue,
  normalizeN,
} from './geometry';

const paramSchema: ParamSchema = [{ key: 'n', label: '階數 n', min: 1, max: 9, step: 1, default: 4 }];

const MODE_LABELS: Record<ReturnType<typeof modeFromValue>, string> = {
  path: 'Dyck 路徑',
  paren: '括號',
  triangulation: '三角剖分',
};

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_PATH,
};

export const catalanNumbersModule: CurveModule = {
  id: 'catalan-numbers',
  paramSchema,
  defaultParams,
  sample: (params) => buildCatalanThumbnail(params),
  getMetadata: (params, runtime): CurveMetadata => {
    const n = normalizeN(params.n);
    const catalan = buildCatalanNumbers(10);
    return {
      title: '卡特蘭數',
      formula: 'C_n = 1/(n+1) * C(2n,n)',
      stats: [
        { key: 'n', label: 'n', value: n },
        { key: 'mode', label: '模式', value: MODE_LABELS[modeFromValue(params.mode)] },
        { key: 'catalan', label: `C_${n}`, value: catalan[n] ?? 0 },
        { key: 'reveal', label: 'reveal', value: runtime ? `${runtime.revealPct}%` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.035, revealSpeed: 0.035 },
};

export { MODE_PAREN, MODE_PATH, MODE_TRIANGULATION } from './geometry';
