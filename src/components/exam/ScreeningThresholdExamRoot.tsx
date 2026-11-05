import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  C_MAX,
  C_MIN,
  DEFAULT_C,
  clampC,
  falseAlarmRate,
  missRate,
  totalError,
} from "../../exam/gaokao-2023-ii-screening-threshold/geometry";
import { renderScreeningThresholdExam } from '../../systems/rendering/screeningThresholdExamRender';
import {
  useRectP5CanvasHost,
  type CanvasSize,
} from "../curve/useRectP5CanvasHost";
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(380, Math.round(width * 0.75)) };
}

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

type Props = { locale?: 'en' };

export default function ScreeningThresholdExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [c, setC] = useState(DEFAULT_C);

  const draw = useCallback(
    (p: p5) =>
      renderScreeningThresholdExam(p, {
        width: p.width,
        height: p.height,
        c,
        en,
      }),
    [c, en],
  );
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [],
    measureCanvas,
    undefined,
    { loop: false, redrawKey: c },
  );

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'One cut-off, two kinds of error' : '一條臨界線，兩種誤判'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? ' Moving c right lowers one error and raises the other. Where does the total stop going down?'
              : 'c 往右，一種誤判變少，另一種變多。總和在哪裡停止下降？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Only the part of the two histograms between 95 and 105 is drawn. Solid colour marks the people judged wrongly.'
              : '只畫兩個直方圖在 95 到 105 之間的部分，實色是被判錯的人'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Cut-off c = ${c.toFixed(1)}, miss rate ${pct(missRate(c))}, false positive rate ${pct(falseAlarmRate(c))}`
                : `臨界值 c = ${c.toFixed(1)}，漏診率 ${pct(missRate(c))}，誤診率 ${pct(falseAlarmRate(c))}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Cut-off' : '臨界值'}
            </p>
            <label className="exam-interactive-explore__range">
              <span>c</span>
              <output>{c.toFixed(1)}</output>
              <input
                id="screening-c"
                type="range"
                aria-label={en ? 'Cut-off c' : '臨界值 c'}
                min={C_MIN}
                max={C_MAX}
                step={0.1}
                value={c}
                onInput={(event) =>
                  setC(clampC(Number(event.currentTarget.value)))
                }
              />
            </label>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              f(c) = p(c) + q(c)
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {pct(missRate(c))} + {pct(falseAlarmRate(c))} ={" "}
              {pct(totalError(c))}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'p = 0.5% at c = 97.5, which gives q = 3.5%. f(c) = −0.008c + 0.82 up to 100 and 0.01c − 0.98 after, so the minimum is 0.02 at c = 100.'
                : 'c = 97.5 時 p = 0.5%，q = 3.5%。f(c) 在 100 以前是 −0.008c + 0.82，之後是 0.01c − 0.98，最小值是 c = 100 時的 0.02。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
