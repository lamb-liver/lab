import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  P_DEFAULT,
  THETA_DEFAULT_DEG,
  format3,
  horizontalSecant,
  sampleCirclePowerThumbnail,
  settle,
  slantedSecant,
} from '../../circlePower';

const paramSchema: ParamSchema = [];

export function asTwoSecantParams(params: ParamValues): { p: number; thetaDeg: number } {
  return settle(Number(params.p ?? P_DEFAULT), Number(params.thetaDeg ?? THETA_DEFAULT_DEG));
}

export const twoSecantsModule: CurveModule = {
  id: 'two-secants',
  paramSchema,
  defaultParams: { p: P_DEFAULT, thetaDeg: THETA_DEFAULT_DEG },
  sample: (params) => {
    const next = asTwoSecantParams(params);
    return sampleCirclePowerThumbnail('two-secants', next.p, next.thetaDeg);
  },
  getMetadata: (params) => {
    const next = asTwoSecantParams(params);
    return {
      title: '兩條割線',
      formula: 'PA·PB = PC·PD',
      stats: [
        { key: 'horizontal', label: '水平', value: format3(horizontalSecant(next.p).product) },
        { key: 'slanted', label: '斜線', value: format3(slantedSecant(next.p, next.thetaDeg).product) },
      ],
    };
  },
};
