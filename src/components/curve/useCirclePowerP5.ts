import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { CirclePowerFigure } from '../../systems/rendering/circlePowerRender';
import { renderCirclePower } from '../../systems/rendering/circlePowerRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

export function measureCirclePowerWorkCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function measureCirclePowerExploreCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(280, Math.min(1000, Math.round(host.clientWidth || 640)));
  return { width, height: Math.max(320, Math.round(width * 0.86)) };
}

export function useCirclePowerP5(
  figure: CirclePowerFigure,
  measure: (host: HTMLElement) => CanvasSize,
) {
  const figureRef = useRef(figure);
  const measureFnRef = useRef(measure);

  useEffect(() => {
    figureRef.current = figure;
  }, [figure]);

  useEffect(() => {
    measureFnRef.current = measure;
  }, [measure]);

  const draw = useCallback((p: p5) => {
    renderCirclePower(p, figureRef.current);
  }, []);

  const measureRect = useCallback((host: HTMLElement) => measureFnRef.current(host), []);

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureRect, undefined, {
    loop: false,
    redrawKey: `${figure.kind}:${figure.p}:${figure.thetaDeg}`,
  });

  return { canvasHostRef };
}
