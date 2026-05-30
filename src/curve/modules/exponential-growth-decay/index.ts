import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  MODE_DECAY,
  MODE_GROWTH,
  EXP_REVEAL_SPEED,
  buildExponentialThumbnail,
  deriveExponentialState,
  exponentialModeFromValue,
} from './geometry';

const paramSchema: ParamSchema = [
  { key: 'c', label: '初始值 C', min: 0.5, max: 5, step: 0.05, default: 1.4 },
  { key: 'kAbs', label: '速率 |k|', min: 0.05, max: 1, step: 0.01, default: 0.32 },
  { key: 'tNorm', label: '切線位置 t/tmax', min: 0, max: 1, step: 0.01, default: 0.42 },
];

const MODE_LABELS: Record<ReturnType<typeof exponentialModeFromValue>, string> = {
  growth: '成長',
  decay: '衰減',
};

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  mode: MODE_GROWTH,
  logScale: 0,
  tangentMode: 0,
};

export const exponentialGrowthDecayModule: CurveModule = {
  id: 'exponential-growth-decay',
  paramSchema,
  defaultParams,
  sample: () => buildExponentialThumbnail(),
  getMetadata: (params, runtime): CurveMetadata => {
    const data = deriveExponentialState(params);
    const mode = exponentialModeFromValue(params.mode);
    const tLabel = mode === 'growth' ? '倍增 T₊' : '半衰期 T₁/₂';
    const kDisplay = mode === 'growth' ? data.kAbs : -data.kAbs;

    const stats = data.tangentMode
      ? [{ key: 'k', label: '速率 k', value: kDisplay.toFixed(2) }]
      : [
          { key: 'mode', label: '模式', value: MODE_LABELS[mode] },
          { key: 'k', label: '速率 k', value: kDisplay.toFixed(2) },
        ];

    if (data.tangentMode) {
      stats.push(
        { key: 't0', label: '切點 t₀', value: data.t0.toFixed(2) },
        { key: 'slope', label: '斜率 dy/dt', value: data.slope.toFixed(2) },
        {
          key: 'reveal',
          label: 'reveal',
          value: runtime ? `${runtime.revealPct}%` : '—',
        },
      );
    } else {
      stats.push({ key: 'T', label: tLabel, value: data.halfLife.toFixed(2) });
      stats.push({
        key: 'reveal',
        label: 'reveal',
        value: runtime ? `${runtime.revealPct}%` : '—',
      });
    }

    return {
      title: '指數成長與衰減',
      formula: data.logScale ? 'ln y = ln C + kt' : 'y(t) = C e^{kt}',
      stats,
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.025, revealSpeed: EXP_REVEAL_SPEED },
};

export {
  MODE_DECAY,
  MODE_GROWTH,
  EXP_REVEAL_SPEED,
} from './geometry';
