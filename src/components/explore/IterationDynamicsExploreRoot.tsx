import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  CHAOS_POINTS_PER_FRAME,
  CHAOS_RATIO_DEFAULT,
  CHAOS_RATIO_MAX,
  CHAOS_RATIO_MIN,
  CHAOS_RATIO_STEP,
  R_DEFAULT,
  R_MAX,
  R_MIN,
  R_STEP,
  X0_DEFAULT,
  X0_MAX,
  X0_MIN,
  X0_STEP,
} from '../../explore/iteration-dynamics/constants';
import {
  bifurcationData,
  chaosGamePoints,
  classifyBehavior,
  type BifurcationColumn,
  type Point,
} from '../../explore/iteration-dynamics/geometry';
import {
  renderBifurcation,
  renderBifurcationMarker,
  renderChaosGame,
  renderCobweb,
} from '../../systems/rendering/iterationDynamicsRender';
import { useP5CanvasHost } from '../curve/useP5CanvasHost';
import '../../styles/components/explore/iteration-dynamics-explore.css';

const CANVAS_MAX = 440;

type IterationMode = 'cobweb' | 'bifurcation' | 'chaos';

const MODE_OPTIONS: Array<{ key: IterationMode; label: string }> = [
  { key: 'cobweb', label: '蛛網圖' },
  { key: 'bifurcation', label: '分岔圖' },
  { key: 'chaos', label: '混沌遊戲' },
];

function measureCanvas(host: HTMLElement): number {
  const w = host.clientWidth;
  const vhCap = Math.floor(window.innerHeight * 0.5);
  const cap = Math.min(CANVAS_MAX, vhCap);
  const size = w > 0 ? Math.min(w, cap) : cap;
  return Math.max(240, size);
}

export default function IterationDynamicsExploreRoot() {
  const [mode, setMode] = useState<IterationMode>('cobweb');
  const [r, setR] = useState(R_DEFAULT);
  const [x0, setX0] = useState(X0_DEFAULT);
  const [ratio, setRatio] = useState(CHAOS_RATIO_DEFAULT);

  const bifData = useMemo<BifurcationColumn[]>(() => bifurcationData(), []);
  const chaosPoints = useMemo<Point[]>(() => chaosGamePoints(ratio), [ratio]);

  const stateRef = useRef({ mode, r: R_DEFAULT, x0: X0_DEFAULT, bifData, chaosPoints });
  const chaosCountRef = useRef(0);

  useEffect(() => {
    stateRef.current = { mode, r, x0, bifData, chaosPoints };
  }, [mode, r, x0, bifData, chaosPoints]);

  // 進入混沌模式或改變 ratio 時，重置漸進累積
  useEffect(() => {
    chaosCountRef.current = 0;
  }, [mode, ratio]);

  const draw = useCallback((p: p5) => {
    p.background(10);
    const s = stateRef.current;
    if (s.mode === 'cobweb') {
      renderCobweb(p, s.r, s.x0);
      return { keepLooping: false };
    } else if (s.mode === 'bifurcation') {
      renderBifurcation(p, s.bifData);
      renderBifurcationMarker(p, s.r, R_MIN, R_MAX);
      return { keepLooping: false };
    } else {
      chaosCountRef.current = Math.min(
        chaosCountRef.current + CHAOS_POINTS_PER_FRAME,
        s.chaosPoints.length,
      );
      renderChaosGame(p, s.chaosPoints, chaosCountRef.current);
      return { keepLooping: chaosCountRef.current < s.chaosPoints.length };
    }
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw], measureCanvas, {
    mode: 'reveal',
    restartOn: [mode, r, x0, ratio],
  });

  const behavior = useMemo(() => classifyBehavior(r, x0), [r, x0]);

  let stateText: string;
  if (mode === 'cobweb') {
    stateText = `r = ${r.toFixed(2)}｜長期行為：${behavior.label}`;
  } else if (mode === 'bifurcation') {
    stateText = `拖動 r 移動標記，看它落在單一分支、短週期分支或密集帶（有限尾段判讀：${behavior.label}）`;
  } else {
    stateText = `ratio = ${ratio.toFixed(2)}｜朝隨機頂點移動此比例；0.5 → 謝爾賓斯基三角形`;
  }

  const visualTitle =
    mode === 'cobweb' ? '蛛網圖' : mode === 'bifurcation' ? '分岔圖' : '混沌遊戲';
  const canvasLabel =
    mode === 'cobweb'
      ? '單峰映射的蛛網圖互動視覺化'
      : mode === 'bifurcation'
        ? '單峰映射的分岔圖互動視覺化'
        : '混沌遊戲生成碎形的互動視覺化';

  return (
    <div className="iteration-explore">
      <div className="iteration-explore__stage">
        <div className="iteration-explore__visual">
          <p className="iteration-explore__visual-title">{visualTitle}</p>
          <div
            ref={canvasHostRef}
            className="iteration-explore__canvas"
            role="img"
            aria-label={canvasLabel}
          />
        </div>

        <aside className="iteration-explore__sidebar">
          <div className="iteration-explore__mode-tabs" aria-label="模式">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className="iteration-explore__mode-btn"
                data-active={mode === option.key}
                onClick={() => setMode(option.key)}
                aria-pressed={mode === option.key}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="iteration-explore__state" aria-live="polite" role="status">
            {stateText}
          </p>

          <div className="iteration-explore__control-block">
            {mode !== 'chaos' && (
              <div className="control-field">
                <label htmlFor="iter-r">
                  成長率 r
                  <span className="iteration-explore__val">{r.toFixed(2)}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="iter-r"
                    type="range"
                    className="range"
                    min={R_MIN}
                    max={R_MAX}
                    step={R_STEP}
                    value={r}
                    onInput={(e) => setR(Number((e.target as HTMLInputElement).value))}
                  />
                </div>
              </div>
            )}

            {mode === 'cobweb' && (
              <div className="control-field">
                <label htmlFor="iter-x0">
                  起始值 x₀
                  <span className="iteration-explore__val">{x0.toFixed(2)}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="iter-x0"
                    type="range"
                    className="range"
                    min={X0_MIN}
                    max={X0_MAX}
                    step={X0_STEP}
                    value={x0}
                    onInput={(e) => setX0(Number((e.target as HTMLInputElement).value))}
                  />
                </div>
              </div>
            )}

            {mode === 'chaos' && (
              <div className="control-field">
                <label htmlFor="iter-ratio">
                  跳躍比例 ratio
                  <span className="iteration-explore__val">{ratio.toFixed(2)}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="iter-ratio"
                    type="range"
                    className="range"
                    min={CHAOS_RATIO_MIN}
                    max={CHAOS_RATIO_MAX}
                    step={CHAOS_RATIO_STEP}
                    value={ratio}
                    onInput={(e) => setRatio(Number((e.target as HTMLInputElement).value))}
                  />
                </div>
              </div>
            )}
          </div>

          <p className="iteration-explore__formula">
            {mode === 'cobweb'
              ? 'xₙ₊₁ = r·xₙ(1 − xₙ)｜階梯沿曲線與 y=x 反覆彈跳'
              : mode === 'bifurcation'
                ? '每個 r 丟棄暫態後畫出長期落點；週期倍增後可見密集帶與週期窗口'
                : '隨機反覆套用收縮映射，散點聚成自我相似的碎形'}
          </p>
        </aside>
      </div>
    </div>
  );
}
