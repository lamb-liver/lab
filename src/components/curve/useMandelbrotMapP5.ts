import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { ParamValues } from '../../curve/types';
import { cFromPixel, insetFrame, mapFrame, pixelFromC } from '../../curve/modules/mandelbrot-map/geometry';
import { renderMandelbrotMap } from '../../systems/rendering/mandelbrotMapRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: ParamValues;
  onCChange: (cx: number, cy: number) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useMandelbrotMapP5({ params, onCChange }: Options) {
  const paramsRef = useRef(params);
  const onCChangeRef = useRef(onCChange);
  const draggingRef = useRef(false);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onCChangeRef.current = onCChange;
  }, [onCChange]);

  const draw = useCallback((p: p5) => {
    const values = paramsRef.current;
    renderMandelbrotMap(
      p,
      { cx: values.cx, cy: values.cy, maxIter: values.maxIter },
      draggingRef.current,
    );
  }, []);

  const extendSketch = useCallback((p: p5, host?: HTMLElement) => {
    const frames = () => ({
      frame: mapFrame(p.width, p.height),
      inset: insetFrame(p.width, p.height),
    });

    const onMarker = () => {
      const { frame } = frames();
      const marker = pixelFromC(paramsRef.current.cx, paramsRef.current.cy, frame);
      return Math.hypot(p.mouseX - marker.x, p.mouseY - marker.y) <= 14;
    };

    const pick = (allowInset: boolean) => {
      const { frame, inset } = frames();
      return cFromPixel(p.mouseX, p.mouseY, frame, inset, allowInset);
    };

    const apply = (allowInset: boolean) => {
      const c = pick(allowInset);
      if (!c) return false;
      paramsRef.current = { ...paramsRef.current, cx: c.cx, cy: c.cy };
      onCChangeRef.current(c.cx, c.cy);
      p.redraw();
      return true;
    };

    p.mouseMoved = () => {
      p.cursor(pick(false) || onMarker() ? 'crosshair' : 'default');
    };

    p.mousePressed = () => {
      const fromMarker = onMarker();
      draggingRef.current = true;
      if (!apply(fromMarker) && !fromMarker) {
        draggingRef.current = false;
        return true;
      }
      return false;
    };

    p.mouseDragged = () => {
      if (!draggingRef.current) return;
      apply(true);
    };

    p.mouseReleased = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      p.redraw();
    };

    wireTouchToMouse(p, host);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureSquareCanvas, extendSketch, {
    loop: false,
    redrawKey: params,
  });

  return { canvasHostRef };
}
