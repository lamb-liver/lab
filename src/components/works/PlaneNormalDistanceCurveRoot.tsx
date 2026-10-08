import { useCallback, useState } from 'react';
import { planeNormalDistanceModule } from '../../curve/modules/plane-normal-distance';
import {
  computePlaneNormalDistanceMetrics,
  DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS,
  distanceFromGeneralForm,
  type PlaneNormalDistanceParams,
} from '../../curve/modules/plane-normal-distance/geometry';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { usePlaneNormalDistanceP5 } from '../curve/usePlaneNormalDistanceP5';
import OrbitViewControls from '../curve/OrbitViewControls';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

type SliderKey = 'planeTilt' | 'h' | 'pointZ' | 'scale';

const SLIDERS: Array<{
  key: SliderKey;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}> = [
  { key: 'planeTilt', min: 0, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'h', min: -2, max: 2, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'pointZ', min: -3, max: 3, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'scale', min: -3, max: 3, step: 0.1, format: (v) => v.toFixed(1) },
];

function sliderLabel(key: SliderKey, locale?: 'en'): string {
  if (locale === 'en') {
    if (key === 'planeTilt') return 'Plane tilt';
    if (key === 'h') return 'Plane offset h';
    if (key === 'pointZ') return 'Test point height';
    return 'Equation scale k';
  }
  if (key === 'planeTilt') return '平面傾角';
  if (key === 'h') return '平面位移 h';
  if (key === 'pointZ') return '測試點高度';
  return '方程尺度 k';
}

function englishMetadata(
  metadata: CurveMetadata,
  params: PlaneNormalDistanceParams,
): CurveMetadata {
  const metrics = computePlaneNormalDistanceMetrics(params);
  const viaGeneralForm = distanceFromGeneralForm(
    metrics.coefficients,
    metrics.constant,
    metrics.point,
  );
  const side =
    metrics.signedDistance >= 0 ? 'same side as the normal' : 'opposite the normal';
  return {
    ...metadata,
    title: 'Plane normal and distance from a point',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'plane') return { ...stat, label: 'General form' };
      if (stat.key === 'dist') return { ...stat, label: 'Distance' };
      if (stat.key === 'signed') {
        return {
          ...stat,
          label: 'Signed distance',
          value: `${metrics.signedDistance.toFixed(3)} (${side})`,
        };
      }
      if (stat.key === 'foot') return { ...stat, label: 'Foot' };
      if (stat.key === 'scale') {
        return {
          ...stat,
          label: 'Unchanged by scale',
          value: `General form gives ${viaGeneralForm.toFixed(3)}, independent of scale k`,
        };
      }
      return stat;
    }),
  };
}

function paramsForMetadata(params: PlaneNormalDistanceParams): ParamValues {
  return { ...params } as unknown as ParamValues;
}

export default function PlaneNormalDistanceCurveRoot({ controlsMountId, locale }: Props) {
  const module = planeNormalDistanceModule;
  const [params, setParams] = useState<PlaneNormalDistanceParams>(
    DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<PlaneNormalDistanceParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = usePlaneNormalDistanceP5({ params, onParamsChange, locale });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata, params) : metadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() =>
            onParamsChange({ planeTilt: 90, planeAzimuth: 0, h: 0, pointX: 1.4, pointZ: 0 })
          }
        >
          {locale === 'en' ? 'Point on the plane' : '點落在平面上'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => onParamsChange({ pointZ: -params.pointZ })}
        >
          {locale === 'en' ? 'Other side' : '翻到另一側'}
        </button>
      </div>

      {SLIDERS.map((slider) => (
        <div className="control-field" key={slider.key}>
          <label htmlFor={`plane-normal-distance-${slider.key}`}>
            <span>{sliderLabel(slider.key, locale)}</span>
            <span className="control-field__value">{slider.format(params[slider.key])}</span>
          </label>
          <div className="range-wrap">
            <input
              id={`plane-normal-distance-${slider.key}`}
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
        idPrefix="plane-normal-distance"
        params={params}
        onParamsChange={onParamsChange}
        locale={locale}
      />

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS)}
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
            ? 'Plane normal and distance from a point: drag to rotate the view'
            : '平面法向量與點面距離互動：拖動畫面可旋轉視角'
        }
      />
      {controls}
    </>
  );
}
