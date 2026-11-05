import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  K_AREA,
  K_MAX,
  K_MIN,
  K_MIN_TAN,
  MIN_TAN,
  areaRatio,
  intersections,
  slope,
  tanPQR,
} from '../../exam/gaokao-2026-i-ellipse-slope-product/geometry';
import { renderEllipseSlopeProductExam } from '../../systems/rendering/ellipseSlopeProductExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(420, Math.round(width * 0.8)) };
}

type Props = { locale?: 'en' };

export default function EllipseSlopeProductExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [k, setK] = useState(2);
  const { P, Q, R } = intersections(k);
  const kQP = slope(Q, P);
  const kQR = slope(Q, R);
  const tan = tanPQR(k);

  const draw = useCallback(
    (p: p5) => renderEllipseSlopeProductExam(p, { width: p.width, height: p.height, k, locale }),
    [k, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: k,
  });

  const presets = [
    { key: 'area', label: en ? '(i) k = √5/2' : '(i) k = √5/2', value: K_AREA },
    { key: 'min', label: en ? '(ii) k = √3/2' : '(ii) k = √3/2', value: K_MIN_TAN },
  ];

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'A slope product that never moves' : '不會變的斜率積'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'P and R are opposite ends of a diameter. As l turns, what happens to k_QP · k_QR?'
              : 'P、R 是一條直徑的兩端。l 轉動時，k_QP · k_QR 會怎樣？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Top: the ellipse, l through F (gold), and QR (cyan). Bottom: tan∠PQR against k.'
              : '上方是橢圓、過 F 的直線 l（金）與 QR（青）。下方是 tan∠PQR 對 k 的曲線'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Ellipse with l of slope ${k.toFixed(2)}, tan of angle PQR ${tan.toFixed(3)}`
                : `橢圓與斜率 ${k.toFixed(2)} 的直線 l，tan∠PQR = ${tan.toFixed(3)}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Slope of l' : '直線 l 的斜率'}</p>
            <label className="exam-interactive-explore__range">
              <span>k</span>
              <output>{k.toFixed(2)}</output>
              <input
                type="range"
                aria-label={en ? 'Slope k' : '斜率 k'}
                min={K_MIN}
                max={K_MAX}
                step={0.01}
                value={k}
                onInput={(event) => setK(Number(event.currentTarget.value))}
              />
            </label>
            <div className="exam-interactive-explore__modes">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  className="exam-interactive-explore__mode-button"
                  data-active={Math.abs(k - preset.value) < 1e-9}
                  aria-pressed={Math.abs(k - preset.value) < 1e-9}
                  onClick={() => setK(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Slopes at Q' : 'Q 點的斜率'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              k_QP · k_QR = {(kQP * kQR).toFixed(4)}
            </p>
            <p className="exam-interactive-explore__note">
              k_QP = {kQP.toFixed(3)}，k_QR = {kQR.toFixed(3)}
            </p>
            <p className="exam-interactive-explore__note">
              P({P.x.toFixed(2)}, {P.y.toFixed(2)})，Q({Q.x.toFixed(2)}, {Q.y.toFixed(2)})，R({R.x.toFixed(2)},{' '}
              {R.y.toFixed(2)})
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Two sub-questions' : '兩個小題'}</p>
            <p className="exam-interactive-explore__note">
              {en
                ? `(i) Area of △PQR over area of △PFO: ${areaRatio(k).toFixed(3)}. It equals 3 at k = √5/2.`
                : `(i) △PQR 與 △PFO 的面積比：${areaRatio(k).toFixed(3)}，k = √5/2 時等於 3。`}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `(ii) tan∠PQR = ${tan.toFixed(3)}. Its minimum is 4√3 ≈ ${MIN_TAN.toFixed(3)} at k = √3/2.`
                : `(ii) tan∠PQR = ${tan.toFixed(3)}，最小值 4√3 ≈ ${MIN_TAN.toFixed(3)}，在 k = √3/2。`}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
