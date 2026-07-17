import { useCallback, useState } from 'react';
import {
  TAYLOR_MAX_N,
  TAYLOR_MIN_N,
  TAYLOR_PRESETS,
  clampA,
  clampN,
  presetById,
  valuesFromParams,
  taylorPolynomialApproximationModule,
  type TaylorPresetId,
} from '../../curve/modules/taylor-polynomial-approximation';
import { useTaylorPolynomialApproximationP5 } from '../curve/useTaylorPolynomialApproximationP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function TaylorPolynomialApproximationCurveRoot({ controlsMountId }: Props) {
  const [presetId, setPresetId] = useState<TaylorPresetId>('sin');
  const [a, setA] = useState(0);
  const [n, setN] = useState(3);
  const [showError, setShowError] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const preset = presetById(presetId);

  const onAChange = useCallback((next: number) => {
    setA((prev) => {
      const clamped = clampA(presetById(presetId), next);
      return Math.abs(prev - clamped) < 0.0001 ? prev : clamped;
    });
  }, [presetId]);

  const { canvasHostRef } = useTaylorPolynomialApproximationP5({
    preset,
    a,
    n,
    showError,
    showTerms: advanced && showTerms,
    onAChange,
  });

  const metadataParams = valuesFromParams({
    preset: presetId,
    a: clampA(preset, a),
    n: clampN(n),
  });
  const metadata = taylorPolynomialApproximationModule.getMetadata(metadataParams);

  const setPreset = (next: TaylorPresetId) => {
    const nextPreset = presetById(next);
    setPresetId(next);
    setA((prev) => clampA(nextPreset, prev));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {TAYLOR_PRESETS.map((item) => (
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

      <div className="control-field">
        <label htmlFor="taylor-polynomial-approximation-n">
          <span>階數 n</span>
          <span className="control-field__value">{n}</span>
        </label>
        <div className="range-wrap">
          <input
            id="taylor-polynomial-approximation-n"
            type="range"
            className="range"
            min={TAYLOR_MIN_N}
            max={TAYLOR_MAX_N}
            step={1}
            value={n}
            onInput={(event) => setN(clampN(Number(event.currentTarget.value)))}
          />
        </div>
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showError}
          onClick={() => setShowError((prev) => !prev)}
        >
          誤差帶
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={advanced}
          onClick={() => setAdvanced((prev) => !prev)}
        >
          進階模式
        </button>
      </div>

      {advanced ? (
        <div className="curve-work-mode-toggle">
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showTerms}
            onClick={() => setShowTerms((prev) => !prev)}
          >
            項次分解
          </button>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed="false"
            onClick={() => {
              setPreset('sin');
              setA(0);
              setN(3);
              setShowError(true);
              setAdvanced(false);
              setShowTerms(false);
            }}
          >
            重設
          </button>
        </div>
      ) : null}

      <p className="curve-work-controls__formula">
        拖動圖中的展開中心 a；{preset.maclaurin}
      </p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="泰勒多項式逼近互動"
      />
      {controls}
    </>
  );
}
