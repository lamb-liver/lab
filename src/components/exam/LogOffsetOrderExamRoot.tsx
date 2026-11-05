import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  CROSSINGS,
  DEFAULT_K,
  K_MAX,
  K_MIN,
  OPTIONS,
  clampK,
  orderAt,
  orderLabel,
  segments,
  value,
} from '../../exam/gaokao-2025-i-log-offset-order/geometry';
import { renderLogOffsetOrderExam } from '../../systems/rendering/logOffsetOrderExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.66)) };
}

function fmt(v: number): string {
  if (v >= 1000 || v < 0.01) return v.toExponential(2);
  return v.toFixed(v >= 100 ? 1 : 3);
}

// 四段順序只跟常數有關，模組載入時算一次
const REACHABLE_ORDERS = segments().map((s) => orderLabel(s.order));

type Props = { locale?: 'en' };

export default function LogOffsetOrderExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [k, setK] = useState(DEFAULT_K);
  const order = orderLabel(orderAt(k));

  const draw = useCallback(
    (p: p5) => {
      renderLogOffsetOrderExam(p, { width: p.width, height: p.height, k });
    },
    [k],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: k,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'One shared value k, three straight lines' : '同一個 k，三條直線'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'x, y, z all move with the same k. Which of the four orders never shows up anywhere along the k axis?'
              : 'x、y、z 跟著同一個 k 動。四種順序裡，哪一種在整條 k 軸上都找不到？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'After taking logs, ln x = (k−2)ln 2, ln y = (k−3)ln 3, ln z = (k−5)ln 5 are lines in k. The three crossings cut the k axis into four stretches.'
              : '取對數後 ln x = (k−2)ln 2、ln y = (k−3)ln 3、ln z = (k−5)ln 5 都是 k 的直線。三個交點把 k 軸切成四段'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Lines ln x, ln y, ln z against k, with k = ${k.toFixed(2)} and order ${order}`
                : `ln x、ln y、ln z 對 k 的三條直線，目前 k = ${k.toFixed(2)}，順序 ${order}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Shared value' : '共同值'}</p>
            <label className="exam-interactive-explore__range">
              <span>k</span>
              <output>{k.toFixed(2)}</output>
              <input
                id="log-offset-k"
                type="range"
                aria-label={en ? 'Shared value k' : '共同值 k'}
                min={K_MIN}
                max={K_MAX}
                step={0.01}
                value={k}
                onInput={(event) => setK(clampK(Number(event.currentTarget.value)))}
              />
            </label>
            <p className="exam-interactive-explore__note">
              x = 2^(k−2) ≈ {fmt(value('x', k))}，y = 3^(k−3) ≈ {fmt(value('y', k))}，z = 5^(k−5) ≈{' '}
              {fmt(value('z', k))}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Order now' : '目前順序'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {order}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `Crossings: x = y at k ≈ ${CROSSINGS.xy.toFixed(2)}, x = z at k ≈ ${CROSSINGS.xz.toFixed(2)}, y = z at k ≈ ${CROSSINGS.yz.toFixed(2)}.`
                : `交點：k ≈ ${CROSSINGS.xy.toFixed(2)} 時 x = y，k ≈ ${CROSSINGS.xz.toFixed(2)} 時 x = z，k ≈ ${CROSSINGS.yz.toFixed(2)} 時 y = z。`}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'The four options' : '四個選項'}</p>
            {OPTIONS.map((option) => {
              const label = orderLabel(option.order);
              const reachable = REACHABLE_ORDERS.includes(label);
              return (
                <p key={option.key} className="exam-interactive-explore__note">
                  {option.key}. {label}
                  {' — '}
                  {reachable ? (en ? 'appears' : '會出現') : en ? 'never appears' : '不會出現'}
                </p>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
