import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type {
  RationalAsymptoteParams,
  RationalAsymptotePreset,
} from '../../curve/modules/rational-vertical-horizontal-asymptotes';
import { renderRationalVerticalHorizontalAsymptotesScene } from '../../systems/rendering/rationalVerticalHorizontalAsymptotesRender';

type Options = {
  preset: RationalAsymptotePreset;
  params: RationalAsymptoteParams;
  showAsymptotes: boolean;
  showHoles: boolean;
  showLocal: boolean;
  advanced: boolean;
};

export function useRationalVerticalHorizontalAsymptotesP5({
  preset,
  params,
  showAsymptotes,
  showHoles,
  showLocal,
  advanced,
}: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const presetRef = useRef(preset);
  const paramsRef = useRef(params);
  const showAsymptotesRef = useRef(showAsymptotes);
  const showHolesRef = useRef(showHoles);
  const showLocalRef = useRef(showLocal);
  const advancedRef = useRef(advanced);
  const p5Ref = useRef<p5 | null>(null);

  const requestRedraw = () => {
    p5Ref.current?.redraw();
  };

  useEffect(() => {
    presetRef.current = preset;
    requestRedraw();
  }, [preset]);

  useEffect(() => {
    paramsRef.current = params;
    requestRedraw();
  }, [params]);

  useEffect(() => {
    showAsymptotesRef.current = showAsymptotes;
    requestRedraw();
  }, [showAsymptotes]);

  useEffect(() => {
    showHolesRef.current = showHoles;
    requestRedraw();
  }, [showHoles]);

  useEffect(() => {
    showLocalRef.current = showLocal;
    requestRedraw();
  }, [showLocal]);

  useEffect(() => {
    advancedRef.current = advanced;
    requestRedraw();
  }, [advanced]);

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
          p.redraw();
        };

        p.draw = () => {
          renderRationalVerticalHorizontalAsymptotesScene(p, {
            size: p.width,
            preset: presetRef.current,
            params: paramsRef.current,
            showAsymptotes: showAsymptotesRef.current,
            showHoles: showHolesRef.current,
            showLocal: showLocalRef.current,
            advanced: advancedRef.current,
          });
        };

        p.mouseWheel = () => true;
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
