import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_N,
  N_MAX,
  N_MIN,
  readLead,
  type LeadReading,
} from '../../exam/gaokao-2025-ii-two-point-lead/geometry';
import { renderTwoPointLeadExam } from '../../systems/rendering/twoPointLeadExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  if (width < 640) return { width, height: Math.round(Math.max(320, width * 1.05)) };
  return { width, height: Math.max(360, Math.round(width * 0.56)) };
}

function rateText(reading: LeadReading): string {
  if (reading.atAnswer) return '2/3';
  return reading.p.toFixed(3);
}

function ratioText(reading: LeadReading): string {
  if (reading.atAnswer) return '4';
  const nearest = Math.round(reading.gapRatio);
  if (Math.abs(reading.gapRatio - nearest) < 1e-6) return String(nearest);
  return reading.gapRatio.toFixed(2);
}

function chainText(reading: LeadReading): string {
  const at = (k: number) => reading.steps.find((step) => step.k === k)?.difference ?? 0;
  return `${at(3).toFixed(2)} < ${at(2).toFixed(2)} < ${at(4).toFixed(2)}`;
}

type Props = { locale?: 'en' };

export default function TwoPointLeadExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [n, setN] = useState(DEFAULT_N);
  const reading = readLead(n);

  const draw = useCallback(
    (p: p5) => {
      renderTwoPointLeadExam(p, { width: p.width, height: p.height, n });
    },
    [n],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: n,
  });

  const ratioNote = reading.atAnswer
    ? en
      ? 'The gap ratio is (p/q)². Here p/q = 2, so the ratio is 4.'
      : '差距比是 (p/q)²。這裡 p/q = 2，比值就是 4。'
    : en
      ? 'The gap ratio is (p/q)². The ratio is 4 when p/q is 2.'
      : '差距比是 (p/q)²。要讓比值等於 4，p/q 得是 2。';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'The squared gap, and the lead after each count' : '差距的平方，與每次打完的領先差'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? ' When the gap ratio equals 4, what is A’s win rate on each point?'
              : ' 差距比等於 4 時，甲每球的勝率是多少？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'The gold bar is how much A’s lead probability grows from three points to four. The white bar is B’s. The tick marks p/q. The other panel runs from 2 points to 8, and odd counts are gold.'
              : '金條是甲從三球到四球增加的領先機率，白條是乙的。刻度標的是 p/q。另一側由 2 球排到 8 球，奇數次用金色。'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Win rate ${rateText(reading)}, gap ratio ${ratioText(reading)}`
                : `甲每球勝率 ${rateText(reading)}，差距比 ${ratioText(reading)}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Win rate per point' : '甲每球勝率'}
            </p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Win rate per point' : '甲每球勝率'}</span>
              <output>{rateText(reading)}</output>
              <input
                id="win-rate"
                type="range"
                aria-label={en ? 'Win rate per point' : '甲每球勝率'}
                min={N_MIN}
                max={N_MAX}
                step={1}
                value={n}
                aria-valuetext={rateText(reading)}
                onInput={(event) => setN(readLead(Number(event.currentTarget.value)).n)}
              />
            </label>
            <p className="exam-interactive-explore__note">
              {en
                ? 'At 2/3 the gap ratio is 4. Dragging right means A wins more often.'
                : '2/3 時差距比是 4。往右拖，甲更常贏。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Gap ratio' : '差距比'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {ratioText(reading)}
            </p>
            <p className="exam-interactive-explore__note">{ratioNote}</p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Lead difference' : '領先差'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {chainText(reading)}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'An odd count sits below the even count before it, and the next even count sits higher.'
                : '奇數次的領先差比前一個偶數次低，再下一個偶數次又更高。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
