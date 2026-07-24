import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  MODE_AREA,
  NAT_LOG_REVEAL_SPEED,
  buildNaturalLogThumbnail,
  deriveNaturalLogState,
  naturalLogModeFromValue,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 't', label: '終點 t', min: 0.25, max: 5, step: 0.01, default: 2.718 },
  { key: 'n', label: '分割數 n', min: 4, max: 80, step: 1, default: 24 },
];

const MODE_LABELS: Record<ReturnType<typeof naturalLogModeFromValue>, string> = {
  area: '面積',
  inverse: '反函數',
};

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_AREA,
  riemannMode: 0,
};

export const naturalLogEGeometryModule: CurveModule = {
  id: 'natural-log-e-geometry',
  paramSchema,
  defaultParams,
  sample: () => buildNaturalLogThumbnail(),
  getMetadata: (params, runtime): CurveMetadata => {
    const data = deriveNaturalLogState(params);
    const stats = [
      { key: 't', label: '終點 t', value: data.t.toFixed(3) },
    ];

    if (data.mode === 'area' && data.riemannMode) {
      stats.push(
        { key: 'n', label: '分割數 n', value: String(data.n) },
        { key: 'riemann', label: 'Σ_mid', value: data.riemannEstimate.toFixed(3) },
      );
    } else if (data.mode === 'area') {
      stats.unshift({ key: 'mode', label: 'mode', value: MODE_LABELS[data.mode] });
      stats.push({ key: 'lnT', label: 'ln t', value: data.lnT.toFixed(3) });
    } else {
      stats.unshift({ key: 'mode', label: 'mode', value: MODE_LABELS[data.mode] });
      stats.push({ key: 'lnT', label: 'ln t', value: data.lnT.toFixed(3) });
    }

    stats.push({
      key: 'reveal',
      label: 'reveal',
      value: runtime ? `${runtime.revealPct}%` : '—',
    });

    return {
      title: '自然對數 e 的幾何定義',
      formula: 'ln t = ∫₁ᵗ 1/x dx',
      stats,
    };
  },
  sampleStep: 1,
  animation: { lerp: 0.025, revealSpeed: NAT_LOG_REVEAL_SPEED },
};

export { MODE_AREA, MODE_INVERSE, NAT_LOG_REVEAL_SPEED } from './geometry';
