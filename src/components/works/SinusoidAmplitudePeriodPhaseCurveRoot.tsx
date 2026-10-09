import { useState } from 'react';
import {
  DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS,
  sinusoidAmplitudePeriodPhaseModule,
  type SinusoidAmplitudePeriodPhaseParams,
} from '../../curve/modules/sinusoid-amplitude-period-phase';
import {
  AMPLITUDE_MAX,
  AMPLITUDE_MIN,
  PERIOD_MAX,
  PERIOD_MIN,
  PHASE_MAX,
  PHASE_MIN,
  VERTICAL_SHIFT_MAX,
  VERTICAL_SHIFT_MIN,
  fmt,
  formatRad,
} from '../../curve/modules/sinusoid-amplitude-period-phase/geometry';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useSinusoidAmplitudePeriodPhaseP5 } from '../curve/useSinusoidAmplitudePeriodPhaseP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Amplitude, period, and phase of a sinusoid',
    stats: metadata.stats.map((stat) =>
      stat.key === 'amplitude' && typeof stat.value === 'string'
        ? { ...stat, value: stat.value.replace('｜', ' | ') }
        : stat,
    ),
  };
}

type NumericParamKey = 'amplitude' | 'period' | 'phase' | 'verticalShift';

function paramsForMetadata(params: SinusoidAmplitudePeriodPhaseParams): ParamValues {
  return {
    amplitude: params.amplitude,
    period: params.period,
    phase: params.phase,
    verticalShift: params.verticalShift,
    showGhost: params.showGhost ? 1 : 0,
    showGuides: params.showGuides ? 1 : 0,
  };
}

export default function SinusoidAmplitudePeriodPhaseCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const [params, setParams] = useState<SinusoidAmplitudePeriodPhaseParams>({
    ...DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS,
  });


  const { canvasHostRef } = useSinusoidAmplitudePeriodPhaseP5({ params, locale });

  const metadataParams = paramsForMetadata(params);
  const metadata = sinusoidAmplitudePeriodPhaseModule.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = en ? englishMetadata(metadata) : metadata;

  const setNumericParam = (key: NumericParamKey, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const resetParams = () => {
    setParams({ ...DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS });
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showGhost}
          onClick={() => setParams((prev) => ({ ...prev, showGhost: !prev.showGhost }))}
        >
          {en ? (params.showGhost ? 'Compare: on' : 'Compare: off') : params.showGhost ? '對照：開' : '對照：關'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showGuides}
          onClick={() => setParams((prev) => ({ ...prev, showGuides: !prev.showGuides }))}
        >
          {en ? (params.showGuides ? 'Guides: on' : 'Guides: off') : params.showGuides ? '輔助線：開' : '輔助線：關'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={resetParams}
        >
          {en ? 'Reset' : '重設'}
        </button>
      </div>

      <div className="control-field">
        <label htmlFor="sinusoid-amplitude">
          {en ? 'Vertical scale A' : '垂直尺度 A'}
          <span className="control-field__value">{fmt(params.amplitude)}</span>
        </label>
        <div className="range-wrap">
          <input
            id="sinusoid-amplitude"
            type="range"
            className="range"
            min={AMPLITUDE_MIN}
            max={AMPLITUDE_MAX}
            step={0.01}
            value={params.amplitude}
            onInput={(event) =>
              setNumericParam('amplitude', Number((event.target as HTMLInputElement).value))
            }
          />
        </div>
      </div>

      <div className="control-field">
        <label htmlFor="sinusoid-period">
          {en ? 'Period T' : '週期 T'}
          <span className="control-field__value">{formatRad(params.period)}</span>
        </label>
        <div className="range-wrap">
          <input
            id="sinusoid-period"
            type="range"
            className="range"
            min={PERIOD_MIN}
            max={PERIOD_MAX}
            step={0.01}
            value={params.period}
            onInput={(event) =>
              setNumericParam('period', Number((event.target as HTMLInputElement).value))
            }
          />
        </div>
      </div>

      <div className="control-field">
        <label htmlFor="sinusoid-phase">
          {en ? 'Phase shift φ' : '相位位移 φ'}
          <span className="control-field__value">{formatRad(params.phase)}</span>
        </label>
        <div className="range-wrap">
          <input
            id="sinusoid-phase"
            type="range"
            className="range"
            min={PHASE_MIN}
            max={PHASE_MAX}
            step={0.01}
            value={params.phase}
            onInput={(event) =>
              setNumericParam('phase', Number((event.target as HTMLInputElement).value))
            }
          />
        </div>
      </div>

      <div className="control-field">
        <label htmlFor="sinusoid-vertical-shift">
          {en ? 'Center line k' : '中心線 k'}
          <span className="control-field__value">{fmt(params.verticalShift)}</span>
        </label>
        <div className="range-wrap">
          <input
            id="sinusoid-vertical-shift"
            type="range"
            className="range"
            min={VERTICAL_SHIFT_MIN}
            max={VERTICAL_SHIFT_MAX}
            step={0.01}
            value={params.verticalShift}
            onInput={(event) =>
              setNumericParam(
                'verticalShift',
                Number((event.target as HTMLInputElement).value),
              )
            }
          />
        </div>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Amplitude, period, and phase of a sinusoid' : '正弦型函數的振幅、週期與相位互動'}
      />
      {controls}
    </>
  );
}
