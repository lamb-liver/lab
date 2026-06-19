import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  circleLayout,
  pickThetaDrag,
  thetaFromPoint,
  type RadianArcLengthParams,
} from '../../curve/modules/radian-arc-length/geometry';
import { renderRadianArcLengthScene } from '../../systems/rendering/radianArcLengthRender';
import { isP5RendererReady } from './p5RendererReady';

type Options = {
  params: RadianArcLengthParams;
  onThetaChange: (theta: number) => void;
};

export function useRadianArcLengthP5({ params, onThetaChange }: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  const onThetaChangeRef = useRef(onThetaChange);
  const draggingRef = useRef(false);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    paramsRef.current = params;
    instanceRef.current?.redraw();
  }, [params]);

  useEffect(() => {
    onThetaChangeRef.current = onThetaChange;
  }, [onThetaChange]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
        const currentCircle = () =>
          circleLayout(p.width, p.height, paramsRef.current.radiusMode);

        const updateDrag = () => {
          if (!draggingRef.current) return;
          const theta = thetaFromPoint(
            paramsRef.current.theta,
            p.mouseX,
            p.mouseY,
            currentCircle(),
          );
          paramsRef.current = { ...paramsRef.current, theta };
          onThetaChangeRef.current(theta);
          p.redraw();
        };

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.noLoop();
        };

        p.draw = () => renderRadianArcLengthScene(p, paramsRef.current);

        p.mouseMoved = () => {
          if (draggingRef.current) return;
          p.cursor(pickThetaDrag(p.mouseX, p.mouseY, currentCircle()) ? 'grab' : 'default');
        };

        p.mousePressed = () => {
          if (!pickThetaDrag(p.mouseX, p.mouseY, currentCircle())) return;
          draggingRef.current = true;
          p.cursor('grabbing');
          updateDrag();
        };

        p.mouseDragged = updateDrag;

        p.mouseReleased = () => {
          draggingRef.current = false;
          p.cursor(pickThetaDrag(p.mouseX, p.mouseY, currentCircle()) ? 'grab' : 'default');
          p.redraw();
        };

        p.touchStarted = () => {
          if (!pickThetaDrag(p.mouseX, p.mouseY, currentCircle())) return true;
          draggingRef.current = true;
          updateDrag();
          return false;
        };

        p.touchMoved = () => {
          updateDrag();
          return !draggingRef.current;
        };

        p.touchEnded = () => {
          draggingRef.current = false;
          p.redraw();
          return false;
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
