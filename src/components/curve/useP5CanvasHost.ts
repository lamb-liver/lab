import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';

type MeasureSize = (host: HTMLElement) => number;

/** 共用 p5 instance 生命週期：setup、ResizeObserver、cleanup */
export function useP5CanvasHost(
  draw: (p: p5) => void,
  deps: unknown[],
  measureSize: MeasureSize = measureWorkCanvasSize,
) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef(draw);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

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
          const size = measureSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => drawRef.current(p);
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        const size = measureSize(host);
        instance.resizeCanvas(size, size);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      });
      ro.observe(host);

      cleanup = () => {
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
