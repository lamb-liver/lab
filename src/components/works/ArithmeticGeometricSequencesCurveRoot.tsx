import { useCallback, useState } from 'react';
import {
  MODE_ARITHMETIC,
  MODE_GEOMETRIC,
  arithmeticGeometricSequencesModule,
} from '../../curve/modules/arithmetic-geometric-sequences';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useArithmeticGeometricSequencesP5 } from '../curve/useArithmeticGeometricSequencesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
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

function presentMetadata(metadata: CurveMetadata, geometric: boolean, locale?: 'en'): CurveMetadata {
  if (locale !== 'en') return metadata;
  return {
    ...metadata,
    title: geometric ? 'Geometric sequence' : 'Arithmetic sequence',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'r') return { ...stat, label: 'Common ratio r' };
      if (stat.key === 'd') return { ...stat, label: 'Common difference d' };
      if (stat.key === 'n') return { ...stat, label: 'Number of terms n' };
      return stat;
    }),
  };
}

export default function ArithmeticGeometricSequencesCurveRoot({ controlsMountId, locale }: Props) {
  const module = arithmeticGeometricSequencesModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);

  const { canvasHostRef } = useArithmeticGeometricSequencesP5({
    targetParams,
    onRevealPctChange,
    locale,
  });


  const mode = Math.round(targetParams.mode ?? MODE_ARITHMETIC);
  const metadata = presentMetadata(
    module.getMetadata(targetParams, {
      revealPct,
      smoothParams: targetParams,
    }),
    mode === MODE_GEOMETRIC,
    locale,
  );

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle" aria-label={locale === 'en' ? 'Sequence type' : '數列模式'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={mode === MODE_ARITHMETIC}
          onClick={() => patchParams({ mode: MODE_ARITHMETIC })}
        >
          {locale === 'en' ? 'Arithmetic' : '等差'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={mode === MODE_GEOMETRIC}
          onClick={() => patchParams({ mode: MODE_GEOMETRIC })}
        >
          {locale === 'en' ? 'Geometric' : '等比'}
        </button>
      </div>

      {mode === MODE_ARITHMETIC ? (
        <>
          <RangeField
            id="arithmetic-a1"
            label={locale === 'en' ? 'First term a₁' : '首項 a₁'}
            value={targetParams.arithmeticA1 ?? 2}
            min={1}
            max={12}
            step={0.1}
            display={(targetParams.arithmeticA1 ?? 2).toFixed(1)}
            onChange={(value) => patchParams({ arithmeticA1: value })}
          />
          <RangeField
            id="arithmetic-d"
            label={locale === 'en' ? 'Common difference d' : '公差 d'}
            value={targetParams.arithmeticD ?? 1}
            min={0.2}
            max={4}
            step={0.1}
            display={(targetParams.arithmeticD ?? 1).toFixed(1)}
            onChange={(value) => patchParams({ arithmeticD: value })}
          />
          <RangeField
            id="arithmetic-n"
            label={locale === 'en' ? 'Number of terms n' : '項數 n'}
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
            label={locale === 'en' ? 'First term a₁' : '首項 a₁'}
            value={targetParams.geometricA1 ?? 1}
            min={0.2}
            max={3}
            step={0.05}
            display={(targetParams.geometricA1 ?? 1).toFixed(2)}
            onChange={(value) => patchParams({ geometricA1: value })}
          />
          <RangeField
            id="geometric-r"
            label={locale === 'en' ? 'Common ratio r' : '公比 r'}
            value={targetParams.geometricR ?? 0.5}
            min={0.2}
            max={0.98}
            step={0.01}
            display={(targetParams.geometricR ?? 0.5).toFixed(2)}
            onChange={(value) => patchParams({ geometricR: value })}
          />
          <RangeField
            id="geometric-n"
            label={locale === 'en' ? 'Number of terms n' : '項數 n'}
            value={targetParams.geometricN ?? 8}
            min={1}
            max={20}
            step={1}
            display={String(Math.round(targetParams.geometricN ?? 8))}
            onChange={(value) => patchParams({ geometricN: value })}
          />
        </>
      )}
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={locale === 'en' ? 'Arithmetic and geometric sequences' : '等差等比數列的幾何視覺'}
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
          onInput={(event) => onChange(Number(event.currentTarget.value))}
        />
      </div>
    </div>
  );
}
