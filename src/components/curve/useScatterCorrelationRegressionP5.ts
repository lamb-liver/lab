import { useCallback, useRef, type MutableRefObject } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  SCATTER_PLOT,
  canvasToWorld,
  hitPlot,
  screenToScatterView,
  worldToCanvas,
  type ScatterPoint,
} from '../../curve/modules/scatter-correlation-regression/geometry';
import type { ParamValues } from '../../curve/types';
import { renderScatterCorrelationRegressionScene } from '../../systems/rendering/scatterCorrelationRegressionRender';
import { useRectP5CanvasHost } from './useRectP5CanvasHost';

export type ScatterCorrelationWorkState = {
  params: ParamValues;
  points: ScatterPoint[];
  selectedIndex: number;
  showMeanAxes: boolean;
  showResiduals: boolean;
};

type Options = {
  stateRef: MutableRefObject<ScatterCorrelationWorkState>;
  onStateChange: () => void;
  redrawKey: number;
};

function measureSquare(host: HTMLElement) {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useScatterCorrelationRegressionP5({
  stateRef,
  onStateChange,
  redrawKey,
}: Options) {
  const dragIndexRef = useRef<number | null>(null);

  const draw = useCallback((p: p5) => {
    const state = stateRef.current;
    renderScatterCorrelationRegressionScene(p, {
      width: p.width,
      height: p.height,
      points: state.points,
      selectedIndex: state.selectedIndex,
      showMeanAxes: state.showMeanAxes,
      showResiduals: state.showResiduals,
    });
  }, [stateRef]);

  const extendSketch = useCallback((p: p5) => {
    p.mousePressed = () => {
      const state = stateRef.current;
      const mouse = screenToScatterView(p.width, p.height, p.mouseX, p.mouseY);
      const index = nearestPoint(state.points, mouse.x, mouse.y);
      state.selectedIndex = index;
      dragIndexRef.current = index >= 0 ? index : null;
      onStateChange();
      return false;
    };

    p.mouseDragged = () => {
      const index = dragIndexRef.current;
      if (index === null) return false;
      const mouse = screenToScatterView(p.width, p.height, p.mouseX, p.mouseY);
      stateRef.current.points[index] = canvasToWorld(SCATTER_PLOT, mouse.x, mouse.y);
      onStateChange();
      return false;
    };

    p.mouseReleased = () => {
      dragIndexRef.current = null;
      return false;
    };

    p.doubleClicked = () => {
      const state = stateRef.current;
      const mouse = screenToScatterView(p.width, p.height, p.mouseX, p.mouseY);
      if (!hitPlot(SCATTER_PLOT, mouse.x, mouse.y)) return false;

      const index = nearestPoint(state.points, mouse.x, mouse.y);
      if (index >= 0 && state.points.length > 3) {
        state.points.splice(index, 1);
        state.params.n = state.points.length;
        state.selectedIndex = -1;
      } else {
        state.points.push(canvasToWorld(SCATTER_PLOT, mouse.x, mouse.y));
        state.params.n = state.points.length;
        state.selectedIndex = state.points.length - 1;
      }

      onStateChange();
      return false;
    };
  }, [onStateChange, stateRef]);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureSquare, extendSketch, {
    loop: false,
    redrawKey,
  });
  return { canvasHostRef };
}

function nearestPoint(points: ScatterPoint[], x: number, y: number): number {
  let best = -1;
  let bestD = Infinity;

  points.forEach((point, i) => {
    const screen = worldToCanvas(SCATTER_PLOT, point.x, point.y);
    const d = Math.hypot(x - screen.x, y - screen.y);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });

  return bestD <= 16 ? best : -1;
}
