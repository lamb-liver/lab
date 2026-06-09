import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  asLawParams,
  DEFAULT_LAW_OF_SINES_COSINES_PARAMS,
  fmt,
  deg,
  sampleLawOfSinesCosinesThumbnail,
  triangleMetrics,
  type LawOfSinesCosinesParams,
} from './geometry';

const paramSchema: ParamSchema = [];

export function asLawOfSinesCosinesParams(
  params: ParamValues | LawOfSinesCosinesParams,
): LawOfSinesCosinesParams {
  return asLawParams(params as LawOfSinesCosinesParams);
}

export const lawOfSinesCosinesModule: CurveModule = {
  id: 'law-of-sines-cosines',
  paramSchema,
  defaultParams: {
    mode: 0,
    advanced: 1,
  },
  sample: (params, { purpose }) => {
    const lawParams = asLawOfSinesCosinesParams(params);
    const spec = sampleLawOfSinesCosinesThumbnail(lawParams);
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const lawParams = asLawOfSinesCosinesParams(params);
    const g = triangleMetrics(lawParams.triangle);

    if (lawParams.mode === 'cosine') {
      const lhs = g.c * g.c;
      const rhs = g.a * g.a + g.b * g.b - 2 * g.a * g.b * Math.cos(g.C);
      return {
        title: '餘弦定理',
        formula: 'c² = a² + b² − 2ab cosC',
        stats: [
          { key: 'sides', label: 'a,b,c', value: `${fmt(g.a)}, ${fmt(g.b)}, ${fmt(g.c)}` },
          { key: 'angleC', label: 'C / cosC', value: `${deg(g.C)} / ${fmt(Math.cos(g.C))}` },
          { key: 'lhs', label: 'c²', value: fmt(lhs) },
          { key: 'rhs', label: 'a²+b²−2abcosC', value: fmt(rhs) },
        ],
      };
    }

    return {
      title: '正弦定理',
      formula: 'a/sinA = b/sinB = c/sinC = 2R',
      stats: [
        { key: 'sides', label: 'a,b,c', value: `${fmt(g.a)}, ${fmt(g.b)}, ${fmt(g.c)}` },
        { key: 'angles', label: 'A,B,C', value: `${deg(g.A)}, ${deg(g.B)}, ${deg(g.C)}` },
        { key: 'ratio', label: 'a/sinA', value: fmt(g.ratioA) },
        { key: 'diameter', label: '2R', value: fmt(2 * g.R) },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
};

export { DEFAULT_LAW_OF_SINES_COSINES_PARAMS };
export type { LawOfSinesCosinesParams };
