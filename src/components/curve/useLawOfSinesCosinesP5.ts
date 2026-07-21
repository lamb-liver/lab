import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
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
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type DragVertex = 'A' | 'B' | 'C';

type Options = {
  params: LawOfSinesCosinesParams;
  onTriangleChange: (triangle: TriangleVerts) => void;
};

const HIT_RADIUS = 30;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useLawOfSinesCosinesP5({ params, onTriangleChange }: Options) {
  const paramsRef = useRef(params);
  const onTriangleChangeRef = useRef(onTriangleChange);
  const activeVertexRef = useRef<DragVertex | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onTriangleChangeRef.current = onTriangleChange;
  }, [onTriangleChange]);

  const draw = useCallback((p: p5) => {
    renderLawOfSinesCosinesScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
      activeVertex: activeVertexRef.current,
    });
  }, []);
  const extendSketch = useCallback((p: p5) => {
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

    wireTouchToMouse(p);
  }, []);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey: params },
  );

  return { canvasHostRef };
}
