import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  ORIGINAL_A_HEIGHT,
  buildParabolaFocalChordScene,
} from '../../exam/ast-111-parabola-focal-chord-directrix-projection/geometry';
import { renderParabolaFocalChordDirectrixProjectionExamScene } from '../../systems/rendering/parabolaFocalChordDirectrixProjectionExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: width < 520 ? 440 : Math.max(350, Math.round(width * 0.64)) };
}

export default function ParabolaFocalChordDirectrixProjectionExamRoot({
  locale,
}: {
  locale?: 'en';
}) {
  const en = locale === 'en';
  const [aHeight, setAHeight] = useState(ORIGINAL_A_HEIGHT);
  const scene = buildParabolaFocalChordScene(aHeight);

  const draw = useCallback(
    (p: p5) => {
      renderParabolaFocalChordDirectrixProjectionExamScene(p, {
        width: p.width,
        height: p.height,
        scene,
        locale,
      });
    },
    [scene, locale],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${aHeight}|${locale ?? ''}`,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Focal chord and directrix projections' : '焦弦與準線投影'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'Which two pairs of equal lengths does the parabola definition give you first?'
              : '拋物線定義先給你哪兩組等長線段？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'A′A=AF and B′B=BF; one focal chord shares one acute angle'
              : 'A′A=AF、B′B=BF；同一條焦弦共享相同傾角'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Focal chord AB passes through the focus F. The projections of A, F, and B onto the directrix are A prime, F prime, and B prime. The segment ratio is about ${scene.ratio.toFixed(3)}`
                : `拋物線焦弦 AB 通過焦點 F，A、F、B 向準線的投影為 A 撇、F 撇、B 撇，目前線段比約為 ${scene.ratio.toFixed(3)}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Move endpoint A of the focal chord' : '移動焦弦端點 A'}
            </p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Height of A (schematic scale)' : 'A 的高度（示意刻度）'}</span>
              <output>{scene.aHeight.toFixed(1)}</output>
              <input
                type="range"
                aria-label={en ? 'Height of point A on the parabola' : '拋物線上 A 點的高度'}
                min="2.2"
                max="4.4"
                step="0.2"
                value={aHeight}
                onInput={(event) => setAHeight(Number(event.currentTarget.value))}
              />
            </label>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Two correct options' : '兩個正確選項'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              A′F′/A′A = ③ = ⑤
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? `All three ratios are about ${scene.ratio.toFixed(3)}. Moving A changes the number and does not break the equality.`
                : `目前三個比值都約為 ${scene.ratio.toFixed(3)}。移動 A，只會改變數值，不會破壞等式。`}
            </p>
          </div>

          <button
            type="button"
            className="exam-interactive-explore__mode-button"
            onClick={() => setAHeight(ORIGINAL_A_HEIGHT)}
          >
            {en ? 'Back to the schematic position' : '回到原題示意位置'}
          </button>
        </aside>
      </div>
    </div>
  );
}
