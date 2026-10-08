import { useCallback, useState } from 'react';
import { linePlaneIntersectionModule } from '../../curve/modules/line-plane-intersection';
import {
  computeLinePlaneMetrics,
  DEFAULT_LINE_PLANE_PARAMS,
  type IntersectionState,
  type LinePlaneParams,
} from '../../curve/modules/line-plane-intersection/geometry';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useLinePlaneIntersectionP5 } from '../curve/useLinePlaneIntersectionP5';
import OrbitViewControls from '../curve/OrbitViewControls';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

type SliderKey = 'planeTilt' | 'h' | 'lineTilt' | 'originZ';

const SLIDERS: Array<{
  key: SliderKey;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}> = [
  { key: 'planeTilt', min: 0, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'h', min: -2, max: 2, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'lineTilt', min: -90, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'originZ', min: -2, max: 2, step: 0.05, format: (v) => v.toFixed(2) },
];

function sliderLabel(key: SliderKey, locale?: 'en'): string {
  if (locale === 'en') {
    if (key === 'planeTilt') return 'Plane tilt';
    if (key === 'h') return 'Plane offset h';
    if (key === 'lineTilt') return 'Line elevation';
    return 'Start height';
  }
  if (key === 'planeTilt') return '平面傾角';
  if (key === 'h') return '平面位移 h';
  if (key === 'lineTilt') return '直線仰角';
  return '起點高度';
}

function stateText(state: IntersectionState, locale?: 'en'): string {
  if (locale === 'en') {
    if (state === 'point') return 'Intersects at a point';
    if (state === 'parallel') return 'Parallel, no intersection';
    return 'Line lies in the plane';
  }
  if (state === 'point') return '交於一點';
  if (state === 'parallel') return '平行不相交';
  return '直線落在平面上';
}

/**
 * 平行與落在平面上這兩種退化狀態要靠手動湊出 n·d = 0，讀者很難碰到，
 * 所以直接提供三個預設讓它們可以被看見。
 */
const PRESETS: Array<{ state: IntersectionState; patch: Partial<LinePlaneParams> }> = [
  {
    state: 'point',
    patch: {
      planeTilt: DEFAULT_LINE_PLANE_PARAMS.planeTilt,
      planeAzimuth: DEFAULT_LINE_PLANE_PARAMS.planeAzimuth,
      h: DEFAULT_LINE_PLANE_PARAMS.h,
      lineTilt: DEFAULT_LINE_PLANE_PARAMS.lineTilt,
      lineAzimuth: DEFAULT_LINE_PLANE_PARAMS.lineAzimuth,
      originZ: DEFAULT_LINE_PLANE_PARAMS.originZ,
    },
  },
  {
    state: 'parallel',
    patch: { planeTilt: 90, planeAzimuth: 0, lineTilt: 0, lineAzimuth: 0, originZ: 0, h: 1.2 },
  },
  {
    state: 'contained',
    patch: { planeTilt: 90, planeAzimuth: 0, lineTilt: 0, lineAzimuth: 0, originZ: 0, h: 0 },
  },
];

function englishMetadata(metadata: CurveMetadata, params: LinePlaneParams): CurveMetadata {
  const metrics = computeLinePlaneMetrics(params);
  return {
    ...metadata,
    title: 'Where a line meets a plane',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'state') {
        return { ...stat, label: 'State', value: stateText(metrics.state, 'en') };
      }
      if (stat.key === 't') {
        return { ...stat, value: metrics.t === null ? 'no solution' : metrics.t.toFixed(3) };
      }
      if (stat.key === 'point') return { ...stat, label: 'Intersection' };
      return stat;
    }),
  };
}

function paramsForMetadata(params: LinePlaneParams): ParamValues {
  return { ...params } as unknown as ParamValues;
}

export default function LinePlaneIntersectionCurveRoot({ controlsMountId, locale }: Props) {
  const module = linePlaneIntersectionModule;
  const [params, setParams] = useState<LinePlaneParams>(DEFAULT_LINE_PLANE_PARAMS);

  const onParamsChange = useCallback((patch: Partial<LinePlaneParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useLinePlaneIntersectionP5({ params, onParamsChange, locale });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata, params) : metadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle">
        {PRESETS.map((preset) => (
          <button
            key={preset.state}
            type="button"
            className="curve-work-mode-button"
            aria-pressed="false"
            onClick={() => onParamsChange(preset.patch)}
          >
            {stateText(preset.state, locale)}
          </button>
        ))}
      </div>

      {SLIDERS.map((slider) => (
        <div className="control-field" key={slider.key}>
          <label htmlFor={`line-plane-intersection-${slider.key}`}>
            <span>{sliderLabel(slider.key, locale)}</span>
            <span className="control-field__value">{slider.format(params[slider.key])}</span>
          </label>
          <div className="range-wrap">
            <input
              id={`line-plane-intersection-${slider.key}`}
              type="range"
              className="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={params[slider.key]}
              onInput={(event) =>
                onParamsChange({ [slider.key]: Number(event.currentTarget.value) })
              }
            />
          </div>
        </div>
      ))}

      <OrbitViewControls
        idPrefix="line-plane-intersection"
        params={params}
        onParamsChange={onParamsChange}
        locale={locale}
      />

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_LINE_PLANE_PARAMS)}
        >
          {locale === 'en' ? 'Reset' : '重設'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en'
            ? 'Where a line meets a plane: drag to rotate the view'
            : '空間直線與平面交點互動：拖動畫面可旋轉視角'
        }
      />
      {controls}
    </>
  );
}
