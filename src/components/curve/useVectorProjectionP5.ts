import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampDragWorld,
  createVectorProjectionLayout,
  screenToWorld,
  vectorFromParams,
  worldToScreen,
  type VectorProjectionParams,
} from '../../curve/modules/vector-projection/geometry';
import { renderVectorProjectionScene } from '../../systems/rendering/vectorProjectionRender';

type DragTarget = 'a' | 'b';

type Options = {
  params: VectorProjectionParams;
  showDrop: boolean;
  showError: boolean;
  onParamsChange: (patch: Partial<VectorProjectionParams>) => void;
};

const HIT_RADIUS = 18;

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function useVectorProjectionP5({
  params,
  showDrop,
  showError,
  onParamsChange,
}: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  const showDropRef = useRef(showDrop);
  const showErrorRef = useRef(showError);
  const onParamsChangeRef = useRef(onParamsChange);
  const activeDragRef = useRef<DragTarget | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    showDropRef.current = showDrop;
  }, [showDrop]);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

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
        function nearestDragTarget(): DragTarget | null {
          const layout = createVectorProjectionLayout(p.width, p.height, paramsRef.current);
          const { a, b } = vectorFromParams(paramsRef.current);
          const mouse = { x: p.mouseX, y: p.mouseY };
          const screenA = worldToScreen(layout, a);
          const screenB = worldToScreen(layout, b);
          const aDist = distance(mouse, screenA);
          const bDist = distance(mouse, screenB);
          const minDist = Math.min(aDist, bDist);
          if (minDist > HIT_RADIUS) return null;
          return aDist <= bDist ? 'a' : 'b';
        }

        function updateDrag(): void {
          const active = activeDragRef.current;
          if (!active) return;
          const layout = createVectorProjectionLayout(p.width, p.height, paramsRef.current);
          const next = clampDragWorld(screenToWorld(layout, { x: p.mouseX, y: p.mouseY }));
          if (active === 'a') {
            onParamsChangeRef.current({ ax: next.x, ay: next.y });
            return;
          }
          onParamsChangeRef.current({ bx: next.x, by: next.y });
        }

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => {
          renderVectorProjectionScene(p, {
            width: p.width,
            height: p.height,
            params: paramsRef.current,
            showDrop: showDropRef.current,
            showError: showErrorRef.current,
            activeDrag: activeDragRef.current,
            timeMs: p.millis(),
          });
        };

        p.mouseMoved = () => {
          if (activeDragRef.current) return;
          p.cursor(nearestDragTarget() ? 'grab' : 'default');
        };

        p.mousePressed = () => {
          activeDragRef.current = nearestDragTarget();
          if (activeDragRef.current) {
            p.cursor('grabbing');
            updateDrag();
          }
        };

        p.mouseDragged = () => {
          updateDrag();
        };

        p.mouseReleased = () => {
          activeDragRef.current = null;
          p.cursor(nearestDragTarget() ? 'grab' : 'default');
        };
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        const size = measureWorkCanvasSize(host);
        instance.resizeCanvas(size, size);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      });
      ro.observe(host);

      cleanup = () => {
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
