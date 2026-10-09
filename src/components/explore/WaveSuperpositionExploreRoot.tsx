import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  stableCanvasHeightForWidth,
  vhCapPx,
} from '../../explore/wave-superposition/canvasSize';
import {
  BEAT_PARAM_SCHEMA,
  DEFAULT_BEAT,
  DEFAULT_GUIDE,
  DEFAULT_SUPERPOSITION,
  GUIDE_PARAM_SCHEMA,
  SPEED_SCALE,
  SUPERPOSITION_PARAM_SCHEMA,
  controlLabel,
} from '../../explore/wave-superposition/constants';
import type {
  BeatParams,
  GuideParams,
  SuperpositionParams,
  WaveMode,
} from '../../explore/wave-superposition/geometry';
import {
  describeBeat,
  describeSuperposition,
  getGuideState,
} from '../../explore/wave-superposition/geometry';
import { renderWaveSuperpositionScene } from '../../systems/rendering/waveSuperpositionRender';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/wave-superposition-explore.css';

const MAX_VISUAL_DELTA_MS = 50;

function clampedDeltaSeconds(deltaMs: number): number {
  const safeDelta = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : 0;
  return Math.min(safeDelta, MAX_VISUAL_DELTA_MS) / 1000;
}

function measureWaveCanvas(host: HTMLElement): { width: number; height: number } {
  const w = host.clientWidth;
  const width = Math.max(280, Math.round(w > 0 ? w : 480));
  const height = stableCanvasHeightForWidth(width, { vhCapPx: vhCapPx() });
  return { width, height };
}

type Props = { locale?: 'en' };

