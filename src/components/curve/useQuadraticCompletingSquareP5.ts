import { useEffect, useRef } from 'react';
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

type Options = {
  params: QuadraticCompletingSquareParams;
  onParamsChange: (patch: Partial<QuadraticCompletingSquareParams>) => void;
};

type P5WithRenderer = p5 & { _renderer?: unknown };

export function useQuadraticCompletingSquareP5({ params, onParamsChange }: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
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

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => {
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
