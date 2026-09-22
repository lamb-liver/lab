import { useCallback, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  OFFICIAL_AREA,
  nearestSolution,
  parallelogramArea,
  solveSideScales,
  type SideScales,
} from '../../exam/ast-114-parallelogram-direction-area/geometry';
import {
  parallelogramExamPlot,
  renderParallelogramDirectionAreaExamScene,
  worldFromScreen,
} from '../../systems/rendering/parallelogramDirectionAreaExamRender';
import {
  useRectP5CanvasHost,
  type CanvasSize,
  type ExtendSketch,
} from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

type Sign = 1 | -1;

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

function isCanvasPointer(p: p5, host: HTMLElement, event?: Event): boolean {
  const target = event?.target;
  if (target instanceof HTMLCanvasElement) return host.contains(target);
  return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
}

export default function ParallelogramDirectionAreaExamRoot() {
  const [mode, setMode] = useState<SideScales['mode']>('sum');
  const [sign, setSign] = useState<Sign>(1);
  const modeRef = useRef(mode);
  const signRef = useRef(sign);
  modeRef.current = mode;
  signRef.current = sign;

  const scales = useMemo(() => solveSideScales(mode, sign), [mode, sign]);
  const area = parallelogramArea(scales);

  const snapToNearest = useCallback((p: p5) => {
    const plot = parallelogramExamPlot(p.width, p.height);
    const world = worldFromScreen(p.mouseX, p.mouseY, plot);
    const next = nearestSolution(world);
    if (next.mode !== modeRef.current) setMode(next.mode);
    if (next.sign !== signRef.current) setSign(next.sign);
  }, []);

  // sketch 只建立一次；draw 讀 ref，按鈕切換只走 redrawKey，避免拆掉 p5 閃一下
  const draw = useCallback((p: p5) => {
    renderParallelogramDirectionAreaExamScene(p, {
      width: p.width,
      height: p.height,
      mode: modeRef.current,
      sign: signRef.current,
    });
  }, []);

  const extendSketch = useMemo<ExtendSketch>(() => {
    return (p, host) => {
      const onPress = (event?: Event) => {
        if (!isCanvasPointer(p, host, event)) return;
        snapToNearest(p);
        return false;
      };

      const onDrag = () => {
        if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
        snapToNearest(p);
        return false;
      };

      p.mousePressed = onPress;
      p.mouseDragged = onDrag;

      p.touchStarted = (event?: Event) => {
        onPress(event);
        return false;
      };
      p.touchMoved = () => {
        onDrag();
        return false;
      };
    };
  }, [snapToNearest]);

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, extendSketch, {
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
            藍、紫虛線是兩族邊向軌道；金色是落在軌道上的平行四邊形。拖相鄰頂點可在四組解間切換。
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label="平行四邊形邊平行兩給定方向，中心 Q 與頂點 P；拖曳相鄰頂點可切換四組解並顯示面積"
            style={{ cursor: 'grab', touchAction: 'none' }}
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
              α、β 會變，但 |αβ| 固定為 12；乘上方向外積 17 就得到 204。約束下只有四組解，拖曳是 snap
              不是連續變形。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
