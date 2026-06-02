import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { getFunctionDef } from '../../curve/modules/limits-riemann-sum/functions';
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
import '../../styles/components/explore/limits-riemann-sum-explore.css';

type P5WithRenderer = p5 & { _renderer?: unknown };

const DEFAULT_PARAMS: LimitsRiemannParams = {
  mode: 'riemann',
  fnKey: 'x2',
  method: 'mid',
  n: 24,
  tangentT: 0.45,
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
    });
  }, []);

  const canvasHostRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef(draw);
  const updateTangentRef = useRef(updateTangentFromMouse);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    updateTangentRef.current = updateTangentFromMouse;
  }, [updateTangentFromMouse]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
        p.setup = () => {
          const { width, height } = measureLimitsCanvas(host);
          p.createCanvas(width, height);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => drawRef.current(p);

        p.mousePressed = () => updateTangentRef.current(p);
        p.mouseDragged = () => updateTangentRef.current(p);
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;

        const { width, height } = measureLimitsCanvas(host);
        instance.resizeCanvas(width, height);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instance.remove();
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  const setMode = (mode: LimitsMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

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
                <option value="riemann">黎曼和</option>
                <option value="tangent">切線逼近</option>
              </select>
            </label>

            <label className="limits-riemann-explore__field">
              <span className="limits-riemann-explore__field-label">函數 f(x)</span>
              <select
                className="limits-riemann-explore__select"
                value={params.fnKey}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    fnKey: e.target.value as FnKey,
                  }))
                }
              >
                <option value="x2">x²</option>
                <option value="sin">sin x</option>
                <option value="exp">eˣ</option>
              </select>
            </label>

            {params.mode === 'riemann' ? (
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
                    <span className="limits-riemann-explore__val">{params.n}</span>
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
                    max={1000}
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
