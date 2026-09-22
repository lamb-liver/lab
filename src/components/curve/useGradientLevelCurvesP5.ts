import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampToScene,
  computeGradientMetrics,
  createPlotLayout,
  toScreen,
  toWorld,
  type GradientLevelCurvesParams,
} from '../../curve/modules/gradient-level-curves/geometry';
import { renderGradientLevelCurvesScene } from '../../systems/rendering/gradientLevelCurvesRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: GradientLevelCurvesParams;
  onParamsChange: (patch: Partial<GradientLevelCurvesParams>) => void;
};

const POINT_HIT_PX = 20;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useGradientLevelCurvesP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const onParamsChangeRef = useRef(onParamsChange);
  const dragRef = useRef(false);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    renderGradientLevelCurvesScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
      dragging: dragRef.current,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    function hitPoint(): boolean {
      const layout = createPlotLayout(p.width, p.height);
      const metrics = computeGradientMetrics(paramsRef.current);
      const screen = toScreen(layout, metrics.point);
      return Math.hypot(p.mouseX - screen.x, p.mouseY - screen.y) <= POINT_HIT_PX;
    }

    function updateDrag(): void {
      if (!dragRef.current) return;
      const layout = createPlotLayout(p.width, p.height);
      const world = toWorld(layout, { x: p.mouseX, y: p.mouseY });
      const next = clampToScene(world.x, world.y);
      onParamsChangeRef.current({ px: next.x, py: next.y });
    }

    p.mouseMoved = () => {
      if (dragRef.current) return;
      p.cursor(hitPoint() ? 'grab' : 'default');
    };

    p.mousePressed = () => {
      dragRef.current = hitPoint();
      if (!dragRef.current) return;
      p.cursor('grabbing');
      updateDrag();
    };

    p.mouseDragged = () => {
      updateDrag();
    };

    p.mouseReleased = () => {
      dragRef.current = false;
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
