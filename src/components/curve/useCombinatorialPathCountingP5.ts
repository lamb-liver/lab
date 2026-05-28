import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { COMBINATORIAL_PATH_SPEED } from '../../curve/modules/combinatorial-path-counting';
import {
  buildPathCounts,
  generateAllPaths,
  getGridLayout,
  modeFromValue,
  normalizeSize,
  pathToPoints,
} from '../../curve/modules/combinatorial-path-counting/geometry';
import type { ParamValues } from '../../curve/types';
import { renderCombinatorialPathCountingScene } from '../../systems/rendering/combinatorialPathCountingRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  rerollNonce: number;
  onRevealPctChange: (pct: number) => void;
};

export function useCombinatorialPathCountingP5({
  defaultParams,
  targetParams,
  rerollNonce,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const rerollNonceRef = useRef(rerollNonce);
  const cacheRef = useRef({
    key: '',
    m: normalizeSize(defaultParams.m),
    n: normalizeSize(defaultParams.n),
    pathCounts: buildPathCounts(normalizeSize(defaultParams.m), normalizeSize(defaultParams.n)),
    allPaths: generateAllPaths(normalizeSize(defaultParams.m), normalizeSize(defaultParams.n)),
  });
  const pathIndexRef = useRef(0);
  const pathProgressRef = useRef(0);
  const revealRef = useRef(0);
  const lastRevealPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    rerollNonceRef.current = rerollNonce;
    if (cacheRef.current.allPaths.length > 0) {
      pathIndexRef.current = Math.floor(Math.random() * cacheRef.current.allPaths.length);
      pathProgressRef.current = 0;
    }
  }, [rerollNonce]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const m = normalizeSize(params.m);
    const n = normalizeSize(params.n);
    const mode = modeFromValue(params.mode);
    const key = `${m}|${n}`;

    if (cacheRef.current.key !== key) {
      cacheRef.current = {
        key,
        m,
        n,
        pathCounts: buildPathCounts(m, n),
        allPaths: generateAllPaths(m, n),
      };
      pathIndexRef.current = 0;
      pathProgressRef.current = 0;
      revealRef.current = 0;
    }

    revealRef.current = Math.min(1, revealRef.current + COMBINATORIAL_PATH_SPEED);
    const allPaths = cacheRef.current.allPaths;
    const current = allPaths.length > 0 ? allPaths[pathIndexRef.current % allPaths.length]! : [];

    pathProgressRef.current += COMBINATORIAL_PATH_SPEED;
    if (pathProgressRef.current > current.length + 0.7 && allPaths.length > 0) {
      pathProgressRef.current = 0;
      pathIndexRef.current = (pathIndexRef.current + 1) % allPaths.length;
    }

    renderCombinatorialPathCountingScene(p, {
      width: p.width,
      height: p.height,
      m,
      n,
      mode,
      layout: getGridLayout(m, n),
      pathCounts: cacheRef.current.pathCounts,
      allPaths,
      currentPathPoints: pathToPoints(getGridLayout(m, n), current),
      pathProgress: pathProgressRef.current,
    });

    const pct = Math.floor(revealRef.current * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
