import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import { JuliaEngine } from '../../curve/modules/julia-set/engine';
import type { ParamValues } from '../../curve/types';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRenderProgress: (pct: number) => void;
  onSmoothCChange: (cx: number, cy: number) => void;
};

export function useJuliaP5({
  defaultParams,
  targetParams,
  onRenderProgress,
  onSmoothCChange,
}: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const onRenderProgressRef = useRef(onRenderProgress);
  const onSmoothCChangeRef = useRef(onSmoothCChange);
  const engineRef = useRef<JuliaEngine | null>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    onRenderProgressRef.current = onRenderProgress;
  }, [onRenderProgress]);

  useEffect(() => {
    onSmoothCChangeRef.current = onSmoothCChange;
  }, [onSmoothCChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
    engineRef.current?.markInteraction(performance.now());
    instanceRef.current?.loop();
  }, [targetParams]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const engine = new JuliaEngine({
        onRenderProgress: (pct) => onRenderProgressRef.current(pct),
        onSmoothCChange: (cx, cy) => onSmoothCChangeRef.current(cx, cy),
      });
      engineRef.current = engine;

      const sketch = (p: p5) => {
        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(1);
          engine.rebuild(p);
        };

        p.draw = () => {
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
        };

        p.mouseMoved = () => {
          engine.markInteraction(p.millis());
          p.loop();
        };
      };

      const instance = new P5(sketch, host);
      instanceRef.current = instance;

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!isP5RendererReady(instance)) return;
        const size = measureWorkCanvasSize(host);
        instance.resizeCanvas(size, size);
        instance.pixelDensity(1);
        engine.rebuild(instance);
        engine.markInteraction(performance.now());
        instance.loop();
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instance.remove();
        engine.dispose();
        engineRef.current = null;
        instanceRef.current = null;
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
