import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from '../curve/p5RendererReady';
import {
  createConicDynamicAnimState,
  stepConicDynamicAnimation,
  type ConicDynamicParams,
} from '../../curve/modules/conic-dynamic-geometry/animation';
import { CANVAS_ASPECT, E_MAX, E_MIN } from '../../curve/modules/conic-dynamic-geometry/constants';
import {
  pickPointClockFromWorld,
  screenToWorld,
} from '../../curve/modules/conic-dynamic-geometry/geometry';
import type { ConicMode, FocusCurveType } from '../../curve/modules/conic-dynamic-geometry/types';
import {
  buildSidebarState,
  renderConicDynamicGeometryScene,
} from '../../systems/rendering/conicDynamicGeometryRender';
import type { CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/conic-dynamic-geometry-explore.css';

const CANVAS_MIN_W = 280;
const CANVAS_MAX_W = 720;

const SIDEBAR_UPDATE_INTERVAL_MS = 120;

const DEFAULT_PARAMS: ConicDynamicParams = {
  mode: 'eccentricity',
  focusCurve: 'ellipse',
  eccentricity: 0.65,
  showConstruction: true,
  animatePoint: true,
};

function measureConicCanvas(host: HTMLElement): CanvasSize {
  const w = Math.min(
    CANVAS_MAX_W,
    Math.max(CANVAS_MIN_W, Math.round(host.clientWidth || CANVAS_MIN_W)),
  );
  return { width: w, height: Math.max(220, Math.round(w * CANVAS_ASPECT)) };
};

type SidebarState = {
  modeLabel: string;
  valueLabel: string;
  noteLabel: string;
  formulaLabel: string;
  subtitle: string;
};

export default function ConicDynamicGeometryExploreRoot() {
  const [params, setParams] = useState<ConicDynamicParams>(DEFAULT_PARAMS);
  const [sidebar, setSidebar] = useState<SidebarState>({
    modeLabel: '模式：離心率',
    valueLabel: 'e = 0.65 · 橢圓',
    noteLabel: '',
    formulaLabel: 'PF / Pd = e',
    subtitle: '橢圓',
  });

  const paramsRef = useRef(params);
  const animRef = useRef(createConicDynamicAnimState(DEFAULT_PARAMS));
  const lastSidebarKeyRef = useRef('');
  const lastSidebarUpdateAtRef = useRef(0);

  useEffect(() => {
    paramsRef.current = params;
    lastSidebarUpdateAtRef.current = 0;
  }, [params]);

  const updatePointFromMouse = useCallback((p: p5) => {
    const anim = animRef.current;
    const target = paramsRef.current;

    if (
      p.mouseX < 0 ||
      p.mouseX > p.width ||
      p.mouseY < 0 ||
      p.mouseY > p.height
    ) {
      return;
    }

    if (!anim.activeMetricPoints.length) return;

    const world = screenToWorld(p.mouseX, p.mouseY, p.width, p.height);
    const nextClock = pickPointClockFromWorld(
      world,
      anim.activeMetricPoints,
      target.mode,
      target.focusCurve,
    );

    paramsRef.current = { ...target, animatePoint: false };
    setParams((prev) => ({ ...prev, animatePoint: false }));

    animRef.current = {
      ...anim,
      pointClock: nextClock,
      targetParams: { ...target, animatePoint: false },
      params: { ...target, animatePoint: false },
    };
  }, []);

  const draw = useCallback((p: p5) => {
    animRef.current = stepConicDynamicAnimation(
      animRef.current,
      paramsRef.current,
      p.deltaTime,
    );

    const anim = animRef.current;
    const snap = {
      width: p.width,
      height: p.height,
      mode: anim.targetParams.mode,
      focusCurve: anim.targetParams.focusCurve,
      smoothE: anim.smoothE,
      reveal: anim.reveal,
      pointClock: anim.pointClock,
      showConstruction: anim.targetParams.showConstruction,
    };

    renderConicDynamicGeometryScene(p, snap);

    const now = p.millis();
    if (now - lastSidebarUpdateAtRef.current >= SIDEBAR_UPDATE_INTERVAL_MS) {
      lastSidebarUpdateAtRef.current = now;

      const panel = buildSidebarState(snap);
      const sidebarKey = `${panel.modeLabel}|${panel.valueLabel}|${panel.noteLabel}|${anim.subtitle}`;
      if (sidebarKey !== lastSidebarKeyRef.current) {
        lastSidebarKeyRef.current = sidebarKey;
        setSidebar({
          ...panel,
          subtitle: anim.subtitle,
        });
      }
    }
  }, []);

  const canvasHostRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef(draw);
  const updatePointRef = useRef(updatePointFromMouse);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    updatePointRef.current = updatePointFromMouse;
  }, [updatePointFromMouse]);

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
          const { width, height } = measureConicCanvas(host);
          p.createCanvas(width, height);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => drawRef.current(p);

        p.mousePressed = () => updatePointRef.current(p);
        p.mouseDragged = () => updatePointRef.current(p);
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!isP5RendererReady(instance)) return;

        const { width, height } = measureConicCanvas(host);
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

  const setMode = (mode: ConicMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const setFocusCurve = (focusCurve: FocusCurveType) => {
    setParams((prev) => ({ ...prev, focusCurve }));
  };

  const formulaLines = useMemo(
    () => sidebar.formulaLabel.split('\n'),
    [sidebar.formulaLabel],
  );

  const noteLines = useMemo(
    () => sidebar.noteLabel.split('\n'),
    [sidebar.noteLabel],
  );

  return (
    <div className="conic-dynamic-explore">
      <div className="conic-dynamic-explore__stage">
        <div className="conic-dynamic-explore__visual">
          <p className="conic-dynamic-explore__visual-title">
            二次曲線動態幾何
          </p>
          <p className="conic-dynamic-explore__visual-sub">{sidebar.subtitle}</p>
          <div
            ref={canvasHostRef}
            className="conic-dynamic-explore__canvas"
            role="img"
            aria-label="二次曲線的幾何動態軌跡"
          />
        </div>

        <aside className="conic-dynamic-explore__sidebar">
          <div className="conic-dynamic-explore__block">
            <p className="conic-dynamic-explore__block-title">切換</p>
            <label className="conic-dynamic-explore__field">
              <span className="conic-dynamic-explore__field-label">模式</span>
              <select
                className="conic-dynamic-explore__select"
                value={params.mode}
                onChange={(e) => setMode(e.target.value as ConicMode)}
              >
                <option value="eccentricity">離心率模式</option>
                <option value="focus">焦點軌跡模式</option>
              </select>
            </label>
          </div>

          {params.mode === 'eccentricity' ? (
            <div className="conic-dynamic-explore__block">
              <p className="conic-dynamic-explore__block-title">離心率</p>
              <div className="control-field">
                <label htmlFor="conic-e">
                  e
                  <span className="conic-dynamic-explore__val">
                    {params.eccentricity.toFixed(2)}
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="conic-e"
                    type="range"
                    className="range"
                    min={E_MIN}
                    max={E_MAX}
                    step={0.01}
                    value={params.eccentricity}
                    onInput={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        eccentricity: Number(
                          (e.target as HTMLInputElement).value,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <label className="conic-dynamic-explore__check">
                <input
                  type="checkbox"
                  checked={params.showConstruction}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      showConstruction: e.target.checked,
                    }))
                  }
                />
                顯示焦點 / 準線
              </label>
            </div>
          ) : (
            <div className="conic-dynamic-explore__block">
              <p className="conic-dynamic-explore__block-title">焦點軌跡</p>
              <label className="conic-dynamic-explore__field">
                <span className="conic-dynamic-explore__field-label">曲線</span>
                <select
                  className="conic-dynamic-explore__select"
                  value={params.focusCurve}
                  onChange={(e) =>
                    setFocusCurve(e.target.value as FocusCurveType)
                  }
                >
                  <option value="ellipse">橢圓</option>
                  <option value="parabola">拋物線</option>
                  <option value="hyperbola">雙曲線</option>
                </select>
              </label>
            </div>
          )}

          <label className="conic-dynamic-explore__check">
            <input
              type="checkbox"
              checked={params.animatePoint}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  animatePoint: e.target.checked,
                }))
              }
            />
            動點 P 自動移動
          </label>

          <div className="conic-dynamic-explore__block">
            <p className="conic-dynamic-explore__block-title">狀態</p>
            <p className="conic-dynamic-explore__muted" aria-live="polite">
              {sidebar.modeLabel}
            </p>
            <p className="conic-dynamic-explore__accent">{sidebar.valueLabel}</p>
            {noteLines.map((line) => (
              <p key={line} className="conic-dynamic-explore__muted">
                {line}
              </p>
            ))}
          </div>

          <div className="conic-dynamic-explore__block conic-dynamic-explore__formula-block">
            <p className="conic-dynamic-explore__block-title">公式</p>
            {formulaLines.map((line) => (
              <p key={line} className="conic-dynamic-explore__formula">
                {line}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
