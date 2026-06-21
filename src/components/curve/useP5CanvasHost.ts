import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';
import { measureWorkCanvasSize } from '../../curve/canvasSize';

type MeasureSize = (host: HTMLElement) => number;
type P5CanvasHostMode = 'continuous' | 'reveal';
type P5CanvasHostOptions = {
  mode?: P5CanvasHostMode;
  restartOn?: unknown[];
};
type DrawResult = void | { keepLooping: boolean };

export function useP5CanvasHost(
  draw: (p: p5) => DrawResult,
  deps: unknown[],
  measureSize: MeasureSize = measureWorkCanvasSize,
  options: P5CanvasHostOptions = {},
) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef(draw);
  const instanceRef = useRef<p5 | null>(null);
  const modeRef = useRef<P5CanvasHostMode>(options.mode ?? 'continuous');
  const revealLoopingRef = useRef(modeRef.current === 'reveal');

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    modeRef.current = options.mode ?? 'continuous';
  }, [options.mode]);

  useEffect(() => {
    if (modeRef.current !== 'reveal') return;
    revealLoopingRef.current = true;
    instanceRef.current?.loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller supplies restart keys
  }, options.restartOn ?? []);

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

        p.draw = () => {
          const result = drawRef.current(p);
          if (modeRef.current !== 'reveal') return;

          const keepLooping = result?.keepLooping !== false;
          revealLoopingRef.current = keepLooping;
          if (!keepLooping) p.noLoop();
        };
      };

      const instance = new P5(sketch, host);
      instanceRef.current = instance;

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!isP5RendererReady(instance)) return;
        const size = measureSize(host);
        instance.resizeCanvas(size, size);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        if (modeRef.current === 'reveal') {
          if (revealLoopingRef.current) instance.loop();
          else instance.redraw();
        }
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instanceRef.current = null;
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
