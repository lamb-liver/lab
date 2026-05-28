import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  buildCatalanNumbers,
  generateDyckWords,
  generateTriangulations,
  modeFromValue,
  normalizeN,
} from '../../curve/modules/catalan-numbers/geometry';
import type { ParamValues } from '../../curve/types';
import { renderCatalanNumbersScene } from '../../systems/rendering/catalanNumbersRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  nextNonce: number;
  onRevealPctChange: (pct: number) => void;
};

export function useCatalanNumbersP5({
  defaultParams,
  targetParams,
  nextNonce,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const nextNonceRef = useRef(nextNonce);
  const cacheRef = useRef<{ key: string; mode: string; n: number; objects: Array<string | number[][]>; active: number }>({
    key: '',
    mode: 'path',
    n: 4,
    objects: [],
    active: 0,
  });
  const revealRef = useRef(0);
  const pctRef = useRef(-1);
  const onRevealPctRef = useRef(onRevealPctChange);
  const catalanRef = useRef(buildCatalanNumbers(11));

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);
  useEffect(() => {
    onRevealPctRef.current = onRevealPctChange;
  }, [onRevealPctChange]);
  useEffect(() => {
    nextNonceRef.current = nextNonce;
    if (cacheRef.current.objects.length > 0) {
      cacheRef.current.active = (cacheRef.current.active + 1) % cacheRef.current.objects.length;
      revealRef.current = 0;
    }
  }, [nextNonce]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const n = normalizeN(params.n);
    const mode = modeFromValue(params.mode);
    const key = `${n}|${mode}`;
    if (cacheRef.current.key !== key) {
      cacheRef.current.key = key;
      cacheRef.current.mode = mode;
      cacheRef.current.n = n;
      cacheRef.current.active = 0;
      cacheRef.current.objects =
        mode === 'triangulation' ? (generateTriangulations(n + 2) as Array<string | number[][]>) : generateDyckWords(n);
      revealRef.current = 0;
    }

    revealRef.current += 0.035;
    const objects = cacheRef.current.objects;
    if (revealRef.current > ((mode === 'triangulation' ? (objects[cacheRef.current.active] as number[][])?.length : (objects[cacheRef.current.active] as string)?.length) ?? 1) + 0.7) {
      revealRef.current = 0;
    }

    renderCatalanNumbersScene(p, {
      width: p.width,
      height: p.height,
      n,
      mode,
      catalanValue: catalanRef.current[n] ?? 0,
      objects,
      activeIndex: cacheRef.current.active,
      reveal: revealRef.current,
    });

    const pct = Math.min(100, Math.floor((Math.min(revealRef.current, 2 * n) / Math.max(1, 2 * n)) * 100));
    if (pct !== pctRef.current) {
      pctRef.current = pct;
      onRevealPctRef.current(pct);
    }
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
