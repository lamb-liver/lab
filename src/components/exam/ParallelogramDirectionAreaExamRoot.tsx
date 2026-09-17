import { useCallback, useMemo, useState } from 'react';
import type p5 from 'p5';
import {
  OFFICIAL_AREA,
  parallelogramArea,
  solveSideScales,
  type SideScales,
} from '../../exam/ast-114-parallelogram-direction-area/geometry';
import { renderParallelogramDirectionAreaExamScene } from '../../systems/rendering/parallelogramDirectionAreaExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

type Sign = 1 | -1;

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

export default function ParallelogramDirectionAreaExamRoot() {
  const [mode, setMode] = useState<SideScales['mode']>('sum');
  const [sign, setSign] = useState<Sign>(1);
  const scales = useMemo(() => solveSideScales(mode, sign), [mode, sign]);
  const area = parallelogramArea(scales);

  const draw = useCallback(
    (p: p5) => {
      renderParallelogramDirectionAreaExamScene(p, {
        width: p.width,
        height: p.height,
        mode,
        sign,
      });
    },
    [mode, sign],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${mode}|${sign}`,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">邊向軌道上的平行四邊形</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            已知中心到一個頂點的向量，為什麼不必先解出四個頂點也能算面積？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            藍、紫虛線是兩族邊向軌道；金色是落在軌道上的平行四邊形
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label="平行四邊形邊平行兩給定方向，中心 Q 與頂點 P，並顯示面積"
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">對角組合</p>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={mode === 'sum'}
                aria-pressed={mode === 'sum'}
                onClick={() => setMode('sum')}
              >
                半對角 = ½(u+v)
              </button>
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={mode === 'diff'}
                aria-pressed={mode === 'diff'}
                onClick={() => setMode('diff')}
              >
                半對角 = ½(u−v)
              </button>
            </div>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={sign === 1}
                aria-pressed={sign === 1}
                onClick={() => setSign(1)}
              >
                PQ 同向
              </button>
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={sign === -1}
                aria-pressed={sign === -1}
                onClick={() => setSign(-1)}
              >
                PQ 反向
              </button>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">面積</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              |u×v|={area.toFixed(0)}（官方 {OFFICIAL_AREA}）
            </p>
            <p className="exam-interactive-explore__note">
              α、β 會變，但 |αβ| 固定為 12；乘上方向外積 17 就得到 204。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
