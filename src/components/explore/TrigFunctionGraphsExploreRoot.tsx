import { useCallback, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_PARAMS,
  MODE_OPTIONS,
  TAU,
  buildTrigFunctionGraphFormulas,
  buildTrigFunctionGraphStats,
  computeTrigFunctionGraphLayout,
  formatRad,
  measureTrigFunctionGraphCanvas,
  pickThetaDrag,
  thetaFromCircle,
  thetaFromGraph,
  type ThetaDragTarget,
  type TrigFunctionGraphMode,
  type TrigFunctionGraphParams,
} from '../../explore/trig-function-graphs/geometry';
import { renderTrigFunctionGraphsExploreScene } from '../../systems/rendering/trigFunctionGraphsExploreRender';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/trig-function-graphs-explore.css';

export default function TrigFunctionGraphsExploreRoot() {
  const [params, setParamsState] = useState<TrigFunctionGraphParams>({ ...DEFAULT_PARAMS });
  const paramsRef = useRef(params);
  const draggingRef = useRef<ThetaDragTarget | null>(null);

  paramsRef.current = params;

  const setParams = useCallback((updater: (prev: TrigFunctionGraphParams) => TrigFunctionGraphParams) => {
    setParamsState((prev) => {
      const next = updater(prev);
      paramsRef.current = next;
      return next;
    });
  }, []);

  const activeMode = MODE_OPTIONS.find((item) => item.id === params.mode) ?? MODE_OPTIONS[0];
  const stats = useMemo(() => buildTrigFunctionGraphStats(params), [params]);
  const formulas = useMemo(() => buildTrigFunctionGraphFormulas(params.mode), [params.mode]);

  const draw = useCallback((p: p5) => {
    renderTrigFunctionGraphsExploreScene(p, paramsRef.current);
  }, []);

  const extendSketch = useCallback(
    (p: p5) => {
      const updateThetaDrag = () => {
        const drag = draggingRef.current;
        if (!drag) return;

        const current = paramsRef.current;
        const layout = computeTrigFunctionGraphLayout(p.width, p.height, current.mode);
        const theta = drag === 'circle'
          ? thetaFromCircle(current.theta, p.mouseX, p.mouseY, layout.circle)
          : thetaFromGraph(p.mouseX, layout);

        setParams((prev) => ({ ...prev, theta }));
      };

      const startDrag = () => {
        const current = paramsRef.current;
        const layout = computeTrigFunctionGraphLayout(p.width, p.height, current.mode);
        draggingRef.current = pickThetaDrag(p.mouseX, p.mouseY, layout, current.mode);
        updateThetaDrag();
      };

      const stopDrag = () => {
        draggingRef.current = null;
      };

      p.mousePressed = startDrag;
      p.mouseDragged = updateThetaDrag;
      p.mouseReleased = stopDrag;

      p.touchStarted = () => {
        startDrag();
        return false;
      };

      p.touchMoved = () => {
        updateThetaDrag();
        return false;
      };

      p.touchEnded = () => {
        stopDrag();
        return false;
      };
    },
    [setParams],
  );

  const measureRect = useCallback((host: HTMLElement) => measureTrigFunctionGraphCanvas(host), []);
  const canvasHostRef = useRectP5CanvasHost(draw, [draw, extendSketch], measureRect, extendSketch, {
    loop: false,
    redrawKey: params,
  });

  const setMode = (mode: TrigFunctionGraphMode) => {
    draggingRef.current = null;
    setParams((prev) => ({ ...prev, mode }));
  };

  const setNumberParam = <K extends keyof TrigFunctionGraphParams>(
    key: K,
    value: TrigFunctionGraphParams[K],
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="trig-graphs-explore">
      <div className="trig-graphs-explore__stage">
        <div className="trig-graphs-explore__visual">
          <p className="trig-graphs-explore__visual-title">TRIG FUNCTION GRAPHS</p>
          <p className="trig-graphs-explore__visual-sub">{activeMode.label}</p>
          <div
            ref={canvasHostRef}
            className="trig-graphs-explore__canvas"
            role="img"
            aria-label="三角函數圖形與弧度互動視覺化"
          />
        </div>

        <aside className="trig-graphs-explore__sidebar">
          <div className="trig-graphs-explore__mode-tabs" aria-label="模式">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="trig-graphs-explore__mode-btn"
                data-active={params.mode === option.id}
                onClick={() => setMode(option.id)}
                aria-pressed={params.mode === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="trig-graphs-explore__state" aria-live="polite" role="status">
            {activeMode.caption}
          </p>

          <div className="trig-graphs-explore__control-block">
            <p className="trig-graphs-explore__group-label">參數</p>
            <RangeField
              id="trig-graphs-theta"
              label="角度 θ"
              min={-Math.PI}
              max={TAU * 2}
              step={0.01}
              value={params.theta}
              valueLabel={formatRad(params.theta)}
              onChange={(value) => setNumberParam('theta', value)}
            />

            {params.mode === 'unfold' && (
              <button
                type="button"
                className="trig-graphs-explore__toggle-btn"
                data-active={params.showCos}
                onClick={() => setParams((prev) => ({ ...prev, showCos: !prev.showCos }))}
                aria-pressed={params.showCos}
              >
                {params.showCos ? '顯示 cos x：開' : '顯示 cos x：關'}
              </button>
            )}

            {params.mode === 'transform' && (
              <>
                <RangeField
                  id="trig-graphs-amplitude"
                  label="振幅 A"
                  min={-2}
                  max={2}
                  step={0.05}
                  value={params.amplitude}
                  onChange={(value) => setNumberParam('amplitude', value)}
                />
                <RangeField
                  id="trig-graphs-period"
                  label="週期 T"
                  min={Math.PI}
                  max={Math.PI * 4}
                  step={0.01}
                  value={params.period}
                  valueLabel={formatRad(params.period)}
                  onChange={(value) => setNumberParam('period', value)}
                />
                <RangeField
                  id="trig-graphs-phase"
                  label="相位 φ"
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.01}
                  value={params.phase}
                  valueLabel={formatRad(params.phase)}
                  onChange={(value) => setNumberParam('phase', value)}
                />
                <RangeField
                  id="trig-graphs-vertical"
                  label="位移 k"
                  min={-1.4}
                  max={1.4}
                  step={0.05}
                  value={params.verticalShift}
                  onChange={(value) => setNumberParam('verticalShift', value)}
                />
              </>
            )}
          </div>

          <div className="trig-graphs-explore__control-block trig-graphs-explore__stats">
            <p className="trig-graphs-explore__group-label">統計</p>
            {stats.map((line) => (
              <p key={line} className="trig-graphs-explore__stat-line">
                {line}
              </p>
            ))}
          </div>

          <div className="trig-graphs-explore__control-block trig-graphs-explore__formula">
            <p className="trig-graphs-explore__group-label">公式</p>
            {formulas.map((line) => (
              <p key={line} className="trig-graphs-explore__formula-line">
                {line}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

type RangeFieldProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueLabel?: string;
  onChange: (value: number) => void;
};

function RangeField({
  id,
  label,
  min,
  max,
  step,
  value,
  valueLabel,
  onChange,
}: RangeFieldProps) {
  return (
    <div className="control-field">
      <label htmlFor={id}>
        {label}
        <span className="trig-graphs-explore__val">{valueLabel ?? formatPlainNumber(value)}</span>
      </label>
      <div className="range-wrap">
        <input
          id={id}
          type="range"
          className="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={(event) => onChange(Number((event.target as HTMLInputElement).value))}
        />
      </div>
    </div>
  );
}

function formatPlainNumber(value: number) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 0.0005) return '0';
  return Number(value.toFixed(2)).toString();
}
