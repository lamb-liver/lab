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

export default function CubicSymmetryCenterExamRoot({ locale }: { locale?: 'en' }) {
  const en = locale === 'en';
  const [distance, setDistance] = useState(2.5);
  const [guess, setGuess] = useState<CenterGuess | null>(null);
  const sample = symmetrySample(distance);

  const draw = useCallback(
    (p: p5) => {
      renderCubicSymmetryCenterExamScene(p, {
        width: p.width,
        height: p.height,
        distance,
        locale,
      });
    },
    [distance, locale],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: distance,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en
              ? 'Axis of the quotient, center of the cubic'
              : '商式對稱軸 → 三次函數對稱中心'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The high point of q is (-6, 8). Is it also the center of symmetry of f?'
              : 'q 的最高點是 (-6, 8)，它也是 f 的對稱中心嗎？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'The curve uses one a < 0 as an example; the center does not depend on a'
              : '曲線取一個 a<0 示意；中心結論與 a 無關'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `The quotient is level on both sides of x=-6; on the cubic, two points ${distance} apart have midpoint (-6, 3)`
                : `商式在 x=-6 左右等高；三次函數相距 ${distance} 的兩點中點為 (-6, 3)`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Pick a center' : '先選中心'}</p>
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
            <p className="exam-interactive-explore__block-title">{en ? 'Check' : '判斷'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {guess === null
                ? en
                  ? 'Pick a point first'
                  : '先選一個坐標'
                : guess === 'remainder-point'
                  ? en
                    ? 'Correct: the center is (-6, 3)'
                    : '正確：中心是 (-6, 3)'
                  : en
                    ? 'Think again: 8 is the maximum of q'
                    : '再想想：8 是 q 的最大值'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'The remainder on division by x+6 is 3, so f(-6)=3; the center must lie on the graph of f.'
                : '除以 x+6 的餘式是 3，所以 f(-6)=3；中心必須在 f 的圖形上。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Symmetric distance' : '對稱距離'}</p>
            <div className="exam-interactive-explore__ranges">
              <label className="exam-interactive-explore__range">
                <span>h</span>
                <output>{distance.toFixed(2)}</output>
                <input
                  type="range"
                  aria-label={en ? 'Symmetric distance h' : '對稱距離 h'}
                  min="1"
                  max="4"
                  step="0.25"
                  value={distance}
                  onInput={(event) => setDistance(Number(event.currentTarget.value))}
                />
              </label>
            </div>
            <p className="exam-interactive-explore__note" aria-live="polite">
              {en ? 'Midpoint M of P and Q' : 'P、Q 的中點 M'} = ({sample.midpoint.x}, {sample.midpoint.y})
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
