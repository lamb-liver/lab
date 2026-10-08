import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  ORIGINAL_APEX_ANGLE,
  buildIsoscelesConstruction,
} from '../../exam/ast-112-isosceles-120-construction/geometry';
import { renderIsosceles120ConstructionExamScene } from '../../systems/rendering/isosceles120ConstructionExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: width < 520 ? 430 : Math.max(340, Math.round(width * 0.62)) };
}

type Props = { locale?: 'en' };

export default function Isosceles120ConstructionExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [apexAngle, setApexAngle] = useState(ORIGINAL_APEX_ANGLE);
  const construction = buildIsoscelesConstruction(apexAngle);
  const isOriginalQuestion = construction.apexAngle === ORIGINAL_APEX_ANGLE;

  const draw = useCallback(
    (p: p5) => {
      renderIsosceles120ConstructionExamScene(p, {
        width: p.width,
        height: p.height,
        construction,
        locale,
      });
    },
    [construction, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: apexAngle,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Isosceles triangles built outward' : '外部等腰三角形作圖'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? '120° is the vertex angle. What is each base angle?'
              : '120° 是頂角，兩個底角各是多少？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'The base angles together fix ∠MAN; the law of cosines then gives MN²'
              : '底角共同決定 ∠MAN，再用餘弦定理求 MN²'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Two outward isosceles triangles with vertex angle ${construction.apexAngle} degrees and base angles ${construction.baseAngle} degrees`
                : `兩個外部等腰三角形的頂角為 ${construction.apexAngle} 度，底角為 ${construction.baseAngle} 度`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Vertex angle' : '等腰三角形頂角'}
            </p>
            <label className="exam-interactive-explore__range">
              <span>φ</span>
              <output>{construction.apexAngle}°</output>
              <input
                type="range"
                aria-label={en ? 'Vertex angle of the isosceles triangles' : '等腰三角形頂角'}
                min="60"
                max="150"
                step="1"
                value={apexAngle}
                onInput={(event) => setApexAngle(Number(event.currentTarget.value))}
              />
            </label>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {en ? 'Base angles' : '底角'} = {construction.baseAngle.toFixed(1)}°
            </p>
            <p className="exam-interactive-explore__note">(180°−φ)÷2</p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Current value' : '目前結果'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {isOriginalQuestion
                ? 'MN² = 13/3'
                : `MN² ≈ ${construction.mnSquared.toFixed(3)}`}
            </p>
            <p className="exam-interactive-explore__note">
              {isOriginalQuestion
                ? en
                  ? 'AM = √21/3, AN = 1, and ∠MAN = ∠BAC + 60°.'
                  : 'AM=√21/3、AN=1、∠MAN=∠BAC+60°。'
                : en
                  ? `∠MAN ≈ ${construction.angleMAN.toFixed(1)}°. Return to 120° for the exact value.`
                  : `∠MAN≈${construction.angleMAN.toFixed(1)}°；回到 120° 可對照原題精確值。`}
            </p>
          </div>

          <button
            type="button"
            className="exam-interactive-explore__mode-button"
            onClick={() => setApexAngle(ORIGINAL_APEX_ANGLE)}
          >
            {en ? 'Back to the original, φ=120°' : '回到原題 φ=120°'}
          </button>
        </aside>
      </div>
    </div>
  );
}
