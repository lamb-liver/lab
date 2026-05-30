import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  canvasHeightForWidth,
  vhCapPx,
} from '../../explore/wave-superposition/canvasSize';
import {
  BEAT_PARAM_SCHEMA,
  DEFAULT_BEAT,
  DEFAULT_SUPERPOSITION,
  SPEED_SCALE,
  SUPERPOSITION_PARAM_SCHEMA,
} from '../../explore/wave-superposition/constants';
import type { BeatParams, SuperpositionParams, WaveMode } from '../../explore/wave-superposition/geometry';
import {
  describeBeat,
  describeSuperposition,
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
  const [mode, setMode] = useState<WaveMode>('superposition');
  const [superposition, setSuperposition] = useState<SuperpositionParams>({
    ...DEFAULT_SUPERPOSITION,
  });
  const [beat, setBeat] = useState<BeatParams>({ ...DEFAULT_BEAT });

  const modeRef = useRef(mode);
  const snapRef = useRef({
    mode,
    time: 0,
    superposition,
    beat,
  });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    snapRef.current = { ...snapRef.current, mode, superposition, beat };
  }, [mode, superposition, beat]);

  const infoText = useMemo(
    () =>
      mode === 'superposition'
        ? describeSuperposition(superposition)
        : describeBeat(beat),
    [mode, superposition, beat],
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

  const toggleMode = () => {
    setMode((m) => (m === 'superposition' ? 'beat' : 'superposition'));
  };

  const superpositionGroups = ['波 A', '波 B'] as const;

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
          <button
            type="button"
            className="wave-explore__mode-btn"
            onClick={toggleMode}
            aria-pressed={mode === 'beat'}
          >
            {mode === 'superposition' ? '切換：拍頻模式' : '切換：疊加模式'}
          </button>

          <p className="wave-explore__state" aria-live="polite" role="status">
            {infoText}
          </p>

          {mode === 'superposition' ? (
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
            f(x) = A₁sin(ω₁x + φ₁) + A₂sin(ω₂x + φ₂)
          </p>
        </aside>
      </div>
    </div>
  );
}
