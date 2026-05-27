import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MODE_ARITHMETIC,
  MODE_GEOMETRIC,
  arithmeticGeometricSequencesModule,
} from '../../curve/modules/arithmetic-geometric-sequences';
import type { ParamValues } from '../../curve/types';
import StatsPanel from '../curve/StatsPanel';
import { useArithmeticGeometricSequencesP5 } from '../curve/useArithmeticGeometricSequencesP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

type RangeFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display?: string;
  onChange: (value: number) => void;
};

export default function ArithmeticGeometricSequencesCurveRoot({
  controlsMountId = 'arithmetic-geometric-sequences-controls',
}: Props) {
  const module = arithmeticGeometricSequencesModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);

  const { canvasHostRef } = useArithmeticGeometricSequencesP5({
    defaultParams: module.defaultParams,
    targetParams,
    onRevealPctChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const mode = Math.round(targetParams.mode ?? MODE_ARITHMETIC);
  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle" aria-label="數列模式">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={mode === MODE_ARITHMETIC}
              onClick={() => patchParams({ mode: MODE_ARITHMETIC })}
            >
              等差
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={mode === MODE_GEOMETRIC}
              onClick={() => patchParams({ mode: MODE_GEOMETRIC })}
            >
              等比
            </button>
          </div>

          {mode === MODE_ARITHMETIC ? (
            <>
              <RangeField
                id="arithmetic-a1"
                label="首項 a₁"
                value={targetParams.arithmeticA1 ?? 2}
                min={1}
                max={12}
                step={0.1}
                display={(targetParams.arithmeticA1 ?? 2).toFixed(1)}
                onChange={(value) => patchParams({ arithmeticA1: value })}
              />
              <RangeField
                id="arithmetic-d"
                label="公差 d"
                value={targetParams.arithmeticD ?? 1}
                min={0.2}
                max={4}
                step={0.1}
                display={(targetParams.arithmeticD ?? 1).toFixed(1)}
                onChange={(value) => patchParams({ arithmeticD: value })}
              />
              <RangeField
                id="arithmetic-n"
                label="項數 n"
                value={targetParams.arithmeticN ?? 8}
                min={1}
                max={20}
                step={1}
                display={String(Math.round(targetParams.arithmeticN ?? 8))}
                onChange={(value) => patchParams({ arithmeticN: value })}
              />
            </>
          ) : (
            <>
              <RangeField
                id="geometric-a1"
                label="首項 a₁"
                value={targetParams.geometricA1 ?? 1}
                min={0.2}
                max={3}
                step={0.05}
                display={(targetParams.geometricA1 ?? 1).toFixed(2)}
                onChange={(value) => patchParams({ geometricA1: value })}
              />
              <RangeField
                id="geometric-r"
                label="公比 r"
                value={targetParams.geometricR ?? 0.5}
                min={0.2}
                max={0.98}
                step={0.01}
                display={(targetParams.geometricR ?? 0.5).toFixed(2)}
                onChange={(value) => patchParams({ geometricR: value })}
              />
              <RangeField
                id="geometric-n"
                label="項數 n"
                value={targetParams.geometricN ?? 8}
                min={1}
                max={20}
                step={1}
                display={String(Math.round(targetParams.geometricN ?? 8))}
                onChange={(value) => patchParams({ geometricN: value })}
              />
            </>
          )}

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
        aria-label="等差等比數列的幾何視覺"
      />
      {controls}
    </>
  );
}

function RangeField({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: RangeFieldProps) {
  return (
    <div className="control-field">
      <label htmlFor={id}>
        <span>{label}</span>
        <span className="control-field__value">{display ?? value}</span>
      </label>
      <div className="range-wrap">
        <input
          id={id}
          type="range"
          className="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          onInput={(event) => onChange(Number(event.currentTarget.value))}
        />
      </div>
    </div>
  );
}
