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
  targetParams: ParamValues;
  rerollNonce: number;
};

export function useCombinatorialPathCountingP5({
  targetParams,
  rerollNonce,
}: Options) {
  const initialM = normalizeSize(targetParams.m);
  const initialN = normalizeSize(targetParams.n);
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const cacheRef = useRef({
    key: `${initialM}|${initialN}`,
    m: initialM,
    n: initialN,
    pathCounts: buildPathCounts(initialM, initialN),
    allPaths: generateAllPaths(initialM, initialN),
  });
  const pathIndexRef = useRef(0);
  const pathProgressRef = useRef(0);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
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
    }

    const allPaths = cacheRef.current.allPaths;
    const current = allPaths.length > 0 ? allPaths[pathIndexRef.current % allPaths.length]! : [];

    pathProgressRef.current += COMBINATORIAL_PATH_SPEED;
    if (pathProgressRef.current > current.length + 0.7 && allPaths.length > 0) {
      pathProgressRef.current = 0;
      pathIndexRef.current = (pathIndexRef.current + 1) % allPaths.length;
    }

    const layout = getGridLayout(m, n);
    renderCombinatorialPathCountingScene(p, {
      width: p.width,
      height: p.height,
      m,
      n,
      mode,
      layout,
      pathCounts: cacheRef.current.pathCounts,
      allPaths,
      currentPathPoints: pathToPoints(layout, current),
      pathProgress: pathProgressRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
