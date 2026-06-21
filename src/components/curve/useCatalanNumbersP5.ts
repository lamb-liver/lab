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
  targetParams: ParamValues;
  nextNonce: number;
};

export function useCatalanNumbersP5({
  targetParams,
  nextNonce,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const cacheRef = useRef<{ key: string; mode: string; n: number; objects: Array<string | number[][]>; active: number }>({
    key: '',
    mode: 'path',
    n: 4,
    objects: [],
    active: 0,
  });
  const revealRef = useRef(0);
  const catalanRef = useRef(buildCatalanNumbers(9));

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);
  useEffect(() => {
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

  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
