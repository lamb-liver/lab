import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  RATIONAL_OBLIQUE_MODES,
  RATIONAL_OBLIQUE_PARAM_META,
  buildRationalObliqueModel,
  modeById,
  rationalObliqueAsymptoteModule,
  rationalObliqueDefaultParams,
  valuesFromParams,
  type RationalObliqueModeId,
  type RationalObliqueParamKey,
  type RationalObliqueParams,
} from '../../curve/modules/rational-oblique-asymptote';
import StatsPanel from '../curve/StatsPanel';
import { useRationalObliqueAsymptoteP5 } from '../curve/useRationalObliqueAsymptoteP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function RationalObliqueAsymptoteCurveRoot({
  controlsMountId = 'rational-oblique-asymptote-controls',
}: Props) {
  const [modeId, setModeId] = useState<RationalObliqueModeId>('oblique');
  const [params, setParams] = useState<RationalObliqueParams>(rationalObliqueDefaultParams);
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [showRemainder, setShowRemainder] = useState(false);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const mode = modeById(modeId);
  const model = buildRationalObliqueModel(mode, params);
  const { canvasHostRef } = useRationalObliqueAsymptoteP5({
    mode,
    params,
    showAsymptotes,
    showRemainder,
    advanced,
  });

  useEffect(() => {
    const mount = document.getElementById(controlsMountId);
    setControlsMount(mount);
    const details = mount?.closest('details');
    if (
      details instanceof HTMLDetailsElement &&
      window.matchMedia('(min-width: 1024px)').matches
    ) {
      details.open = true;
    }
  }, [controlsMountId]);

  const metadataParams = valuesFromParams(modeId, params);
  const metadata = rationalObliqueAsymptoteModule.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const setParam = (key: RationalObliqueParamKey, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

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
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}

          {mode.sliders.map((key) => {
            const meta = RATIONAL_OBLIQUE_PARAM_META[key];
            return (
              <div key={key} className="control-field">
                <label htmlFor={`rational-oblique-asymptote-${key}`}>
                  {meta.label}
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
              漸近線
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
                aria-pressed={showRemainder}
                onClick={() => setShowRemainder((prev) => !prev)}
              >
                餘式 E
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
                重設
              </button>
            </div>
          ) : null}

          <p className="curve-work-controls__formula">{mode.note}</p>
          <StatsPanel metadata={metadata} />

          {advanced ? (
            <div className="curve-work-controls__stats">
              <div>
                <dt>次數</dt>
                <dd>{model.degreeText}</dd>
              </div>
              <div>
                <dt>拆式</dt>
                <dd>{model.split}</dd>
              </div>
              <div>
                <dt>餘式</dt>
                <dd>{model.remainder}</dd>
              </div>
            </div>
          ) : null}
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="斜漸近線與多項式除法互動"
      />
      {controls}
    </>
  );
}
