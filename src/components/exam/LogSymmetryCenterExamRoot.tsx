import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_N,
  N_MAX,
  N_MIN,
  readBend,
  type BendReading,
} from '../../exam/gaokao-2024-i-log-symmetry-center/geometry';
import { renderLogSymmetryCenterExam } from '../../systems/rendering/logSymmetryCenterExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  if (width < 640) return { width, height: Math.round(Math.max(320, width * 1.05)) };
  return { width, height: Math.max(360, Math.round(width * 0.56)) };
}

function bText(reading: BendReading): string {
  if (reading.n === 0) return '0';
  if (reading.n === 20) return '1';
  if (reading.n === -20) return '−1';
  return reading.b.toFixed(2).replace('-', '−');
}

type Props = { locale?: 'en' };

export default function LogSymmetryCenterExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [n, setN] = useState(DEFAULT_N);
  const reading = readBend(n);

  const draw = useCallback(
    (p: p5) => {
      renderLogSymmetryCenterExam(p, { width: p.width, height: p.height, n });
    },
    [n],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: n,
  });

  const bendNote = reading.atZero
    ? en
      ? 'The cubic term is 0. The tangent at the center has slope 3.'
      : '立方項是 0。中心處的切線斜率是 3。'
    : en
      ? 'The curve has bent. The center and its tangent have not moved.'
      : '曲線已經彎了。中心和那裡的切線都沒有動。';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'The center stays put while the cubic bends the curve' : '立方項把曲線彎開，中心不動'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? ' The cubic term lifts one side and lowers the other. Why does the midpoint stay at (1, 1)?'
              : ' 立方項把一邊抬高、一邊壓低。為什麼中點還停在 (1, 1)？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'This page fixes a = 1, so the center is (1, 1). The white segment joins a pair of points on the curve. The short gold line is the tangent there, and its slope does not follow the cubic term.'
              : '這一頁把 a 固定成 1，所以中心是 (1, 1)。白線連接曲線上的一對點。短金線是這一點的切線，斜率不跟著立方項變。'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Cubic term ${bText(reading)}, center (1, 1), tangent slope 3`
                : `立方項 ${bText(reading)}，對稱中心 (1, 1)，切線斜率 3`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Cubic term' : '立方項'}</p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Cubic term' : '立方項'}</span>
              <output>{bText(reading)}</output>
              <input
                id="cubic-term"
                type="range"
                aria-label={en ? 'Cubic term' : '立方項'}
                aria-valuetext={bText(reading)}
                min={N_MIN}
                max={N_MAX}
                step={1}
                value={reading.n}
                onInput={(event) => setN(readBend(Number(event.currentTarget.value)).n)}
              />
            </label>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Zero is the curve without the cubic term. a stays at 1.'
                : '0 是沒有立方項的曲線。a 保持為 1。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Center of symmetry' : '對稱中心'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              (1, 1)
            </p>
            <p className="exam-interactive-explore__note">{bendNote}</p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'The pair' : '這一對點'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {reading.leftY.toFixed(2).replace('-', '−')} , {reading.rightY.toFixed(2).replace('-', '−')}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'These are the heights at 0.2 and 1.8. Their average is 1.'
                : '這是 x = 0.2 與 x = 1.8 的高度。平均是 1。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
