import { defaultsFromSchema } from '../../defaults';
import type { CurveMetadata, CurveModule, ParamSchema, ParamValues } from '../../types';
import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import {
  PASCAL_PRIMES,
  buildPascalFrameData,
  buildPascalThumbnail,
  normalizePrime,
  normalizeRows,
} from './geometry';

export const PASCAL_REVEAL_SPEED = 0.04;

const paramSchema: ParamSchema = [{ key: 'rows', label: '行數', min: 1, max: 42, step: 1, default: 24 }];

const defaultParams: ParamValues = {
  ...defaultsFromSchema(paramSchema),
  prime: 2,
};

export const pascalsTriangleModule: CurveModule = {
  id: 'pascals-triangle',
  paramSchema,
  defaultParams,
  sample: (params) => buildPascalThumbnail(params),
  getMetadata: (params): CurveMetadata => {
    const data = buildPascalFrameData(params);
    const activeCount = data.cellMap.reduce(
      (sum, row) => sum + row.filter((cell) => cell.value !== 0).length,
      0,
    );
    const totalCount = ((data.rows + 1) * (data.rows + 2)) / 2;
    return {
      title: '帕斯卡三角形',
      formula: 'C(n,k) = n! / (k!(n-k)!)',
      stats: [
        { key: 'rows', label: '行數 n', value: normalizeRows(params.rows) },
        { key: 'prime', label: '模數 p', value: normalizePrime(params.prime) },
        { key: 'active', label: '非零', value: `${activeCount}/${totalCount}` },
        { key: 'primes', label: '質數', value: PASCAL_PRIMES.join(', ') },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: PASCAL_REVEAL_SPEED, revealSpeed: PASCAL_REVEAL_SPEED },
};

export { PASCAL_PRIMES } from './geometry';
