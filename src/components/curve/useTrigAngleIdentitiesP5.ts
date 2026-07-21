import { useCallback, useEffect, useRef } from 'react';
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
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: TrigAngleIdentitiesParams;
  onAnglesChange: (patch: Partial<Pick<TrigAngleIdentitiesParams, 'alpha' | 'beta'>>) => void;
};

const INITIAL_SMOOTH = {
  alpha: (2 * Math.PI) / 3,
  beta: Math.PI / 6,
  guideMix: 1,
};
const SMOOTH_EPSILON = 0.001;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useTrigAngleIdentitiesP5({ params, onAnglesChange }: Options) {
  const paramsRef = useRef(params);
  const smoothRef = useRef({ ...INITIAL_SMOOTH });
  const onAnglesChangeRef = useRef(onAnglesChange);
  const activeDragRef = useRef<AngleDragKey | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onAnglesChangeRef.current = onAnglesChange;
  }, [onAnglesChange]);

  const draw = useCallback((p: p5) => {
    const params = paramsRef.current;
    const smooth = stepTrigAngleIdentitiesSmoothing(
      smoothRef.current,
      params,
      p.deltaTime,
    );
    smoothRef.current = smooth;

    renderTrigAngleIdentitiesScene(p, {
      width: p.width,
      height: p.height,
      params,
      smooth,
    });

    return { keepLooping: !isSmoothSettled(smooth, params) };
  }, []);

  const extendSketch = useCallback((p: p5) => {
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

    wireTouchToMouse(p);
  }, []);

  const redrawKey = `${params.formulaId}|${params.alpha}|${params.beta}|${
    params.showRadians ? 1 : 0
  }|${params.reverseRead ? 1 : 0}|${params.showGuides ? 1 : 0}`;
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { restartOn: [redrawKey] },
  );

  return { canvasHostRef };
}

function isSmoothSettled(
  smooth: typeof INITIAL_SMOOTH,
  params: TrigAngleIdentitiesParams,
): boolean {
  return (
    Math.abs(smooth.alpha - params.alpha) <= SMOOTH_EPSILON &&
    Math.abs(smooth.beta - params.beta) <= SMOOTH_EPSILON &&
    Math.abs(smooth.guideMix - (params.showGuides ? 1 : 0)) <= SMOOTH_EPSILON
  );
}
