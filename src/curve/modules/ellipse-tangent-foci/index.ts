import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_ELLIPSE_TANGENT_PARAMS,
  clampEllipseTangent,
  formatDegrees,
  readEllipseTangent,
  sampleEllipseTangentThumbnail,
  type EllipseTangentParams,
} from './geometry';

/** 控制項由 EllipseTangentFociCurveRoot 自行渲染 */
const paramSchema: ParamSchema = [];

export function asEllipseTangentParams(
  params: ParamValues | EllipseTangentParams,
): EllipseTangentParams {
  return clampEllipseTangent(params);
}

export const ellipseTangentFociModule: CurveModule = {
  id: 'ellipse-tangent-foci',
  paramSchema,
  defaultParams: { ...DEFAULT_ELLIPSE_TANGENT_PARAMS },
  sample: (params) => sampleEllipseTangentThumbnail(asEllipseTangentParams(params)),
  getMetadata: (params) => {
    const reading = readEllipseTangent(asEllipseTangentParams(params));
    return {
      title: '兩焦點切線',
      formula: 'θ₁ = θ₂',
      stats: [
        { key: 'sum', label: '距離和', value: reading.sum.toFixed(3) },
        { key: 'angle1', label: 'F₁ 夾角', value: formatDegrees(reading.angle1) },
        { key: 'angle2', label: 'F₂ 夾角', value: formatDegrees(reading.angle2) },
      ],
    };
  },
};

export type { EllipseTangentParams };
