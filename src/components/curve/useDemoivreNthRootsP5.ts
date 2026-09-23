import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampRadius,
  computeDemoivreMetrics,
  createPlotLayout,
  toScreen,
  toWorld,
  type DemoivreNthRootsParams,
} from '../../curve/modules/demoivre-nth-roots/geometry';
import { renderDemoivreNthRootsScene } from '../../systems/rendering/demoivreNthRootsRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: DemoivreNthRootsParams;
  onParamsChange: (patch: Partial<DemoivreNthRootsParams>) => void;
};

const POINT_HIT_PX = 22;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useDemoivreNthRootsP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const onParamsChangeRef = useRef(onParamsChange);
  const dragRef = useRef(false);
  const dragLayoutRadiusRef = useRef<number | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    const metrics = computeDemoivreMetrics(paramsRef.current);
    renderDemoivreNthRootsScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
      dragging: dragRef.current,
      layoutRadius: dragLayoutRadiusRef.current ?? metrics.viewportRadius,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    function layoutRadius(): number {
      if (dragLayoutRadiusRef.current != null) return dragLayoutRadiusRef.current;
      return computeDemoivreMetrics(paramsRef.current).viewportRadius;
    }

    function hitPoint(): boolean {
      const metrics = computeDemoivreMetrics(paramsRef.current);
      const layout = createPlotLayout(p.width, p.height, layoutRadius());
      const screen = toScreen(layout, metrics.z);
      return Math.hypot(p.mouseX - screen.x, p.mouseY - screen.y) <= POINT_HIT_PX;
    }

    function updateDrag(): void {
      if (!dragRef.current) return;
      const layout = createPlotLayout(p.width, p.height, layoutRadius());
      const world = toWorld(layout, { x: p.mouseX, y: p.mouseY });
      const next = clampRadius(world.re, world.im);
      onParamsChangeRef.current({ re: next.re, im: next.im });
    }

    p.mouseMoved = () => {
      if (dragRef.current) return;
      p.cursor(hitPoint() ? 'grab' : 'default');
    };
    p.mousePressed = () => {
      dragRef.current = hitPoint();
      if (!dragRef.current) return true;
      dragLayoutRadiusRef.current = computeDemoivreMetrics(paramsRef.current).viewportRadius;
      p.cursor('grabbing');
      updateDrag();
      return false;
    };
    p.mouseDragged = () => {
      updateDrag();
    };
    p.mouseReleased = () => {
      dragRef.current = false;
      dragLayoutRadiusRef.current = null;
      p.cursor(hitPoint() ? 'grab' : 'default');
    };
    wireTouchToMouse(p);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
  );

  return { canvasHostRef };
}
