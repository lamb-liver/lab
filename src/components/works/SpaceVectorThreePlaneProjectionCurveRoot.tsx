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
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useSpaceVectorThreePlaneProjectionP5 } from '../curve/useSpaceVectorThreePlaneProjectionP5';
import OrbitViewControls from '../curve/OrbitViewControls';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

type ComponentKey = 'vx' | 'vy' | 'vz';

const COMPONENTS: ComponentKey[] = ['vx', 'vy', 'vz'];

const PLANES: ProjectionPlane[] = ['all', 'xy', 'xz', 'yz'];

function componentLabel(key: ComponentKey, locale?: 'en'): string {
  return locale === 'en' ? `Component ${key}` : `分量 ${key}`;
}

function planeLabel(plane: ProjectionPlane, locale?: 'en'): string {
  if (locale === 'en') return plane === 'all' ? 'Three shadows' : `${plane} plane`;
  return plane === 'all' ? '三面影子' : `${plane} 平面`;
}

function englishMetadata(metadata: CurveMetadata, plane: ProjectionPlane): CurveMetadata {
  return {
    ...metadata,
    title:
      plane === 'all'
        ? 'Spatial vector and three plane projections'
        : `${plane} plane projection`,
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'xy' || stat.key === 'xz' || stat.key === 'yz') {
        return {
          ...stat,
          label: `${stat.key} shadow`,
          value: String(stat.value).replace('｜長 ', ' | length '),
        };
      }
      if (stat.key === 'check') {
        return {
          ...stat,
          label: 'Shared components',
          value: 'xy and xz share x; xy and yz share y; xz and yz share z',
        };
      }
      return stat;
    }),
  };
}

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

export default function SpaceVectorThreePlaneProjectionCurveRoot({
  controlsMountId,
  locale,
}: Props) {
  const module = spaceVectorThreePlaneProjectionModule;
  const [params, setParams] = useState<SpaceVectorProjectionParams>(
    DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<SpaceVectorProjectionParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useSpaceVectorThreePlaneProjectionP5({
    params,
    onParamsChange,
    locale,
  });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata, params.plane) : metadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle">
        {PLANES.map((plane) => (
          <button
            key={plane}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.plane === plane}
            onClick={() => onParamsChange({ plane })}
          >
            {planeLabel(plane, locale)}
          </button>
        ))}
      </div>

      {COMPONENTS.map((key) => (
        <div className="control-field" key={key}>
          <label htmlFor={`space-vector-three-plane-projection-${key}`}>
            <span>{componentLabel(key, locale)}</span>
            <span className="control-field__value">{params[key].toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id={`space-vector-three-plane-projection-${key}`}
              type="range"
              className="range"
              min={-AXIS_LIMIT}
              max={AXIS_LIMIT}
              step={0.05}
              value={params[key]}
              onInput={(event) => onParamsChange({ [key]: Number(event.currentTarget.value) })}
            />
          </div>
        </div>
      ))}

      <OrbitViewControls
        idPrefix="space-vector-three-plane-projection"
        params={params}
        onParamsChange={onParamsChange}
        locale={locale}
      />

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS)}
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
            ? 'Spatial vector and three plane projections: drag to rotate the view'
            : '空間向量與三平面投影互動：拖動畫面可旋轉視角'
        }
      />
      {controls}
    </>
  );
}
