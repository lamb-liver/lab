import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  TRANSLATED_VERTEX_H,
  translatedVertex,
} from '../../exam/gsat-115-parabola-restricted-translation/geometry';
import { renderParabolaRestrictedTranslationExamScene } from '../../systems/rendering/parabolaRestrictedTranslationExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

type CandidateH = 0 | typeof TRANSLATED_VERTEX_H;

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

export default function ParabolaRestrictedTranslationExamRoot({ locale }: { locale?: 'en' }) {
  const en = locale === 'en';
  const [selectedH, setSelectedH] = useState<CandidateH | null>(null);
  const q = selectedH === null ? null : translatedVertex(selectedH);

  const draw = useCallback(
    (p: p5) => {
      renderParabolaRestrictedTranslationExamScene(p, {
        width: p.width,
        height: p.height,
        selectedH,
      });
    },
    [selectedH],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: selectedH,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Two constraints, two candidate positions' : '兩個限制 → 兩個候選位置'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The translated graph still passes through B. Does staying put count?'
              : '平移後仍通過 B，原地不動也算答案嗎？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'The vertex moves along the line ℓ; compare the two positions that still pass through B'
              : '頂點沿直線 ℓ 移動；比較兩個仍通過 B 的位置'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              q
                ? en
                  ? `The original parabola has vertex P at (0, 1). Candidate vertex Q is at (${q.x}, ${q.y}). Both graphs pass through B`
                  : `原拋物線頂點 P 為 (0,1)，候選頂點 Q 為 (${q.x},${q.y})，兩圖都通過 B`
                : en
                  ? 'The original parabola, the line that restricts the vertex, and the fixed point B'
                  : '原拋物線、頂點限制直線與固定點 B'
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Candidate vertex' : '選擇候選頂點'}
            </p>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={selectedH === 0}
                aria-pressed={selectedH === 0}
                onClick={() => setSelectedH(0)}
              >
                {en ? 'h=0, Q=(0,1)' : 'h=0，Q=(0,1)'}
              </button>
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={selectedH === TRANSLATED_VERTEX_H}
                aria-pressed={selectedH === TRANSLATED_VERTEX_H}
                onClick={() => setSelectedH(TRANSLATED_VERTEX_H)}
              >
                {en ? 'h=3/2, Q=(3/2,4)' : 'h=3/2，Q=(3/2,4)'}
              </button>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Decision' : '判斷'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {selectedH === null
                ? en
                  ? 'Pick a candidate first'
                  : '先選一個候選位置'
                : selectedH === 0
                  ? en
                    ? 'Ruled out: Q=P, not distinct'
                    : '排除：Q=P，不是相異點'
                  : en
                    ? 'Holds: PQ=3√5/2'
                    : '成立：PQ=3√5/2'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Passing through B gives h=0 or h=3/2. Distinct P and Q then rules out h=0.'
                : '通過 B 會得到 h=0 或 h=3/2；題目再用 P、Q 相異排除 h=0。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Translation distance' : '平移距離'}
            </p>
            <p className="exam-interactive-explore__result">
              |PQ|=|h|√(1²+2²)
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Both vertices lie on y=1+2x, so the translation vector is (h, 2h).'
                : '頂點都在 y=1+2x 上，所以平移向量是 (h,2h)。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
