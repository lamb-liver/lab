import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  N_MAX,
  N_MIN,
  clampRadius,
  computeDemoivreMetrics,
  createPlotLayout,
  toScreen,
  toWorld,
} from '../../curve/modules/demoivre-nth-roots/geometry';
import {
  DEFAULT_POWERS_ROOTS_PARAMS,
  modeTitle,
  modeVerdict,
  multiplyViewportRadius,
  readings,
  type PowersRootsMode,
  type PowersRootsParams,
} from '../../explore/complex-powers-roots/geometry';
import { renderComplexPowersRootsExploreScene } from '../../systems/rendering/complexPowersRootsExploreRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import { wireTouchToMouse } from '../curve/touchToMouse';
import '../../styles/components/explore/complex-powers-roots-explore.css';

const MODES: Array<{ value: PowersRootsMode; label: string }> = [
  { value: 'multiply', label: '乘法' },
  { value: 'power', label: '乘冪' },
  { value: 'roots', label: '方根' },
];

const POINT_HIT_PX = 22;

function measureExploreCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(280, Math.min(1000, Math.round(host.clientWidth || 640)));
  return { width, height: Math.max(320, Math.round(width * 0.86)) };
}

export default function ComplexPowersRootsExploreRoot() {
  const [params, setParams] = useState<PowersRootsParams>(DEFAULT_POWERS_ROOTS_PARAMS);
  const paramsRef = useRef(params);
  const draggingRef = useRef<'z1' | 'z2' | null>(null);
  const dragLayoutRadiusRef = useRef<number | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const patchParams = useCallback((patch: Partial<PowersRootsParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const draw = useCallback((p: p5) => {
    renderComplexPowersRootsExploreScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
      dragging: draggingRef.current,
      layoutRadius: dragLayoutRadiusRef.current ?? undefined,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    function liveRadius(current: PowersRootsParams): number {
      if (current.mode === 'multiply') return multiplyViewportRadius(current.z1, current.z2);
      return computeDemoivreMetrics({
        mode: current.mode,
        n: current.n,
        re: current.z1.re,
        im: current.z1.im,
      }).viewportRadius;
    }

    function layoutFor(current: PowersRootsParams) {
      return createPlotLayout(
        p.width,
        p.height,
        dragLayoutRadiusRef.current ?? liveRadius(current),
      );
    }

    function hit(): 'z1' | 'z2' | null {
      const current = paramsRef.current;
      const layout = layoutFor(current);
      const z1 = toScreen(layout, current.z1);
      const d1 = Math.hypot(p.mouseX - z1.x, p.mouseY - z1.y);
      if (current.mode !== 'multiply') return d1 <= POINT_HIT_PX ? 'z1' : null;
      const z2 = toScreen(layout, current.z2);
      const d2 = Math.hypot(p.mouseX - z2.x, p.mouseY - z2.y);
      if (d1 < POINT_HIT_PX && d1 <= d2) return 'z1';
      if (d2 < POINT_HIT_PX) return 'z2';
      return null;
    }

    function updateDrag(): void {
      const target = draggingRef.current;
      if (!target) return;
      const layout = layoutFor(paramsRef.current);
      const world = toWorld(layout, { x: p.mouseX, y: p.mouseY });
      const next = clampRadius(world.re, world.im);
      setParams((prev) => ({ ...prev, [target]: next }));
    }

    p.mouseMoved = () => {
      if (draggingRef.current) return;
      p.cursor(hit() ? 'grab' : 'default');
    };
    p.mousePressed = () => {
      draggingRef.current = hit();
      if (!draggingRef.current) return;
      dragLayoutRadiusRef.current = liveRadius(paramsRef.current);
      p.cursor('grabbing');
      updateDrag();
    };
    p.mouseDragged = () => updateDrag();
    p.mouseReleased = () => {
      draggingRef.current = null;
      dragLayoutRadiusRef.current = null;
      p.cursor(hit() ? 'grab' : 'default');
    };
    wireTouchToMouse(p);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureExploreCanvas,
    extendSketch,
  );

  const rows = useMemo(() => readings(params), [params]);

  return (
    <div className="complex-powers-roots-explore">
      <div className="complex-powers-roots-explore__stage">
        <div className="complex-powers-roots-explore__visual">
          <p className="complex-powers-roots-explore__visual-title">乘冪與方根</p>
          <p className="complex-powers-roots-explore__visual-sub">{modeTitle(params.mode)}</p>
          <div
            ref={canvasHostRef}
            className="complex-powers-roots-explore__canvas"
            role="img"
            aria-label="乘冪與方根互動：可切換乘法、乘冪與方根"
          />
        </div>

        <aside className="complex-powers-roots-explore__sidebar">
          <div className="complex-powers-roots-explore__block">
            <p className="complex-powers-roots-explore__block-title">讀法</p>
            <div className="complex-powers-roots-explore__modes">
              {MODES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="complex-powers-roots-explore__mode-button"
                  data-active={params.mode === item.value}
                  aria-pressed={params.mode === item.value}
                  onClick={() => patchParams({ mode: item.value })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="complex-powers-roots-explore__block">
            <p className="complex-powers-roots-explore__block-title">這個讀法怎麼說</p>
            <p className="complex-powers-roots-explore__verdict">{modeVerdict(params)}</p>
          </div>

          {params.mode !== 'multiply' && (
            <div className="complex-powers-roots-explore__block">
              <p className="complex-powers-roots-explore__block-title">場景</p>
              <div className="control-field">
                <label htmlFor="powers-roots-n">
                  <span>次數 n</span>
                  <span className="control-field__value">{params.n}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="powers-roots-n"
                    type="range"
                    className="range"
                    min={N_MIN}
                    max={N_MAX}
                    step={1}
                    value={params.n}
                    onInput={(event) => patchParams({ n: Number(event.currentTarget.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="complex-powers-roots-explore__block">
            <p className="complex-powers-roots-explore__block-title">讀數</p>
            {rows.map(([label, value]) => (
              <p className="complex-powers-roots-explore__reading" key={label}>
                <span>{label}</span>
                <span>{value}</span>
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
