import { useCallback, useEffect, useRef, useState } from 'react';
import type p5 from 'p5';
import { matrixText } from '../../curve/modules/matrix-linear-transform/matrix';
import {
  comparisonOptions,
  getComparison,
  type ComparisonId,
} from '../../exam/gsat-112-rotation-composition/geometry';
import { renderRotationCompositionExamScene } from '../../systems/rendering/rotationCompositionExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

const ANIMATION_MS = 900;

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(260, Math.round(width * 0.58)) };
}

export default function RotationCompositionExamRoot() {
  const [comparisonId, setComparisonId] = useState<ComparisonId>('rotations');
  const [hasInteracted, setHasInteracted] = useState(false);
  const comparisonRef = useRef(getComparison(comparisonId));
  const progressRef = useRef(0);
  const comparison = getComparison(comparisonId);

  useEffect(() => {
    comparisonRef.current = getComparison(comparisonId);
    progressRef.current = 0;
  }, [comparisonId]);

  const draw = useCallback((p: p5) => {
    progressRef.current = Math.min(
      1,
      progressRef.current + Math.min(p.deltaTime, 50) / ANIMATION_MS,
    );
    const current = comparisonRef.current;

    renderRotationCompositionExamScene(p, {
      width: p.width,
      height: p.height,
      leftLabel: current.left,
      rightLabel: current.right,
      leftFirstLabel: current.leftSteps.first,
      leftSecondLabel: current.leftSteps.second,
      rightFirstLabel: current.rightSteps.first,
      rightSecondLabel: current.rightSteps.second,
      leftFirstMatrix: current.leftSteps.firstMatrix,
      rightFirstMatrix: current.rightSteps.firstMatrix,
      leftMatrix: current.leftMatrix,
      rightMatrix: current.rightMatrix,
      progress: progressRef.current,
    });

    return { keepLooping: progressRef.current < 1 };
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureCanvas, undefined, {
    restartOn: [comparisonId],
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">矩陣合成比較</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            相同兩個變換調換順序，結果一定相同嗎？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            圖形會依序演出：乘積 XY 先做 Y，再做 X
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`${comparison.left} 與 ${comparison.right} 的變換結果比較`}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">選擇比較</p>
            <div className="exam-interactive-explore__modes">
              {comparisonOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="exam-interactive-explore__mode-button"
                  data-active={comparisonId === option.id}
                  aria-pressed={comparisonId === option.id}
                  onClick={() => {
                    setComparisonId(option.id);
                    setHasInteracted(true);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {hasInteracted ? (
            <>
              <div className="exam-interactive-explore__block">
                <p className="exam-interactive-explore__block-title">判斷</p>
                <p className="exam-interactive-explore__result" aria-live="polite">
                  {comparison.left} {comparison.equal ? '=' : '≠'} {comparison.right}
                </p>
                <p className="exam-interactive-explore__note">{comparison.note}</p>
              </div>

              <div className="exam-interactive-explore__block">
                <p className="exam-interactive-explore__block-title">矩陣</p>
                <p className="exam-interactive-explore__matrix">
                  {comparison.left} = {matrixText(comparison.leftMatrix)}
                </p>
                <p className="exam-interactive-explore__matrix">
                  {comparison.right} = {matrixText(comparison.rightMatrix)}
                </p>
              </div>
            </>
          ) : (
            <div className="exam-interactive-explore__block">
              <p className="exam-interactive-explore__block-title">先判斷</p>
              <p className="exam-interactive-explore__note">
                觀察兩邊的兩段變換，再選一組查看結論。
              </p>
            </div>
          )}

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">四個基本變換</p>
            <p className="exam-interactive-explore__note">
              A：順時針 90°　B：逆時針 90°
              <br />
              C：對 x=y 鏡射　D：對 x=−y 鏡射
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
