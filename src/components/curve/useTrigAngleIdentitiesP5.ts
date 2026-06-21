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

type Options = {
  params: TrigAngleIdentitiesParams;
  onAnglesChange: (patch: Partial<Pick<TrigAngleIdentitiesParams, 'alpha' | 'beta'>>) => void;
};

const INITIAL_SMOOTH = {
  alpha: (2 * Math.PI) / 3,
  beta: Math.PI / 6,
  guideMix: 1,
};

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
  }, []);

  const redrawKey = `${params.formulaId}|${params.alpha}|${params.beta}|${
    params.showRadians ? 1 : 0
  }|${params.reverseRead ? 1 : 0}|${params.showGuides ? 1 : 0}`;
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey },
  );

  return { canvasHostRef };
}
