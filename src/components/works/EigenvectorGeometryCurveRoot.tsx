import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  EIGENVECTOR_PRESETS,
  eigenvectorGeometryModule,
  paramsFromMatrixVector,
  presetById,
  type EigenvectorPresetId,
} from '../../curve/modules/eigenvector-geometry';
import type { ParamValues } from '../../curve/types';
import StatsPanel from '../curve/StatsPanel';
import { useEigenvectorGeometryP5 } from '../curve/useEigenvectorGeometryP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

type MatrixKey = 'a' | 'b' | 'c' | 'd';
type PresetSelection = EigenvectorPresetId | 'custom';

const MATRIX_KEYS: MatrixKey[] = ['a', 'b', 'c', 'd'];

export default function EigenvectorGeometryCurveRoot({
  controlsMountId = 'eigenvector-geometry-controls',
}: Props) {
  const module = eigenvectorGeometryModule;
  const [params, setParams] = useState<ParamValues>(module.defaultParams);
  const [presetId, setPresetId] = useState<PresetSelection>('stretch');
  const [advanced, setAdvanced] = useState(false);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const currentPreset = useMemo(
    () => (presetId === 'custom' ? undefined : presetById(presetId)),
    [presetId],
  );
  const visiblePresets = EIGENVECTOR_PRESETS.filter((preset) => advanced || !preset.advanced);

  const onParamsChange = useCallback((patch: ParamValues) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useEigenvectorGeometryP5({
    params,
    presetNote: currentPreset?.note,
    onParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(params, {
    revealPct: 100,
    smoothParams: params,
  });

  const setPreset = (id: EigenvectorPresetId) => {
    const preset = presetById(id);
    if (!preset) return;
    setPresetId(id);
    setParams((prev) => ({
      ...paramsFromMatrixVector(preset.matrix, {
        x: prev.ux,
        y: prev.uy,
      }),
    }));
  };

  const updateMatrixValue = (key: MatrixKey, value: number) => {
    setPresetId('custom');
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
            {visiblePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={presetId === preset.id}
                onClick={() => setPreset(preset.id)}
              >
                {preset.label}
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
              進階矩陣
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed="false"
              onClick={() => setPreset('stretch')}
            >
              重設
            </button>
          </div>

          {advanced ? (
            <div className="curve-work-controls__matrix">
              {MATRIX_KEYS.map((key) => (
                <div key={key} className="control-field">
                  <label htmlFor={`eigenvector-geometry-${key}`}>
                    <span>{key}</span>
                    <span className="control-field__value">
                      {(params[key] ?? 0).toFixed(2)}
                    </span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id={`eigenvector-geometry-${key}`}
                      type="range"
                      className="range"
                      min={-3}
                      max={3}
                      step={0.01}
                      value={params[key] ?? 0}
                      onInput={(event) => updateMatrixValue(key, Number(event.currentTarget.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

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
        aria-label="特徵向量與伸縮比互動"
      />
      {controls}
    </>
  );
}
