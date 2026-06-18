import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { VectorFieldPatternParams } from '../../curve/modules/vector-field-patterns';
import type { Vec2 } from '../../curve/modules/vector-field-patterns/geometry';
import { renderVectorFieldPatternsScene } from '../../systems/rendering/vectorFieldPatternsRender';

type Options = {
  params: VectorFieldPatternParams;
  streamlines: Vec2[][];
};

export function useVectorFieldPatternsP5({ params, streamlines }: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  const streamlinesRef = useRef(streamlines);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    paramsRef.current = params;
    instanceRef.current?.redraw();
  }, [params]);

  useEffect(() => {
    streamlinesRef.current = streamlines;
    instanceRef.current?.redraw();
  }, [streamlines]);

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
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.noLoop();
        };

        p.draw = () => {
          renderVectorFieldPatternsScene(p, {
            width: p.width,
            height: p.height,
            params: paramsRef.current,
            streamlines: streamlinesRef.current,
          });
        };
      };

      const instance = new P5(sketch, host);
      instanceRef.current = instance;

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
        instanceRef.current = null;
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