export default function WaveSuperpositionExploreRoot({ locale }: Props) {
  const en = locale === 'en';
  const [mode, setMode] = useState<WaveMode>('guide');
  const [guide, setGuide] = useState<GuideParams>({ ...DEFAULT_GUIDE });
  const [superposition, setSuperposition] = useState<SuperpositionParams>({
    ...DEFAULT_SUPERPOSITION,
  });
  const [beat, setBeat] = useState<BeatParams>({ ...DEFAULT_BEAT });

  const snapRef = useRef({
    mode,
    time: 0,
    guide,
    superposition,
    beat,
    locale,
  });

  useEffect(() => {
    snapRef.current = { ...snapRef.current, mode, guide, superposition, beat, locale };
  }, [mode, guide, superposition, beat, locale]);

  const guideState = useMemo(() => getGuideState(guide, locale), [guide, locale]);

  const infoText = useMemo(
    () => {
      if (mode === 'guide') return guideState.summary;
      if (mode === 'superposition') return describeSuperposition(superposition, locale);
      return describeBeat(beat, locale);
    },
    [beat, guideState.summary, mode, superposition, locale],
  );

  const draw = useCallback((p: p5) => {
    const snap = snapRef.current;
    snap.time += clampedDeltaSeconds(p.deltaTime) * SPEED_SCALE;
    snapRef.current = snap;
    renderWaveSuperpositionScene(p, snap);
  }, []);

  const measureRect = useCallback(
    (host: HTMLElement) => measureWaveCanvas(host),
    [],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureRect);

  const superpositionGroups = ['波 A', '波 B'] as const;
  const groupLabel = (group: (typeof superpositionGroups)[number]) =>
    en ? (group === '波 A' ? 'Wave A' : 'Wave B') : group;
  const modeOptions: Array<{ key: WaveMode; label: string }> = [
    { key: 'guide', label: en ? 'Guide' : '導覽' },
    { key: 'superposition', label: en ? 'Superposition' : '疊加' },
    { key: 'beat', label: en ? 'Beats' : '拍頻' },
  ];

  return (
    <div className="wave-explore">
      <div className="wave-explore__stage">
        <div className="wave-explore__visual">
          <p className="wave-explore__visual-title">{en ? 'Superposition of waves' : '波的疊加'}</p>
          <div
            ref={canvasHostRef}
            className="wave-explore__canvas"
            role="img"
            aria-label={en ? 'Wave superposition and beats, interactive' : '波疊加與拍頻互動視覺化'}
          />
        </div>

        <aside className="wave-explore__sidebar">
          <div className="wave-explore__mode-tabs" aria-label={en ? 'Mode' : '模式'}>
            {modeOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className="wave-explore__mode-btn"
                data-active={mode === option.key}
                onClick={() => setMode(option.key)}
                aria-pressed={mode === option.key}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="wave-explore__state" aria-live="polite" role="status">
            {infoText}
          </p>

          {mode === 'guide' ? (
            <div className="wave-explore__control-block">
              <p className="wave-explore__group-label">{en ? 'Phase guide' : '相位導覽'}</p>
              {GUIDE_PARAM_SCHEMA.map((schema) => (
                <div key={schema.key} className="control-field">
                  <label htmlFor={`guide-${schema.key}`}>
                    {controlLabel(schema, locale)}
                    <span className="wave-explore__val">
                      {guide[schema.key].toFixed(2)}
                    </span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id={`guide-${schema.key}`}
                      type="range"
                      className="range"
                      min={schema.min}
                      max={schema.max}
                      step={schema.step}
                      value={guide[schema.key]}
                      onInput={(e) =>
                        setGuide((prev) => ({
                          ...prev,
                          [schema.key]: Number((e.target as HTMLInputElement).value),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="wave-explore__guide-labels">
                <p>{guideState.displacementLabel}</p>
                <p>{guideState.standingLabel}</p>
                <p>{guideState.fringeLabel}</p>
              </div>
              <p className="wave-explore__note">
                {en
                  ? 'Chladni figures extend the idea of nodal lines. Their shape comes from the eigenmodes of the vibrating plate.'
                  : '克拉尼圖形延伸的是節線概念；其形狀由振動板本徵模態決定。'}
              </p>
            </div>
          ) : mode === 'superposition' ? (
            superpositionGroups.map((group) => (
              <div key={group} className="wave-explore__control-block">
                <p className="wave-explore__group-label">{groupLabel(group)}</p>
                {SUPERPOSITION_PARAM_SCHEMA.filter((s) => s.group === group).map(
                  (schema) => (
                    <div key={schema.key} className="control-field">
                      <label htmlFor={`wave-${schema.key}`}>
                        {controlLabel(schema, locale)}
                        <span className="wave-explore__val">
                          {superposition[schema.key].toFixed(2)}
                        </span>
                      </label>
                      <div className="range-wrap">
                        <input
                          id={`wave-${schema.key}`}
                          type="range"
                          className="range"
                          min={schema.min}
                          max={schema.max}
                          step={schema.step}
                          value={superposition[schema.key]}
                          onInput={(e) =>
                            setSuperposition((prev) => ({
                              ...prev,
                              [schema.key]: Number(
                                (e.target as HTMLInputElement).value,
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            ))
          ) : (
            <div className="wave-explore__control-block">
              <p className="wave-explore__group-label">{en ? 'Beat controls' : '拍頻控制'}</p>
              {BEAT_PARAM_SCHEMA.map((schema) => (
                <div key={schema.key} className="control-field">
                  <label htmlFor={`beat-${schema.key}`}>
                    {controlLabel(schema, locale)}
                    <span className="wave-explore__val">
                      {beat[schema.key].toFixed(2)}
                    </span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id={`beat-${schema.key}`}
                      type="range"
                      className="range"
                      min={schema.min}
                      max={schema.max}
                      step={schema.step}
                      value={beat[schema.key]}
                      onInput={(e) =>
                        setBeat((prev) => ({
                          ...prev,
                          [schema.key]: Number((e.target as HTMLInputElement).value),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="wave-explore__formula">
            {mode === 'guide'
              ? en
                ? 'Δφ sets the phase offset. Chladni figures come from eigenmodes.'
                : 'Δφ 控制相位偏移；克拉尼圖形由本徵模態決定。'
              : 'f(x) = A₁sin(ω₁x + φ₁) + A₂sin(ω₂x + φ₂)'}
          </p>
        </aside>
      </div>
    </div>
  );
}
