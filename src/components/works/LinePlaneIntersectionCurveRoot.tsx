import { useCallback, useState } from 'react';
import { linePlaneIntersectionModule } from '../../curve/modules/line-plane-intersection';
import {
  DEFAULT_LINE_PLANE_PARAMS,
  type LinePlaneParams,
} from '../../curve/modules/line-plane-intersection/geometry';
import type { ParamValues } from '../../curve/types';
import { useLinePlaneIntersectionP5 } from '../curve/useLinePlaneIntersectionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

type SliderKey = 'planeTilt' | 'h' | 'lineTilt' | 'originZ';

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
  { key: 'lineTilt', label: '直線仰角', min: -90, max: 90, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'originZ', label: '起點高度', min: -2, max: 2, step: 0.05, format: (v) => v.toFixed(2) },
];

/**
 * 平行與落在平面上這兩種退化狀態要靠手動湊出 n·d = 0，讀者很難碰到，
 * 所以直接提供三個預設讓它們可以被看見。
 */
const PRESETS: Array<{ label: string; patch: Partial<LinePlaneParams> }> = [
  {
    label: '交於一點',
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
    label: '平行不相交',
    patch: { planeTilt: 90, planeAzimuth: 0, lineTilt: 0, lineAzimuth: 0, originZ: 0, h: 1.2 },
  },
  {
    label: '直線落在平面上',
    patch: { planeTilt: 90, planeAzimuth: 0, lineTilt: 0, lineAzimuth: 0, originZ: 0, h: 0 },
  },
];

function paramsForMetadata(params: LinePlaneParams): ParamValues {
  return { ...params } as unknown as ParamValues;
}

export default function LinePlaneIntersectionCurveRoot({ controlsMountId }: Props) {
  const module = linePlaneIntersectionModule;
  const [params, setParams] = useState<LinePlaneParams>(DEFAULT_LINE_PLANE_PARAMS);

  const onParamsChange = useCallback((patch: Partial<LinePlaneParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useLinePlaneIntersectionP5({ params, onParamsChange });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="curve-work-mode-button"
            aria-pressed="false"
            onClick={() => onParamsChange(preset.patch)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {SLIDERS.map((slider) => (
        <div className="control-field" key={slider.key}>
          <label htmlFor={`line-plane-intersection-${slider.key}`}>
            <span>{slider.label}</span>
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

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_LINE_PLANE_PARAMS)}
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
        aria-label="空間直線與平面交點互動：拖動畫面可旋轉視角"
      />
      {controls}
    </>
  );
}
