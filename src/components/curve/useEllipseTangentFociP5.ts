import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { EllipseTangentParams } from '../../curve/modules/ellipse-tangent-foci/geometry';
import { renderEllipseTangentFoci } from '../../systems/rendering/ellipseTangentFociRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: EllipseTangentParams;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useEllipseTangentFociP5({ params }: Options) {
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const draw = useCallback((p: p5) => {
    renderEllipseTangentFoci(p, paramsRef.current);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureSquareCanvas, undefined, {
    loop: false,
    redrawKey: `${params.e}|${params.tDeg}`,
  });

  return { canvasHostRef };
}
