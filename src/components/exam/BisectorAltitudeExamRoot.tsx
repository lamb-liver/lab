import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  renderBisectorAltitudeExam,
  type BisectorMode,
} from '../../systems/rendering/bisectorAltitudeExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.min(320, Math.max(200, Math.round(width * 0.48))) };
}

type Props = { locale?: 'en' };

const COPY = {
  bd: {
    zh: '整條角平分線 BD 長 48。',
    en: 'The whole bisector BD has length 48.',
  },
  pd: {
    zh: '截下的 PD 長 27，與 CD 同長。45 減 27 是 18。',
    en: 'The cut segment PD has length 27, the same as CD. 45 minus 27 is 18.',
  },
  bp: {
    zh: '剩下的 BP 長 21。48 減 27 是 21。',
    en: 'The remaining length BP is 21. 48 minus 27 is 21.',
  },
} as const;

export default function BisectorAltitudeExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [mode, setMode] = useState<BisectorMode>('bd');
  const reading = en ? COPY[mode].en : COPY[mode].zh;

  const draw = useCallback(
    (p: p5) => renderBisectorAltitudeExam(p, { width: p.width, height: p.height, mode }),
    [mode],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: mode,
  });

  const sub =
    mode === 'bd'
      ? en
        ? 'Gold is the whole bisector from B to D. The altitude is still hidden.'
        : '金色是整條角平分線，從 B 到 D。高還沒有畫出來。'
      : en
        ? 'Cyan is the altitude from C to AB. Gold is the piece named in the reading. The pale line is the rest of the bisector.'
        : '青色是 C 到 AB 的高。金色是讀數點名的那一段。淡線是角平分線的其餘部分。';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'The altitude cuts the bisector' : '高把角平分線截開'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The whole bisector has length 48. Is that the length the problem asks for?'
              : '整條角平分線長 48。題目問的是這個長度嗎？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">{sub}</p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Triangle with sides 80, 45, and 75. ${reading}`
                : `三邊 80、45、75 的三角形。${reading}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Which piece' : '看哪一段'}</p>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                id="bisector-bd"
                className="exam-interactive-explore__mode-button"
                data-active={mode === 'bd' ? 'true' : 'false'}
                aria-pressed={mode === 'bd'}
                onClick={() => setMode('bd')}
              >
                {en ? 'Whole BD' : '整條 BD'}
              </button>
              <button
                type="button"
                id="bisector-pd"
                className="exam-interactive-explore__mode-button"
                data-active={mode === 'pd' ? 'true' : 'false'}
                aria-pressed={mode === 'pd'}
                onClick={() => setMode('pd')}
              >
                {en ? 'The cut segment' : '截下的一段'}
              </button>
              <button
                type="button"
                id="bisector-bp"
                className="exam-interactive-explore__mode-button"
                data-active={mode === 'bp' ? 'true' : 'false'}
                aria-pressed={mode === 'bp'}
                onClick={() => setMode('bp')}
              >
                {en ? 'Remaining BP' : '剩下的 BP'}
              </button>
            </div>
            <p id="bisector-readout" className="exam-interactive-explore__result" aria-live="polite">
              {reading}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'D splits AC into 48 and 27. P is where the altitude meets the bisector.'
                : 'D 把 AC 分成 48 與 27。P 是高與角平分線的交點。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
