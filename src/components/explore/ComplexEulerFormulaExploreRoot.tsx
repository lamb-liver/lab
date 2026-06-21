import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import { TAU } from '../../curve/modules/complex-euler-formula/constants';
import { formatAngle } from '../../curve/modules/complex-euler-formula/complex';
import {
  complexToScreen,
  computePlotRect,
  isInsidePlot,
  measureComplexEulerCanvas,
  screenToComplex,
} from '../../curve/modules/complex-euler-formula/layout';
import type {
  ComplexEulerParams,
  ComplexMode,
  OpKey,
} from '../../curve/modules/complex-euler-formula/types';
import {
  buildComplexEulerSidebarState,
  renderComplexEulerFormulaScene,
} from '../../systems/rendering/complexEulerFormulaRender';
import '../../styles/components/explore/complex-euler-formula-explore.css';

const DEFAULT_PARAMS: ComplexEulerParams = {
  mode: 'operation',
  opKey: 'mul',
  z1: { re: 1.25, im: 0.85 },
  z2: { re: 0.85, im: -0.65 },
  theta: Math.PI * 0.75,
  n: 3,
  deTheta: Math.PI / 5,
};

type DragTarget = 'z1' | 'z2' | null;

export default function ComplexEulerFormulaExploreRoot() {
  const [params, setParams] = useState<ComplexEulerParams>(DEFAULT_PARAMS);

  const paramsRef = useRef(params);
  const draggingRef = useRef<DragTarget>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const sidebar = useMemo(() => buildComplexEulerSidebarState(params), [params]);

  const handleMousePressed = useCallback((p: p5) => {
    const current = paramsRef.current;
    if (current.mode !== 'operation') return;

    const plot = computePlotRect(p.width, p.height);
    if (!isInsidePlot(p.mouseX, p.mouseY, plot)) return;

    const p1 = complexToScreen(current.z1, plot);
    const p2 = complexToScreen(current.z2, plot);

    const d1 = Math.hypot(p.mouseX - p1.x, p.mouseY - p1.y);
    const d2 = Math.hypot(p.mouseX - p2.x, p.mouseY - p2.y);

    if (d1 < 24 && d1 <= d2) {
      draggingRef.current = 'z1';
    } else if (d2 < 24) {
      draggingRef.current = 'z2';
    }
  }, []);

  const handleMouseDragged = useCallback((p: p5) => {
    const target = draggingRef.current;
    if (!target) return;

    const plot = computePlotRect(p.width, p.height);
    const z = screenToComplex(p.mouseX, p.mouseY, plot);

    setParams((prev) => ({
      ...prev,
      [target]: z,
    }));
  }, []);

  const handleMouseReleased = useCallback(() => {
    draggingRef.current = null;
  }, []);

  const draw = useCallback((p: p5) => {
    const current = paramsRef.current;

    renderComplexEulerFormulaScene(p, {
      width: p.width,
      height: p.height,
      ...current,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    p.mousePressed = () => handleMousePressed(p);
    p.mouseDragged = () => handleMouseDragged(p);
    p.mouseReleased = handleMouseReleased;
  }, [handleMouseDragged, handleMousePressed, handleMouseReleased]);

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureComplexEulerCanvas,
    extendSketch,
  );

  return (
    <div className="complex-euler-explore">
      <div className="complex-euler-explore__stage">
        <div className="complex-euler-explore__visual">
          <div
            ref={canvasHostRef}
            className="complex-euler-explore__canvas"
            role="img"
            aria-label="複數與尤拉公式"
          />
        </div>

        <aside className="complex-euler-explore__sidebar">
          <div className="complex-euler-explore__block">
            <p className="complex-euler-explore__block-title">參數</p>

            <label className="complex-euler-explore__field">
              <span className="complex-euler-explore__field-label">模式</span>
              <select
                className="complex-euler-explore__select"
                value={params.mode}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    mode: e.target.value as ComplexMode,
                  }))
                }
              >
                <option value="operation">複數運算</option>
                <option value="euler">尤拉公式</option>
                <option value="demoivre">棣美弗定理</option>
              </select>
            </label>

            {params.mode === 'operation' && (
              <label className="complex-euler-explore__field">
                <span className="complex-euler-explore__field-label">運算</span>
                <select
                  className="complex-euler-explore__select"
                  value={params.opKey}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      opKey: e.target.value as OpKey,
                    }))
                  }
                >
                  <option value="add">加法 z₁ + z₂</option>
                  <option value="sub">減法 z₁ − z₂</option>
                  <option value="mul">乘法 z₁ × z₂</option>
                  <option value="div">除法 z₁ ÷ z₂</option>
                </select>
              </label>
            )}

            {params.mode === 'euler' && (
              <div className="control-field">
                <label htmlFor="complex-theta">
                  角度 θ
                  <span className="complex-euler-explore__val">
                    {formatAngle(params.theta)}
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="complex-theta"
                    type="range"
                    className="range"
                    min={0}
                    max={1000}
                    step={1}
                    value={Math.round((params.theta / TAU) * 1000)}
                    onInput={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        theta:
                          (Number((e.target as HTMLInputElement).value) /
                            1000) *
                          TAU,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {params.mode === 'demoivre' && (
              <>
                <div className="control-field">
                  <label htmlFor="complex-n">
                    次方 n
                    <span className="complex-euler-explore__val">{params.n}</span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id="complex-n"
                      type="range"
                      className="range"
                      min={1}
                      max={12}
                      step={1}
                      value={params.n}
                      onInput={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          n: Number((e.target as HTMLInputElement).value),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="control-field">
                  <label htmlFor="complex-de-theta">
                    角度 θ
                    <span className="complex-euler-explore__val">
                      {formatAngle(params.deTheta)}
                    </span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id="complex-de-theta"
                      type="range"
                      className="range"
                      min={0}
                      max={1000}
                      step={1}
                      value={Math.round((params.deTheta / TAU) * 1000)}
                      onInput={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          deTheta:
                            (Number((e.target as HTMLInputElement).value) /
                              1000) *
                            TAU,
                        }))
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {params.mode === 'operation' && (
              <p className="complex-euler-explore__hint">拖動 z₁、z₂ 向量端點</p>
            )}
          </div>

          <div className="complex-euler-explore__block">
            <p className="complex-euler-explore__block-title">統計</p>
            {sidebar.statsLines.map((line) => (
              <p key={line} className="complex-euler-explore__stat">
                {line}
              </p>
            ))}
            <p className="complex-euler-explore__hint">{sidebar.hintLine}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
