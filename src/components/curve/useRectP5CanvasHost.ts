import { useEffect, useRef } from 'react';
import type p5 from 'p5';

export type CanvasSize = { width: number; height: number };

type MeasureRect = (host: HTMLElement) => CanvasSize;
type P5WithRenderer = p5 & { _renderer?: unknown };

export type ExtendSketch = (p: p5, host: HTMLElement) => void;

/** 矩形 p5 instance：setup、ResizeObserver、cleanup */
export function useRectP5CanvasHost(
  draw: (p: p5) => void,
  deps: unknown[],
  measureRect: MeasureRect,
  extendSketch?: ExtendSketch,
) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef(draw);
  const measureRef = useRef(measureRect);
  const extendSketchRef = useRef(extendSketch);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    measureRef.current = measureRect;
  }, [measureRect]);

  useEffect(() => {
    extendSketchRef.current = extendSketch;
  }, [extendSketch]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
        p.setup = () => {
          const { width, height } = measureRef.current(host);
          p.createCanvas(width, height);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => drawRef.current(p);
        extendSketchRef.current?.(p, host);
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;
        const { width, height } = measureRef.current(host);
        instance.resizeCanvas(width, height);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instance.remove();
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls sketch deps
  }, deps);

  return canvasHostRef;
}
