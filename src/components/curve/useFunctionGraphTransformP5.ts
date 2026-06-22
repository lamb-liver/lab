import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampFeaturePoint,
  computeWorkPlotRect,
  pickFeaturePoint,
  screenToWorld,
  stepViewHalfYSmoothing,
  type FunctionGraphTransformParams,
  type ViewSmoothState,
} from '../../curve/modules/function-graph-transform/geometry';
import { renderFunctionGraphTransformScene } from '../../systems/rendering/functionGraphTransformRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: FunctionGraphTransformParams;
  onParamsChange: (patch: Partial<FunctionGraphTransformParams>) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useFunctionGraphTransformP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const smoothRef = useRef<ViewSmoothState>({ viewHalfY: 5 });
  const draggingFeatureRef = useRef(false);
  const onParamsChangeRef = useRef(onParamsChange);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    const targetViewHalfY = renderFunctionGraphTransformScene(p, {
      size: p.width,
      params: paramsRef.current,
      smooth: smoothRef.current,
    });
    smoothRef.current = stepViewHalfYSmoothing(
      smoothRef.current,
      targetViewHalfY,
      p.deltaTime,
    );
  }, []);
  const extendSketch = useCallback((p: p5) => {
    const updateDrag = () => {
      if (!draggingFeatureRef.current) return;
      const plot = computeWorkPlotRect(p.width);
      const world = screenToWorld(
        plot,
        smoothRef.current.viewHalfY,
        p.mouseX,
        p.mouseY,
      );
      const next = clampFeaturePoint(world.x, world.y);
      onParamsChangeRef.current(next);
    };

    p.mousePressed = () => {
      const plot = computeWorkPlotRect(p.width);
      draggingFeatureRef.current = pickFeaturePoint(
        paramsRef.current,
        plot,
        smoothRef.current.viewHalfY,
        p.mouseX,
        p.mouseY,
      );
      if (draggingFeatureRef.current) updateDrag();
    };

    p.mouseDragged = () => {
      updateDrag();
    };

    p.mouseReleased = () => {
      draggingFeatureRef.current = false;
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
