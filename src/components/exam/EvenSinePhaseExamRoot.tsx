import { useCallback, useState } from 'react';
import type p5 from 'p5';
import { A_VALUES, THETA_STEPS, f, isEven, isIncreasing, thetaLabel } from '../../exam/gaokao-2026-i-even-sine-phase/geometry';
import { renderEvenSinePhaseExam } from '../../systems/rendering/evenSinePhaseExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(300, Math.round(width * 0.55)) };
}

type Props = { locale?: 'en' };

export default function EvenSinePhaseExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [a, setA] = useState(1);
  const [k, setK] = useState(2);
  const theta = (k * Math.PI) / 4;
  const even = isEven(a, theta);
  const inc = isIncreasing(a, theta);
  const value = f((2 * Math.PI) / 3, a, theta);

  const draw = useCallback(
    (p: p5) => renderEvenSinePhaseExam(p, { width: p.width, height: p.height, a, theta, locale }),
    [a, theta, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, { loop: false, redrawKey: `${a}-${k}` });

  const yes = en ? 'yes' : '是';
  const no = en ? 'no' : '否';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Even, and rising on (0, π/2)' : '偶函數，又在 (0, π/2) 遞增'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'An even function has a peak or a trough at x = 0. Which one lets it rise right after 0?'
              : '偶函數在 x = 0 是最高點或最低點。哪一種才能在 0 的右邊往上走？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Gold: f(x) = 2sin(ax + θ). Dashed cyan: f(−x); the two coincide when f is even. The shaded band is (0, π/2).'
              : '金色是 f(x) = 2sin(ax + θ)，青色虛線是 f(−x)，兩者重合就是偶函數。淺色帶是 (0, π/2)'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Graph of 2sin(${a}x + ${thetaLabel(k)}), even: ${even ? yes : no}, rising on (0, π/2): ${inc ? yes : no}`
                : `2sin(${a}x + ${thetaLabel(k)}) 的圖形，偶函數：${even ? yes : no}，在 (0, π/2) 遞增：${inc ? yes : no}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Phase θ' : '相位 θ'}</p>
            <div className="exam-interactive-explore__modes">
              {[...Array(THETA_STEPS).keys()].map((i) => (
                <button
                  key={i}
                  type="button"
                  className="exam-interactive-explore__mode-button"
                  data-active={k === i}
                  aria-pressed={k === i}
                  onClick={() => setK(i)}
                >
                  θ = {thetaLabel(i)}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Frequency a' : '頻率 a'}</p>
            <div className="exam-interactive-explore__modes">
              {A_VALUES.map((v) => (
                <button
                  key={v}
                  type="button"
                  className="exam-interactive-explore__mode-button"
                  data-active={a === v}
                  aria-pressed={a === v}
                  onClick={() => setA(v)}
                >
                  a = {v}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Check' : '檢查'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {en
                ? `Even: ${even ? yes : no}; rising on (0, π/2): ${inc ? yes : no}`
                : `偶函數：${even ? yes : no}；在 (0, π/2) 遞增：${inc ? yes : no}`}
            </p>
            <p className="exam-interactive-explore__note">f(2π/3) = {value.toFixed(3)}</p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Both hold only for θ = 3π/2 with a = 1 or 2, and both give f(2π/3) = 1.'
                : '兩個條件只在 θ = 3π/2、a = 1 或 2 同時成立，兩者都得 f(2π/3) = 1。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
