import { useCallback, useMemo, useState } from 'react';
import type p5 from 'p5';
import {
  AXIS_LIMIT,
  DEFAULT_SPACE_VECTORS_PARAMS,
  computeSpaceVectorsMetrics,
  formatVec3,
  stateLabel,
  type ReadingMode,
  type RelationState,
  type SpaceVectorsParams,
} from '../../explore/space-vectors-planes-lines/geometry';
import { renderSpaceVectorsPlanesLinesScene } from '../../systems/rendering/spaceVectorsPlanesLinesExploreRender';
import type { CanvasSize } from '../curve/useRectP5CanvasHost';
import OrbitViewControls from '../curve/OrbitViewControls';
import { useOrbitViewP5 } from '../curve/useOrbitViewP5';
import '../../styles/components/explore/space-vectors-explore.css';

const MODES: ReadingMode[] = ['position', 'direction', 'relation'];

type SliderKey = 'vx' | 'vy' | 'vz' | 'planeTilt' | 'h';

const SLIDERS: Array<{
  key: SliderKey;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}> = [
  { key: 'vx', min: -AXIS_LIMIT, max: AXIS_LIMIT, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'vy', min: -AXIS_LIMIT, max: AXIS_LIMIT, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'vz', min: -AXIS_LIMIT, max: AXIS_LIMIT, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'planeTilt', min: 0, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'h', min: -2, max: 2, step: 0.05, format: (v) => v.toFixed(2) },
];

/**
 * explore 的舞台比 works 寬，不能沿用 works 那個上限 600px 的方形量測——
 * 那會讓畫布被放大而變糊。這裡填滿容器寬度，高度取 0.86 略帶直向以容納 z 軸。
 */
function measureExploreCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(280, Math.min(1000, Math.round(host.clientWidth || 640)));
  return { width, height: Math.max(320, Math.round(width * 0.86)) };
}

/**
 * n̂·v 要恰好落在 0 才進得了「落在面內」與「平行」，靠拖滑桿碰不到，
 * 所以跟 line-plane-intersection 一樣用預設把三種狀態都變得看得見。
 */
const RELATION_PRESETS: Array<{ id: RelationState; patch: Partial<SpaceVectorsParams> }> = [
  { id: 'apart', patch: { planeTilt: 78, vx: 1.9, vy: 1.2, vz: 1.6, h: 0.5 } },
  { id: 'parallel', patch: { planeTilt: 90, vx: 1.9, vy: 1.2, vz: 0, h: 0.8 } },
  { id: 'inPlane', patch: { planeTilt: 90, vx: 1.9, vy: 1.2, vz: 0, h: 0 } },
];

function modeLabel(mode: ReadingMode, locale?: 'en'): string {
  if (locale === 'en') {
    if (mode === 'position') return 'Position';
    if (mode === 'direction') return 'Direction';
    return 'Relation';
  }
  if (mode === 'position') return '位置讀法';
  if (mode === 'direction') return '方向讀法';
  return '關係讀法';
}

function modeTitle(mode: ReadingMode, locale?: 'en'): string {
  if (locale === 'en') {
    if (mode === 'position') return 'Where v is';
    if (mode === 'direction') return 'Which way the plane faces';
    return 'How the two are related';
  }
  if (mode === 'position') return 'v 在哪裡';
  if (mode === 'direction') return '平面朝哪裡';
  return '兩者什麼關係';
}

function sliderLabel(key: SliderKey, locale?: 'en'): string {
  if (locale === 'en') {
    if (key === 'planeTilt') return 'Plane tilt';
    if (key === 'h') return 'Plane offset h';
    return `Component ${key}`;
  }
  if (key === 'planeTilt') return '平面傾角';
  if (key === 'h') return '平面位移 h';
  return `分量 ${key}`;
}

function presetLabel(id: RelationState, locale?: 'en'): string {
  if (locale === 'en') {
    if (id === 'apart') return 'At a distance';
    if (id === 'parallel') return 'v parallel to the plane';
    return 'v lies in the plane';
  }
  if (id === 'apart') return '有距離';
  if (id === 'parallel') return 'v 平行於平面';
  return 'v 落在面內';
}

