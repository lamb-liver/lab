import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  clampDragWorld,
  createVectorAdditionScalarLayout,
  screenToWorld,
  vectorFromParams,
  worldToScreen,
  type VectorAdditionScalarParams,
} from '../../curve/modules/vector-addition-scalar/geometry';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import { renderVectorAdditionScalarScene } from '../../systems/rendering/vectorAdditionScalarRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type DragTarget = 'u' | 'v';

type Options = {
  params: VectorAdditionScalarParams;
  showComponents: boolean;
  onParamsChange: (patch: Partial<VectorAdditionScalarParams>) => void;
};

const HIT_RADIUS = 18;

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useVectorAdditionScalarP5({
  params,
  showComponents,
  onParamsChange,
}: Options) {
  const paramsRef = useRef(params);
  const showComponentsRef = useRef(showComponents);
  const onParamsChangeRef = useRef(onParamsChange);
  const activeDragRef = useRef<DragTarget | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    showComponentsRef.current = showComponents;
  }, [showComponents]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    renderVectorAdditionScalarScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
      showComponents: showComponentsRef.current,
      activeDrag: activeDragRef.current,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    function nearestDragTarget(): DragTarget | null {
      const layout = createVectorAdditionScalarLayout(p.width, p.height, paramsRef.current);
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
      const layout = createVectorAdditionScalarLayout(p.width, p.height, paramsRef.current);
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
  }, []);

  const redrawKey = `${showComponents ? 1 : 0}|${params.ux}|${params.uy}|${
    params.vx
  }|${params.vy}|${params.scalar}`;
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey },
  );

  return { canvasHostRef };
}
