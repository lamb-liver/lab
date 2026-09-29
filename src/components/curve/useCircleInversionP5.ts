import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  moveHandle,
  pickHandle,
  pxToMath,
  type CircleInversionParams,
  type HandleId,
} from '../../curve/modules/circle-inversion/geometry';
import { renderCircleInversion } from '../../systems/rendering/circleInversionRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: CircleInversionParams;
  onChange: (params: CircleInversionParams) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useCircleInversionP5({ params, onChange }: Options) {
  const paramsRef = useRef(params);
  const onChangeRef = useRef(onChange);
  const handleRef = useRef<HandleId | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const draw = useCallback((p: p5) => {
    renderCircleInversion(p, paramsRef.current);
  }, []);

  const extendSketch = useCallback((p: p5, host?: HTMLElement) => {
    const at = () => pxToMath(p.mouseX, p.mouseY, p.width);

    p.mouseMoved = () => {
      if (handleRef.current) return;
      p.cursor(pickHandle(at(), paramsRef.current, p.width) ? 'grab' : 'default');
    };

    p.mousePressed = () => {
      const id = pickHandle(at(), paramsRef.current, p.width);
      if (!id) return true;
      handleRef.current = id;
      p.cursor('grabbing');
      return false;
    };

    p.mouseDragged = () => {
      const id = handleRef.current;
      if (!id) return;
      const next = moveHandle(paramsRef.current, id, at());
      paramsRef.current = next;
      onChangeRef.current(next);
      p.redraw();
    };

    p.mouseReleased = () => {
      handleRef.current = null;
      p.cursor(pickHandle(at(), paramsRef.current, p.width) ? 'grab' : 'default');
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
