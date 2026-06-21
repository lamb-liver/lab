import { useCallback, useEffect, useRef } from 'react';
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
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: UnitCircleTrigDefinitionParams;
  onThetaChange: (theta: number) => void;
};

const INITIAL_SMOOTH: UnitCircleSmoothState = {
  theta: Math.PI / 4,
  quadrantMix: 1,
  specialMix: 1,
  tangentMix: 1,
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useUnitCircleTrigDefinitionP5({ params, onThetaChange }: Options) {
  const paramsRef = useRef(params);
  const smoothRef = useRef<UnitCircleSmoothState>({ ...INITIAL_SMOOTH });
  const onThetaChangeRef = useRef(onThetaChange);
  const draggingRef = useRef(false);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onThetaChangeRef.current = onThetaChange;
  }, [onThetaChange]);

  const draw = useCallback((p: p5) => {
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
  }, []);

  const extendSketch = useCallback((p: p5) => {
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
  }, []);

  const redrawKey = `${params.theta}|${params.showRadians ? 1 : 0}|${
    params.showSpecialAngles ? 1 : 0
  }|${params.showQuadrants ? 1 : 0}|${params.showTangent ? 1 : 0}`;
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey },
  );

  return { canvasHostRef };
}
