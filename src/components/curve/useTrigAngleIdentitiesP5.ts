import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  setCircularTarget,
  stepTrigAngleIdentitiesSmoothing,
  type TrigAngleIdentitiesParams,
} from '../../curve/modules/trig-angle-identities/geometry';
import {
  angleFromDrag,
  pickAngleDrag,
  renderTrigAngleIdentitiesScene,
  type AngleDragKey,
} from '../../systems/rendering/trigAngleIdentitiesRender';

type Options = {
  params: TrigAngleIdentitiesParams;
  onAnglesChange: (patch: Partial<Pick<TrigAngleIdentitiesParams, 'alpha' | 'beta'>>) => void;
};

type P5WithRenderer = p5 & { _renderer?: unknown };

const INITIAL_SMOOTH = {
  alpha: (2 * Math.PI) / 3,
  beta: Math.PI / 6,
  guideMix: 1,
};

export function useTrigAngleIdentitiesP5({ params, onAnglesChange }: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  const smoothRef = useRef({ ...INITIAL_SMOOTH });
  const onAnglesChangeRef = useRef(onAnglesChange);
  const activeDragRef = useRef<AngleDragKey | null>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    paramsRef.current = params;
    instanceRef.current?.redraw();
  }, [params]);

  useEffect(() => {
    onAnglesChangeRef.current = onAnglesChange;
  }, [onAnglesChange]);

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
          const key = activeDragRef.current;
          if (!key) return;

          const angle = angleFromDrag(p.mouseX, p.mouseY, p.width, p.height);
          const current = paramsRef.current[key];
          const next = setCircularTarget(current, angle);

          paramsRef.current = { ...paramsRef.current, [key]: next };
          onAnglesChangeRef.current({ [key]: next });
          p.redraw();
        };

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.noLoop();
        };

        p.draw = () => {
          smoothRef.current = stepTrigAngleIdentitiesSmoothing(
            smoothRef.current,
            paramsRef.current,
            p.deltaTime,
          );

          renderTrigAngleIdentitiesScene(p, {
            width: p.width,
            height: p.height,
            params: paramsRef.current,
            smooth: smoothRef.current,
          });
        };

        p.mouseMoved = () => {
          if (activeDragRef.current) return;
          const hit = pickAngleDrag(
            p.mouseX,
            p.mouseY,
            p.width,
            p.height,
            smoothRef.current.alpha,
            smoothRef.current.beta,
          );
          p.cursor(hit ? 'grab' : 'default');
        };

        p.mousePressed = () => {
          activeDragRef.current = pickAngleDrag(
            p.mouseX,
            p.mouseY,
            p.width,
            p.height,
            smoothRef.current.alpha,
            smoothRef.current.beta,
          );
          if (!activeDragRef.current) return;
          p.cursor('grabbing');
          updateDrag();
        };

        p.mouseDragged = () => {
          updateDrag();
        };

        p.mouseReleased = () => {
          activeDragRef.current = null;
          const hit = pickAngleDrag(
            p.mouseX,
            p.mouseY,
            p.width,
            p.height,
            smoothRef.current.alpha,
            smoothRef.current.beta,
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
