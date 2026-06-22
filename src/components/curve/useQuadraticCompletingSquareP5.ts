import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  buildQuadraticSceneCache,
  computeWorkPlotRect,
  pickVertex,
  screenToWorld,
  stepViewHalfYSmoothing,
  vertexFromDrag,
  type QuadraticCompletingSquareParams,
  type QuadraticSceneCache,
  type ViewSmoothState,
} from '../../curve/modules/quadratic-completing-square/geometry';
import { renderQuadraticCompletingSquareScene } from '../../systems/rendering/quadraticCompletingSquareRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: QuadraticCompletingSquareParams;
  onParamsChange: (patch: Partial<QuadraticCompletingSquareParams>) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useQuadraticCompletingSquareP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const sceneCacheRef = useRef<QuadraticSceneCache>(buildQuadraticSceneCache(params));
  const smoothRef = useRef<ViewSmoothState>({ viewHalfY: 5 });
  const draggingVertexRef = useRef(false);
  const onParamsChangeRef = useRef(onParamsChange);

  useEffect(() => {
    if (draggingVertexRef.current) return;
    paramsRef.current = params;
    sceneCacheRef.current = buildQuadraticSceneCache(params);
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    const targetViewHalfY = renderQuadraticCompletingSquareScene(p, {
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
      sceneCacheRef.current = buildQuadraticSceneCache(paramsRef.current);
    };

    const updateVertexDrag = () => {
      if (!draggingVertexRef.current) return;
      const plot = computeWorkPlotRect(p.width);
      const world = screenToWorld(
        plot,
        smoothRef.current.viewHalfY,
        p.mouseX,
        p.mouseY,
      );
      const next = vertexFromDrag(paramsRef.current, world.x, world.y);
      paramsRef.current = { ...paramsRef.current, ...next };
      syncSceneCache();
    };

    p.mousePressed = () => {
      const plot = computeWorkPlotRect(p.width);
      draggingVertexRef.current = pickVertex(
        sceneCacheRef.current.meta,
        plot,
        smoothRef.current.viewHalfY,
        p.mouseX,
        p.mouseY,
      );
      if (draggingVertexRef.current) updateVertexDrag();
    };

    p.mouseDragged = () => {
      updateVertexDrag();
    };

    p.mouseReleased = () => {
      if (draggingVertexRef.current) {
        onParamsChangeRef.current({
          b: paramsRef.current.b,
          c: paramsRef.current.c,
        });
      }
      draggingVertexRef.current = false;
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
