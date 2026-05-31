import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampDragWorld,
  createDotProductLayout,
  screenToWorld,
  vectorFromParams,
  worldToScreen,
  type DotProductGeometryParams,
} from '../../curve/modules/dot-product-geometry/geometry';
import { renderDotProductGeometryScene } from '../../systems/rendering/dotProductGeometryRender';

type DragTarget = 'u' | 'v';

type Options = {
  params: DotProductGeometryParams;
  showAngle: boolean;
  showProjection: boolean;
  onParamsChange: (patch: Partial<DotProductGeometryParams>) => void;
};

const HIT_RADIUS = 18;

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function useDotProductGeometryP5({
  params,
  showAngle,
  showProjection,
  onParamsChange,
}: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  const showAngleRef = useRef(showAngle);
  const showProjectionRef = useRef(showProjection);
  const onParamsChangeRef = useRef(onParamsChange);
  const activeDragRef = useRef<DragTarget | null>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    paramsRef.current = params;
    instanceRef.current?.redraw();
  }, [params]);

  useEffect(() => {
    showAngleRef.current = showAngle;
    instanceRef.current?.redraw();
  }, [showAngle]);

  useEffect(() => {
    showProjectionRef.current = showProjection;
    instanceRef.current?.redraw();
  }, [showProjection]);

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
          const layout = createDotProductLayout(p.width, p.height, paramsRef.current);
          const { u, v } = vectorFromParams(paramsRef.current);
          const mouse = { x: p.mouseX, y: p.mouseY };
          const screenU = worldToScreen(layout, u);
          const screenV = worldToScreen(layout, v);
          const uDist = distance(mouse, screenU);
          const vDist = distance(mouse, screenV);
          const minDist = Math.min(uDist, vDist);
          if (minDist > HIT_RADIUS) return null;
          return uDist <= vDist ? 'u' : 'v';
        }

        function updateDrag(): void {
          const active = activeDragRef.current;
          if (!active) return;
          const layout = createDotProductLayout(p.width, p.height, paramsRef.current);
          const next = clampDragWorld(screenToWorld(layout, { x: p.mouseX, y: p.mouseY }));
          if (active === 'u') {
            const patch = { ux: next.x, uy: next.y };
            paramsRef.current = { ...paramsRef.current, ...patch };
            onParamsChangeRef.current(patch);
            p.redraw();
            return;
          }
          const patch = { vx: next.x, vy: next.y };
          paramsRef.current = { ...paramsRef.current, ...patch };
          onParamsChangeRef.current(patch);
          p.redraw();
        }

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.noLoop();
        };

        p.draw = () => {
          renderDotProductGeometryScene(p, {
            width: p.width,
            height: p.height,
            params: paramsRef.current,
            showAngle: showAngleRef.current,
            showProjection: showProjectionRef.current,
            activeDrag: activeDragRef.current,
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
          p.redraw();
        };
      };

      const instance = new P5(sketch, host);
      instanceRef.current = instance;

      const ro = new ResizeObserver(() => {
        const size = measureWorkCanvasSize(host);
        instance.resizeCanvas(size, size);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        instance.redraw();
      });
      ro.observe(host);

      cleanup = () => {
        ro.disconnect();
        instanceRef.current = null;
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
