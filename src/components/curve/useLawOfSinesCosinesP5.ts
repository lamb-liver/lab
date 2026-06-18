import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  createTriangleTransform,
  preventTriangleCollapse,
  screenToWorld,
  worldToScreen,
  type LawOfSinesCosinesParams,
  type TriangleVerts,
} from '../../curve/modules/law-of-sines-cosines/geometry';
import { renderLawOfSinesCosinesScene } from '../../systems/rendering/lawOfSinesCosinesRender';

type DragVertex = 'A' | 'B' | 'C';

type Options = {
  params: LawOfSinesCosinesParams;
  onTriangleChange: (triangle: TriangleVerts) => void;
};

const HIT_RADIUS = 30;

export function useLawOfSinesCosinesP5({ params, onTriangleChange }: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  const onTriangleChangeRef = useRef(onTriangleChange);
  const activeVertexRef = useRef<DragVertex | null>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    paramsRef.current = params;
    instanceRef.current?.redraw();
  }, [params]);

  useEffect(() => {
    onTriangleChangeRef.current = onTriangleChange;
  }, [onTriangleChange]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
        function nearestVertex(): DragVertex | null {
          const T = createTriangleTransform(p.width, p.height);
          let best: DragVertex | null = null;
          let bestD = 9999;

          for (const key of ['A', 'B', 'C'] as const) {
            const point = worldToScreen(paramsRef.current.triangle[key], T);
            const d = Math.hypot(p.mouseX - point.x, p.mouseY - point.y);
            if (d < bestD) {
              bestD = d;
              best = key;
            }
          }

          return best && bestD < HIT_RADIUS ? best : null;
        }

        function updateDrag(): void {
          const vertex = activeVertexRef.current;
          if (!vertex) return;

          const T = createTriangleTransform(p.width, p.height);
          const world = screenToWorld({ x: p.mouseX, y: p.mouseY }, T);
          const next = preventTriangleCollapse(
            {
              ...paramsRef.current.triangle,
              [vertex]: {
                x: Math.max(-1.75, Math.min(1.75, world.x)),
                y: Math.max(-1.25, Math.min(1.35, world.y)),
              },
            },
            vertex,
          );

          paramsRef.current = {
            ...paramsRef.current,
            triangle: next,
          };
          onTriangleChangeRef.current(next);
          p.redraw();
        }

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.noLoop();
        };

        p.draw = () => {
          renderLawOfSinesCosinesScene(p, {
            width: p.width,
            height: p.height,
            params: paramsRef.current,
            activeVertex: activeVertexRef.current,
          });
        };

        p.mouseMoved = () => {
          if (activeVertexRef.current) return;
          p.cursor(nearestVertex() ? 'grab' : 'default');
        };

        p.mousePressed = () => {
          activeVertexRef.current = nearestVertex();
          if (activeVertexRef.current) {
            p.cursor('grabbing');
            updateDrag();
          }
        };

        p.mouseDragged = () => {
          updateDrag();
        };

        p.mouseReleased = () => {
          activeVertexRef.current = null;
          p.cursor(nearestVertex() ? 'grab' : 'default');
          p.redraw();
        };
      };

      const instance = new P5(sketch, host);
      instanceRef.current = instance;

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!isP5RendererReady(instance)) return;
        const size = measureWorkCanvasSize(host);
        instance.resizeCanvas(size, size);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        instance.redraw();
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
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
