import { useCallback, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  EMPTY_TALLY,
  EXPECTATION,
  averageX,
  makeRng,
  runRounds,
  type Tally,
} from '../../exam/gaokao-2025-i-distinct-balls-expectation/geometry';
import { renderDistinctBallsExam } from '../../systems/rendering/distinctBallsExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(320, Math.round(width * 0.6)) };
}

type Props = { locale?: 'en' };

export default function DistinctBallsExpectationExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const rngRef = useRef(makeRng(20250607));
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY);
  const avg = averageX(tally);

  const draw = useCallback(
    (p: p5) => {
      renderDistinctBallsExam(p, { width: p.width, height: p.height, tally, locale });
    },
    [tally, locale],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: tally,
  });

  const run = (n: number) => setTally((t) => runRounds(t, rngRef.current, n));
  const reset = () => {
    rngRef.current = makeRng(20250607);
    setTally(EMPTY_TALLY);
  };

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'One lamp per ball' : '每顆球一盞燈'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'X counts lit lamps. Can you get E(X) without listing P(X = 1), P(X = 2), P(X = 3)?'
              : 'X 是亮燈的數目。不列出 P(X=1)、P(X=2)、P(X=3)，能算出 E(X) 嗎？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Each round draws three times with replacement. Bars show how often each ball shows up at least once.'
              : '每一輪有放回地取三次。長條是每顆球在幾成的輪數裡至少出現一次'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Five balls after ${tally.rounds} rounds, average X ${avg === null ? 'not yet' : avg.toFixed(3)}`
                : `五顆球，已抽 ${tally.rounds} 輪，X 的平均 ${avg === null ? '尚無' : avg.toFixed(3)}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Draw' : '抽球'}</p>
            <div className="exam-interactive-explore__modes">
              <button type="button" className="exam-interactive-explore__mode-button" onClick={() => run(1)}>
                {en ? 'One round' : '抽一輪'}
              </button>
              <button type="button" className="exam-interactive-explore__mode-button" onClick={() => run(100)}>
                {en ? '100 rounds' : '抽 100 輪'}
              </button>
              <button type="button" className="exam-interactive-explore__mode-button" onClick={() => run(1000)}>
                {en ? '1000 rounds' : '抽 1000 輪'}
              </button>
              <button type="button" className="exam-interactive-explore__mode-button" onClick={reset}>
                {en ? 'Reset' : '重設'}
              </button>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Average X' : 'X 的平均'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {avg === null
                ? en
                  ? 'No rounds yet'
                  : '還沒抽'
                : `${avg.toFixed(3)}（${tally.rounds} ${en ? 'rounds' : '輪'}）`}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `Five lamps, each lit with probability 1 − (4/5)³ = 61/125, so E(X) = 5 · 61/125 = 61/25 = ${EXPECTATION.toFixed(2)}.`
                : `五盞燈，每盞亮的機率 1 − (4/5)³ = 61/125，所以 E(X) = 5 · 61/125 = 61/25 = ${EXPECTATION.toFixed(2)}。`}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Same answer, listed' : '列分佈核對'}</p>
            <p className="exam-interactive-explore__note">
              P(X=1) = 5/125，P(X=2) = 60/125，P(X=3) = 60/125
            </p>
            <p className="exam-interactive-explore__note">
              {en ? 'Weighted sum 305/125 = 61/25.' : '加權和 305/125 = 61/25。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
