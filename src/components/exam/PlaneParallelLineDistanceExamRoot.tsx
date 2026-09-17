import { useCallback, useState } from 'react';
import type p5 from 'p5';
import { PARALLEL_METRICS } from '../../exam/ast-114-plane-parallel-line-distance/geometry';
import { renderPlaneParallelLineDistanceExamScene } from '../../systems/rendering/planeParallelLineDistanceExamRender';
import OrbitViewControls from '../curve/OrbitViewControls';
import { useOrbitViewP5 } from '../curve/useOrbitViewP5';
import type { CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

type Params = {
  yaw: number;
  pitch: number;
};

const DEFAULT_PARAMS: Params = { yaw: 38, pitch: 22 };

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(330, Math.round(width * 0.64)) };
}

export default function PlaneParallelLineDistanceExamRoot() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const patchParams = useCallback((patch: Partial<Params>) => {
    setParams((current) => ({ ...current, ...patch }));
  }, []);
  const render = useCallback(
    (p: p5, current: Params, rotating: boolean) =>
      renderPlaneParallelLineDistanceExamScene(p, {
        width: p.width,
        height: p.height,
        ...current,
        rotating,
      }),
    [],
  );
  const { canvasHostRef } = useOrbitViewP5({
    params,
    onParamsChange: patchParams,
    render,
    redrawKey: `${params.yaw}|${params.pitch}`,
    measure: measureCanvas,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">坐標面截線與平行距離</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            一條線在 x=0、另一條在 z=0，又互相平行時，方向向量還能有幾個自由度？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            藍、紫半透明面是坐標面；金線是兩平行線的最短線段
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label="平面與 x=0、z=0 的交線為平行線，並標出公垂線；拖動可旋轉視角"
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">距離</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              |AB|=√185≈{PARALLEL_METRICS.distance.toFixed(3)}
            </p>
            <p className="exam-interactive-explore__note">
              方向被鎖成 (0,1,0) 後，距離就是兩已知點在 xz 平面投影的距離 √(8²+11²)。
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">視角</p>
            <OrbitViewControls
              idPrefix="plane-parallel-line-distance"
              params={params}
              onParamsChange={patchParams}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
