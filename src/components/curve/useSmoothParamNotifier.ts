import { useCallback, useEffect, useRef } from 'react';
import type { ParamValues } from '../../curve/types';

const PHASE_LIKE = /^phase$|^delta$|^theta/;

export function quantizeSmoothParam(key: string, value: number): string {
  if (PHASE_LIKE.test(key)) {
    return (value / Math.PI).toFixed(2);
  }
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 1e-6) {
    return String(rounded);
  }
  return value.toFixed(2);
}

type UseSmoothParamNotifierOptions = {
  /** 回傳 delta patch；呼叫端必須 merge 進既有 smoothParams。 */
  onChange: (params: ParamValues) => void;
  /** 目標參數快照；變更時重置量化快取，避免 patch 漏欄。 */
  getParams?: () => ParamValues;
};

/** draw 內同步平滑參數到 React；僅在量化後顯示值變化時 emit delta patch。 */
export function useSmoothParamNotifier(options: UseSmoothParamNotifierOptions) {
  const { onChange, getParams } = options;
  const lastRef = useRef<Record<string, string>>({});
  const targetSigRef = useRef('');
  const onChangeRef = useRef(onChange);
  const getParamsRef = useRef(getParams);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    getParamsRef.current = getParams;
  }, [getParams]);

  return useCallback((partial: ParamValues) => {
    const readParams = getParamsRef.current;
    if (readParams) {
      const sig = JSON.stringify(readParams());
      if (sig !== targetSigRef.current) {
        lastRef.current = {};
        targetSigRef.current = sig;
      }
    }

    const emit: ParamValues = {};
    for (const [key, value] of Object.entries(partial)) {
      const q = quantizeSmoothParam(key, value);
      if (lastRef.current[key] !== q) {
        lastRef.current[key] = q;
        emit[key] = value;
      }
    }
    if (Object.keys(emit).length > 0) {
      onChangeRef.current(emit);
    }
  }, []);
}
