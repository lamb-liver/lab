import type { CurveModule, CurvePoint, ParamValues } from './types';

function paramsKey(params: ParamValues, decimals = 4): string {
  return Object.keys(params)
    .sort()
    .map((k) => `${k}:${params[k].toFixed(decimals)}`)
    .join('|');
}

export type MorphPathCache = {
  getPoints: (params: ParamValues, step: number) => ReadonlyArray<CurvePoint>;
  clear: () => void;
};

/** 參數不變時重用點列（reveal 動畫期間避免每幀 resample） */
export function createMorphPathCache(module: CurveModule): MorphPathCache {
  let lastKey = '';
  let lastStep = 0;
  let lastPoints: CurvePoint[] = [];

  return {
    getPoints(params, step) {
      const key = paramsKey(params);
      if (key === lastKey && step === lastStep && lastPoints.length > 0) {
        return lastPoints;
      }
      lastPoints = module.sample(params, { step });
      lastKey = key;
      lastStep = step;
      return lastPoints;
    },
    clear() {
      lastKey = '';
      lastStep = 0;
      lastPoints = [];
    },
  };
}
