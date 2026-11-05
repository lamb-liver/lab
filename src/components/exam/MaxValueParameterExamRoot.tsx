import { useCallback, useState } from 'react';
import type p5 from 'p5';
import { A_MAX, A_MIN, OPTIONS, criticalX, maxValue } from '../../exam/gaokao-2026-i-max-value-parameter/geometry';
import { renderMaxValueParameterExam } from '../../systems/rendering/maxValueParameterExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(320, Math.round(width * 0.6)) };
}

type Props = { locale?: 'en' };

export default function MaxValueParameterExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [a, setA] = useState(2);
  const x0 = criticalX(a);
  const m = maxValue(a);

  const draw = useCallback(
    (p: p5) => renderMaxValueParameterExam(p, { width: p.width, height: p.height, a, locale }),
    [a, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, { loop: false, redrawKey: a });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Where the highest point can sit' : '最高點只能落在哪裡'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'Change a and the peak moves. Is there a single curve that every peak lies on?'
              : '改變 a，最高點跟著移動。這些最高點是不是都在同一條曲線上？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Gold: y = (x+2)/(eˣ + a). Faint: the four options. Dashed cyan: y = e^(−x), the path of the peak.'
              : '金色是 y = (x+2)/(eˣ + a)，淡線是四個選項，青色虛線 y = e^(−x) 是最高點的軌跡'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Graph for a = ${a.toFixed(2)}, peak at x = ${x0.toFixed(2)} with value ${m.toFixed(3)}`
                : `a = ${a.toFixed(2)} 的圖形，最高點 x = ${x0.toFixed(2)}，最大值 ${m.toFixed(3)}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Parameter' : '參數'}</p>
            <label className="exam-interactive-explore__range">
              <span>a</span>
              <output>{a.toFixed(2)}</output>
              <input
                type="range"
                aria-label={en ? 'Parameter a' : '參數 a'}
                min={A_MIN}
                max={A_MAX}
                step={0.01}
                value={a}
                onInput={(event) => setA(Number(event.currentTarget.value))}
              />
            </label>
            <div className="exam-interactive-explore__modes">
              {OPTIONS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className="exam-interactive-explore__mode-button"
                  data-active={Math.abs(a - o.a) < 1e-9}
                  aria-pressed={Math.abs(a - o.a) < 1e-9}
                  onClick={() => setA(o.a)}
                >
                  {o.key}. a = {o.a}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Maximum' : '最大值'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {en ? `max f = ${m.toFixed(3)}` : `f 的最大值 = ${m.toFixed(3)}`}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `Peak at x₀ = ${x0.toFixed(3)}, where (x₀+1)e^(x₀) = a. The value equals e^(−x₀) = ${Math.exp(-x0).toFixed(3)}.`
                : `最高點 x₀ = ${x0.toFixed(3)}，滿足 (x₀+1)e^(x₀) = a，最大值等於 e^(−x₀) = ${Math.exp(-x0).toFixed(3)}。`}
            </p>
            <p className="exam-interactive-explore__note">
              {en ? 'The maximum is 1 only when x₀ = 0, that is a = 1.' : '最大值是 1 只在 x₀ = 0，也就是 a = 1。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
