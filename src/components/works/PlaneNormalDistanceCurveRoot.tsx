import { useCallback, useState } from 'react';
import { planeNormalDistanceModule } from '../../curve/modules/plane-normal-distance';
import {
  DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS,
  type PlaneNormalDistanceParams,
} from '../../curve/modules/plane-normal-distance/geometry';
import type { ParamValues } from '../../curve/types';
import { usePlaneNormalDistanceP5 } from '../curve/usePlaneNormalDistanceP5';
import OrbitViewControls from '../curve/OrbitViewControls';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

type SliderKey = 'planeTilt' | 'h' | 'pointZ' | 'scale';

const SLIDERS: Array<{
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}> = [
  { key: 'planeTilt', label: '平面傾角', min: 0, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'h', label: '平面位移 h', min: -2, max: 2, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'pointZ', label: '測試點高度', min: -3, max: 3, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'scale', label: '方程尺度 k', min: -3, max: 3, step: 0.1, format: (v) => v.toFixed(1) },
];

function paramsForMetadata(params: PlaneNormalDistanceParams): ParamValues {
  return { ...params } as unknown as ParamValues;
}

export default function PlaneNormalDistanceCurveRoot({ controlsMountId }: Props) {
  const module = planeNormalDistanceModule;
  const [params, setParams] = useState<PlaneNormalDistanceParams>(
    DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<PlaneNormalDistanceParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = usePlaneNormalDistanceP5({ params, onParamsChange });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() =>
            onParamsChange({ planeTilt: 90, planeAzimuth: 0, h: 0, pointX: 1.4, pointZ: 0 })
          }
        >
          點落在平面上
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => onParamsChange({ pointZ: -params.pointZ })}
        >
          翻到另一側
        </button>
      </div>

      {SLIDERS.map((slider) => (
        <div className="control-field" key={slider.key}>
          <label htmlFor={`plane-normal-distance-${slider.key}`}>
            <span>{slider.label}</span>
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

      <OrbitViewControls idPrefix="plane-normal-distance" params={params} onParamsChange={onParamsChange} />

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS)}
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
        aria-label="平面法向量與點面距離互動：拖動畫面可旋轉視角"
      />
      {controls}
    </>
  );
}
