import { useCallback } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

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
  const measureRect = useCallback(
    (host: HTMLElement): CanvasSize => {
      const size = measureSize(host);
      return { width: size, height: size };
    },
    [measureSize],
  );

  return useRectP5CanvasHost(draw, deps, measureRect, undefined, {
    restartOn: options.mode === 'reveal' ? options.restartOn : undefined,
  });
}
