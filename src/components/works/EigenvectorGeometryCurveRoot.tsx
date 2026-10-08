import { useCallback, useState } from 'react';
import {
  EIGENVECTOR_PRESETS,
  eigenvectorGeometryModule,
  paramsFromMatrixVector,
  presetById,
  type EigenvectorPresetId,
} from '../../curve/modules/eigenvector-geometry';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useEigenvectorGeometryP5 } from '../curve/useEigenvectorGeometryP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const PRESET_LABEL_EN: Record<EigenvectorPresetId, string> = {
  stretch: 'Stretch',
  rotation: 'Rotation',
  shear: 'Shear',
  reflection: 'Reflection',
  saddle: 'Saddle',
  scalar: 'Scalar',
  rotstretch: 'Rotate-and-stretch',
  singular: 'Flatten',
  mixed: 'Oblique',
};

const PRESET_NOTE_EN: Record<EigenvectorPresetId, string> = {
  stretch: 'Both axes are eigen directions',
  rotation: 'Not a 180 degree turn: no real direction',
  shear: 'A repeated eigenvalue, only one direction',
  reflection: 'One direction stays, one reverses',
  saddle: 'One stretches, one reverses',
  scalar: 'Every direction is an eigen direction',
  rotstretch: 'Rotation plus scaling: no real direction',
  singular: 'det A = 0: one direction is sent to the origin',
  mixed: 'Eigen directions need not be the axes',
};

const STATUS_EN: Record<string, string> = {
  兩方向: 'Two directions',
  一方向: 'One direction',
  每個方向: 'Every direction',
  無實方向: 'No real direction',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Eigenvectors and stretch factors',
    stats: metadata.stats.map((stat) =>
      stat.key === 'status'
        ? { ...stat, label: 'Status', value: STATUS_EN[String(stat.value)] ?? stat.value }
        : stat,
    ),
  };
}

type MatrixKey = 'a' | 'b' | 'c' | 'd';
type PresetSelection = EigenvectorPresetId | 'custom';

const MATRIX_KEYS: MatrixKey[] = ['a', 'b', 'c', 'd'];

export default function EigenvectorGeometryCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = eigenvectorGeometryModule;
  const [params, setParams] = useQuerySyncedParams(module.defaultParams);
  const [presetId, setPresetId] = useState<PresetSelection>('stretch');
  const [advanced, setAdvanced] = useState(false);

  const currentPreset = presetId === 'custom' ? undefined : presetById(presetId);
  const visiblePresets = EIGENVECTOR_PRESETS.filter((preset) => advanced || !preset.advanced);

  const onParamsChange = useCallback((patch: ParamValues) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useEigenvectorGeometryP5({
    params,
    presetNote: currentPreset
      ? en
        ? PRESET_NOTE_EN[currentPreset.id]
        : currentPreset.note
      : undefined,
    onParamsChange,
    locale,
  });

  const metadata = module.getMetadata(params, {
    revealPct: 100,
    smoothParams: params,
  });
  const shown = en ? englishMetadata(metadata) : metadata;

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

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {visiblePresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={presetId === preset.id}
            onClick={() => setPreset(preset.id)}
          >
            {en ? PRESET_LABEL_EN[preset.id] : preset.label}
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
          {en ? 'Advanced matrices' : '進階矩陣'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setPreset('stretch')}
        >
          {en ? 'Reset' : '重設'}
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
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Eigenvectors and stretch factors' : '特徵向量與伸縮比互動'}
      />
      {controls}
    </>
  );
}
