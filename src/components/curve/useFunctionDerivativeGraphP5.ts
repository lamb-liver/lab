import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampX0,
  type FunctionDerivativePreset,
} from '../../curve/modules/function-derivative-graph';
import {
  isFunctionDerivativePointerInPlot,
  renderFunctionDerivativeGraphScene,
  xFromFunctionDerivativePointer,
} from '../../systems/rendering/functionDerivativeGraphRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  preset: FunctionDerivativePreset;
  x0: number;
  showZeros: boolean;
  showMonotonic: boolean;
  onX0Change: (x0: number) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useFunctionDerivativeGraphP5({
  preset,
  x0,
  showZeros,
  showMonotonic,
  onX0Change,
}: Options) {
  const presetRef = useRef(preset);
  const x0Ref = useRef(x0);
  const showZerosRef = useRef(showZeros);
  const showMonotonicRef = useRef(showMonotonic);
  const onX0ChangeRef = useRef(onX0Change);
  const draggingRef = useRef(false);

  useEffect(() => {
    presetRef.current = preset;
    x0Ref.current = clampX0(preset, x0Ref.current);
  }, [preset]);

  useEffect(() => {
    x0Ref.current = x0;
  }, [x0]);

  useEffect(() => {
    showZerosRef.current = showZeros;
  }, [showZeros]);

  useEffect(() => {
    showMonotonicRef.current = showMonotonic;
  }, [showMonotonic]);

  useEffect(() => {
    onX0ChangeRef.current = onX0Change;
  }, [onX0Change]);

  const draw = useCallback((p: p5) => {
    renderFunctionDerivativeGraphScene(p, {
      size: p.width,
      preset: presetRef.current,
      x0: clampX0(presetRef.current, x0Ref.current),
      showZeros: showZerosRef.current,
      showMonotonic: showMonotonicRef.current,
      activeDrag: draggingRef.current,
    });
  }, []);
  const extendSketch = useCallback((p: p5) => {
    const updateDrag = () => {
      if (!draggingRef.current) return;
      const next = xFromFunctionDerivativePointer(
        p.width,
        p.mouseX,
        p.mouseY,
        presetRef.current,
      );
      x0Ref.current = next;
      onX0ChangeRef.current(next);
      p.redraw();
    };

    p.mouseMoved = () => {
      p.cursor(
        isFunctionDerivativePointerInPlot(p.width, p.mouseX, p.mouseY)
          ? 'ew-resize'
          : 'default',
      );
    };

    p.mousePressed = () => {
      if (!isFunctionDerivativePointerInPlot(p.width, p.mouseX, p.mouseY)) {
        return true;
      }
      draggingRef.current = true;
      updateDrag();
      return false;
    };

    p.mouseDragged = () => {
      updateDrag();
      return draggingRef.current ? false : true;
    };

    p.mouseReleased = () => {
      const wasDragging = draggingRef.current;
      draggingRef.current = false;
      if (wasDragging) p.redraw();
      return wasDragging ? false : true;
    };

    p.touchStarted = () => p.mousePressed();
    p.touchMoved = () => p.mouseDragged();
    p.touchEnded = () => p.mouseReleased();
    p.mouseWheel = () => !isFunctionDerivativePointerInPlot(p.width, p.mouseX, p.mouseY);
  }, []);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey: `${preset.id}|${x0}|${showZeros}|${showMonotonic}` },
  );

  return { canvasHostRef };
}
