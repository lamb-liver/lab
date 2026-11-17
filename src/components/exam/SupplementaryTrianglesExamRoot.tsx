import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  acuteTheta,
  obtuseTheta,
  thirdSide,
  triangleArea,
} from '../../exam/amc12b-2025-21-supplementary-triangles/geometry';
import { renderSupplementaryTrianglesExam } from '../../systems/rendering/supplementaryTrianglesExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.min(440, Math.max(280, Math.round(width * 0.72))) };
}

type Props = { locale?: 'en' };

function nearly(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.002;
}

export default function SupplementaryTrianglesExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const acute = acuteTheta();
  const obtuse = obtuseTheta();
  const [theta, setTheta] = useState(acute);
  const [both, setBoth] = useState(false);
  const degrees = (theta * 180) / Math.PI;
  const onPair = nearly(theta, acute) || nearly(theta, obtuse);

  const draw = useCallback(
    (p: p5) => renderSupplementaryTrianglesExam(p, { width: p.width, height: p.height, theta, both }),
    [theta, both],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${theta}|${both}`,
  });

  const side = thirdSide(theta);
  const partner = thirdSide(Math.PI - theta);
  const smaller = Math.min(side, partner);
  const larger = Math.max(side, partner);
  const area = triangleArea(theta);

  let reading: string;
  if (!both && nearly(theta, acute)) {
    reading = en ? 'The third side is 11. Doubling it gives 22.' : '第三邊是 11。把它加倍會得到 22。';
  } else if (!both && nearly(theta, obtuse)) {
    reading = en ? 'The third side is 13. Doubling it gives 26.' : '第三邊是 13。把它加倍會得到 26。';
  } else if (!both) {
    reading = en
      ? `The third side is about ${side.toFixed(2)}. The supplementary triangle has third side about ${partner.toFixed(2)}, and the areas match.`
      : `第三邊約 ${side.toFixed(2)}。補角那一塊的第三邊約 ${partner.toFixed(2)}，兩塊面積相同。`;
  } else if (onPair) {
    reading = en
      ? 'The third sides are 11 and 13, and their sum is 24. Each area is 6√35.'
      : '兩塊的第三邊是 11 與 13，和是 24。面積都是 6√35。';
  } else {
    reading = en
      ? `The areas match, about ${area.toFixed(2)} each. The third sides are about ${smaller.toFixed(2)} and ${larger.toFixed(2)}.`
      : `兩塊面積相同，約 ${area.toFixed(2)}。第三邊約 ${smaller.toFixed(2)} 與 ${larger.toFixed(2)}。`;
  }

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Two triangles with supplementary included angles' : '夾角互補的兩塊三角形'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'One third side is 11. Is the sum of the two third sides 22?'
              : '其中一個第三邊是 11。兩個第三邊的和是 22 嗎？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {both
              ? en
                ? 'Gold uses included angle θ. White uses the supplement. They share the base, and the areas match.'
                : '金色是夾角 θ，白色是它的補角。兩塊共用底邊，面積相同。'
              : en
                ? 'Gold is the triangle with included angle θ. The side of length 9 lies on the base, and the side of length 8 opens the angle.'
                : '金色是夾角為 θ 的那一塊。長 9 的邊在底邊，長 8 的邊張出夾角。'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Triangles with sides 8 and 9 and included angle ${degrees.toFixed(1)} degrees. ${reading}`
                : `兩邊 8 與 9，夾角 ${degrees.toFixed(1)} 度。${reading}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Included angle' : '夾角'}</p>
            <label className="exam-interactive-explore__range">
              <span>θ</span>
              <output>{`${degrees.toFixed(1)}°`}</output>
              <input
                id="supp-theta"
                type="range"
                aria-label={en ? 'Included angle' : '夾角'}
                min={10}
                max={170}
                step={0.1}
                value={degrees}
                onInput={(event) => setTheta((Number(event.currentTarget.value) * Math.PI) / 180)}
              />
            </label>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                id="supp-only"
                className="exam-interactive-explore__mode-button"
                data-active={both ? 'false' : 'true'}
                aria-pressed={!both}
                onClick={() => setBoth(false)}
              >
                {en ? 'One triangle' : '只留一塊'}
              </button>
              <button
                type="button"
                id="supp-both"
                className="exam-interactive-explore__mode-button"
                data-active={both ? 'true' : 'false'}
                aria-pressed={both}
                onClick={() => setBoth(true)}
              >
                {en ? 'Add the other' : '補上另一塊'}
              </button>
              <button
                type="button"
                id="supp-official"
                className="exam-interactive-explore__mode-button"
                data-active={nearly(theta, acute) ? 'true' : 'false'}
                aria-pressed={nearly(theta, acute)}
                onClick={() => setTheta(acute)}
              >
                {en ? 'Side 11' : '夾角對 11'}
              </button>
            </div>
          </div>
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Reading' : '讀數'}</p>
            <p id="supp-readout" className="exam-interactive-explore__result" aria-live="polite">
              {reading}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Supplementary angles share a sine, so the areas stay equal while the third sides change.'
                : '互補的角正弦相同，所以面積維持相等，第三邊換成另一個數。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
