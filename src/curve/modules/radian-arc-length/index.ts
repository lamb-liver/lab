import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  DEFAULT_RADIAN_ARC_LENGTH_PARAMS,
  arcLength,
  asRadianArcLengthParams,
  fmt,
  formatArcLength,
  formatDeg,
  formatRad,
  radiusFromMode,
  sampleRadianArcLengthThumbnail,
  type RadianArcLengthParams,
} from './geometry';

const paramSchema: ParamSchema = [];

function asRadianArcLengthModuleParams(
  params: ParamValues | RadianArcLengthParams,
): RadianArcLengthParams {
  return asRadianArcLengthParams(params as RadianArcLengthParams);
}

export const radianArcLengthModule: CurveModule = {
  id: 'radian-arc-length',
  paramSchema,
  defaultParams: {
    theta: DEFAULT_RADIAN_ARC_LENGTH_PARAMS.theta,
    radius: radiusFromMode(DEFAULT_RADIAN_ARC_LENGTH_PARAMS.radiusMode),
    showSpecialAngles: DEFAULT_RADIAN_ARC_LENGTH_PARAMS.showSpecialAngles ? 1 : 0,
  },
  sample: (_params, { purpose }) => {
    const spec = sampleRadianArcLengthThumbnail();
    if (purpose === 'thumbnail') return spec;
    return spec.paths[2]?.points ?? [];
  },
  getMetadata: (params) => {
    const p = asRadianArcLengthModuleParams(params);
    const radius = radiusFromMode(p.radiusMode);
    const s = arcLength(p.theta, p.radiusMode);

    return {
      title: '弧度與圓弧長',
      formula: 's = rθ',
      stats: [
        { key: 'radius', label: 'r', value: fmt(radius, 0) },
        { key: 'theta', label: 'θ', value: `${formatRad(p.theta)}｜${formatDeg(p.theta)}` },
        { key: 'arc', label: 's', value: formatArcLength(s) },
        { key: 'ratio', label: 's / r', value: formatRad(s / radius) },
      ],
    };
  },
};

export { DEFAULT_RADIAN_ARC_LENGTH_PARAMS };
export type { RadianArcLengthParams, RadiusMode } from './geometry';
