import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  setCircularTarget,
  stepUnitCircleSmoothing,
  type UnitCircleSmoothState,
  type UnitCircleTrigDefinitionParams,
} from '../../curve/modules/unit-circle-trig-definition/geometry';
import {
  pickThetaDrag,
  renderUnitCircleTrigDefinitionScene,
  thetaFromDrag,
} from '../../systems/rendering/unitCircleTrigDefinitionRender';

type Options = {
  params: UnitCircleTrigDefinitionParams;
  onThetaChange: (theta: number) => void;
};

type P5WithRenderer = p5 & { _renderer?: unknown };

const INITIAL_SMOOTH: UnitCircleSmoothState = {
  theta: Math.PI / 4,
  quadrantMix: 1,
  specialMix: 1,
  tangentMix: 1,
};

export function useUnitCircleTrigDefinitionP5({ params, onThetaChange }: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  const smoothRef = useRef<UnitCircleSmoothState>({ ...INITIAL_SMOOTH });
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
        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.noLoop();
        };

        p.draw = () => {
          smoothRef.current = stepUnitCircleSmoothing(
            smoothRef.current,
            paramsRef.current,
            p.deltaTime,
          );

          renderUnitCircleTrigDefinitionScene(p, {
            width: p.width,
            height: p.height,
            params: paramsRef.current,
            smooth: smoothRef.current,
          });
        };

        const updateDrag = () => {
          if (!draggingRef.current) return;
          const angle = thetaFromDrag(p.mouseX, p.mouseY, p.width, p.height);
          const next = setCircularTarget(paramsRef.current.theta, angle);
          paramsRef.current = { ...paramsRef.current, theta: next };
          onThetaChangeRef.current(next);
          p.redraw();
        };

        p.mouseMoved = () => {
          if (draggingRef.current) return;
          const hit = pickThetaDrag(
            p.mouseX,
            p.mouseY,
            p.width,
            p.height,
            smoothRef.current.theta,
          );
          p.cursor(hit ? 'grab' : 'default');
        };

        p.mousePressed = () => {
          const hit = pickThetaDrag(
            p.mouseX,
            p.mouseY,
            p.width,
            p.height,
            smoothRef.current.theta,
          );
          if (!hit) return;
          draggingRef.current = true;
          p.cursor('grabbing');
          updateDrag();
        };

        p.mouseDragged = () => {
          updateDrag();
        };

        p.mouseReleased = () => {
          draggingRef.current = false;
          const hit = pickThetaDrag(
            p.mouseX,
            p.mouseY,
            p.width,
            p.height,
            smoothRef.current.theta,
          );
          p.cursor(hit ? 'grab' : 'default');
          p.redraw();
        };
      };

      const instance = new P5(sketch, host);
      instanceRef.current = instance;

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;
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
