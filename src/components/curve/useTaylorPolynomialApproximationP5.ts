import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from './p5RendererReady';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampA,
  type TaylorPreset,
} from '../../curve/modules/taylor-polynomial-approximation';
import {
  aFromTaylorPointer,
  isTaylorPointerInPlot,
  renderTaylorPolynomialApproximationScene,
} from '../../systems/rendering/taylorPolynomialApproximationRender';

type Options = {
  preset: TaylorPreset;
  a: number;
  n: number;
  showError: boolean;
  showTerms: boolean;
  onAChange: (a: number) => void;
};

export function useTaylorPolynomialApproximationP5({
  preset,
  a,
  n,
  showError,
  showTerms,
  onAChange,
}: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const presetRef = useRef(preset);
  const aRef = useRef(a);
  const nRef = useRef(n);
  const showErrorRef = useRef(showError);
  const showTermsRef = useRef(showTerms);
  const onAChangeRef = useRef(onAChange);
  const draggingRef = useRef(false);
  const p5Ref = useRef<p5 | null>(null);

  const requestRedraw = () => {
    p5Ref.current?.redraw();
  };

  useEffect(() => {
    presetRef.current = preset;
    aRef.current = clampA(preset, aRef.current);
    requestRedraw();
  }, [preset]);

  useEffect(() => {
    aRef.current = a;
    requestRedraw();
  }, [a]);

  useEffect(() => {
    nRef.current = n;
    requestRedraw();
  }, [n]);

  useEffect(() => {
    showErrorRef.current = showError;
    requestRedraw();
  }, [showError]);

  useEffect(() => {
    showTermsRef.current = showTerms;
    requestRedraw();
  }, [showTerms]);

  useEffect(() => {
    onAChangeRef.current = onAChange;
  }, [onAChange]);

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
          const next = aFromTaylorPointer(p.width, p.mouseX, presetRef.current);
          aRef.current = next;
          onAChangeRef.current(next);
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
          renderTaylorPolynomialApproximationScene(p, {
            size: p.width,
            preset: presetRef.current,
            a: clampA(presetRef.current, aRef.current),
            n: nRef.current,
            showError: showErrorRef.current,
            showTerms: showTermsRef.current,
            activeDrag: draggingRef.current,
          });
        };

        p.mouseMoved = () => {
          p.cursor(isTaylorPointerInPlot(p.width, p.mouseX, p.mouseY) ? 'ew-resize' : 'default');
        };

        p.mousePressed = () => {
          if (!isTaylorPointerInPlot(p.width, p.mouseX, p.mouseY)) {
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

        p.mouseWheel = () => !isTaylorPointerInPlot(p.width, p.mouseX, p.mouseY);
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
