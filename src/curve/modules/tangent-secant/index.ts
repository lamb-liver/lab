import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  P_DEFAULT,
  THETA_DEFAULT_DEG,
  format3,
  sampleCirclePowerThumbnail,
  settle,
  slantedSecant,
  upperTangent,
} from '../../circlePower';

const paramSchema: ParamSchema = [];

export function asTangentSecantParams(params: ParamValues): { p: number; thetaDeg: number } {
  return settle(Number(params.p ?? P_DEFAULT), Number(params.thetaDeg ?? THETA_DEFAULT_DEG));
}

export const tangentSecantModule: CurveModule = {
  id: 'tangent-secant',
  paramSchema,
  defaultParams: { p: P_DEFAULT, thetaDeg: THETA_DEFAULT_DEG },
  sample: (params) => {
    const next = asTangentSecantParams(params);
    return sampleCirclePowerThumbnail('tangent-secant', next.p, next.thetaDeg);
  },
  getMetadata: (params) => {
    const next = asTangentSecantParams(params);
    return {
      title: '切線與割線',
      formula: 'PT² = PA·PB',
      stats: [
        { key: 'tangent', label: '切線平方', value: format3(upperTangent(next.p).square) },
        { key: 'secant', label: '割線乘積', value: format3(slantedSecant(next.p, next.thetaDeg).product) },
      ],
    };
  },
};
