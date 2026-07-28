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

export default function ParabolaFocalChordDirectrixProjectionExamRoot() {
  const [aHeight, setAHeight] = useState(ORIGINAL_A_HEIGHT);
  const scene = buildParabolaFocalChordScene(aHeight);

  const draw = useCallback(
    (p: p5) => {
      renderParabolaFocalChordDirectrixProjectionExamScene(p, {
        width: p.width,
        height: p.height,
        scene,
      });
    },
    [scene],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: aHeight,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">焦弦與準線投影</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            拋物線定義先給你哪兩組等長線段？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            A′A=AF、B′B=BF；同一條焦弦共享相同傾角
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`拋物線焦弦 AB 通過焦點 F，A、F、B 向準線的投影為 A 撇、F 撇、B 撇，目前線段比約為 ${scene.ratio.toFixed(3)}`}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">移動焦弦端點 A</p>
            <label className="exam-interactive-explore__range">
              <span>A 的高度（示意刻度）</span>
              <output>{scene.aHeight.toFixed(1)}</output>
              <input
                type="range"
                aria-label="拋物線上 A 點的高度"
                min="2.2"
                max="4.4"
                step="0.2"
                value={aHeight}
                onInput={(event) => setAHeight(Number(event.currentTarget.value))}
              />
            </label>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">兩個正確選項</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              A′F′/A′A = ③ = ⑤
            </p>
            <p className="exam-interactive-explore__note">
              目前三個比值都約為 {scene.ratio.toFixed(3)}。移動 A，只會改變數值，不會破壞等式。
            </p>
          </div>

          <button
            type="button"
            className="exam-interactive-explore__mode-button"
            onClick={() => setAHeight(ORIGINAL_A_HEIGHT)}
          >
            回到原題示意位置
          </button>
        </aside>
      </div>
    </div>
  );
}
