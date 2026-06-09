import { useCallback, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { BASIS_OPTIONS, DEFAULT_PARAMS, MODE_OPTIONS } from '../../explore/function-equations/constants';
import {
  buildStatsLines,
  computeSceneLayout,
  measureFunctionEquationsCanvas,
  pickPolynomialRootHandle,
  rootFromScreenX,
  sanitizeQuadraticA,
  stepViewHalfYSmoothing,
} from '../../explore/function-equations/geometry';
import type {
  BasisKind,
  FunctionEquationsMode,
  FunctionEquationsParams,
  FunctionEquationsSmooth,
  Multiplicity,
} from '../../explore/function-equations/types';
import { renderFunctionEquationsExploreScene } from '../../systems/rendering/functionEquationsExploreRender';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/function-equations-explore.css';

const INITIAL_SMOOTH: FunctionEquationsSmooth = {
  viewHalfY: 5,
};

export default function FunctionEquationsExploreRoot() {
  const [params, setParamsState] = useState<FunctionEquationsParams>(DEFAULT_PARAMS);

  const paramsRef = useRef(params);
  const smoothRef = useRef<FunctionEquationsSmooth>({ ...INITIAL_SMOOTH });
  const draggingRootRef = useRef<number | null>(null);

  paramsRef.current = params;

  const setParams = useCallback((updater: (prev: FunctionEquationsParams) => FunctionEquationsParams) => {
    setParamsState((prev) => {
      const next = updater(prev);
      paramsRef.current = next;
      return next;
    });
  }, []);

  const activeMode = MODE_OPTIONS.find((item) => item.id === params.mode) ?? MODE_OPTIONS[0];
  const stats = useMemo(() => buildStatsLines(params), [params]);

  const draw = useCallback((p: p5) => {
    const targetViewHalfY = renderFunctionEquationsExploreScene(p, {
      params: paramsRef.current,
      smooth: smoothRef.current,
    });
    smoothRef.current = stepViewHalfYSmoothing(smoothRef.current, targetViewHalfY, p.deltaTime);
  }, []);

  const extendSketch = useCallback(
    (p: p5) => {
      const startDrag = () => {
        if (paramsRef.current.mode !== 'polynomial') return;
        const layout = computeSceneLayout(p.width, p.height);

        draggingRootRef.current = pickPolynomialRootHandle(
          paramsRef.current,
          layout,
          smoothRef.current.viewHalfY,
          p.mouseX,
          p.mouseY,
        );
      };

      const updateDrag = () => {
        const index = draggingRootRef.current;
        if (index === null) return;

        const { plot } = computeSceneLayout(p.width, p.height);
        const nextRoot = rootFromScreenX(p.mouseX, plot);
        setParams((prev) => {
          const roots = [...prev.polynomial.roots] as FunctionEquationsParams['polynomial']['roots'];
          roots[index] = nextRoot;
          return { ...prev, polynomial: { ...prev.polynomial, roots } };
        });
      };

      const stopDrag = () => {
        draggingRootRef.current = null;
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

  const measureRect = useCallback((host: HTMLElement) => measureFunctionEquationsCanvas(host), []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw, extendSketch], measureRect, extendSketch);

  const setMode = (mode: FunctionEquationsMode) => {
    setParams((prev) => ({ ...prev, mode }));
    draggingRootRef.current = null;
  };

  const setTransform = <K extends keyof FunctionEquationsParams['transform']>(
    key: K,
    value: FunctionEquationsParams['transform'][K],
  ) => {
    setParams((prev) => ({
      ...prev,
      transform: { ...prev.transform, [key]: value },
    }));
  };

  const setQuadratic = <K extends keyof FunctionEquationsParams['quadratic']>(
    key: K,
    value: FunctionEquationsParams['quadratic'][K],
  ) => {
    setParams((prev) => ({
      ...prev,
      quadratic: {
        ...prev.quadratic,
        [key]: key === 'a' ? sanitizeQuadraticA(value as number) : value,
      },
    }));
  };

  const setPolynomialRoot = (index: number, value: number) => {
    setParams((prev) => {
      const roots = [...prev.polynomial.roots] as FunctionEquationsParams['polynomial']['roots'];
      roots[index] = value;
      return { ...prev, polynomial: { ...prev.polynomial, roots } };
    });
  };

  const setPolynomialMult = (index: number, mult: Multiplicity) => {
    setParams((prev) => {
      const mults = [...prev.polynomial.mult] as FunctionEquationsParams['polynomial']['mult'];
      mults[index] = mult;
      return { ...prev, polynomial: { ...prev.polynomial, mult: mults } };
    });
  };

  return (
    <div className="fn-eq-explore">
      <div className="fn-eq-explore__stage">
        <div className="fn-eq-explore__visual">
          <p className="fn-eq-explore__visual-title">FUNCTIONS &amp; EQUATIONS</p>
          <p className="fn-eq-explore__visual-sub">{activeMode.caption}</p>
          <div
            ref={canvasHostRef}
            className="fn-eq-explore__canvas"
            role="img"
            aria-label="函數圖形與方程解集主題導覽互動視覺化"
          />
        </div>

        <aside className="fn-eq-explore__sidebar">
          <p className="fn-eq-explore__sidebar-lead">方程看交點，不等式看上下區間</p>

          <div className="fn-eq-explore__mode-tabs" aria-label="模式">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="fn-eq-explore__mode-btn"
                data-active={params.mode === option.id}
                onClick={() => setMode(option.id)}
                aria-pressed={params.mode === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>

          {params.mode === 'transform' && (
            <div className="fn-eq-explore__control-block">
              <p className="fn-eq-explore__group-label">基底 f(x)</p>
              <div className="fn-eq-explore__basis-grid">
                {BASIS_OPTIONS.map((basis) => (
                  <button
                    key={basis.id}
                    type="button"
                    className="fn-eq-explore__chip-btn"
                    data-active={params.transform.basis === basis.id}
                    onClick={() => setTransform('basis', basis.id as BasisKind)}
                    aria-pressed={params.transform.basis === basis.id}
                  >
                    {basis.label}
                  </button>
                ))}
              </div>

              <RangeField
                id="transform-a"
                label="垂直倍率 a"
                min={-2.5}
                max={2.5}
                step={0.05}
                value={params.transform.a}
                onChange={(value) => setTransform('a', value)}
              />
              <RangeField
                id="transform-b"
                label="水平倍率 b"
                min={-2.5}
                max={2.5}
                step={0.05}
                value={params.transform.b}
                onChange={(value) => setTransform('b', value)}
              />
              <RangeField
                id="transform-h"
                label="水平位移 h"
                min={-3}
                max={3}
                step={0.05}
                value={params.transform.h}
                onChange={(value) => setTransform('h', value)}
              />
              <RangeField
                id="transform-k"
                label="垂直位移 k"
                min={-3}
                max={3}
                step={0.05}
                value={params.transform.k}
                onChange={(value) => setTransform('k', value)}
              />
            </div>
          )}

          {params.mode === 'quadratic' && (
            <div className="fn-eq-explore__control-block">
              <RangeField
                id="quadratic-a"
                label="係數 a"
                min={-2}
                max={2}
                step={0.05}
                value={params.quadratic.a}
                onChange={(value) => setQuadratic('a', value)}
              />
              <RangeField
                id="quadratic-b"
                label="係數 b"
                min={-5}
                max={5}
                step={0.05}
                value={params.quadratic.b}
                onChange={(value) => setQuadratic('b', value)}
              />
              <RangeField
                id="quadratic-c"
                label="係數 c"
                min={-5}
                max={5}
                step={0.05}
                value={params.quadratic.c}
                onChange={(value) => setQuadratic('c', value)}
              />
            </div>
          )}

          {params.mode === 'polynomial' && (
            <div className="fn-eq-explore__control-block">
              {params.polynomial.roots.map((root, index) => (
                <div key={`root-${index}`} className="fn-eq-explore__root-row">
                  <RangeField
                    id={`polynomial-r${index + 1}`}
                    label={`零點 r${index + 1}`}
                    min={-4.5}
                    max={4.5}
                    step={0.05}
                    value={root}
                    onChange={(value) => setPolynomialRoot(index, value)}
                  />
                  <div className="fn-eq-explore__mult-row">
                    <span className="fn-eq-explore__mult-label">重數 m{index + 1}</span>
                    <div className="fn-eq-explore__mult-btns">
                      <button
                        type="button"
                        className="fn-eq-explore__chip-btn"
                        data-active={params.polynomial.mult[index] === 1}
                        onClick={() => setPolynomialMult(index, 1)}
                        aria-pressed={params.polynomial.mult[index] === 1}
                      >
                        1
                      </button>
                      <button
                        type="button"
                        className="fn-eq-explore__chip-btn"
                        data-active={params.polynomial.mult[index] === 2}
                        onClick={() => setPolynomialMult(index, 2)}
                        aria-pressed={params.polynomial.mult[index] === 2}
                      >
                        2
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <p className="fn-eq-explore__note">也可在圖上拖動 r₁、r₂、r₃ 控制點</p>
            </div>
          )}

          <button
            type="button"
            className="fn-eq-explore__advanced-btn"
            data-active={params.advanced}
            onClick={() => setParams((prev) => ({ ...prev, advanced: !prev.advanced }))}
            aria-pressed={params.advanced}
          >
            {params.advanced ? '進階 guide：開' : '進階 guide：關'}
          </button>

          <div className="fn-eq-explore__control-block fn-eq-explore__stats">
            <p className="fn-eq-explore__group-label">統計</p>
            {stats.map((line) => (
              <p key={line} className="fn-eq-explore__stat-line">
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
  onChange: (value: number) => void;
};

function RangeField({ id, label, min, max, step, value, onChange }: RangeFieldProps) {
  return (
    <div className="control-field">
      <label htmlFor={id}>
        {label}
        <span className="fn-eq-explore__val">{formatRangeValue(value)}</span>
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

function formatRangeValue(value: number) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 0.0005) return '0';
  const digits = Math.abs(value) >= 10 ? 1 : 2;
  return Number(value.toFixed(digits)).toString();
}
