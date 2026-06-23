import { useState } from 'react';
import {
  RATIONAL_ASYMPTOTE_PARAM_META,
  RATIONAL_ASYMPTOTE_PRESETS,
  buildRationalAsymptoteModel,
  presetById,
  rationalVerticalHorizontalAsymptotesModule,
  valuesFromParams,
  type RationalAsymptoteParamKey,
  type RationalAsymptoteParams,
  type RationalAsymptotePresetId,
} from '../../curve/modules/rational-vertical-horizontal-asymptotes';
import { useRationalVerticalHorizontalAsymptotesP5 } from '../curve/useRationalVerticalHorizontalAsymptotesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function RationalVerticalHorizontalAsymptotesCurveRoot({ controlsMountId }: Props) {
  const [presetId, setPresetId] = useState<RationalAsymptotePresetId>('factor');
  const [params, setParams] = useState<RationalAsymptoteParams>(RATIONAL_ASYMPTOTE_PRESETS[0]!.params);
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [showHoles, setShowHoles] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [showLocal, setShowLocal] = useState(false);

  const preset = presetById(presetId);
  const model = buildRationalAsymptoteModel(preset, params);
  const { canvasHostRef } = useRationalVerticalHorizontalAsymptotesP5({
    preset,
    params,
    showAsymptotes,
    showHoles,
    showLocal,
    advanced,
  });

  const metadataParams = valuesFromParams(presetId, params);
  const metadata = rationalVerticalHorizontalAsymptotesModule.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const setPreset = (next: RationalAsymptotePresetId) => {
    const nextPreset = presetById(next);
    setPresetId(next);
    setParams(nextPreset.params);
    setShowLocal(false);
  };

  const setParam = (key: RationalAsymptoteParamKey, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const sliderKeys = preset.basicKeys.concat(advanced ? preset.advancedKeys : []);

  const controls = (
    <WorkControlsPortal
      controlsMountId={controlsMountId}
      metadata={metadata}
      footer={
        advanced ? (
          <div className="curve-work-controls__stats">
            <div>
              <dt>次數</dt>
              <dd>{model.degreeText}</dd>
            </div>
            <div>
              <dt>判斷</dt>
              <dd>{model.warning || model.formulas[3]}</dd>
            </div>
          </div>
        ) : null
      }
    >
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {RATIONAL_ASYMPTOTE_PRESETS.map((item) => (
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

      {sliderKeys.map((key) => {
        const meta = RATIONAL_ASYMPTOTE_PARAM_META[key];
        return (
          <div key={key} className="control-field">
            <label htmlFor={`rational-vertical-horizontal-asymptotes-${key}`}>
              {meta.label}
              <span className="control-field__value">{params[key].toFixed(2)}</span>
            </label>
            <div className="range-wrap">
              <input
                id={`rational-vertical-horizontal-asymptotes-${key}`}
                type="range"
                className="range"
                min={meta.min}
                max={meta.max}
                step={meta.step}
                value={params[key]}
                onInput={(event) => setParam(key, Number(event.currentTarget.value))}
              />
            </div>
          </div>
        );
      })}

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showAsymptotes}
          onClick={() => setShowAsymptotes((prev) => !prev)}
        >
          漸近線
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showHoles}
          onClick={() => setShowHoles((prev) => !prev)}
        >
          洞標記
        </button>
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={advanced}
          onClick={() => setAdvanced((prev) => !prev)}
        >
          進階模式
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={advanced && showLocal}
          onClick={() => setShowLocal((prev) => !prev)}
          disabled={!advanced}
        >
          局部窗口
        </button>
      </div>

      <p className="curve-work-controls__formula">{preset.note}</p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="有理函數垂直與水平漸近線互動"
      />
      {controls}
    </>
  );
}