function relationStateText(state: RelationState, locale?: 'en'): string {
  if (locale !== 'en') return stateLabel(state);
  if (state === 'inPlane') return 'v lies in the plane';
  if (state === 'parallel') return 'v is parallel to the plane';
  return 'v is at a distance from the plane';
}

type Props = {
  locale?: 'en';
};

export default function SpaceVectorsPlanesLinesExploreRoot({ locale }: Props) {
  const [params, setParams] = useState<SpaceVectorsParams>(DEFAULT_SPACE_VECTORS_PARAMS);
  const en = locale === 'en';

  const patchParams = useCallback((patch: Partial<SpaceVectorsParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const render = useCallback(
    (p: p5, current: SpaceVectorsParams, rotating: boolean) => {
      renderSpaceVectorsPlanesLinesScene(p, {
        width: p.width,
        height: p.height,
        params: current,
        rotating,
        locale,
      });
    },
    [locale],
  );

  const { canvasHostRef } = useOrbitViewP5({
    params,
    onParamsChange: patchParams,
    render,
    redrawKey: `${params.vx}|${params.vy}|${params.vz}|${params.planeTilt}|${params.planeAzimuth}|${params.h}|${params.yaw}|${params.pitch}|${params.mode}`,
    measure: measureExploreCanvas,
  });

  const metrics = useMemo(() => computeSpaceVectorsMetrics(params), [params]);

  const readings: Array<[string, string]> = useMemo(() => {
    if (params.mode === 'position') {
      return [
        ['v', formatVec3(metrics.v)],
        ...metrics.shadows.map(
          (shadow) =>
            [`${shadow.plane} ${en ? 'shadow' : '影子'}`, formatVec3(shadow.vector)] as [string, string],
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
      [en ? 'State' : '狀態', relationStateText(metrics.state, locale)],
    ];
  }, [en, locale, metrics, params.mode]);

  return (
    <div className="space-vectors-explore">
      <div className="space-vectors-explore__stage">
        <div className="space-vectors-explore__visual">
          <p className="space-vectors-explore__visual-title">
            {en ? 'Spatial vectors, planes, and lines' : '空間向量與平面直線'}
          </p>
          <p className="space-vectors-explore__visual-sub">{modeTitle(params.mode, locale)}</p>
          <div
            ref={canvasHostRef}
            className="space-vectors-explore__canvas"
            role="img"
            aria-label={
              en
                ? 'Spatial vectors, planes, and lines: drag to rotate the view'
                : '空間向量與平面直線互動視覺化：拖動畫面可旋轉視角'
            }
          />
        </div>

        <aside className="space-vectors-explore__sidebar">
          <div className="space-vectors-explore__block">
            <p className="space-vectors-explore__block-title">{en ? 'Reading' : '讀法'}</p>
            <div className="space-vectors-explore__modes">
              {MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className="space-vectors-explore__mode-button"
                  data-active={params.mode === mode}
                  aria-pressed={params.mode === mode}
                  onClick={() => patchParams({ mode })}
                >
                  {modeLabel(mode, locale)}
                </button>
              ))}
            </div>
          </div>

          {params.mode === 'relation' ? (
            <div className="space-vectors-explore__block">
              <p className="space-vectors-explore__block-title">{en ? 'Three states' : '三種狀態'}</p>
              <div className="space-vectors-explore__modes">
                {RELATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="space-vectors-explore__mode-button"
                    onClick={() => patchParams(preset.patch)}
                  >
                    {presetLabel(preset.id, locale)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-vectors-explore__block">
            <p className="space-vectors-explore__block-title">{en ? 'Scene' : '場景'}</p>
            {SLIDERS.map((slider) => (
              <div className="control-field" key={slider.key}>
                <label htmlFor={`space-vectors-${slider.key}`}>
                  <span>{sliderLabel(slider.key, locale)}</span>
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
            <p className="space-vectors-explore__block-title">{en ? 'View' : '視角'}</p>
            <OrbitViewControls
              idPrefix="space-vectors"
              params={params}
              onParamsChange={patchParams}
              locale={locale}
            />
          </div>

          <div className="space-vectors-explore__block">
            <p className="space-vectors-explore__block-title">{en ? 'Readings' : '讀數'}</p>
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
