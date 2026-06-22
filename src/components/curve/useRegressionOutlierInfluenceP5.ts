import { useCallback, useRef, type MutableRefObject } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  SCATTER_PLOT,
  canvasToWorld,
  screenToScatterView,
  worldToCanvas,
  type ScatterPoint,
} from '../../curve/modules/scatter-correlation-regression/geometry';
import { renderRegressionOutlierInfluenceScene } from '../../systems/rendering/regressionOutlierInfluenceRender';
import { useRectP5CanvasHost } from './useRectP5CanvasHost';

export type RegressionOutlierInfluenceWorkState = {
  outlier: ScatterPoint;
  dragging: boolean;
  showLeverage: boolean;
  showResidual: boolean;
  showMean: boolean;
};

type Options = {
  stateRef: MutableRefObject<RegressionOutlierInfluenceWorkState>;
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

export function useRegressionOutlierInfluenceP5({
  stateRef,
  onStateChange,
  redrawKey,
}: Options) {
  const draggingRef = useRef(false);

  const draw = useCallback((p: p5) => {
    const state = stateRef.current;
    renderRegressionOutlierInfluenceScene(p, {
      width: p.width,
      height: p.height,
      outlier: state.outlier,
      dragging: state.dragging,
      showLeverage: state.showLeverage,
      showResidual: state.showResidual,
      showMean: state.showMean,
    });
  }, [stateRef]);

  const extendSketch = useCallback((p: p5, host: HTMLElement) => {
    p.mousePressed = (event?: Event) => {
      if (!isCanvasPointer(p, host, event)) return;
      const mouse = screenToScatterView(p.width, p.height, p.mouseX, p.mouseY);
      const outlier = stateRef.current.outlier;
      const point = worldToCanvas(SCATTER_PLOT, outlier.x, outlier.y);
      draggingRef.current = Math.hypot(mouse.x - point.x, mouse.y - point.y) <= 24;
      stateRef.current.dragging = draggingRef.current;
      onStateChange();
      return false;
    };

    p.mouseDragged = () => {
      if (!draggingRef.current) return;
      const mouse = screenToScatterView(p.width, p.height, p.mouseX, p.mouseY);
      stateRef.current.outlier = canvasToWorld(SCATTER_PLOT, mouse.x, mouse.y);
      onStateChange();
      return false;
    };

    p.mouseReleased = () => {
      if (!draggingRef.current && !stateRef.current.dragging) return;
      draggingRef.current = false;
      stateRef.current.dragging = false;
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
