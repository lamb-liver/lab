import { useCallback, useState } from 'react';
import {
  planeToParam,
  spaceVectorThreePlaneProjectionModule,
  type ProjectionPlane,
  type SpaceVectorProjectionParams,
} from '../../curve/modules/space-vector-three-plane-projection';
import {
  AXIS_LIMIT,
  DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS,
} from '../../curve/modules/space-vector-three-plane-projection/geometry';
import type { ParamValues } from '../../curve/types';
import { useSpaceVectorThreePlaneProjectionP5 } from '../curve/useSpaceVectorThreePlaneProjectionP5';
import OrbitViewControls from '../curve/OrbitViewControls';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

type ComponentKey = 'vx' | 'vy' | 'vz';

const COMPONENTS: Array<{ key: ComponentKey; label: string }> = [
  { key: 'vx', label: '分量 vx' },
  { key: 'vy', label: '分量 vy' },
  { key: 'vz', label: '分量 vz' },
];

const PLANES: Array<{ value: ProjectionPlane; label: string }> = [
  { value: 'all', label: '三面影子' },
  { value: 'xy', label: 'xy 平面' },
  { value: 'xz', label: 'xz 平面' },
  { value: 'yz', label: 'yz 平面' },
];

function paramsForMetadata(params: SpaceVectorProjectionParams): ParamValues {
  return {
    vx: params.vx,
    vy: params.vy,
    vz: params.vz,
    yaw: params.yaw,
    pitch: params.pitch,
    plane: planeToParam(params.plane),
  };
}

export default function SpaceVectorThreePlaneProjectionCurveRoot({ controlsMountId }: Props) {
  const module = spaceVectorThreePlaneProjectionModule;
  const [params, setParams] = useState<SpaceVectorProjectionParams>(
    DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<SpaceVectorProjectionParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useSpaceVectorThreePlaneProjectionP5({ params, onParamsChange });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle">
        {PLANES.map((item) => (
          <button
            key={item.value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.plane === item.value}
            onClick={() => onParamsChange({ plane: item.value })}
          >
            {item.label}
          </button>
        ))}
      </div>

      {COMPONENTS.map((component) => (
        <div className="control-field" key={component.key}>
          <label htmlFor={`space-vector-three-plane-projection-${component.key}`}>
            <span>{component.label}</span>
            <span className="control-field__value">{params[component.key].toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id={`space-vector-three-plane-projection-${component.key}`}
              type="range"
              className="range"
              min={-AXIS_LIMIT}
              max={AXIS_LIMIT}
              step={0.05}
              value={params[component.key]}
              onInput={(event) =>
                onParamsChange({ [component.key]: Number(event.currentTarget.value) })
              }
            />
          </div>
        </div>
      ))}

      <OrbitViewControls idPrefix="space-vector-three-plane-projection" params={params} onParamsChange={onParamsChange} />

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS)}
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
        aria-label="空間向量與三平面投影互動：拖動畫面可旋轉視角"
      />
      {controls}
    </>
  );
}
