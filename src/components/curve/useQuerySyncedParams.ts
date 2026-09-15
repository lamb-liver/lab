import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { ParamValues } from '../../curve/types';

const DEBOUNCE_MS = 120;
const EQ_EPS = 1e-9;

/** Work 互動參數 ↔ URL query；只同步 defaults 內的數值鍵，等於預設則省略。 */

export function formatQueryNumber(n: number): string {
  if (!Number.isFinite(n)) return '';
  const rounded = Math.round(n);
  if (Math.abs(n - rounded) < EQ_EPS) return String(rounded);
  const compact = n.toPrecision(6);
  return compact.includes('e') ? String(n) : String(Number(compact));
}

export function parseParamsFromSearch(search: string, defaults: ParamValues): ParamValues {
  const query = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  const next: ParamValues = { ...defaults };

  for (const key of Object.keys(defaults)) {
    const raw = params.get(key);
    if (raw == null || raw === '') continue;
    const value = Number(raw);
    if (Number.isFinite(value)) next[key] = value;
  }

  return next;
}

export function searchFromParams(
  values: ParamValues,
  defaults: ParamValues,
  currentSearch: string,
): string {
  const query = currentSearch.startsWith('?') ? currentSearch.slice(1) : currentSearch;
  const params = new URLSearchParams(query);

  for (const key of Object.keys(defaults)) {
    const value = values[key];
    const fallback = defaults[key];
    if (!Number.isFinite(value) || Math.abs(value - fallback) < EQ_EPS) {
      params.delete(key);
    } else {
      params.set(key, formatQueryNumber(value));
    }
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export function useQuerySyncedParams(
  defaults: ParamValues,
): [ParamValues, Dispatch<SetStateAction<ParamValues>>] {
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  const [values, setValues] = useState<ParamValues>(() =>
    typeof window === 'undefined'
      ? defaults
      : parseParamsFromSearch(window.location.search, defaults),
  );

  const timerRef = useRef(0);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const url = new URL(window.location.href);
      const nextSearch = searchFromParams(values, defaultsRef.current, url.search);
      if (nextSearch === url.search) return;
      url.search = nextSearch;
      history.replaceState(history.state, '', url.href);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timerRef.current);
  }, [values]);

  return [values, setValues];
}
