import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_ROW_OP_PARAMS,
  clampK,
  formatRow,
  presetId,
  presetLabel,
  sampleRowOpThumbnail,
  sceneFromParams,
  solutionLabel,
  type RowOpParams,
} from './geometry';

/** 控制項由 RowOpSolutionSpaceCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asRowOpParams(params: ParamValues | RowOpParams): RowOpParams {
  return {
    preset: presetId(params.preset ?? DEFAULT_ROW_OP_PARAMS.preset),
    k: clampK(params.k ?? DEFAULT_ROW_OP_PARAMS.k),
  };
}

export const rowOpSolutionSpaceModule: CurveModule = {
  id: 'row-op-solution-space',
  paramSchema,
  defaultParams: { ...DEFAULT_ROW_OP_PARAMS },
  sample: (params) => sampleRowOpThumbnail(asRowOpParams(params)),
  getMetadata: (params) => {
    const next = asRowOpParams(params);
    const scene = sceneFromParams(next);
    return {
      title: '列運算與解空間',
      formula: '第3列 := 第3列 + k×第1列',
      stats: [
        { key: 'state', label: '狀態', value: presetLabel(next.preset) },
        { key: 'solution', label: '解', value: solutionLabel(scene.solution) },
        { key: 'r1', label: '第一式', value: formatRow(scene.rows[0]) },
        { key: 'r2', label: '第二式', value: formatRow(scene.rows[1]) },
        { key: 'r3', label: '第三式', value: formatRow(scene.rows[2]) },
        { key: 'k', label: 'k', value: next.k.toFixed(2) },
      ],
    };
  },
};

export type { RowOpParams };
