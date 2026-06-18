import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';
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

type Options = {
  preset: FunctionDerivativePreset;
  x0: number;
  showZeros: boolean;
  showMonotonic: boolean;
  onX0Change: (x0: number) => void;
};

export function useFunctionDerivativeGraphP5({
  preset,
  x0,
  showZeros,
  showMonotonic,
  onX0Change,
}: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const presetRef = useRef(preset);
  const x0Ref = useRef(x0);
  const showZerosRef = useRef(showZeros);
  const showMonotonicRef = useRef(showMonotonic);
  const onX0ChangeRef = useRef(onX0Change);
  const draggingRef = useRef(false);
  const p5Ref = useRef<p5 | null>(null);

  const requestRedraw = () => {
    p5Ref.current?.redraw();
  };

  useEffect(() => {
    presetRef.current = preset;
    x0Ref.current = clampX0(preset, x0Ref.current);
    requestRedraw();
  }, [preset]);

  useEffect(() => {
    x0Ref.current = x0;
    requestRedraw();
  }, [x0]);

  useEffect(() => {
    showZerosRef.current = showZeros;
    requestRedraw();
  }, [showZeros]);

  useEffect(() => {
    showMonotonicRef.current = showMonotonic;
    requestRedraw();
  }, [showMonotonic]);

  useEffect(() => {
    onX0ChangeRef.current = onX0Change;
  }, [onX0Change]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
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

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.noLoop();
          p.redraw();
        };

        p.draw = () => {
          renderFunctionDerivativeGraphScene(p, {
            size: p.width,
            preset: presetRef.current,
            x0: clampX0(presetRef.current, x0Ref.current),
            showZeros: showZerosRef.current,
            showMonotonic: showMonotonicRef.current,
            activeDrag: draggingRef.current,
          });
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

        p.touchStarted = () => {
          return p.mousePressed();
        };

        p.touchMoved = () => {
          return p.mouseDragged();
        };

        p.touchEnded = () => {
          return p.mouseReleased();
        };

        p.mouseWheel = () => !isFunctionDerivativePointerInPlot(p.width, p.mouseX, p.mouseY);
      };

      const instance = new P5(sketch, host);
      p5Ref.current = instance;

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
        if (p5Ref.current === instance) p5Ref.current = null;
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
