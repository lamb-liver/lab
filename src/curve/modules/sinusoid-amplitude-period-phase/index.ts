import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  AMPLITUDE_MAX,
  AMPLITUDE_MIN,
  DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS,
  PERIOD_MAX,
  PERIOD_MIN,
  PHASE_MAX,
  PHASE_MIN,
  VERTICAL_SHIFT_MAX,
  VERTICAL_SHIFT_MIN,
  asSinusoidAmplitudePeriodPhaseParams,
  buildSinusoidCurvePoints,
  fmt,
  formatRad,
  sampleSinusoidAmplitudePeriodPhaseThumbnail,
  type SinusoidAmplitudePeriodPhaseParams,
} from './geometry';

const paramSchema: ParamSchema = [
  {
    key: 'amplitude',
    label: '垂直尺度 A',
    min: AMPLITUDE_MIN,
    max: AMPLITUDE_MAX,
    step: 0.01,
    default: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.amplitude,
  },
  {
    key: 'period',
    label: '週期 T',
    min: PERIOD_MIN,
    max: PERIOD_MAX,
    step: 0.01,
    default: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.period,
  },
  {
    key: 'phase',
    label: '相位位移 φ',
    min: PHASE_MIN,
    max: PHASE_MAX,
    step: 0.01,
    default: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.phase,
  },
  {
    key: 'verticalShift',
    label: '中心線 k',
    min: VERTICAL_SHIFT_MIN,
    max: VERTICAL_SHIFT_MAX,
    step: 0.01,
    default: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.verticalShift,
  },
];

export function asSinusoidAmplitudePeriodPhaseModuleParams(
  params: ParamValues | SinusoidAmplitudePeriodPhaseParams,
): SinusoidAmplitudePeriodPhaseParams {
  return asSinusoidAmplitudePeriodPhaseParams(
    params as Partial<SinusoidAmplitudePeriodPhaseParams> & Record<string, unknown>,
  );
}

export const sinusoidAmplitudePeriodPhaseModule: CurveModule = {
  id: 'sinusoid-amplitude-period-phase',
  paramSchema,
  defaultParams: {
    amplitude: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.amplitude,
    period: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.period,
    phase: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.phase,
    verticalShift: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.verticalShift,
    showGhost: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.showGhost ? 1 : 0,
    showGuides: DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS.showGuides ? 1 : 0,
  },
  sample: (params, { purpose }) => {
    const p = asSinusoidAmplitudePeriodPhaseModuleParams(params);
    if (purpose === 'thumbnail') return sampleSinusoidAmplitudePeriodPhaseThumbnail(p);
    return buildSinusoidCurvePoints(p);
  },
  getMetadata: (params) => {
    const p = asSinusoidAmplitudePeriodPhaseModuleParams(params);

    return {
      title: '正弦型函數的振幅、週期與相位',
      formula: 'y = A sin((2π/T)(x − φ)) + k',
      stats: [
        { key: 'amplitude', label: 'A', value: `${fmt(p.amplitude)}｜|A|=${fmt(Math.abs(p.amplitude))}` },
        { key: 'period', label: 'T', value: formatRad(p.period) },
        { key: 'phase', label: 'φ', value: formatRad(p.phase) },
        { key: 'verticalShift', label: 'k', value: fmt(p.verticalShift) },
      ],
    };
  },
};

export { DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS };
export type { SinusoidAmplitudePeriodPhaseParams } from './geometry';
