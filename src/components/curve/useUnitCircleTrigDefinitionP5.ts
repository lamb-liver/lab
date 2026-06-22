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
const SMOOTH_EPSILON = 0.001;

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
    const params = paramsRef.current;
    const smooth = stepUnitCircleSmoothing(
      smoothRef.current,
      params,
      p.deltaTime,
    );
    smoothRef.current = smooth;

    renderUnitCircleTrigDefinitionScene(p, {
      width: p.width,
      height: p.height,
      params,
      smooth,
    });

    return { keepLooping: !isSmoothSettled(smooth, params) };
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
    { restartOn: [redrawKey] },
  );

  return { canvasHostRef };
}

function isSmoothSettled(
  smooth: UnitCircleSmoothState,
  params: UnitCircleTrigDefinitionParams,
): boolean {
  return (
    Math.abs(smooth.theta - params.theta) <= SMOOTH_EPSILON &&
    Math.abs(smooth.quadrantMix - (params.showQuadrants ? 1 : 0)) <= SMOOTH_EPSILON &&
    Math.abs(smooth.specialMix - (params.showSpecialAngles ? 1 : 0)) <= SMOOTH_EPSILON &&
    Math.abs(smooth.tangentMix - (params.showTangent ? 1 : 0)) <= SMOOTH_EPSILON
  );
}
