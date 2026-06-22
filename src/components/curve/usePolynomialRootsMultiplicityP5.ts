import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  buildPolynomialSceneCache,
  computePolynomialPlotRect,
  pickRoot,
  rootFromDrag,
  screenToWorldX,
  stepViewHalfYSmoothing,
  type PolynomialRootsMultiplicityParams,
  type PolynomialSceneCache,
  type ViewSmoothState,
} from '../../curve/modules/polynomial-roots-multiplicity/geometry';
import { renderPolynomialRootsMultiplicityScene } from '../../systems/rendering/polynomialRootsMultiplicityRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: PolynomialRootsMultiplicityParams;
  onParamsChange: (patch: Partial<PolynomialRootsMultiplicityParams>) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function usePolynomialRootsMultiplicityP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const sceneCacheRef = useRef<PolynomialSceneCache>(buildPolynomialSceneCache(params));
  const smoothRef = useRef<ViewSmoothState>({ viewHalfY: 5 });
  const draggingRootIndexRef = useRef(-1);
  const onParamsChangeRef = useRef(onParamsChange);

  useEffect(() => {
    if (draggingRootIndexRef.current >= 0) return;
    paramsRef.current = params;
    sceneCacheRef.current = buildPolynomialSceneCache(params);
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    const targetViewHalfY = renderPolynomialRootsMultiplicityScene(p, {
      size: p.width,
      params: paramsRef.current,
      scene: sceneCacheRef.current,
      smooth: smoothRef.current,
    });
    smoothRef.current = stepViewHalfYSmoothing(
      smoothRef.current,
      targetViewHalfY,
      p.deltaTime,
    );
  }, []);
  const extendSketch = useCallback((p: p5) => {
    const syncSceneCache = () => {
      sceneCacheRef.current = buildPolynomialSceneCache(paramsRef.current);
    };

    const updateRootDrag = () => {
      const index = draggingRootIndexRef.current;
      if (index < 0) return;

      const plot = computePolynomialPlotRect(p.width);
      const worldX = screenToWorldX(plot, smoothRef.current.viewHalfY, p.mouseX);
      const { root } = rootFromDrag(index, worldX);
      const roots = [...paramsRef.current.roots] as [number, number, number];
      roots[index] = root;
      paramsRef.current = { ...paramsRef.current, roots };
      syncSceneCache();
    };

    p.mousePressed = () => {
      const plot = computePolynomialPlotRect(p.width);
      draggingRootIndexRef.current = pickRoot(
        sceneCacheRef.current.meta,
        plot,
        smoothRef.current.viewHalfY,
        p.mouseX,
        p.mouseY,
      );
      if (draggingRootIndexRef.current >= 0) updateRootDrag();
    };

    p.mouseDragged = () => {
      updateRootDrag();
    };

    p.mouseReleased = () => {
      if (draggingRootIndexRef.current >= 0) {
        onParamsChangeRef.current({ roots: [...paramsRef.current.roots] as [number, number, number] });
      }
      draggingRootIndexRef.current = -1;
    };

    p.touchStarted = () => {
      p.mousePressed();
      return false;
    };

    p.touchMoved = () => {
      p.mouseDragged();
      return false;
    };

    p.touchEnded = () => {
      p.mouseReleased();
      return false;
    };
  }, []);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
  );

  return { canvasHostRef };
}
