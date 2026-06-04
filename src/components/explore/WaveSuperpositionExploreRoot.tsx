import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  canvasHeightForWidth,
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

function measureWaveCanvas(host: HTMLElement, mode: WaveMode): { width: number; height: number } {
  const w = host.clientWidth;
  const width = Math.max(280, Math.round(w > 0 ? w : 480));
  const height = canvasHeightForWidth(mode, width, { vhCapPx: vhCapPx() });
  return { width, height };
}

export default function WaveSuperpositionExploreRoot() {
  const [mode, setMode] = useState<WaveMode>('guide');
  const [guide, setGuide] = useState<GuideParams>({ ...DEFAULT_GUIDE });
  const [superposition, setSuperposition] = useState<SuperpositionParams>({
    ...DEFAULT_SUPERPOSITION,
  });
  const [beat, setBeat] = useState<BeatParams>({ ...DEFAULT_BEAT });

  const modeRef = useRef(mode);
  const snapRef = useRef({
    mode,
    time: 0,
    guide,
    superposition,
    beat,
  });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    snapRef.current = { ...snapRef.current, mode, guide, superposition, beat };
  }, [mode, guide, superposition, beat]);

  const guideState = useMemo(() => getGuideState(guide), [guide]);

  const infoText = useMemo(
    () => {
      if (mode === 'guide') return guideState.summary;
      if (mode === 'superposition') return describeSuperposition(superposition);
      return describeBeat(beat);
    },
    [beat, guideState.summary, mode, superposition],
  );

  const draw = useCallback((p: p5) => {
    const snap = snapRef.current;
    snap.time += clampedDeltaSeconds(p.deltaTime) * SPEED_SCALE;
    snapRef.current = snap;

    const targetH = canvasHeightForWidth(snap.mode, p.width, { vhCapPx: vhCapPx() });
    if (Math.abs(p.height - targetH) > 2) {
      p.resizeCanvas(p.width, targetH);
    }

    renderWaveSuperpositionScene(p, snap);
  }, []);

  const measureRect = useCallback(
    (host: HTMLElement) => measureWaveCanvas(host, modeRef.current),
    [],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureRect);

  const superpositionGroups = ['波 A', '波 B'] as const;
  const modeOptions: Array<{ key: WaveMode; label: string }> = [
    { key: 'guide', label: '導覽' },
    { key: 'superposition', label: '疊加' },
    { key: 'beat', label: '拍頻' },
  ];

  return (
    <div className="wave-explore">
      <div className="wave-explore__stage">
        <div className="wave-explore__visual">
          <p className="wave-explore__visual-title">波的疊加</p>
          <div
            ref={canvasHostRef}
            className="wave-explore__canvas"
            role="img"
            aria-label="波疊加與拍頻互動視覺化"
          />
        </div>

        <aside className="wave-explore__sidebar">
          <div className="wave-explore__mode-tabs" aria-label="模式">
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
              <p className="wave-explore__group-label">相位導覽</p>
              {GUIDE_PARAM_SCHEMA.map((schema) => (
                <div key={schema.key} className="control-field">
                  <label htmlFor={`guide-${schema.key}`}>
                    {schema.label}
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
                克拉尼圖形延伸的是節線概念；其形狀由振動板本徵模態決定。
              </p>
            </div>
          ) : mode === 'superposition' ? (
            superpositionGroups.map((group) => (
              <div key={group} className="wave-explore__control-block">
                <p className="wave-explore__group-label">{group}</p>
                {SUPERPOSITION_PARAM_SCHEMA.filter((s) => s.group === group).map(
                  (schema) => (
                    <div key={schema.key} className="control-field">
                      <label htmlFor={`wave-${schema.key}`}>
                        {schema.label}
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
              <p className="wave-explore__group-label">拍頻控制</p>
              {BEAT_PARAM_SCHEMA.map((schema) => (
                <div key={schema.key} className="control-field">
                  <label htmlFor={`beat-${schema.key}`}>
                    {schema.label}
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
              ? 'Δφ 控制相位偏移；克拉尼圖形由本徵模態決定。'
              : 'f(x) = A₁sin(ω₁x + φ₁) + A₂sin(ω₂x + φ₂)'}
          </p>
        </aside>
      </div>
    </div>
  );
}
