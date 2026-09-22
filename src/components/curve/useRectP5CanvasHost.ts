import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';

export type CanvasSize = { width: number; height: number };

type MeasureRect = (host: HTMLElement) => CanvasSize;
type DrawResult = void | { keepLooping: boolean };
type RectP5Options = {
  loop?: boolean;
  redrawKey?: unknown;
  restartOn?: unknown[];
};

export type ExtendSketch = (p: p5, host: HTMLElement) => void;

/**
 * p5 instance 跟 React 元件同壽命。draw / extendSketch / measure 走 ref，
 * 參數變化用 redrawKey（noLoop）或 restartOn（loop），不要靠第二個參數拆掉重建——
 * 那會讓按鈕切換閃空白畫布。
 */
export function useRectP5CanvasHost(
  draw: (p: p5) => DrawResult,
  _deps: unknown[],
  measureRect: MeasureRect,
  extendSketch?: ExtendSketch,
  options: RectP5Options = {},
) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);
  const drawRef = useRef(draw);
  const measureRef = useRef(measureRect);
  const extendSketchRef = useRef(extendSketch);
  const autoStoppedRef = useRef(false);
  const shouldLoopRef = useRef(options.loop ?? true);
  const shouldLoop = options.loop ?? true;
  shouldLoopRef.current = shouldLoop;

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    measureRef.current = measureRect;
  }, [measureRect]);

  useEffect(() => {
    extendSketchRef.current = extendSketch;
    const instance = instanceRef.current;
    const host = canvasHostRef.current;
    if (!instance || !host || !extendSketch || !isP5RendererReady(instance)) return;
    extendSketch(instance, host);
  }, [extendSketch]);

  useEffect(() => {
    if (!shouldLoop) instanceRef.current?.redraw();
  }, [shouldLoop, options.redrawKey]);

  useEffect(() => {
    if (shouldLoop) {
      autoStoppedRef.current = false;
      instanceRef.current?.loop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller supplies restart keys
  }, [shouldLoop, ...(options.restartOn ?? [])]);

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
          if (!shouldLoopRef.current) {
            p.noLoop();
            p.redraw();
          }
        };

        p.draw = () => {
          const looping = shouldLoopRef.current;
          const result = drawRef.current(p);
          if (looping && result?.keepLooping === false) {
            autoStoppedRef.current = true;
            p.noLoop();
            return;
          }
          if (looping) autoStoppedRef.current = false;
        };
        extendSketchRef.current?.(p, host);
      };

      const instance = new P5(sketch, host);
      instanceRef.current = instance;

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!isP5RendererReady(instance)) return;
        const { width, height } = measureRef.current(host);
        instance.resizeCanvas(width, height);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        if (!shouldLoopRef.current) instance.redraw();
        else if (autoStoppedRef.current) instance.redraw();
        else instance.loop();
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        if (instanceRef.current === instance) instanceRef.current = null;
        instance.remove();
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return canvasHostRef;
}
