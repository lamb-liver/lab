import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FUNCTION_DERIVATIVE_PRESETS,
  clampX0,
  functionDerivativeGraphModule,
  presetById,
  presetIndexFromId,
  valuesFromParams,
  type FunctionDerivativePresetId,
} from '../../curve/modules/function-derivative-graph';
import StatsPanel from '../curve/StatsPanel';
import { useFunctionDerivativeGraphP5 } from '../curve/useFunctionDerivativeGraphP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function FunctionDerivativeGraphCurveRoot({
  controlsMountId = 'function-derivative-graph-controls',
}: Props) {
  const [presetId, setPresetId] = useState<FunctionDerivativePresetId>('quad');
  const [x0, setX0] = useState(1.25);
  const [advanced, setAdvanced] = useState(false);
  const [showZeros, setShowZeros] = useState(true);
  const [showMonotonic, setShowMonotonic] = useState(false);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);
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
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadataParams = valuesFromParams({
    preset: presetId,
    x0: clampX0(preset, x0),
  });
  const metadata = functionDerivativeGraphModule.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const setPreset = (next: FunctionDerivativePresetId) => {
    const nextPreset = presetById(next);
    setPresetId(next);
    setX0((prev) => clampX0(nextPreset, prev));
  };

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

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
              進階標示
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={showZeros}
              onClick={() => setShowZeros((prev) => !prev)}
            >
              零點標記
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
                單調區間
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
                重設
              </button>
            </div>
          ) : null}

          <p className="curve-work-controls__formula">
            拖動圖中的垂直檢查線 x₀；目前函數序號 {presetIndexFromId(presetId) + 1}
          </p>
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
        aria-label="原函數與導函數圖形對照互動"
      />
      {controls}
    </>
  );
}
