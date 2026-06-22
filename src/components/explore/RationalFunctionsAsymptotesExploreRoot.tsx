import { useCallback, useMemo, useRef, useState } from 'react';
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
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/rational-functions-asymptotes-explore.css';

export default function RationalFunctionsAsymptotesExploreRoot() {
  const [presetId, setPresetId] = useState<RationalPresetId>('factor');
  const [params, setParams] = useState<RationalParams>(() => ({ ...presetById('factor').params }));
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [showHoles, setShowHoles] = useState(true);
  const [advanced, setAdvanced] = useState(false);

  const presetIdRef = useRef(presetId);
  const paramsRef = useRef(params);
  const showAsymptotesRef = useRef(showAsymptotes);
  const showHolesRef = useRef(showHoles);

  presetIdRef.current = presetId;
  paramsRef.current = params;
  showAsymptotesRef.current = showAsymptotes;
  showHolesRef.current = showHoles;

  const activePreset = useMemo(() => presetById(presetId), [presetId]);
  const model = useMemo(() => buildRationalModel(activePreset, params), [activePreset, params]);
  const statusLines = useMemo(() => buildStatusLines(model), [model]);
  const formulaLines = useMemo(() => buildFormulaLines(model), [model]);
  const advancedLines = useMemo(() => buildAdvancedLines(model), [model]);

  const draw = useCallback((p: p5) => {
    p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans TC", sans-serif');
    const preset = presetById(presetIdRef.current);
    renderRationalFunctionsAsymptotesExploreScene(p, {
      preset,
      model: buildRationalModel(preset, paramsRef.current),
      showAsymptotes: showAsymptotesRef.current,
      showHoles: showHolesRef.current,
    });
  }, []);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw],
    measureRationalExploreCanvas,
    undefined,
    { loop: false, redrawKey: `${presetId}|${JSON.stringify(params)}|${showAsymptotes}|${showHoles}` },
  );

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
