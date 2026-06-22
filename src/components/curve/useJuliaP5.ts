import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import { JuliaEngine } from '../../curve/modules/julia-set/engine';
import type { ParamValues } from '../../curve/types';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRenderProgress: (pct: number) => void;
  onSmoothCChange: (cx: number, cy: number) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useJuliaP5({
  defaultParams,
  targetParams,
  onRenderProgress,
  onSmoothCChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const onRenderProgressRef = useRef(onRenderProgress);
  const onSmoothCChangeRef = useRef(onSmoothCChange);
  const engineRef = useRef<JuliaEngine | null>(null);

  useEffect(() => {
    onRenderProgressRef.current = onRenderProgress;
  }, [onRenderProgress]);

  useEffect(() => {
    onSmoothCChangeRef.current = onSmoothCChange;
  }, [onSmoothCChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
    engineRef.current?.markInteraction(performance.now());
  }, [targetParams]);

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const draw = useCallback((p: p5) => {
    let engine = engineRef.current;
    if (!engine) {
      engine = new JuliaEngine({
        onRenderProgress: (pct) => onRenderProgressRef.current(pct),
        onSmoothCChange: (cx, cy) => onSmoothCChangeRef.current(cx, cy),
      });
      engineRef.current = engine;
    }

    if (p.pixelDensity() !== 1) {
      p.pixelDensity(1);
      engine.rebuild(p);
    }

    const needsFrame = engine.frame(
      p,
      targetParamsRef.current as {
        autoDrift: number;
        cx: number;
        cy: number;
        maxIter: number;
      },
      p.millis(),
    );
    if (!needsFrame) p.noLoop();
  }, []);
  const extendSketch = useCallback((p: p5) => {
    p.mouseMoved = () => {
      engineRef.current?.markInteraction(p.millis());
      p.loop();
    };
  }, []);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { restartOn: [targetParams] },
  );

  return { canvasHostRef };
}
