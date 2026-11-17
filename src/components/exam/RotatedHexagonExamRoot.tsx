import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  areaOverSqrt3,
  officialTan,
  officialTheta,
} from '../../exam/amc12b-2024-19-rotated-hexagon/geometry';
import { renderRotatedHexagonExam } from '../../systems/rendering/rotatedHexagonExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.min(440, Math.max(300, Math.round(width * 0.72))) };
}

type Props = { locale?: 'en' };

const THIRTY = Math.PI / 6;
const SIXTY = Math.PI / 3;

function nearly(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-6;
}

export default function RotatedHexagonExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [theta, setTheta] = useState(THIRTY);

  const draw = useCallback(
    (p: p5) => renderRotatedHexagonExam(p, { width: p.width, height: p.height, theta }),
    [theta],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: theta,
  });

  const degrees = (theta * 180) / Math.PI;
  const over = areaOverSqrt3(theta);
  let areaText: string;
  let tanText: string;
  if (nearly(theta, officialTheta())) {
    areaText = en ? 'area = 91√3' : '面積 = 91√3';
    tanText = en ? `tan θ = 5√3/11 ≈ ${officialTan().toFixed(4)}` : `tan θ = 5√3/11 ≈ ${officialTan().toFixed(4)}`;
  } else if (nearly(theta, THIRTY)) {
    areaText = en ? 'area = 147 = 49√3 × √3' : '面積 = 147 = 49√3 × √3';
    tanText = en ? 'tan θ = 1/√3' : 'tan θ = 1/√3';
  } else if (nearly(theta, SIXTY)) {
    areaText = en ? 'area = 98√3' : '面積 = 98√3';
    tanText = en ? 'tan θ = √3' : 'tan θ = √3';
  } else {
    areaText = en ? `area / √3 ≈ ${over.toFixed(2)}` : `面積 / √3 ≈ ${over.toFixed(2)}`;
    tanText = `tan θ ≈ ${Math.tan(theta).toFixed(4)}`;
  }

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Hexagon from two equilateral triangles' : '兩個正三角形轉出的六邊形'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'At 30° or at 60°, is the hexagon area 91√3?'
              : '轉到 30° 或 60° 時，六邊形面積會是 91√3 嗎？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'White is the original triangle, gold is the rotated triangle. Cyan is the hexagon formed by the six vertices.'
              : '白色是原來的正三角形，金色是轉出來的。青色是六個頂點圍成的六邊形。'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Two equilateral triangles of side 14 rotated by ${degrees.toFixed(1)} degrees. ${areaText}. ${tanText}.`
                : `邊長 14 的兩個正三角形，轉了 ${degrees.toFixed(1)} 度。${areaText}。${tanText}。`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Rotation' : '旋轉角'}</p>
            <label className="exam-interactive-explore__range">
              <span>θ</span>
              <output>{`${degrees.toFixed(2)}°`}</output>
              <input
                id="hex-theta"
                type="range"
                aria-label={en ? 'Rotation angle' : '旋轉角'}
                min={0}
                max={60}
                step={0.01}
                value={degrees}
                onInput={(event) => setTheta((Number(event.currentTarget.value) * Math.PI) / 180)}
              />
            </label>
            <div className="exam-interactive-explore__modes">
              <button type="button" id="hex-at-30" className="exam-interactive-explore__mode-button" data-active={nearly(theta, THIRTY) ? 'true' : 'false'} aria-pressed={nearly(theta, THIRTY)} onClick={() => setTheta(THIRTY)}>
                30°
              </button>
              <button type="button" id="hex-at-60" className="exam-interactive-explore__mode-button" data-active={nearly(theta, SIXTY) ? 'true' : 'false'} aria-pressed={nearly(theta, SIXTY)} onClick={() => setTheta(SIXTY)}>
                60°
              </button>
              <button type="button" id="hex-at-target" className="exam-interactive-explore__mode-button" data-active={nearly(theta, officialTheta()) ? 'true' : 'false'} aria-pressed={nearly(theta, officialTheta())} onClick={() => setTheta(officialTheta())}>
                {en ? 'Area 91√3' : '面積 91√3'}
              </button>
            </div>
          </div>
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Reading' : '讀數'}</p>
            <p id="hex-readout" className="exam-interactive-explore__result" aria-live="polite">
              {areaText}. {tanText}.
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'At 60° the six vertices are equally spaced and the area is 98√3. At 30° it is 147.'
                : '60° 時六個頂點把圓平分，面積是 98√3。30° 時面積是 147。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
