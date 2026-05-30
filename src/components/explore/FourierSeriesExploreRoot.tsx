import { useCallback, useEffect, useRef, useState } from 'react';
import type p5 from 'p5';
import { FOURIER_CURVE_STYLE, REVEAL_SPEED_PER_SEC } from '../../explore/fourier/constants';
import {
  buildFourierPath,
  tAtArcLength,
  type FourierMode,
  type FourierPathCache,
} from '../../explore/fourier/path';
import {
  applyFourierTransform,
  renderFourierEpicycles,
  renderFourierGrid,
} from '../../systems/rendering/fourierRender';
import { renderGhostCurve } from '../../systems/rendering/polyline';
import { renderReveal } from '../../systems/rendering/reveal';
import { useP5CanvasHost } from '../curve/useP5CanvasHost';
import '../../styles/components/explore/fourier-explore.css';

type AnimState = {
  revealProgress: number;
  isComplete: boolean;
};

const EXPLORE_CANVAS_MAX = 400;
const MAX_VISUAL_DELTA_MS = 50;

function clampedDeltaSeconds(deltaMs: number): number {
  const safeDelta = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : 0;
  return Math.min(safeDelta, MAX_VISUAL_DELTA_MS) / 1000;
}

function measureExploreCanvasSize(host: HTMLElement): number {
  const w = host.clientWidth;
  const vhCap = Math.floor(window.innerHeight * 0.34);
  const cap = Math.min(EXPLORE_CANVAS_MAX, vhCap);
  const size = w > 0 ? Math.min(w, cap) : cap;
  return Math.max(200, size);
}

const MODE_LABELS: Record<FourierMode, string> = {
  '1D': '一維方波合成',
  '2D': '接近方形的週期軌道',
};

export default function FourierSeriesExploreRoot() {
  const [N, setN] = useState(2);
  const [mode, setMode] = useState<FourierMode>('1D');
  const [revealPct, setRevealPct] = useState(0);

  const paramsRef = useRef({ N: 2, mode: '1D' as FourierMode });
  const cacheRef = useRef<FourierPathCache | null>(null);
  const animRef = useRef<AnimState>({ revealProgress: 0, isComplete: false });
  const lastRevealPctRef = useRef(-1);

  useEffect(() => {
    paramsRef.current = { N, mode };
    cacheRef.current = buildFourierPath(mode, N);
    animRef.current = { revealProgress: 0, isComplete: false };
    lastRevealPctRef.current = -1;
    setRevealPct(0);
  }, [N, mode]);

  const draw = useCallback((p: p5) => {
    const { mode: targetMode } = paramsRef.current;
    const path = cacheRef.current;
    if (!path) return;

    let { revealProgress, isComplete } = animRef.current;

    if (!isComplete) {
      revealProgress += clampedDeltaSeconds(p.deltaTime) * REVEAL_SPEED_PER_SEC;
      if (revealProgress >= 1) {
        revealProgress = 1;
        isComplete = true;
      }
      animRef.current = { revealProgress, isComplete };
    }

    const pct = Math.floor(revealProgress * 100);
    if (!isComplete && pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      setRevealPct(pct);
    } else if (isComplete && lastRevealPctRef.current !== 100) {
      lastRevealPctRef.current = 100;
      setRevealPct(100);
    }

    p.background(10);

    p.push();
    if (targetMode === '1D') {
      applyFourierTransform(p, targetMode);
    } else {
      p.translate(p.width / 2, p.height / 2);
    }

    renderFourierGrid(p, targetMode, p.width);
    renderGhostCurve(p, path.points, FOURIER_CURVE_STYLE);
    renderReveal(p, path.points, revealProgress, 'byArcLength', FOURIER_CURVE_STYLE);

    const targetLength = path.totalLength * revealProgress;
    const currentT = tAtArcLength(path.points, targetLength);
    renderFourierEpicycles(p, targetMode, path.epicycles, currentT);

    p.pop();
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw], measureExploreCanvasSize);

  const toggleMode = () => {
    setMode((prev) => (prev === '1D' ? '2D' : '1D'));
  };

  return (
    <div className="fourier-explore">
      <div
        ref={canvasHostRef}
        className="fourier-explore__canvas"
        role="img"
        aria-label="傅立葉級數互動視覺化"
      />
      <div className="fourier-explore__controls">
        <div className="fourier-explore__toolbar">
          <div className="control-field fourier-explore__n">
            <label htmlFor="fourier-n">
              疊加項數 N
              <span className="fourier-explore__n-value">{N}</span>
            </label>
            <div className="range-wrap">
              <input
                id="fourier-n"
                type="range"
                className="range"
                min={1}
                max={20}
                step={1}
                value={N}
                onInput={(e) => setN(Number((e.target as HTMLInputElement).value))}
              />
            </div>
          </div>

          <button
            type="button"
            className="fourier-explore__mode-btn"
            onClick={toggleMode}
            aria-pressed={mode === '2D'}
            aria-label={`目前模式：${MODE_LABELS[mode]}，點擊切換`}
          >
            {mode === '1D' ? '一維方波' : '二維軌道'} ↔ 切換
          </button>

          <span className="fourier-explore__reveal" aria-live="polite" role="status">
            {revealPct}%
          </span>
        </div>

        <div className="fourier-explore__meta">
          <p className="fourier-explore__title">傅立葉級數視覺化</p>
          <p className="fourier-explore__formula">
            f(x) = a₀/2 + Σ(aₙ·cos(nx) + bₙ·sin(nx))
          </p>
          <p className="fourier-explore__mode">模式：{MODE_LABELS[mode]}</p>
        </div>
      </div>
    </div>
  );
}
