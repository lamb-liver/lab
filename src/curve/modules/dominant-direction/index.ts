import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_DOMINANT_PARAMS,
  clampDominant,
  formatDegrees,
  readDominant,
  sampleDominantThumbnail,
  type DominantParams,
} from './geometry';

/** 控制項由 DominantDirectionCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asDominantParams(params: ParamValues | DominantParams): DominantParams {
  return clampDominant(params);
}

export const dominantDirectionModule: CurveModule = {
  id: 'dominant-direction',
  paramSchema,
  defaultParams: { ...DEFAULT_DOMINANT_PARAMS },
  sample: (params) => sampleDominantThumbnail(asDominantParams(params)),
  getMetadata: (params) => {
    const reading = readDominant(asDominantParams(params));
    return {
      title: '主方向',
      formula: 'u ← Au / ||Au||',
      stats: [
        { key: 'angle', label: '與主方向夾角', value: formatDegrees(reading.angleDeg) },
        { key: 'stretch', label: '下一步伸縮', value: reading.stretch.toFixed(3) },
      ],
    };
  },
};

export type { DominantParams };
