import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  RATIONAL_PARAM_META,
  RATIONAL_PRESETS,
} from '../../explore/rational-functions-asymptotes/constants';
import {
  buildAdvancedLines,
  buildFormulaLines,
  buildRationalModel,
  buildStatusLines,
  fmt,
  measureRationalExploreCanvas,
  presetById,
  roundParam,
} from '../../explore/rational-functions-asymptotes/geometry';
import type {
  RationalParamKey,
  RationalParams,
  RationalPresetId,
} from '../../explore/rational-functions-asymptotes/types';
import { renderRationalFunctionsAsymptotesExploreScene } from '../../systems/rendering/rationalFunctionsAsymptotesExploreRender';
import '../../styles/components/explore/rational-functions-asymptotes-explore.css';

type P5WithRenderer = p5 & { _renderer?: unknown };

export default function RationalFunctionsAsymptotesExploreRoot() {
  const [presetId, setPresetId] = useState<RationalPresetId>('factor');
  const [params, setParams] = useState<RationalParams>(() => ({ ...presetById('factor').params }));
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [showHoles, setShowHoles] = useState(true);
  const [advanced, setAdvanced] = useState(false);

  const canvasHostRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const presetIdRef = useRef(presetId);
  const paramsRef = useRef(params);
  const showAsymptotesRef = useRef(showAsymptotes);
  const showHolesRef = useRef(showHoles);

  const activePreset = useMemo(() => presetById(presetId), [presetId]);
  const model = useMemo(() => buildRationalModel(activePreset, params), [activePreset, params]);
  const statusLines = useMemo(() => buildStatusLines(model), [model]);
  const formulaLines = useMemo(() => buildFormulaLines(model), [model]);
  const advancedLines = useMemo(() => buildAdvancedLines(model), [model]);

  const requestRedraw = useCallback(() => {
    p5Ref.current?.redraw();
  }, []);

  useEffect(() => {
    presetIdRef.current = presetId;
    paramsRef.current = params;
    showAsymptotesRef.current = showAsymptotes;
    showHolesRef.current = showHoles;
    requestRedraw();
  }, [presetId, params, showAsymptotes, showHoles, requestRedraw]);

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
          const { width, height } = measureRationalExploreCanvas(host);
          p.createCanvas(width, height);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans TC", sans-serif');
          p.noLoop();
          window.requestAnimationFrame(() => {
            if (!disposed) p.redraw();
          });
        };

        p.draw = () => {
          const preset = presetById(presetIdRef.current);
          renderRationalFunctionsAsymptotesExploreScene(p, {
            preset,
            model: buildRationalModel(preset, paramsRef.current),
            showAsymptotes: showAsymptotesRef.current,
            showHoles: showHolesRef.current,
          });
        };
      };

      const instance = new P5(sketch, host);
      p5Ref.current = instance;

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;
        const { width, height } = measureRationalExploreCanvas(host);
        instance.resizeCanvas(width, height);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        instance.redraw();
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        if (p5Ref.current === instance) p5Ref.current = null;
        instance.remove();
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  const setPreset = (id: RationalPresetId) => {
    const nextPreset = presetById(id);
    setPresetId(id);
    setParams({ ...nextPreset.params });
  };

  const setParam = (key: RationalParamKey, value: number) => {
    setParams((prev) => ({ ...prev, [key]: roundParam(value) }));
  };

  return (
    <div className="rational-explore">
      <div className="rational-explore__stage">
        <div className="rational-explore__visual">
          <p className="rational-explore__visual-title">RATIONAL FUNCTIONS</p>
          <p className="rational-explore__visual-sub">{activePreset.note}</p>
          <div
            ref={canvasHostRef}
            className="rational-explore__canvas"
            role="img"
            aria-label="有理函數與漸近線主題導覽互動視覺化"
          />
        </div>

        <aside className="rational-explore__sidebar">
          <p className="rational-explore__sidebar-lead">
            從零點、洞、垂直線與遠處骨架讀出有理函數的圖形結構。
          </p>

          <div className="rational-explore__mode-grid" aria-label="模式">
            {RATIONAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="rational-explore__mode-btn"
                data-active={presetId === preset.id}
                aria-pressed={presetId === preset.id}
                onClick={() => setPreset(preset.id)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="rational-explore__block">
            <p className="rational-explore__group-label">參數</p>
            {activePreset.sliders.map((key) => {
              const meta = RATIONAL_PARAM_META[key];
              return (
                <RangeField
                  key={key}
                  id={`rational-${key}`}
                  label={meta.label}
                  min={meta.min}
                  max={meta.max}
                  step={0.01}
                  value={params[key]}
                  onChange={(value) => setParam(key, value)}
                />
              );
            })}
          </div>

          <div className="rational-explore__block">
            <p className="rational-explore__group-label">顯示</p>
            <button
              type="button"
              className="rational-explore__toggle-btn"
              data-active={showAsymptotes}
              aria-pressed={showAsymptotes}
              onClick={() => setShowAsymptotes((prev) => !prev)}
            >
              漸近線：{showAsymptotes ? '顯示' : '隱藏'}
            </button>
            <button
              type="button"
              className="rational-explore__toggle-btn"
              data-active={showHoles}
              aria-pressed={showHoles}
              onClick={() => setShowHoles((prev) => !prev)}
            >
              洞標記：{showHoles ? '顯示' : '隱藏'}
            </button>
            <button
              type="button"
              className="rational-explore__toggle-btn"
              data-active={advanced}
              aria-pressed={advanced}
              onClick={() => setAdvanced((prev) => !prev)}
            >
              進階模式：{advanced ? '開' : '關'}
            </button>
          </div>

          <InfoBlock title="狀態讀數" lines={statusLines} />
          <InfoBlock title="短式子" lines={formulaLines} accent />
          {advanced ? <InfoBlock title="約分與拆式" lines={advancedLines} /> : null}
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
  onChange: (value: number) => void;
};

function RangeField({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
}: RangeFieldProps) {
  return (
    <label className="rational-explore__field" htmlFor={id}>
      <span>
        {label}
        <span className="rational-explore__val">{fmt(value)}</span>
      </span>
      <input
        id={id}
        className="range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

function InfoBlock({
  title,
  lines,
  accent = false,
}: {
  title: string;
  lines: string[];
  accent?: boolean;
}) {
  return (
    <div className="rational-explore__info">
      <p className="rational-explore__group-label">{title}</p>
      {lines.map((line) => (
        <p key={line} className={accent ? 'rational-explore__stat rational-explore__stat--accent' : 'rational-explore__stat'}>
          {line}
        </p>
      ))}
    </div>
  );
}
