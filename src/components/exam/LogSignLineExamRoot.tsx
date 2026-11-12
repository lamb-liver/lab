import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_OFFSET,
  OFFSET_MAX,
  OFFSET_MIN,
  readLogSign,
  type LogSignReading,
} from '../../exam/gaokao-2024-ii-log-sign-line/geometry';
import { renderLogSignExam } from '../../systems/rendering/logSignLineExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  if (width < 640) return { width, height: Math.round(Math.max(320, width * 1.05)) };
  return { width, height: Math.max(360, Math.round(width * 0.56)) };
}

function coeff(value: number, target: number, label: string): string {
  if (Math.abs(value - target) < 0.005) return label;
  return value.toFixed(2).replace('-', '−');
}

function squaredText(reading: LogSignReading): string {
  if (reading.atMinimum) return '1/2';
  return reading.squared.toFixed(3);
}

function pairText(reading: LogSignReading): string {
  const a = coeff(reading.a, -0.5, '−1/2');
  const b = coeff(reading.b, 0.5, '1/2');
  return `a = ${a}，b = ${b}`;
}

type Props = { locale?: 'en' };

export default function LogSignLineExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const reading = readLogSign(offset);

  const draw = useCallback(
    (p: p5) => {
      renderLogSignExam(p, { width: p.width, height: p.height, offset });
    },
    [offset],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: offset,
  });

  const signBody = reading.onLine
    ? en
      ? 'The two sign changes meet'
      : '兩個變號點重合'
    : en
      ? 'Negative between the sign changes'
      : '兩個變號點之間是負的';

  const trap = reading.atMinimum
    ? en
      ? 'Any closer point leaves the line, and the function is negative between the sign changes.'
      : '再靠近原點就離開直線，兩個變號點之間的函數值是負的。'
    : reading.squared < 0.5
      ? en
        ? 'This point is closer than 1/2, and it is off the line.'
        : '這點比 1/2 更近，已經不在直線上。'
      : en
        ? 'This point is farther than the foot, and the sign changes have split.'
        : '這點比垂足更遠，兩個變號點已經分開。';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'The line, the circle, and the sign' : '直線、圓，與函數的符號'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The origin sits at the center of the circle, so its squared distance is 0. When the function stays non-negative on its whole domain, why is the least value 1/2?'
              : '原點在圓心，距離平方是 0。函數在整個定義域上不負時，為什麼最小值是 1/2？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'The gold line is b = a + 1. The circle touches it at the foot. The white point moves along the perpendicular, and the other panel marks the two sign changes.'
              : '金線是 b = a + 1。圓與金線相切於垂足。白點沿垂線移動，另一側標出兩個變號點。'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Point at offset ${reading.offset.toFixed(2)} from the line b = a + 1, with squared distance ${squaredText(reading)}`
                : `離開直線 b = a + 1 的偏移 ${reading.offset.toFixed(2)}，距離平方 ${squaredText(reading)}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Offset from the line' : '離開直線'}
            </p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Offset from the line' : '離開直線'}</span>
              <output>{reading.offset.toFixed(2).replace('-', '−')}</output>
              <input
                id="sign-offset"
                type="range"
                aria-label={en ? 'Offset from the line' : '離開直線'}
                min={OFFSET_MIN}
                max={OFFSET_MAX}
                step={0.01}
                value={offset}
                onInput={(event) => setOffset(readLogSign(Number(event.currentTarget.value)).offset)}
              />
            </label>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Zero sits on the line b = a + 1. Dragging left moves toward the origin.'
                : '0 停在直線 b = a + 1 上。往左拖朝原點。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Squared distance' : '距離平方'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {squaredText(reading)}
            </p>
            <p className="exam-interactive-explore__note">{en ? pairText(reading).replace('，', ', ') : pairText(reading)}</p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Sign changes' : '變號點'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {signBody}
            </p>
            <p className="exam-interactive-explore__note">{trap}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
