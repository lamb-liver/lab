import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  asUnitCircleParams,
  DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS,
  fmt,
  formatAngle,
  getTrigValues,
  normalizeAngle,
  quadrantLabel,
  sampleUnitCircleTrigDefinitionThumbnail,
  signLabel,
  type UnitCircleTrigDefinitionParams,
} from './geometry';

const paramSchema: ParamSchema = [];

export function asUnitCircleTrigDefinitionParams(
  params: ParamValues | UnitCircleTrigDefinitionParams,
): UnitCircleTrigDefinitionParams {
  return asUnitCircleParams(params as UnitCircleTrigDefinitionParams);
}

export const unitCircleTrigDefinitionModule: CurveModule = {
  id: 'unit-circle-trig-definition',
  paramSchema,
  defaultParams: {
    theta: DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS.theta,
    showRadians: 0,
    showSpecialAngles: 1,
    showQuadrants: 1,
    showTangent: 1,
  },
  sample: (_params, { purpose }) => {
    const spec = sampleUnitCircleTrigDefinitionThumbnail();
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const p = asUnitCircleTrigDefinitionParams(params);
    const thetaNorm = normalizeAngle(p.theta);
    const { cosValue, sinValue, tanValue } = getTrigValues(thetaNorm);

    return {
      title: '單位圓定義',
      formula: 'P(θ) = (cosθ, sinθ)',
      stats: [
        { key: 'theta', label: 'θ', value: formatAngle(p.theta, p.showRadians) },
        { key: 'cos', label: 'cos θ', value: fmt(cosValue) },
        { key: 'sin', label: 'sin θ', value: fmt(sinValue) },
        {
          key: 'tan',
          label: 'tan θ',
          value: Number.isFinite(tanValue) ? fmt(tanValue) : '未定義',
        },
        {
          key: 'identity',
          label: 'sin²+cos²',
          value: fmt(sinValue * sinValue + cosValue * cosValue),
        },
        {
          key: 'quadrant',
          label: '象限',
          value: `${quadrantLabel(thetaNorm)}｜cos ${signLabel(cosValue)} sin ${signLabel(sinValue)}`,
        },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
};

export { DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS };
export type { UnitCircleTrigDefinitionParams };
