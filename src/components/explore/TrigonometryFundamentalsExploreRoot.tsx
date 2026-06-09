import { useCallback, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_PARAMS,
  MODE_OPTIONS,
  TAU,
} from '../../explore/trigonometry/constants';
import {
  applyVisualDrag,
  buildCircleStats,
  buildIdentityStats,
  buildTriangleStats,
  degLabel,
  measureTrigonometryCanvas,
  pickVisualDrag,
  plotRect,
  resetTriangle,
  signedDegLabel,
  stepSmoothing,
} from '../../explore/trigonometry/geometry';
import type {
  TrigExploreParams,
  TrigSmoothState,
  VisualDragKind,
} from '../../explore/trigonometry/types';
import { renderTrigonometryExploreScene } from '../../systems/rendering/trigonometryExploreRender';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/trigonometry-explore.css';

const INITIAL_SMOOTH: TrigSmoothState = {
  theta: DEFAULT_PARAMS.theta,
  alpha: DEFAULT_PARAMS.alpha,
  beta: DEFAULT_PARAMS.beta,
  advancedMix: 0,
};

export default function TrigonometryFundamentalsExploreRoot() {
  const [params, setParamsState] = useState<TrigExploreParams>({
    ...DEFAULT_PARAMS,
    triangle: resetTriangle(),
  });

  const paramsRef = useRef(params);
  const smoothRef = useRef<TrigSmoothState>({ ...INITIAL_SMOOTH });
  const draggingRef = useRef<VisualDragKind | null>(null);

  paramsRef.current = params;

  const setParams = useCallback((updater: (prev: TrigExploreParams) => TrigExploreParams) => {
    setParamsState((prev) => {
      const next = updater(prev);
      paramsRef.current = next;
      return next;
    });
  }, []);

  const activeMode = MODE_OPTIONS.find((item) => item.id === params.mode) ?? MODE_OPTIONS[0];

  const sidebar = useMemo(() => {
    if (params.mode === 'circle') return buildCircleStats(params.theta);
    if (params.mode === 'triangle') return buildTriangleStats(params.triangle);
    return buildIdentityStats(params.alpha, params.beta);
  }, [params]);

  const draw = useCallback((p: p5) => {
    smoothRef.current = stepSmoothing(smoothRef.current, paramsRef.current, p.deltaTime);
    renderTrigonometryExploreScene(p, {
      params: paramsRef.current,
      smooth: smoothRef.current,
    });
  }, []);

  const extendSketch = useCallback(
    (p: p5) => {
      const startDrag = () => {
        const plot = plotRect(p.width, p.height);
        draggingRef.current = pickVisualDrag(
          paramsRef.current.mode,
          p.mouseX,
          p.mouseY,
          plot,
          paramsRef.current,
          smoothRef.current,
        );
      };

      const updateDrag = () => {
        const drag = draggingRef.current;
        if (!drag) return;

        const plot = plotRect(p.width, p.height);
        const patch = applyVisualDrag(
          drag,
          p.mouseX,
          p.mouseY,
          plot,
          paramsRef.current,
          smoothRef.current,
        );

        setParams((prev) => ({ ...prev, ...patch }));
      };

      const stopDrag = () => {
        draggingRef.current = null;
      };

      p.mousePressed = startDrag;
      p.mouseDragged = updateDrag;
      p.mouseReleased = stopDrag;

      p.touchStarted = () => {
        startDrag();
        return false;
      };

      p.touchMoved = () => {
        updateDrag();
        return false;
      };

      p.touchEnded = () => {
        stopDrag();
        return false;
      };
    },
    [setParams],
  );

  const measureRect = useCallback(
    (host: HTMLElement) => measureTrigonometryCanvas(host),
    [],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [draw, extendSketch], measureRect, extendSketch);

  return (
    <div className="trig-explore">
      <div className="trig-explore__stage">
        <div className="trig-explore__visual">
          <p className="trig-explore__visual-title">TRIGONOMETRY</p>
          <p className="trig-explore__visual-sub">{activeMode.label}</p>
          <div
            ref={canvasHostRef}
            className="trig-explore__canvas"
            role="img"
            aria-label="三角函數主題導覽互動視覺化"
          />
        </div>

        <aside className="trig-explore__sidebar">
          <div className="trig-explore__mode-tabs" aria-label="模式">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="trig-explore__mode-btn"
                data-active={params.mode === option.id}
                onClick={() => setParams((prev) => ({ ...prev, mode: option.id }))}
                aria-pressed={params.mode === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="trig-explore__advanced-btn"
            data-active={params.advanced}
            onClick={() => setParams((prev) => ({ ...prev, advanced: !prev.advanced }))}
            aria-pressed={params.advanced}
          >
            {params.advanced ? '進階 guide：開' : '進階 guide：關'}
          </button>

          <p className="trig-explore__state" aria-live="polite" role="status">
            {activeMode.caption}
          </p>

          {params.mode === 'circle' && (
            <div className="trig-explore__control-block">
              <p className="trig-explore__group-label">參數</p>
              <div className="control-field">
                <label htmlFor="trig-theta">
                  角度 θ
                  <span className="trig-explore__val">{degLabel(params.theta)}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="trig-theta"
                    type="range"
                    className="range"
                    min={0}
                    max={TAU}
                    step={0.01}
                    value={params.theta % TAU}
                    onInput={(event) =>
                      setParams((prev) => ({
                        ...prev,
                        theta: Number((event.target as HTMLInputElement).value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {params.mode === 'triangle' && (
            <div className="trig-explore__control-block">
              <p className="trig-explore__group-label">參數</p>
              <p className="trig-explore__note">拖動 A、B、C 三個頂點</p>
              <button
                type="button"
                className="trig-explore__reset-btn"
                onClick={() => setParams((prev) => ({ ...prev, triangle: resetTriangle() }))}
              >
                重置三角形
              </button>
            </div>
          )}

          {params.mode === 'identity' && (
            <div className="trig-explore__control-block">
              <p className="trig-explore__group-label">參數</p>
              <div className="control-field">
                <label htmlFor="trig-alpha">
                  角度 α
                  <span className="trig-explore__val">{degLabel(params.alpha)}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="trig-alpha"
                    type="range"
                    className="range"
                    min={0}
                    max={TAU}
                    step={0.01}
                    value={params.alpha % TAU}
                    onInput={(event) =>
                      setParams((prev) => ({
                        ...prev,
                        alpha: Number((event.target as HTMLInputElement).value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="control-field">
                <label htmlFor="trig-beta">
                  角度 β
                  <span className="trig-explore__val">{signedDegLabel(params.beta)}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="trig-beta"
                    type="range"
                    className="range"
                    min={-Math.PI}
                    max={Math.PI}
                    step={0.01}
                    value={params.beta}
                    onInput={(event) =>
                      setParams((prev) => ({
                        ...prev,
                        beta: Number((event.target as HTMLInputElement).value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <div className="trig-explore__control-block trig-explore__stats">
            <p className="trig-explore__group-label">統計</p>
            {sidebar.stats.map((line) => (
              <p key={line} className="trig-explore__stat-line">
                {line}
              </p>
            ))}
          </div>

          <div className="trig-explore__control-block">
            <p className="trig-explore__group-label">公式</p>
            {sidebar.formulas.map((line) => (
              <p key={line} className="trig-explore__formula-line">
                {line}
              </p>
            ))}
            {params.mode === 'identity' && params.advanced && (
              <p className="trig-explore__formula-line">2sinαcosβ=sin(α+β)+sin(α−β)</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
