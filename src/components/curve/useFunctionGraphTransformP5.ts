import { useEffect, useRef } from 'react';
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

type Options = {
  params: FunctionGraphTransformParams;
  onParamsChange: (patch: Partial<FunctionGraphTransformParams>) => void;
};

type P5WithRenderer = p5 & { _renderer?: unknown };

export function useFunctionGraphTransformP5({ params, onParamsChange }: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
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

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => {
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
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;
        const size = measureWorkCanvasSize(host);
        instance.resizeCanvas(size, size);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instance.remove();
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return { canvasHostRef };
}
