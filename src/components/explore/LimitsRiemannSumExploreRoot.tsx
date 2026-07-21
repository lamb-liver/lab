import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  getFunctionDef,
  scaleToForwardH,
  scaleToPartitionCount,
} from '../../curve/modules/limits-riemann-sum/functions';
import {
  computePlotRect,
  isInsidePlot,
  measureLimitsCanvas,
  screenToTangentT,
} from '../../curve/modules/limits-riemann-sum/layout';
import type {
  FnKey,
  LimitsMode,
  LimitsRiemannParams,
  RiemannMethod,
} from '../../curve/modules/limits-riemann-sum/types';
import {
  buildLimitsSidebarState,
  renderLimitsRiemannSumScene,
} from '../../systems/rendering/limitsRiemannSumRender';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/limits-riemann-sum-explore.css';
import { wireTouchToMouse } from '../curve/touchToMouse';

const DEFAULT_PARAMS: LimitsRiemannParams = {
  mode: 'compare',
  fnKey: 'x2',
  method: 'mid',
  n: 24,
  tangentT: 0.45,
  localH: 0.18,
  scale: 0.45,
};

export default function LimitsRiemannSumExploreRoot() {
  const [params, setParams] = useState<LimitsRiemannParams>(DEFAULT_PARAMS);

  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const sidebar = useMemo(() => buildLimitsSidebarState(params), [params]);

  const updateTangentFromMouse = useCallback((p: p5) => {
    const current = paramsRef.current;
    if (current.mode !== 'tangent') return;

    const plot = computePlotRect(p.width, p.height);
    if (!isInsidePlot(p.mouseX, p.mouseY, plot)) return;

    const fn = getFunctionDef(current.fnKey);
    const tangentT = screenToTangentT(p.mouseX, fn, plot);

    setParams((prev) => ({ ...prev, tangentT }));
  }, []);

  const draw = useCallback((p: p5) => {
    const current = paramsRef.current;

    renderLimitsRiemannSumScene(p, {
      width: p.width,
      height: p.height,
      mode: current.mode,
      fnKey: current.fnKey,
      method: current.method,
      n: current.n,
      tangentT: current.tangentT,
      localH: current.localH,
      scale: current.scale,
    });
  }, []);

  const updateTangentRef = useRef(updateTangentFromMouse);

  useEffect(() => {
    updateTangentRef.current = updateTangentFromMouse;
  }, [updateTangentFromMouse]);

  const extendSketch = useCallback((p: p5) => {
    p.mousePressed = () => updateTangentRef.current(p);
    p.mouseDragged = () => updateTangentRef.current(p);

    wireTouchToMouse(p);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw],
    measureLimitsCanvas,
    extendSketch,
  );

  const setMode = (mode: LimitsMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const fn = getFunctionDef(params.fnKey);
  const localHRatio = params.localH / (fn.b - fn.a);
  const displayN =
    params.mode === 'compare' ? scaleToPartitionCount(params.scale) : params.n;
  const displayH =
    params.mode === 'compare'
      ? scaleToForwardH(fn, params.scale)
      : params.localH;

  return (
    <div className="limits-riemann-explore">
      <div className="limits-riemann-explore__stage">
        <div className="limits-riemann-explore__visual">
          <div
            ref={canvasHostRef}
            className="limits-riemann-explore__canvas"
            role="img"
            aria-label="極限與黎曼和"
          />
        </div>

        <aside className="limits-riemann-explore__sidebar">
          <div className="limits-riemann-explore__block">
            <p className="limits-riemann-explore__block-title">參數</p>

            <label className="limits-riemann-explore__field">
              <span className="limits-riemann-explore__field-label">模式</span>
              <select
                className="limits-riemann-explore__select"
                value={params.mode}
                onChange={(e) => setMode(e.target.value as LimitsMode)}
              >
                <option value="compare">對照</option>
                <option value="riemann">全域面積</option>
                <option value="tangent">局部斜率</option>
              </select>
            </label>

            <label className="limits-riemann-explore__field">
              <span className="limits-riemann-explore__field-label">函數 f(x)</span>
              <select
                className="limits-riemann-explore__select"
                value={params.fnKey}
                onChange={(e) =>
                  setParams((prev) => {
                    const nextFnKey = e.target.value as FnKey;
                    const nextFn = getFunctionDef(nextFnKey);
                    return {
                      ...prev,
                      fnKey: nextFnKey,
                      localH: scaleToForwardH(nextFn, prev.scale),
                      tangentT: Math.min(prev.tangentT, nextFn.comparisonT + 0.25),
                    };
                  })
                }
              >
                <option value="x2">x²</option>
                <option value="sin">sin x</option>
                <option value="exp">eˣ</option>
              </select>
            </label>

            {params.mode === 'compare' ? (
              <div className="control-field">
                <label htmlFor="limits-scale">
                  尺度
                  <span className="limits-riemann-explore__val">
                    {Math.round(params.scale * 100)}%
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="limits-scale"
                    type="range"
                    className="range"
                    min={0}
                    max={1000}
                    step={1}
                    value={Math.round(params.scale * 1000)}
                    onInput={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        scale: Number((e.target as HTMLInputElement).value) / 1000,
                      }))
                    }
                  />
                </div>
              </div>
            ) : params.mode === 'riemann' ? (
              <>
                <label className="limits-riemann-explore__field">
                  <span className="limits-riemann-explore__field-label">
                    分割方式
                  </span>
                  <select
                    className="limits-riemann-explore__select"
                    value={params.method}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        method: e.target.value as RiemannMethod,
                      }))
                    }
                  >
                    <option value="left">左點</option>
                    <option value="right">右點</option>
                    <option value="mid">中點</option>
                  </select>
                </label>

                <div className="control-field">
                  <label htmlFor="limits-n">
                    分割數 n
                    <span className="limits-riemann-explore__val">{displayN}</span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id="limits-n"
                      type="range"
                      className="range"
                      min={1}
                      max={200}
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
              </>
            ) : (
              <>
                <div className="control-field">
                  <label htmlFor="limits-t">
                    點 P 位置 t
                    <span className="limits-riemann-explore__val">
                      {params.tangentT.toFixed(3)}
                    </span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id="limits-t"
                      type="range"
                      className="range"
                      min={0}
                      max={950}
                      step={1}
                      value={Math.round(params.tangentT * 1000)}
                      onInput={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          tangentT: Number((e.target as HTMLInputElement).value) / 1000,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="control-field">
                  <label htmlFor="limits-h">
                    局部跨度 h
                    <span className="limits-riemann-explore__val">
                      {displayH.toFixed(4)}
                    </span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id="limits-h"
                      type="range"
                      className="range"
                      min={10}
                      max={350}
                      step={1}
                      value={Math.round(localHRatio * 1000)}
                      onInput={(e) =>
                        setParams((prev) => {
                          const ratio =
                            Number((e.target as HTMLInputElement).value) / 1000;
                          const currentFn = getFunctionDef(prev.fnKey);
                          return {
                            ...prev,
                            localH: (currentFn.b - currentFn.a) * ratio,
                          };
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="limits-riemann-explore__block">
            <p className="limits-riemann-explore__block-title">統計</p>
            {sidebar.statsLines.map((line) => (
              <p key={line} className="limits-riemann-explore__stat">
                {line}
              </p>
            ))}
            <p className="limits-riemann-explore__hint">{sidebar.hintLine}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
