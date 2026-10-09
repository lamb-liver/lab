import { useState } from 'react';
import {
  RATIONAL_OBLIQUE_MODES,
  RATIONAL_OBLIQUE_PARAM_META,
  buildRationalObliqueModel,
  fmt,
  modeById,
  obliqueModeText,
  obliqueParamLabel,
  rationalObliqueAsymptoteModule,
  rationalObliqueDefaultParams,
  valuesFromParams,
  type RationalObliqueModeId,
  type RationalObliqueParamKey,
  type RationalObliqueParams,
} from '../../curve/modules/rational-oblique-asymptote';
import type { CurveMetadata } from '../../curve/types';
import { useRationalObliqueAsymptoteP5 } from '../curve/useRationalObliqueAsymptoteP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

export default function RationalObliqueAsymptoteCurveRoot({ controlsMountId, locale }: Props) {
  const [modeId, setModeId] = useState<RationalObliqueModeId>('oblique');
  const [params, setParams] = useState<RationalObliqueParams>(rationalObliqueDefaultParams);
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [showRemainder, setShowRemainder] = useState(false);

  const en = locale === 'en';
  const mode = modeById(modeId);
  const modeCopy = obliqueModeText(mode, locale);
  const model = buildRationalObliqueModel(mode, params, locale);
  const { canvasHostRef } = useRationalObliqueAsymptoteP5({
    mode,
    params,
    showAsymptotes,
    showRemainder,
    advanced,
    locale,
  });

  const metadataParams = valuesFromParams(modeId, params);
  const metadata = rationalObliqueAsymptoteModule.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown: CurveMetadata = en
    ? {
        title: 'Oblique asymptotes and polynomial division',
        formula: model.expression,
        stats: [
          { key: 'mode', label: 'State', value: model.family },
          {
            key: 'guide',
            label: model.guide.type === 'oblique' ? 'Oblique asymptote' : 'Horizontal asymptote',
            value: model.guide.label,
          },
          {
            key: 'vertical',
            label: 'Vertical asymptote',
            value: model.verticals.map((value) => `x=${fmt(value)}`).join(', ') || '—',
          },
          { key: 'remainder', label: 'Remainder', value: model.remainder },
        ],
      }
    : metadata;

  const setParam = (key: RationalObliqueParamKey, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

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
              <dt>{en ? 'Split' : '拆式'}</dt>
              <dd>{model.split}</dd>
            </div>
            <div>
              <dt>{en ? 'Remainder' : '餘式'}</dt>
              <dd>{model.remainder}</dd>
            </div>
          </div>
        ) : null
      }
    >
      {advanced ? (
        <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
          {RATIONAL_OBLIQUE_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="curve-work-mode-button"
              aria-pressed={modeId === item.id}
              onClick={() => setModeId(item.id)}
            >
              {obliqueModeText(item, locale).label}
            </button>
          ))}
        </div>
      ) : null}

      {mode.sliders.map((key) => {
        const meta = RATIONAL_OBLIQUE_PARAM_META[key];
        return (
          <div key={key} className="control-field">
            <label htmlFor={`rational-oblique-asymptote-${key}`}>
              {obliqueParamLabel(key, locale)}
              <span className="control-field__value">{params[key].toFixed(2)}</span>
            </label>
            <div className="range-wrap">
              <input
                id={`rational-oblique-asymptote-${key}`}
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
          aria-pressed={advanced}
          onClick={() => setAdvanced((prev) => !prev)}
        >
          {en ? 'Advanced' : '進階模式'}
        </button>
      </div>

      {advanced ? (
        <div className="curve-work-mode-toggle">
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showRemainder}
            onClick={() => setShowRemainder((prev) => !prev)}
          >
            {en ? 'Remainder E' : '餘式 E'}
          </button>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed="false"
            onClick={() => {
              setModeId('oblique');
              setParams(rationalObliqueDefaultParams);
              setShowRemainder(false);
            }}
          >
            {en ? 'Reset' : '重設'}
          </button>
        </div>
      ) : null}

      <p className="curve-work-controls__formula">{modeCopy.note}</p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Oblique asymptotes and polynomial division' : '斜漸近線與多項式除法互動'}
      />
      {controls}
    </>
  );
}
