import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS,
  formatVec3,
  projectionsOf,
  sampleSpaceVectorProjectionThumbnail,
  vectorFromParams,
  vectorLength,
  type ProjectionPlane,
  type SpaceVectorProjectionParams,
} from './geometry';

/** 控制項由 SpaceVectorThreePlaneProjectionCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

const PLANE_BY_INDEX: ProjectionPlane[] = ['all', 'xy', 'xz', 'yz'];

function planeFromParam(value: number | ProjectionPlane | undefined): ProjectionPlane {
  if (typeof value === 'string') return value;
  return PLANE_BY_INDEX[value ?? 0] ?? 'all';
}

export function planeToParam(plane: ProjectionPlane): number {
  const index = PLANE_BY_INDEX.indexOf(plane);
  return index < 0 ? 0 : index;
}

export function asSpaceVectorProjectionParams(
  params: ParamValues | SpaceVectorProjectionParams,
): SpaceVectorProjectionParams {
  return {
    vx: (params.vx as number) ?? DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.vx,
    vy: (params.vy as number) ?? DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.vy,
    vz: (params.vz as number) ?? DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.vz,
    yaw: (params.yaw as number) ?? DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.yaw,
    pitch: (params.pitch as number) ?? DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.pitch,
    plane: planeFromParam(params.plane as number | ProjectionPlane | undefined),
  };
}

export const spaceVectorThreePlaneProjectionModule: CurveModule = {
  id: 'space-vector-three-plane-projection',
  paramSchema,
  defaultParams: {
    vx: DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.vx,
    vy: DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.vy,
    vz: DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.vz,
    yaw: DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.yaw,
    pitch: DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS.pitch,
    plane: 0,
  },
  sample: (params, { purpose }) => {
    const spec = sampleSpaceVectorProjectionThumbnail(asSpaceVectorProjectionParams(params));
    if (purpose === 'thumbnail') return spec;
    return spec.paths[spec.paths.length - 1]?.points ?? [];
  },
  getMetadata: (params) => {
    const projParams = asSpaceVectorProjectionParams(params);
    const v = vectorFromParams(projParams);
    const projections = projectionsOf(v);
    const focus = projParams.plane;

    return {
      title:
        focus === 'all' ? '空間向量與三平面投影' : `聚焦 ${focus} 平面投影`,
      formula: 'proj_xy v = (v_x, v_y, 0)',
      stats: [
        { key: 'v', label: 'v', value: formatVec3(v) },
        { key: 'len', label: '‖v‖', value: vectorLength(projParams).toFixed(3) },
        ...projections.map((item) => ({
          key: item.plane,
          label: `${item.plane} 影子`,
          value: `${formatVec3(item.vector)}｜長 ${item.length.toFixed(2)}`,
        })),
        {
          key: 'check',
          label: '重複分量',
          value: 'xy 與 xz 共用 x；xy 與 yz 共用 y；xz 與 yz 共用 z',
        },
      ],
    };
  },
  animation: { lerp: 1, revealSpeed: 0 },
};

export type { SpaceVectorProjectionParams, ProjectionPlane };
