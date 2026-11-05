import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  B_MAX,
  B_MIN,
  INDEPENDENT_B,
  OFFICIAL_B,
  chiSquare,
  clampB,
  illGivenAbnormal,
  smallestRejectingB,
  tableFor,
} from '../../exam/gaokao-2025-i-ultrasound-independence-test/geometry';
import { renderIndependenceTestExam } from '../../systems/rendering/independenceTestExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

const THRESHOLD_B = smallestRejectingB();

type Props = { locale?: 'en' };

export default function IndependenceTestExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [b, setB] = useState(OFFICIAL_B);
  const t = tableFor(b);
  const chi = chiSquare(t);
  const related = chi > 10.828;

  const draw = useCallback(
    (p: p5) => {
      renderIndependenceTestExam(p, { width: p.width, height: p.height, b, locale });
    },
    [b, locale],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: b,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Same totals, one free cell' : '合計不變，只剩一格能動'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? ' If the scan had nothing to do with the disease, how many of the 200 abnormal scans would be ill?'
              : '如果檢查結果和疾病無關，200 個不正常的人裡應該有幾個患病？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Bars are the observed share ill in each scan group. Dashed lines are the 20% both groups would share if independent. The bottom line is χ² against 10.828.'
              : '長條是兩組實際的患病比例，虛線是無關時兩組共同的 20%。下方數線是 χ² 與 10.828 的位置'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Table with ${t.b} ill among abnormal scans, chi-square ${chi.toFixed(2)}`
                : `不正常組患病 ${t.b} 人的列聯表，χ² = ${chi.toFixed(2)}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'The 2×2 table' : '2×2 列聯表'}</p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Ill with abnormal scan' : '患病且不正常'}</span>
              <output>{t.b}</output>
              <input
                id="independence-b"
                type="range"
                aria-label={en ? 'Ill with abnormal scan' : '患病且不正常的人數'}
                min={B_MIN}
                max={B_MAX}
                step={1}
                value={b}
                onInput={(event) => setB(clampB(Number(event.currentTarget.value)))}
              />
            </label>
            <p className="exam-interactive-explore__note">
              {en
                ? `Ill: ${t.a} normal, ${t.b} abnormal. Not ill: ${t.c} normal, ${t.d} abnormal.`
                : `患病：正常 ${t.a}、不正常 ${t.b}。未患病：正常 ${t.c}、不正常 ${t.d}。`}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Part 1' : '第一問'}</p>
            <p className="exam-interactive-explore__result">
              P ≈ {t.b}/200 = {illGivenAbnormal(t).toFixed(3)}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `The denominator is the 200 abnormal scans, not 1000 (that gives ${(t.b / 1000).toFixed(3)}).`
                : `分母是不正常的 200 人，不是 1000（那會得到 ${(t.b / 1000).toFixed(3)}）。`}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Part 2' : '第二問'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              χ² = {chi.toFixed(3)}
              {related ? (en ? ' > 10.828, related' : ' > 10.828，有關') : en ? ' ≤ 10.828, not shown' : ' ≤ 10.828，不能判定有關'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `With these totals χ² = (b − ${INDEPENDENT_B})² / 25.6. At α = 0.001 b = ${THRESHOLD_B} is already enough.`
                : `合計固定時 χ² = (b − ${INDEPENDENT_B})² / 25.6。α = 0.001 下，b 到 ${THRESHOLD_B} 就已經足夠。`}
            </p>
          </div>

          <button
            type="button"
            className="exam-interactive-explore__mode-button"
            onClick={() => setB(OFFICIAL_B)}
          >
            {en ? 'Back to the original table' : '回到原題表格'}
          </button>
        </aside>
      </div>
    </div>
  );
}
