import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_N,
  N_MAX,
  N_MIN,
  pairedLabels,
  readStage,
  type StageReading,
} from '../../exam/gaokao-2024-ii-two-stage-shooting/geometry';
import { renderTwoStageShootingExam } from '../../systems/rendering/twoStageShootingExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  if (width < 640) return { width, height: Math.round(Math.max(320, width * 1.05)) };
  return { width, height: Math.max(360, Math.round(width * 0.56)) };
}

function fiveText(reading: StageReading): string {
  return reading.atLeastFive.toFixed(3);
}

type Props = { locale?: 'en' };

export default function TwoStageShootingExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [n, setN] = useState(DEFAULT_N);
  const reading = readStage(n);
  const chance = pairedLabels(reading.chanceGold, reading.chanceWhite, 3);
  const score = pairedLabels(reading.scoreGold, reading.scoreWhite, 2);

  const draw = useCallback(
    (p: p5) => {
      renderTwoStageShootingExam(p, { width: p.width, height: p.height, n });
    },
    [n],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: n,
  });

  const fiveNote = reading.atGiven
    ? en
      ? `With A first, the probability of scoring at least 5 is ${fiveText(reading)}.`
      : `甲先打時，得分不少於 5 的機率是 ${fiveText(reading)}。`
    : en
      ? 'Gold is A on the qualifying round. White is B. Both comparisons keep gold ahead.'
      : '金色是甲打資格賽，白色是乙打。兩種比較都是金色較大。';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'The chance of 15, and the expected score' : '15 分的機率，與期望得分'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? ' If both the chance of 15 and the expected score should be as large as possible, who takes the qualifying round?'
              : ' 若要 15 分的機率與期望得分都最大，資格賽該由誰來投？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Gold is A on the qualifying round, and white is B. Each panel is scaled to its longer bar. The panel marked 15 is a probability, and the panel marked E is the expected score.'
              : '金色是甲打資格賽，白色是乙打。每一側用較長的那條當尺度。標 15 的是機率，標 E 的是期望得分。'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `B’s hit rate ${reading.rateText}. A takes the qualifying round.`
                : `乙的命中率 ${reading.rateText}，資格賽由甲投`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'B’s hit rate' : '乙的命中率'}</p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'B’s hit rate' : '乙的命中率'}</span>
              <output>{reading.rateText}</output>
              <input
                id="hit-rate"
                type="range"
                aria-label={en ? 'B’s hit rate' : '乙的命中率'}
                min={N_MIN}
                max={N_MAX}
                step={1}
                value={n}
                aria-valuetext={reading.rateText}
                onInput={(event) => setN(readStage(Number(event.currentTarget.value)).n)}
              />
            </label>
            <p className="exam-interactive-explore__note">
              {en
                ? 'A is fixed at 0.40, below B. 0.50 is the rate given for B. Dragging right makes B more accurate.'
                : '甲固定 0.40，低於乙。0.50 是題目給的乙。往右乙更準。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Qualifying round' : '資格賽'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {en ? 'A' : '甲'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Both the chance of 15 and the expected score are larger when A qualifies.'
                : '15 分的機率與期望得分，都是甲打資格賽比較大。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'The two orders' : '兩種排法'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {`15  ${chance.gold} > ${chance.white}`}
              <br />
              {`E  ${score.gold} > ${score.white}`}
            </p>
            <p className="exam-interactive-explore__note">{fiveNote}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
