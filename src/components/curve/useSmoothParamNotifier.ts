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

/** draw 內同步平滑參數到 React；僅在量化後顯示值變化時 setState。 */
export function useSmoothParamNotifier(onChange: (params: ParamValues) => void) {
  const lastRef = useRef<Record<string, string>>({});
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  return useCallback((partial: ParamValues) => {
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

export function useQuantizedScalarNotifier(onChange: (value: number) => void, quantize: (v: number) => string = (v) => v.toFixed(2)) {
  const lastRef = useRef('');
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  return useCallback((value: number) => {
    const q = quantize(value);
    if (lastRef.current === q) return;
    lastRef.current = q;
    onChangeRef.current(value);
  }, [quantize]);
}
