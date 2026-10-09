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

const TEXT = {
  zh: {
    aria: '極限與黎曼和',
    parameters: '參數',
    mode: '模式',
    modes: [
      { value: 'compare' as const, label: '對照' },
      { value: 'riemann' as const, label: '全域面積' },
      { value: 'tangent' as const, label: '局部斜率' },
    ],
    fn: '函數 f(x)',
    scale: '尺度',
    sample: '分割方式',
    samples: [
      { value: 'left' as const, label: '左點' },
      { value: 'right' as const, label: '右點' },
      { value: 'mid' as const, label: '中點' },
    ],
    partitions: '分割數 n',
    point: '點 P 位置 t',
    span: '局部跨度 h',
    stats: '統計',
  },
  en: {
    aria: 'Limits and Riemann sums',
    parameters: 'Parameters',
    mode: 'Mode',
    modes: [
      { value: 'compare' as const, label: 'Compare' },
      { value: 'riemann' as const, label: 'Global area' },
      { value: 'tangent' as const, label: 'Local slope' },
    ],
    fn: 'Function f(x)',
    scale: 'Scale',
    sample: 'Sample',
    samples: [
      { value: 'left' as const, label: 'Left point' },
      { value: 'right' as const, label: 'Right point' },
      { value: 'mid' as const, label: 'Midpoint' },
    ],
    partitions: 'Number of partitions n',
    point: 'Point P position t',
    span: 'Local span h',
    stats: 'Statistics',
  },
} as const;

const DEFAULT_PARAMS: LimitsRiemannParams = {
  mode: 'compare',
  fnKey: 'x2',
  method: 'mid',
  n: 24,
  tangentT: 0.45,
  localH: 0.18,
  scale: 0.45,
};

type Props = {
  locale?: 'en';
};

export default function LimitsRiemannSumExploreRoot({ locale }: Props) {
  const text = locale === 'en' ? TEXT.en : TEXT.zh;
  const [params, setParams] = useState<LimitsRiemannParams>(DEFAULT_PARAMS);

  const paramsRef = useRef(params);
  const localeRef = useRef(locale);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const sidebar = useMemo(() => buildLimitsSidebarState(params, locale), [params, locale]);

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
      locale: localeRef.current,
    });
  }, []);

  const updateTangentRef = useRef(updateTangentFromMouse);

  useEffect(() => {
    updateTangentRef.current = updateTangentFromMouse;
  }, [updateTangentFromMouse]);

  const extendSketch = useCallback((p: p5, host?: HTMLElement) => {
    p.mousePressed = () => updateTangentRef.current(p);
    p.mouseDragged = () => updateTangentRef.current(p);

    wireTouchToMouse(p, host);
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
            aria-label={text.aria}
          />
        </div>

        <aside className="limits-riemann-explore__sidebar">
          <div className="limits-riemann-explore__block">
            <p className="limits-riemann-explore__block-title">{text.parameters}</p>

            <label className="limits-riemann-explore__field">
              <span className="limits-riemann-explore__field-label">{text.mode}</span>
              <select
                className="limits-riemann-explore__select"
                value={params.mode}
                onChange={(e) => setMode(e.target.value as LimitsMode)}
              >
                {text.modes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="limits-riemann-explore__field">
              <span className="limits-riemann-explore__field-label">{text.fn}</span>
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
                  {text.scale}
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
                    {text.sample}
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
                    {text.samples.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="control-field">
                  <label htmlFor="limits-n">
                    {text.partitions}
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
                    {text.point}
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
                    {text.span}
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
            <p className="limits-riemann-explore__block-title">{text.stats}</p>
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
