import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  buildInverseSceneCache,
  computeWorkPlotRect,
  geometryParamsEqual,
  inputFromDrag,
  pickPointP,
  screenToWorldX,
  stepViewHalfYSmoothing,
  type InverseFunctionReflectionParams,
  type InverseSceneCache,
  type ViewSmoothState,
} from '../../curve/modules/inverse-function-reflection/geometry';
import { renderInverseFunctionReflectionScene } from '../../systems/rendering/inverseFunctionReflectionRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: InverseFunctionReflectionParams;
  onParamsChange: (patch: Partial<InverseFunctionReflectionParams>) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useInverseFunctionReflectionP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const sceneCacheRef = useRef<InverseSceneCache>(buildInverseSceneCache(params));
  const smoothRef = useRef<ViewSmoothState>({ viewHalfY: 5 });
  const draggingPointRef = useRef(false);
  const onParamsChangeRef = useRef(onParamsChange);

  useEffect(() => {
    if (draggingPointRef.current) return;

    const prev = paramsRef.current;
    paramsRef.current = params;

    if (prev.mode !== params.mode) {
      smoothRef.current = { viewHalfY: 5 };
    }

    if (!geometryParamsEqual(prev, params)) {
      sceneCacheRef.current = buildInverseSceneCache(params);
    }
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    const targetViewHalfY = renderInverseFunctionReflectionScene(p, {
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
      sceneCacheRef.current = buildInverseSceneCache(paramsRef.current);
    };

    const updatePointDrag = () => {
      if (!draggingPointRef.current) return;
      const plot = computeWorkPlotRect(p.width);
      const worldX = screenToWorldX(plot, smoothRef.current.viewHalfY, p.mouseX);
      const input = inputFromDrag(paramsRef.current.mode, worldX);
      paramsRef.current = { ...paramsRef.current, input };
      syncSceneCache();
    };

    p.mousePressed = () => {
      const plot = computeWorkPlotRect(p.width);
      draggingPointRef.current = pickPointP(
        sceneCacheRef.current.meta,
        plot,
        smoothRef.current.viewHalfY,
        p.mouseX,
        p.mouseY,
      );
      if (draggingPointRef.current) updatePointDrag();
    };

    p.mouseDragged = () => {
      updatePointDrag();
    };

    p.mouseReleased = () => {
      if (draggingPointRef.current) {
        onParamsChangeRef.current({ input: paramsRef.current.input });
      }
      draggingPointRef.current = false;
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
