import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  AXIS_HALF,
  DEFAULT_LINEAR_PROGRAMMING_PARAMS,
  computeLinearProgrammingMetrics,
  modeTitle,
  modeVerdict,
  type LinearProgrammingParams,
  type ReadingMode,
} from '../../explore/linear-programming/geometry';
import { formatPoint } from '../../curve/linearProgramming';
import { renderLinearProgrammingExploreScene } from '../../systems/rendering/linearProgrammingExploreRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/linear-programming-explore.css';

const MODES: Array<{ value: ReadingMode; label: string }> = [
  { value: 'constraints', label: '約束讀法' },
  { value: 'objective', label: '目標讀法' },
  { value: 'candidates', label: '候選讀法' },
];

type SliderKey = 'offsetA' | 'offsetB' | 'angle';

const SLIDERS: Array<{
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}> = [
  { key: 'offsetA', label: '約束 A 位移', min: -2, max: 10, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'offsetB', label: '約束 B 位移', min: -2, max: 10, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'angle', label: '目標方向 θ', min: 0, max: 360, step: 1, format: (v) => `${v.toFixed(0)}°` },
];

/**
 * explore 的舞台比 works 寬，不能沿用 works 那個上限 600px 的方形量測——
 * 那會讓畫布被放大而變糊。這裡填滿容器寬度，高度取 0.86。
 */
function measureExploreCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(280, Math.min(1000, Math.round(host.clientWidth || 640)));
  return { width, height: Math.max(320, Math.round(width * 0.86)) };
}

export default function LinearProgrammingExploreRoot() {
  const [params, setParams] = useState<LinearProgrammingParams>(
    DEFAULT_LINEAR_PROGRAMMING_PARAMS,
  );

  const patchParams = useCallback((patch: Partial<LinearProgrammingParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  // sketch 只建立一次，draw 透過 ref 讀最新的參數；重繪由 redrawKey 觸發
  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const draw = useCallback((p: p5) => {
    renderLinearProgrammingExploreScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
    });
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureExploreCanvas, undefined, {
    loop: false,
    redrawKey: `${params.offsetA}|${params.offsetB}|${params.angle}|${params.sense}|${params.mode}`,
  });

  const metrics = useMemo(() => computeLinearProgrammingMetrics(params), [params]);

  const readings: Array<[string, string]> = useMemo(() => {
    if (params.mode === 'constraints') {
      return [
        ['角點數', String(metrics.vertices.length)],
        ['冗餘約束', metrics.redundant.length > 0 ? `${metrics.redundant.length} 條` : '無'],
        ['狀態', metrics.empty ? '空集合' : metrics.bounded ? '有界' : '無界'],
      ];
    }
    if (params.mode === 'objective') {
      return [
        ['法向 n', formatPoint({ x: metrics.objective.p, y: metrics.objective.q })],
        ['最優值', metrics.best === null ? '不存在' : metrics.best.toFixed(3)],
        ['求', params.sense === 'max' ? '最大值' : '最小值'],
      ];
    }
    return metrics.ranking.slice(0, 4).map(
      (index, rank) =>
        [`第 ${rank + 1} 名`, `${formatPoint(metrics.vertices[index], 1)}　z = ${metrics.values[index].toFixed(2)}`] as [
          string,
          string,
        ],
    );
  }, [metrics, params.mode, params.sense]);

  return (
    <div className="linear-programming-explore">
      <div className="linear-programming-explore__stage">
        <div className="linear-programming-explore__visual">
          <p className="linear-programming-explore__visual-title">線性規劃</p>
          <p className="linear-programming-explore__visual-sub">{modeTitle(params.mode)}</p>
          <div
            ref={canvasHostRef}
            className="linear-programming-explore__canvas"
            role="img"
            aria-label="線性規劃互動視覺化：可切換約束、目標與候選三種讀法"
          />
        </div>

        <aside className="linear-programming-explore__sidebar">
          <div className="linear-programming-explore__block">
            <p className="linear-programming-explore__block-title">讀法</p>
            <div className="linear-programming-explore__modes">
              {MODES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="linear-programming-explore__mode-button"
                  data-active={params.mode === item.value}
                  aria-pressed={params.mode === item.value}
                  onClick={() => patchParams({ mode: item.value })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="linear-programming-explore__block">
            <p className="linear-programming-explore__block-title">這個讀法怎麼說</p>
            <p className="linear-programming-explore__verdict">
              {modeVerdict(metrics, params.mode)}
            </p>
          </div>

          <div className="linear-programming-explore__block">
            <p className="linear-programming-explore__block-title">場景</p>
            {SLIDERS.map((slider) => (
              <div className="control-field" key={slider.key}>
                <label htmlFor={`linear-programming-${slider.key}`}>
                  <span>{slider.label}</span>
                  <span className="control-field__value">{slider.format(params[slider.key])}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id={`linear-programming-${slider.key}`}
                    type="range"
                    className="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={params[slider.key]}
                    onInput={(event) =>
                      patchParams({ [slider.key]: Number(event.currentTarget.value) })
                    }
                  />
                </div>
              </div>
            ))}

            <div className="linear-programming-explore__modes">
              <button
                type="button"
                className="linear-programming-explore__mode-button"
                data-active={params.sense === 'max'}
                aria-pressed={params.sense === 'max'}
                onClick={() => patchParams({ sense: params.sense === 'max' ? 'min' : 'max' })}
              >
                {params.sense === 'max' ? '求最大值' : '求最小值'}
              </button>
            </div>
          </div>

          <div className="linear-programming-explore__block">
            <p className="linear-programming-explore__block-title">讀數</p>
            {readings.map(([label, value]) => (
              <p className="linear-programming-explore__reading" key={label}>
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
