import { useCallback, useState } from 'react';
import type p5 from 'p5';
import { symmetrySample } from '../../exam/gsat-114-cubic-symmetry-center/geometry';
import { renderCubicSymmetryCenterExamScene } from '../../systems/rendering/cubicSymmetryCenterExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

type CenterGuess = 'quotient-vertex' | 'remainder-point';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return {
    width,
    height: width < 620 ? Math.max(520, Math.round(width * 1.35)) : Math.max(340, Math.round(width * 0.58)),
  };
}

export default function CubicSymmetryCenterExamRoot() {
  const [distance, setDistance] = useState(2.5);
  const [guess, setGuess] = useState<CenterGuess | null>(null);
  const sample = symmetrySample(distance);

  const draw = useCallback(
    (p: p5) => {
      renderCubicSymmetryCenterExamScene(p, {
        width: p.width,
        height: p.height,
        distance,
      });
    },
    [distance],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: distance,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">商式對稱軸 → 三次函數對稱中心</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            q 的最高點是 (-6, 8)，它也是 f 的對稱中心嗎？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            曲線取一個 a&lt;0 示意；中心結論與 a 無關
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`商式在 x=-6 左右等高；三次函數相距 ${distance} 的兩點中點為 (-6, 3)`}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">先選中心</p>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={guess === 'quotient-vertex'}
                aria-pressed={guess === 'quotient-vertex'}
                onClick={() => setGuess('quotient-vertex')}
              >
                (-6, 8)
              </button>
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={guess === 'remainder-point'}
                aria-pressed={guess === 'remainder-point'}
                onClick={() => setGuess('remainder-point')}
              >
                (-6, 3)
              </button>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">判斷</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {guess === null
                ? '先選一個坐標'
                : guess === 'remainder-point'
                  ? '正確：中心是 (-6, 3)'
                  : '再想想：8 是 q 的最大值'}
            </p>
            <p className="exam-interactive-explore__note">
              除以 x+6 的餘式是 3，所以 f(-6)=3；中心必須在 f 的圖形上。
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">對稱距離</p>
            <div className="exam-interactive-explore__ranges">
              <label className="exam-interactive-explore__range">
                <span>h</span>
                <output>{distance.toFixed(2)}</output>
                <input
                  type="range"
                  aria-label="對稱距離 h"
                  min="1"
                  max="4"
                  step="0.25"
                  value={distance}
                  onInput={(event) => setDistance(Number(event.currentTarget.value))}
                />
              </label>
            </div>
            <p className="exam-interactive-explore__note" aria-live="polite">
              P、Q 的中點 M = ({sample.midpoint.x}, {sample.midpoint.y})
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
