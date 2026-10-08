import { useState } from 'react';
import {
  RATIONAL_ASYMPTOTE_PARAM_META,
  RATIONAL_ASYMPTOTE_PRESETS,
  asymptoteParamLabel,
  asymptotePresetText,
  buildRationalAsymptoteModel,
  fmt,
  presetById,
  rationalVerticalHorizontalAsymptotesModule,
  valuesFromParams,
  type RationalAsymptoteModel,
  type RationalAsymptoteParamKey,
  type RationalAsymptoteParams,
  type RationalAsymptotePresetId,
} from '../../curve/modules/rational-vertical-horizontal-asymptotes';
import type { CurveMetadata } from '../../curve/types';
import { useRationalVerticalHorizontalAsymptotesP5 } from '../curve/useRationalVerticalHorizontalAsymptotesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

function englishMetadata(model: RationalAsymptoteModel): CurveMetadata {
  const list = (values: number[]) => (values.length ? values.map((value) => `x=${fmt(value)}`).join(', ') : 'none');
  return {
    title: 'Vertical and horizontal asymptotes',
    formula: model.expression,
    stats: [
      { key: 'mode', label: 'State', value: model.family },
      { key: 'zero', label: 'Zero', value: list(model.zeros) },
      { key: 'vertical', label: 'Vertical asymptote', value: list(model.verticals) },
      {
        key: 'horizontal',
        label: 'Horizontal asymptote',
        value: model.horizontal.exists ? `y=${fmt(model.horizontal.value)}` : 'none',
      },
    ],
  };
}

export default function RationalVerticalHorizontalAsymptotesCurveRoot({ controlsMountId, locale }: Props) {
  const [presetId, setPresetId] = useState<RationalAsymptotePresetId>('factor');
  const [params, setParams] = useState<RationalAsymptoteParams>(RATIONAL_ASYMPTOTE_PRESETS[0]!.params);
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [showHoles, setShowHoles] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [showLocal, setShowLocal] = useState(false);

  const en = locale === 'en';
  const preset = presetById(presetId);
  const presetCopy = asymptotePresetText(preset, locale);
  const model = buildRationalAsymptoteModel(preset, params, locale);
  const { canvasHostRef } = useRationalVerticalHorizontalAsymptotesP5({
    preset,
    params,
    showAsymptotes,
    showHoles,
    showLocal,
    advanced,
    locale,
  });

  const metadataParams = valuesFromParams(presetId, params);
  const metadata = rationalVerticalHorizontalAsymptotesModule.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = en ? englishMetadata(model) : metadata;

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
      metadata={shown}
      footer={
        advanced ? (
          <div className="curve-work-controls__stats">
            <div>
              <dt>{en ? 'Degree' : '次數'}</dt>
              <dd>{model.degreeText}</dd>
            </div>
            <div>
              <dt>{en ? 'Conclusion' : '判斷'}</dt>
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
            {asymptotePresetText(item, locale).label}
          </button>
        ))}
      </div>

      {sliderKeys.map((key) => {
        const meta = RATIONAL_ASYMPTOTE_PARAM_META[key];
        return (
          <div key={key} className="control-field">
            <label htmlFor={`rational-vertical-horizontal-asymptotes-${key}`}>
              {asymptoteParamLabel(key, locale)}
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
          {en ? 'Asymptotes' : '漸近線'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showHoles}
          onClick={() => setShowHoles((prev) => !prev)}
        >
          {en ? 'Hole marks' : '洞標記'}
        </button>
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={advanced}
          onClick={() => setAdvanced((prev) => !prev)}
        >
          {en ? 'Advanced' : '進階模式'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={advanced && showLocal}
          onClick={() => setShowLocal((prev) => !prev)}
          disabled={!advanced}
        >
          {en ? 'Local window' : '局部窗口'}
        </button>
      </div>

      <p className="curve-work-controls__formula">{presetCopy.note}</p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Vertical and horizontal asymptotes' : '有理函數垂直與水平漸近線互動'}
      />
      {controls}
    </>
  );
}
