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

export default function AugmentedMatrixRowOperationsExamRoot() {
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
      });
    },
    [alpha, beta, result],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${alpha}|${beta}`,
  });

  const isOriginalQuestion =
    result.originalRightSide[0] === 0 && result.originalRightSide[1] === 1;

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">相同列運算的線性組合</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            怎麼用 (2, 1) 與 (−1, −1) 組成目標 (0, 1)？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            原常數怎麼組合，列運算後的常數與解就用相同方式組合
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`右側向量的線性組合經相同列運算後得到 x=${result.solution[0]}、y=${result.solution[1]}`}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">組合係數</p>
            <div className="exam-interactive-explore__ranges">
              <label className="exam-interactive-explore__range">
                <span>α × 第一組</span>
                <output>{alpha}</output>
                <input
                  type="range"
                  aria-label="第一組的組合係數 alpha"
                  min="-3"
                  max="3"
                  step="1"
                  value={alpha}
                  onInput={(event) => setAlpha(Number(event.currentTarget.value))}
                />
              </label>
              <label className="exam-interactive-explore__range">
                <span>β × 第二組</span>
                <output>{beta}</output>
                <input
                  type="range"
                  aria-label="第二組的組合係數 beta"
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
            <p className="exam-interactive-explore__block-title">目前結果</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              x={result.solution[0]}，y={result.solution[1]}
            </p>
            <p className="exam-interactive-explore__note">
              右側為 ({result.originalRightSide[0]}, {result.originalRightSide[1]})
              {isOriginalQuestion ? '，正好是原題目標。' : '；調整到 (0, 1) 即回到原題。'}
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
            回到原題 α=−1、β=−2
          </button>
        </aside>
      </div>
    </div>
  );
}
