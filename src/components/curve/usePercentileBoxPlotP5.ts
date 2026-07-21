import { useCallback, useRef, type MutableRefObject } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  BOXPLOT_PLOT,
  canvasToValue,
  hitPlot,
  screenToBoxplotView,
  sortedValuesWithIndex,
  valueToCanvas,
} from '../../curve/modules/percentile-box-plot/geometry';
import type { ParamValues } from '../../curve/types';
import { renderPercentileBoxPlotScene } from '../../systems/rendering/percentileBoxPlotRender';
import { useRectP5CanvasHost } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

export type PercentileBoxPlotWorkState = {
  params: ParamValues;
  values: number[];
  selectedIndex: number;
  showPercentiles: boolean;
  showSortedRanks: boolean;
};

type Options = {
  stateRef: MutableRefObject<PercentileBoxPlotWorkState>;
  onStateChange: () => void;
  redrawKey: number;
};

function measureSquare(host: HTMLElement) {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

function isCanvasPointer(p: p5, host: HTMLElement, event?: Event): boolean {
  const target = event?.target;
  if (target instanceof HTMLCanvasElement) return host.contains(target);
  return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
}

export function usePercentileBoxPlotP5({ stateRef, onStateChange, redrawKey }: Options) {
  const dragIndexRef = useRef<number | null>(null);

  const draw = useCallback((p: p5) => {
    const state = stateRef.current;
    renderPercentileBoxPlotScene(p, {
      width: p.width,
      height: p.height,
      values: state.values,
      fenceK: state.params.fenceK ?? 1.5,
      selectedIndex: state.selectedIndex,
      showPercentiles: state.showPercentiles,
      showSortedRanks: state.showSortedRanks,
    });
  }, [stateRef]);

  const extendSketch = useCallback((p: p5, host: HTMLElement) => {
    p.mousePressed = (event?: Event) => {
      if (!isCanvasPointer(p, host, event)) return;
      const state = stateRef.current;
      const mouse = screenToBoxplotView(p.width, p.height, p.mouseX, p.mouseY);
      const index = nearestValueDot(state.values, mouse.x, mouse.y);
      state.selectedIndex = index;
      dragIndexRef.current = index >= 0 ? index : null;
      onStateChange();
      return false;
    };

    p.mouseDragged = () => {
      const index = dragIndexRef.current;
      if (index === null) return;
      const mouse = screenToBoxplotView(p.width, p.height, p.mouseX, p.mouseY);
      stateRef.current.values[index] = canvasToValue(BOXPLOT_PLOT, mouse.x);
      onStateChange();
      return false;
    };

    p.mouseReleased = () => {
      if (dragIndexRef.current === null) return;
      dragIndexRef.current = null;
      onStateChange();
      return false;
    };

    wireTouchToMouse(p);

    p.doubleClicked = (event?: Event) => {
      if (!isCanvasPointer(p, host, event)) return;
      const state = stateRef.current;
      const mouse = screenToBoxplotView(p.width, p.height, p.mouseX, p.mouseY);
      if (!hitPlot(BOXPLOT_PLOT, mouse.x, mouse.y)) return;

      const index = nearestValueDot(state.values, mouse.x, mouse.y);
      if (index >= 0 && state.values.length > 5) {
        state.values.splice(index, 1);
        state.selectedIndex = -1;
      } else if (index < 0 && state.values.length < 28) {
        state.values.push(canvasToValue(BOXPLOT_PLOT, mouse.x));
        state.selectedIndex = state.values.length - 1;
      }

      state.params.n = state.values.length;
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

function nearestValueDot(values: number[], x: number, y: number): number {
  const axisY = BOXPLOT_PLOT.y + BOXPLOT_PLOT.h * 0.73;
  let best = -1;
  let bestD = Infinity;

  sortedValuesWithIndex(values).forEach((item, rank) => {
    const dotX = valueToCanvas(BOXPLOT_PLOT, item.value);
    const dotY = axisY - 22 + (rank % 3) * 13;
    const d = Math.hypot(x - dotX, y - dotY);
    if (d < bestD) {
      bestD = d;
      best = item.index;
    }
  });

  return bestD <= 17 ? best : -1;
}
