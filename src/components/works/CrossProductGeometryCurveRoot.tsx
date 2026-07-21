import { useCallback, useState } from 'react';
import {
  crossProductGeometryModule,
  type CrossProductGeometryParams,
  type CrossProductMode,
} from '../../curve/modules/cross-product-geometry';
import { DEFAULT_CROSS_PRODUCT_PARAMS } from '../../curve/modules/cross-product-geometry/geometry';
import type { ParamValues } from '../../curve/types';
import { useCrossProductGeometryP5 } from '../curve/useCrossProductGeometryP5';
import OrbitViewControls from '../curve/OrbitViewControls';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

type SliderKey = 'theta' | 'lenB' | 'phi';

const SLIDERS: Array<{
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}> = [
  { key: 'theta', label: '夾角 θ', min: 0, max: 180, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'lenB', label: '長度 |b|', min: 0.5, max: 4, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'phi', label: '傾斜 φ', min: -90, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
];

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

export default function CrossProductGeometryCurveRoot({ controlsMountId }: Props) {
  const module = crossProductGeometryModule;
  const [params, setParams] = useState<CrossProductGeometryParams>(
    DEFAULT_CROSS_PRODUCT_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<CrossProductGeometryParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useCrossProductGeometryP5({ params, onParamsChange });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const setMode = (mode: CrossProductMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'area'}
          onClick={() => setMode('area')}
        >
          面積 ‖a × b‖
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.mode === 'righthand'}
          onClick={() => setMode('righthand')}
        >
          右手定則
        </button>
      </div>

      {SLIDERS.map((slider) => (
        <div className="control-field" key={slider.key}>
          <label htmlFor={`cross-product-geometry-${slider.key}`}>
            <span>{slider.label}</span>
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

      <OrbitViewControls idPrefix="cross-product-geometry" params={params} onParamsChange={onParamsChange} />

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_CROSS_PRODUCT_PARAMS)}
        >
          重設
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="外積的幾何意義互動：拖動畫面可旋轉視角"
      />
      {controls}
    </>
  );
}
