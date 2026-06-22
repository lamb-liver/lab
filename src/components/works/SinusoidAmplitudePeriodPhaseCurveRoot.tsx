import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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
import type { ParamValues } from '../../curve/types';
import { useSinusoidAmplitudePeriodPhaseP5 } from '../curve/useSinusoidAmplitudePeriodPhaseP5';
import StatsPanel from '../curve/StatsPanel';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

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

export default function SinusoidAmplitudePeriodPhaseCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<SinusoidAmplitudePeriodPhaseParams>({
    ...DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS,
  });
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const { canvasHostRef } = useSinusoidAmplitudePeriodPhaseP5({ params });

  const metadata = useMemo(
    () =>
      sinusoidAmplitudePeriodPhaseModule.getMetadata(paramsForMetadata(params), {
        revealPct: 100,
        smoothParams: paramsForMetadata(params),
      }),
    [params],
  );

  const setNumericParam = (key: NumericParamKey, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const resetParams = () => {
    setParams({ ...DEFAULT_SINUSOID_AMPLITUDE_PERIOD_PHASE_PARAMS });
  };

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.showGhost}
              onClick={() => setParams((prev) => ({ ...prev, showGhost: !prev.showGhost }))}
            >
              {params.showGhost ? '對照：開' : '對照：關'}
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.showGuides}
              onClick={() => setParams((prev) => ({ ...prev, showGuides: !prev.showGuides }))}
            >
              {params.showGuides ? '輔助線：開' : '輔助線：關'}
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed="false"
              onClick={resetParams}
            >
              重置
            </button>
          </div>

          <div className="control-field">
            <label htmlFor="sinusoid-amplitude">
              垂直尺度 A
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
              週期 T
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
              相位位移 φ
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
              中心線 k
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

          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="正弦型函數的振幅、週期與相位互動"
      />
      {controls}
    </>
  );
}
