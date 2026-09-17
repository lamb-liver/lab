import { useCallback, useMemo, useState } from 'react';
import type p5 from 'p5';
import {
  clampCenterA,
  minDistances,
  radiusForRatio,
  ratioIsThreeToOne,
  tangentSlopesFromOrigin,
} from '../../exam/ast-115-circle-two-lines-tangent/geometry';
import { renderCircleTwoLinesTangentExamScene } from '../../systems/rendering/circleTwoLinesTangentExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

export default function CircleTwoLinesTangentExamRoot() {
  const [a, setA] = useState(2);
  const radius = radiusForRatio(a);
  const feasible = ratioIsThreeToOne(a, radius);
  const { d1, d2 } = useMemo(() => minDistances(a, radius), [a, radius]);
  const slopes = tangentSlopesFromOrigin(a);

  const draw = useCallback(
    (p: p5) => {
      renderCircleTwoLinesTangentExamScene(p, {
        width: p.width,
        height: p.height,
        a,
      });
    },
    [a],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: a,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">距離比定圓 → 原點切線</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            兩直線互相垂直時，圓心在 x 軸上，為什麼切線斜率會跟 |a| 無關？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            金色虛線是過原點的切線；藍、紫短線段是圓到 L₁、L₂ 的最短距離
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`圓心在 (${a.toFixed(1)},0)、半徑 ${radius.toFixed(2)}，顯示兩垂線與原點切線`}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">移動圓心</p>
            <label className="exam-interactive-explore__range">
              <span>a（圓心橫坐標）</span>
              <output>{a.toFixed(1)}</output>
              <input
                type="range"
                aria-label="圓心在 x 軸上的橫坐標 a"
                min="-6"
                max="6"
                step="0.1"
                value={a}
                onInput={(event) => setA(clampCenterA(Number(event.currentTarget.value)))}
              />
            </label>
            <p className="exam-interactive-explore__note">
              為保持與兩線不相交，|a| 會被夾在可行區間；此時 r=|a|/2 恰使 d₁=3d₂。
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">距離條件</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {feasible
                ? `d₁=${d1.toFixed(2)}，d₂=${d2.toFixed(2)}，比約 3:1`
                : '尚未落在 d₁:d₂=3:1 的不相交狀態'}
            </p>
            <p className="exam-interactive-explore__note">
              最短距離是圓心到直線距離減半徑；不相交才有正的 d₁、d₂。
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">切線斜率</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {slopes
                ? `m=±√3/3≈±${slopes[0].toFixed(4)}`
                : '調整 a 使圓與兩線不相交'}
            </p>
            <p className="exam-interactive-explore__note">
              過原點的直線到圓心距離等於半徑，化簡後 |m|=1/√3，與 a 的正負無關。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
