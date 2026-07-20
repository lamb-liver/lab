import { useCallback, useMemo, useState } from 'react';
import type p5 from 'p5';
import {
  AXIS_LIMIT,
  DEFAULT_SPACE_VECTORS_PARAMS,
  computeSpaceVectorsMetrics,
  formatVec3,
  stateLabel,
  type ReadingMode,
  type SpaceVectorsParams,
} from '../../explore/space-vectors-planes-lines/geometry';
import { renderSpaceVectorsPlanesLinesScene } from '../../systems/rendering/spaceVectorsPlanesLinesExploreRender';
import { useOrbitViewP5 } from '../curve/useOrbitViewP5';
import '../../styles/components/explore/space-vectors-explore.css';

const MODES: Array<{ value: ReadingMode; label: string }> = [
  { value: 'position', label: '位置讀法' },
  { value: 'direction', label: '方向讀法' },
  { value: 'relation', label: '關係讀法' },
];

type SliderKey = 'vx' | 'vy' | 'vz' | 'planeTilt' | 'h';

const SLIDERS: Array<{
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}> = [
  { key: 'vx', label: '分量 vx', min: -AXIS_LIMIT, max: AXIS_LIMIT, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'vy', label: '分量 vy', min: -AXIS_LIMIT, max: AXIS_LIMIT, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'vz', label: '分量 vz', min: -AXIS_LIMIT, max: AXIS_LIMIT, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'planeTilt', label: '平面傾角', min: 0, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'h', label: '平面位移 h', min: -2, max: 2, step: 0.05, format: (v) => v.toFixed(2) },
];

function modeTitle(mode: ReadingMode): string {
  if (mode === 'position') return 'v 在哪裡';
  if (mode === 'direction') return '平面朝哪裡';
  return '兩者什麼關係';
}

export default function SpaceVectorsPlanesLinesExploreRoot() {
  const [params, setParams] = useState<SpaceVectorsParams>(DEFAULT_SPACE_VECTORS_PARAMS);

  const patchParams = useCallback((patch: Partial<SpaceVectorsParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const render = useCallback((p: p5, current: SpaceVectorsParams, rotating: boolean) => {
    renderSpaceVectorsPlanesLinesScene(p, {
      width: p.width,
      height: p.height,
      params: current,
      rotating,
    });
  }, []);

  const { canvasHostRef } = useOrbitViewP5({
    params,
    onParamsChange: patchParams,
    render,
    redrawKey: `${params.vx}|${params.vy}|${params.vz}|${params.planeTilt}|${params.planeAzimuth}|${params.h}|${params.yaw}|${params.pitch}|${params.mode}`,
  });

  const metrics = useMemo(() => computeSpaceVectorsMetrics(params), [params]);

  const readings: Array<[string, string]> = useMemo(() => {
    if (params.mode === 'position') {
      return [
        ['v', formatVec3(metrics.v)],
        ...metrics.shadows.map(
          (shadow) => [`${shadow.plane} 影子`, formatVec3(shadow.vector)] as [string, string],
        ),
      ];
    }
    if (params.mode === 'direction') {
      return [
        ['n̂', formatVec3(metrics.unitNormal)],
        ['a', formatVec3(metrics.a)],
        ['b', formatVec3(metrics.b)],
      ];
    }
    return [
      ['n̂·v', metrics.normalComponent.toFixed(3)],
      ['n̂·v − h', metrics.signedDistance.toFixed(3)],
      ['狀態', stateLabel(metrics.state)],
    ];
  }, [metrics, params.mode]);

  return (
    <div className="space-vectors-explore">
      <div className="space-vectors-explore__stage">
        <div className="space-vectors-explore__visual">
          <p className="space-vectors-explore__visual-title">空間向量與平面直線</p>
          <p className="space-vectors-explore__visual-sub">{modeTitle(params.mode)}</p>
          <div
            ref={canvasHostRef}
            className="space-vectors-explore__canvas"
            role="img"
            aria-label="空間向量與平面直線互動視覺化：拖動畫面可旋轉視角"
          />
        </div>

        <aside className="space-vectors-explore__sidebar">
          <div className="space-vectors-explore__block">
            <p className="space-vectors-explore__block-title">讀法</p>
            <div className="space-vectors-explore__modes">
              {MODES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="space-vectors-explore__mode-button"
                  data-active={params.mode === item.value}
                  aria-pressed={params.mode === item.value}
                  onClick={() => patchParams({ mode: item.value })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-vectors-explore__block">
            <p className="space-vectors-explore__block-title">場景</p>
            {SLIDERS.map((slider) => (
              <div className="control-field" key={slider.key}>
                <label htmlFor={`space-vectors-${slider.key}`}>
                  <span>{slider.label}</span>
                  <span className="control-field__value">{slider.format(params[slider.key])}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id={`space-vectors-${slider.key}`}
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
          </div>

          <div className="space-vectors-explore__block">
            <p className="space-vectors-explore__block-title">讀數</p>
            {readings.map(([label, value]) => (
              <p className="space-vectors-explore__reading" key={label}>
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
