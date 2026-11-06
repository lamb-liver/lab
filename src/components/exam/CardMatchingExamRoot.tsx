import { useCallback, useState } from 'react';
import type p5 from 'p5';
import { JIA, MATCHINGS, YI, distribution, score } from '../../exam/gaokao-2024-i-card-matching/geometry';
import { renderCardMatchingExam } from '../../systems/rendering/cardMatchingExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(360, Math.round(width * (width < 520 ? 1.1 : 0.64))) };
}

const DIST = distribution();

type Props = { locale?: 'en' };

export default function CardMatchingExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [index, setIndex] = useState(0);
  const [onlyWins, setOnlyWins] = useState(false);
  const m = MATCHINGS[index];
  const s = score(m);
  const pairs = m.map((j, i) => `${JIA[i]}–${YI[j]}`).join(en ? ', ' : '、');

  const draw = useCallback(
    (p: p5) => renderCardMatchingExam(p, { width: p.width, height: p.height, index, onlyWins, locale }),
    [index, onlyWins, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${index}-${onlyWins}`,
  });

  const step = (dir: number) => {
    let i = index;
    do i = (i + dir + 24) % 24;
    while (onlyWins && score(MATCHINGS[i]) < 2);
    setIndex(i);
  };

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? '24 ways to match the cards' : '24 種配對'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The order of the rounds does not change the score. What does?'
              : '四輪的先後不影響得分。真正決定得分的是什麼？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Top: A’s cards (gold) matched to B’s (cyan); gold lines are rounds A wins. Bottom: all 24 matchings with A’s score; gold tiles score 2 or more.'
              : '上方是甲（金）對上乙（青）的配對，金線是甲贏的一輪。下方是 24 種配對與甲的得分，金色格子得分至少 2'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en ? `Matching ${index + 1} of 24: ${pairs}, A scores ${s}` : `第 ${index + 1} 種配對：${pairs}，甲得 ${s} 分`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Matching' : '配對'}</p>
            <div className="exam-interactive-explore__modes">
              <button type="button" className="exam-interactive-explore__mode-button" onClick={() => step(-1)}>
                {en ? 'Previous' : '上一種'}
              </button>
              <button type="button" className="exam-interactive-explore__mode-button" onClick={() => step(1)}>
                {en ? 'Next' : '下一種'}
              </button>
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={onlyWins}
                aria-pressed={onlyWins}
                onClick={() => {
                  setOnlyWins((v) => !v);
                  if (!onlyWins && score(MATCHINGS[index]) < 2) setIndex(MATCHINGS.findIndex((mm) => score(mm) >= 2));
                }}
              >
                {en ? 'Only score ≥ 2' : '只看得分 ≥ 2'}
              </button>
            </div>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {en ? `${index + 1}/24: ${pairs}, A scores ${s}` : `${index + 1}/24：${pairs}，甲得 ${s} 分`}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Score count' : '得分統計'}</p>
            {[0, 1, 2, 3].map((k) => (
              <p key={k} className="exam-interactive-explore__note">
                {en ? `${k} point${k === 1 ? '' : 's'}: ${DIST[k]} of 24` : `${k} 分：24 種中 ${DIST[k]} 種`}
              </p>
            ))}
            <p className="exam-interactive-explore__note">
              {en
                ? `Score ≥ 2: ${DIST[2] + DIST[3]}/24 = 1/2.`
                : `得分至少 2：${DIST[2] + DIST[3]}/24 = 1/2。`}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
