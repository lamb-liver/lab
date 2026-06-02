import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  computePlotRect,
  isInsidePlot,
  measureDiffEqCanvas,
  wx,
  wy,
} from '../../curve/modules/differential-equations-geometry/layout';
import type {
  DiffEqMode,
  DiffEqParams,
  EqKey,
  Point2,
} from '../../curve/modules/differential-equations-geometry/types';
import {
  buildDiffEqSidebarState,
  renderDifferentialEquationsGeometryScene,
} from '../../systems/rendering/differentialEquationsGeometryRender';
import '../../styles/components/explore/differential-equations-geometry-explore.css';

type P5WithRenderer = p5 & { _renderer?: unknown };

const DEFAULT_INITIAL_POINTS: Point2[] = [
  { x: -2.2, y: 1.5 },
  { x: -1.2, y: -1.0 },
  { x: 0.6, y: 1.0 },
];

const MAX_INITIAL_POINTS = 10;

const DEFAULT_PARAMS: DiffEqParams = {
  mode: 'field',
  eqKey: 'minusY',
  stepH: 0.35,
  initialPoints: DEFAULT_INITIAL_POINTS,
};

export default function DifferentialEquationsGeometryExploreRoot() {
  const [params, setParams] = useState<DiffEqParams>(DEFAULT_PARAMS);

  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const sidebar = useMemo(() => buildDiffEqSidebarState(params), [params]);

  const addPointFromMouse = useCallback((p: p5) => {
    const current = paramsRef.current;
    if (current.mode !== 'field') return;

    const plot = computePlotRect(p.width, p.height);
    if (!isInsidePlot(p.mouseX, p.mouseY, plot)) return;

    const point = { x: wx(p.mouseX, plot), y: wy(p.mouseY, plot) };

    setParams((prev) => ({
      ...prev,
      initialPoints: [...prev.initialPoints, point].slice(-MAX_INITIAL_POINTS),
    }));
  }, []);

  const draw = useCallback((p: p5) => {
    const current = paramsRef.current;

    renderDifferentialEquationsGeometryScene(p, {
      width: p.width,
      height: p.height,
      mode: current.mode,
      eqKey: current.eqKey,
      stepH: current.stepH,
      initialPoints: current.initialPoints,
    });
  }, []);

  const canvasHostRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef(draw);
  const addPointRef = useRef(addPointFromMouse);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    addPointRef.current = addPointFromMouse;
  }, [addPointFromMouse]);

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
          const { width, height } = measureDiffEqCanvas(host);
          p.createCanvas(width, height);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => drawRef.current(p);

        p.mousePressed = () => addPointRef.current(p);
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;

        const { width, height } = measureDiffEqCanvas(host);
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

  return (
    <div className="diff-eq-explore">
      <div className="diff-eq-explore__stage">
        <div className="diff-eq-explore__visual">
          <div
            ref={canvasHostRef}
            className="diff-eq-explore__canvas"
            role="img"
            aria-label="微分方程的幾何視覺化"
          />
        </div>

        <aside className="diff-eq-explore__sidebar">
          <div className="diff-eq-explore__block">
            <p className="diff-eq-explore__block-title">參數</p>

            <label className="diff-eq-explore__field">
              <span className="diff-eq-explore__field-label">模式</span>
              <select
                className="diff-eq-explore__select"
                value={params.mode}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    mode: e.target.value as DiffEqMode,
                  }))
                }
              >
                <option value="field">斜率場</option>
                <option value="euler">尤拉法逼近</option>
              </select>
            </label>

            <label className="diff-eq-explore__field">
              <span className="diff-eq-explore__field-label">方程式 dy/dx</span>
              <select
                className="diff-eq-explore__select"
                value={params.eqKey}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    eqKey: e.target.value as EqKey,
                  }))
                }
              >
                <option value="x">dy/dx = x</option>
                <option value="minusY">dy/dx = -y</option>
                <option value="xPlusY">dy/dx = x + y</option>
              </select>
            </label>

            {params.mode === 'field' ? (
              <button
                type="button"
                className="diff-eq-explore__clear-btn"
                onClick={() =>
                  setParams((prev) => ({ ...prev, initialPoints: [] }))
                }
              >
                清除軌跡
              </button>
            ) : (
              <div className="control-field">
                <label htmlFor="diff-eq-h">
                  步長 h
                  <span className="diff-eq-explore__val">
                    {params.stepH.toFixed(2)}
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="diff-eq-h"
                    type="range"
                    className="range"
                    min={0.05}
                    max={0.8}
                    step={0.05}
                    value={params.stepH}
                    onInput={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        stepH: Number((e.target as HTMLInputElement).value),
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="diff-eq-explore__block">
            <p className="diff-eq-explore__block-title">統計</p>
            {sidebar.statsLines.map((line) => (
              <p key={line} className="diff-eq-explore__stat">
                {line}
              </p>
            ))}
            <p className="diff-eq-explore__hint">{sidebar.hintLine}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
