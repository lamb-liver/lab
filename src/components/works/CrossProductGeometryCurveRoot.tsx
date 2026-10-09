import { useCallback, useState } from 'react';
import {
  crossProductGeometryModule,
  type CrossProductGeometryParams,
  type CrossProductMode,
} from '../../curve/modules/cross-product-geometry';
import {
  A_LENGTH,
  computeCrossProductMetrics,
  DEFAULT_CROSS_PRODUCT_PARAMS,
} from '../../curve/modules/cross-product-geometry/geometry';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useCrossProductGeometryP5 } from '../curve/useCrossProductGeometryP5';
import OrbitViewControls from '../curve/OrbitViewControls';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

type SliderKey = 'theta' | 'lenB' | 'phi';

const SLIDERS: Array<{
  key: SliderKey;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}> = [
  { key: 'theta', min: 0, max: 180, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'lenB', min: 0.5, max: 4, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'phi', min: -90, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
];

function sliderLabel(key: SliderKey, locale?: 'en'): string {
  if (locale === 'en') {
    if (key === 'theta') return 'Angle θ';
    if (key === 'lenB') return 'Length |b|';
    return 'Tilt φ';
  }
  if (key === 'theta') return '夾角 θ';
  if (key === 'lenB') return '長度 |b|';
  return '傾斜 φ';
}

function englishMetadata(
  metadata: CurveMetadata,
  params: CrossProductGeometryParams,
): CurveMetadata {
  const metrics = computeCrossProductMetrics(params);
  return {
    ...metadata,
    title: params.mode === 'righthand' ? 'Right-hand rule and the normal' : 'Cross product',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'n') return { ...stat, label: 'Direction of n' };
      if (stat.key === 'relation') {
        return {
          ...stat,
          label: 'Relation',
          value: metrics.isDegenerate
            ? 'Nearly parallel: area near 0'
            : `sinθ = ${metrics.sinTheta.toFixed(3)}`,
        };
      }
      if (stat.key === 'area') {
        return { ...stat, value: `${metrics.area.toFixed(3)} (|a| = ${A_LENGTH})` };
      }
      return stat;
    }),
  };
}

function paramsForMetadata(params: CrossProductGeometryParams): ParamValues {
  return {
    theta: params.theta,
    lenB: params.lenB,
    phi: params.phi,
    yaw: params.yaw,
    pitch: params.pitch,
    mode: params.mode === 'righthand' ? 1 : 0,
  };
}

export default function CrossProductGeometryCurveRoot({ controlsMountId, locale }: Props) {
  const module = crossProductGeometryModule;
  const [params, setParams] = useState<CrossProductGeometryParams>(
    DEFAULT_CROSS_PRODUCT_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<CrossProductGeometryParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useCrossProductGeometryP5({ params, onParamsChange, locale });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata, params) : metadata;

  const setMode = (mode: CrossProductMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'area'}
          onClick={() => setMode('area')}
        >
          {locale === 'en' ? 'Area ‖a × b‖' : '面積 ‖a × b‖'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'righthand'}
          onClick={() => setMode('righthand')}
        >
          {locale === 'en' ? 'Right-hand rule' : '右手定則'}
        </button>
      </div>

      {SLIDERS.map((slider) => (
        <div className="control-field" key={slider.key}>
          <label htmlFor={`cross-product-geometry-${slider.key}`}>
            <span>{sliderLabel(slider.key, locale)}</span>
            <span className="control-field__value">{slider.format(params[slider.key])}</span>
          </label>
          <div className="range-wrap">
            <input
              id={`cross-product-geometry-${slider.key}`}
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
        idPrefix="cross-product-geometry"
        params={params}
        onParamsChange={onParamsChange}
        locale={locale}
      />

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_CROSS_PRODUCT_PARAMS)}
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
            ? 'Cross product: drag to rotate the view'
            : '外積的幾何意義互動：拖動畫面可旋轉視角'
        }
      />
      {controls}
    </>
  );
}
