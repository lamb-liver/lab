import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  buildComplexUnitCircleScene,
  OFFICIAL_THETA_DEGREES,
} from '../../exam/ast-111-complex-unit-circle/geometry';
import { renderComplexUnitCircleExamScene } from '../../systems/rendering/complexUnitCircleExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: width < 520 ? 430 : Math.max(320, Math.round(width * 0.58)) };
}

export default function ComplexUnitCircleExamRoot() {
  const [thetaDegrees, setThetaDegrees] = useState(OFFICIAL_THETA_DEGREES);
  const scene = buildComplexUnitCircleScene(thetaDegrees);
  const isEquidistant = scene.distanceGap < 0.001;

  const draw = useCallback(
    (p: p5) => {
      renderComplexUnitCircleExamScene(p, {
        width: p.width,
        height: p.height,
        scene,
      });
    },
    [scene],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: thetaDegrees,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">單位圓上的等距</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            不要先展開三次方：複數絕對值在圖上代表哪一段距離？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            虛線是弦 zz³ 的中垂線；固定點 w 落在線上時，兩段距離相等
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`單位圓上 z 的幅角為 ${scene.thetaDegrees.toFixed(1)} 度，固定點 w 到 z 與 z 三次方的距離差為 ${scene.distanceGap.toFixed(3)}`}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">第一象限的 z</p>
            <div className="exam-interactive-explore__ranges">
              <label className="exam-interactive-explore__range">
                <span>幅角 θ</span>
                <output>{scene.thetaDegrees.toFixed(1)}°</output>
                <input
                  type="range"
                  aria-label="調整複數 z 的幅角"
                  min="5"
                  max="85"
                  step="0.5"
                  value={thetaDegrees}
                  onInput={(event) => setThetaDegrees(Number(event.currentTarget.value))}
                />
              </label>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">等距判斷</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {isEquidistant ? '等距成立：z²=w' : `距離差 ≈ ${scene.distanceGap.toFixed(3)}`}
            </p>
            <p className="exam-interactive-explore__note">
              原題答案：a=√5/5，b=2√5/5。
            </p>
          </div>

          <button
            type="button"
            className="exam-interactive-explore__mode-button"
            onClick={() => setThetaDegrees(OFFICIAL_THETA_DEGREES)}
          >
            回到原題解答位置
          </button>
        </aside>
      </div>
    </div>
  );
}
