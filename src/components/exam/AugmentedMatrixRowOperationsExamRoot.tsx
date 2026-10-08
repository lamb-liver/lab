import { useCallback, useState } from 'react';
import type p5 from 'p5';
import { combineRowOperationResults } from '../../exam/ast-113-augmented-matrix-row-operations/geometry';
import { renderAugmentedMatrixRowOperationsExamScene } from '../../systems/rendering/augmentedMatrixRowOperationsExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: width < 520 ? 430 : Math.max(300, Math.round(width * 0.55)) };
}

export default function AugmentedMatrixRowOperationsExamRoot({ locale }: { locale?: 'en' }) {
  const en = locale === 'en';
  const [alpha, setAlpha] = useState(-1);
  const [beta, setBeta] = useState(-2);
  const result = combineRowOperationResults(alpha, beta);

  const draw = useCallback(
    (p: p5) => {
      renderAugmentedMatrixRowOperationsExamScene(p, {
        width: p.width,
        height: p.height,
        alpha,
        beta,
        result,
        locale,
      });
    },
    [alpha, beta, result, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${alpha}|${beta}|${locale ?? ''}`,
  });

  const isOriginalQuestion =
    result.originalRightSide[0] === 0 && result.originalRightSide[1] === 1;

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'The same row operations, as a linear combination' : '相同列運算的線性組合'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'How do the columns (2, 1) and (−1, −1) combine into the target (0, 1)?'
              : '怎麼用 (2, 1) 與 (−1, −1) 組成目標 (0, 1)？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Whatever combination you use on the original constants, use it again after the row operations, and on the solution'
              : '原常數怎麼組合，列運算後的常數與解就用相同方式組合'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `The linear combination of the constant columns, after the same row operations, gives x=${result.solution[0]} and y=${result.solution[1]}`
                : `右側向量的線性組合經相同列運算後得到 x=${result.solution[0]}、y=${result.solution[1]}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Coefficients' : '組合係數'}</p>
            <div className="exam-interactive-explore__ranges">
              <label className="exam-interactive-explore__range">
                <span>{en ? 'α × first system' : 'α × 第一組'}</span>
                <output>{alpha}</output>
                <input
                  type="range"
                  aria-label={en ? 'Combination coefficient alpha of the first system' : '第一組的組合係數 alpha'}
                  min="-3"
                  max="3"
                  step="1"
                  value={alpha}
                  onInput={(event) => setAlpha(Number(event.currentTarget.value))}
                />
              </label>
              <label className="exam-interactive-explore__range">
                <span>{en ? 'β × second system' : 'β × 第二組'}</span>
                <output>{beta}</output>
                <input
                  type="range"
                  aria-label={en ? 'Combination coefficient beta of the second system' : '第二組的組合係數 beta'}
                  min="-3"
                  max="3"
                  step="1"
                  value={beta}
                  onInput={(event) => setBeta(Number(event.currentTarget.value))}
                />
              </label>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Current result' : '目前結果'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              x={result.solution[0]}
              {en ? ', ' : '，'}y={result.solution[1]}
            </p>
            <p className="exam-interactive-explore__note">
              {en ? 'Constant column' : '右側為'} ({result.originalRightSide[0]}, {result.originalRightSide[1]})
              {isOriginalQuestion
                ? en
                  ? ', the original target.'
                  : '，正好是原題目標。'
                : en
                  ? '. Move it to (0, 1) to return to the problem.'
                  : '；調整到 (0, 1) 即回到原題。'}
            </p>
          </div>

          <button
            type="button"
            className="exam-interactive-explore__mode-button"
            onClick={() => {
              setAlpha(-1);
              setBeta(-2);
            }}
          >
            {en ? 'Original problem α=−1, β=−2' : '回到原題 α=−1、β=−2'}
          </button>
        </aside>
      </div>
    </div>
  );
}
