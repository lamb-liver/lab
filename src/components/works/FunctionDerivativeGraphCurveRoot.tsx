import { useCallback, useState } from 'react';
import {
  FUNCTION_DERIVATIVE_PRESETS,
  clampX0,
  functionDerivativeGraphModule,
  localizeDerivativePhrase,
  presetById,
  presetIndexFromId,
  valuesFromParams,
  type FunctionDerivativePresetId,
} from '../../curve/modules/function-derivative-graph';
import type { CurveMetadata } from '../../curve/types';
import { useFunctionDerivativeGraphP5 } from '../curve/useFunctionDerivativeGraphP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  extremum: 'Extremum candidate',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'A function and its derivative',
    formula: metadata.formula.replaceAll('；', '; '),
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
      value: localizeDerivativePhrase(String(stat.value), 'en'),
    })),
  };
}

export default function FunctionDerivativeGraphCurveRoot({ controlsMountId, locale }: Props) {
  const [presetId, setPresetId] = useState<FunctionDerivativePresetId>('quad');
  const [x0, setX0] = useState(1.25);
  const [advanced, setAdvanced] = useState(false);
  const [showZeros, setShowZeros] = useState(true);
  const [showMonotonic, setShowMonotonic] = useState(false);
  const preset = presetById(presetId);

  const onX0Change = useCallback((next: number) => {
    setX0((prev) => {
      const activePreset = presetById(presetId);
      const clamped = clampX0(activePreset, next);
      return Math.abs(prev - clamped) < 0.0001 ? prev : clamped;
    });
  }, [presetId]);

  const { canvasHostRef } = useFunctionDerivativeGraphP5({
    preset,
    x0,
    showZeros,
    showMonotonic: advanced && showMonotonic,
    onX0Change,
    locale,
  });

  const metadataParams = valuesFromParams({
    preset: presetId,
    x0: clampX0(preset, x0),
  });
  const metadata = functionDerivativeGraphModule.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;

  const setPreset = (next: FunctionDerivativePresetId) => {
    const nextPreset = presetById(next);
    setPresetId(next);
    setX0((prev) => clampX0(nextPreset, prev));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {FUNCTION_DERIVATIVE_PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={presetId === item.id}
            onClick={() => setPreset(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={advanced}
          onClick={() => setAdvanced((prev) => !prev)}
        >
          {locale === 'en' ? 'Advanced marks' : '進階標示'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showZeros}
          onClick={() => setShowZeros((prev) => !prev)}
        >
          {locale === 'en' ? 'Zero marks' : '零點標記'}
        </button>
      </div>

      {advanced ? (
        <div className="curve-work-mode-toggle">
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showMonotonic}
            onClick={() => setShowMonotonic((prev) => !prev)}
          >
            {locale === 'en' ? 'Monotone intervals' : '單調區間'}
          </button>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed="false"
            onClick={() => {
              setPreset('quad');
              setAdvanced(false);
              setShowZeros(true);
              setShowMonotonic(false);
            }}
          >
            {locale === 'en' ? 'Reset' : '重設'}
          </button>
        </div>
      ) : null}

      <p className="curve-work-controls__formula">
        {locale === 'en'
          ? `x₀: drag the vertical line. Function ${presetIndexFromId(presetId) + 1}`
          : `拖動圖中的垂直檢查線 x₀；目前函數序號 ${presetIndexFromId(presetId) + 1}`}
      </p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en' ? 'A function and its derivative' : '原函數與導函數圖形對照互動'
        }
      />
      {controls}
    </>
  );
}
