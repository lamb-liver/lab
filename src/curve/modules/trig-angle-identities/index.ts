import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import type { CurveModule, ParamSchema, ParamValues } from '../../types';
import {
  asTrigAngleIdentitiesParams,
  DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS,
  fmt,
  formatAngle,
  formulaDisplayLine,
  formulaFromId,
  makeCompositionSnap,
  reverseFormulaLine,
  sampleTrigAngleIdentitiesThumbnail,
  type FormulaId,
  type TrigAngleIdentitiesParams,
} from './geometry';

const paramSchema: ParamSchema = [];

const FORMULA_INDEX: Record<FormulaId, number> = {
  sinSum: 0,
  sinDiff: 1,
  cosSum: 2,
  cosDiff: 3,
};

export function formulaIdFromParam(value: number | FormulaId | undefined): FormulaId {
  if (typeof value === 'string') return formulaFromId(value).id;
  const ids: FormulaId[] = ['sinSum', 'sinDiff', 'cosSum', 'cosDiff'];
  return ids[Math.max(0, Math.min(3, Math.round(value ?? 0)))] ?? 'sinSum';
}

export function asTrigAngleIdentitiesModuleParams(
  params: ParamValues | TrigAngleIdentitiesParams,
): TrigAngleIdentitiesParams {
  const raw = params as TrigAngleIdentitiesParams & { formulaId?: FormulaId | number };
  return asTrigAngleIdentitiesParams({
    formulaId: formulaIdFromParam(raw.formulaId),
    alpha: raw.alpha,
    beta: raw.beta,
    showRadians: raw.showRadians,
    reverseRead: raw.reverseRead,
    showGuides: raw.showGuides,
  });
}

export const trigAngleIdentitiesModule: CurveModule = {
  id: 'trig-angle-identities',
  paramSchema,
  defaultParams: {
    formulaId: FORMULA_INDEX.sinSum,
    alpha: DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.alpha,
    beta: DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.beta,
    showRadians: 0,
    reverseRead: 0,
    showGuides: 1,
  },
  sample: (_params, { purpose }) => {
    const spec = sampleTrigAngleIdentitiesThumbnail();
    if (purpose === 'thumbnail') return spec;
    return spec.paths[0]?.points ?? [];
  },
  getMetadata: (params) => {
    const p = asTrigAngleIdentitiesModuleParams(params);
    const snap = makeCompositionSnap(p, { alpha: p.alpha, beta: p.beta, guideMix: 1 });
    const formulaLine = p.reverseRead
      ? reverseFormulaLine(snap.formula)
      : formulaDisplayLine(snap.formula);

    return {
      title: snap.formula.label,
      formula: formulaLine,
      stats: [
        { key: 'm', label: 'm=(α+β)/2', value: formatAngle(snap.formulaM, p.showRadians) },
        { key: 'd', label: 'd=(α−β)/2', value: formatAngle(snap.formulaD, p.showRadians) },
        { key: 'lhs', label: snap.formula.line1, value: fmt(snap.lhs) },
        { key: 'rhs', label: snap.formula.line2, value: fmt(snap.rhs) },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
};

export { DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS };
export type { TrigAngleIdentitiesParams, FormulaId };
