import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';
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

type Options = {
  params: PolynomialRootsMultiplicityParams;
  onParamsChange: (patch: Partial<PolynomialRootsMultiplicityParams>) => void;
};

export function usePolynomialRootsMultiplicityP5({ params, onParamsChange }: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
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

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => {
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
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!isP5RendererReady(instance)) return;
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
