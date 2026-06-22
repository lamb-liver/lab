import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  circleLayout,
  pickThetaDrag,
  thetaFromPoint,
  type RadianArcLengthParams,
} from '../../curve/modules/radian-arc-length/geometry';
import { renderRadianArcLengthScene } from '../../systems/rendering/radianArcLengthRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: RadianArcLengthParams;
  onThetaChange: (theta: number) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useRadianArcLengthP5({ params, onThetaChange }: Options) {
  const paramsRef = useRef(params);
  const onThetaChangeRef = useRef(onThetaChange);
  const draggingRef = useRef(false);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onThetaChangeRef.current = onThetaChange;
  }, [onThetaChange]);

  const draw = useCallback((p: p5) => renderRadianArcLengthScene(p, paramsRef.current), []);
  const extendSketch = useCallback((p: p5) => {
    const currentCircle = () => circleLayout(p.width, p.height, paramsRef.current.radiusMode);

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
  }, []);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey: params },
  );

  return { canvasHostRef };
}
