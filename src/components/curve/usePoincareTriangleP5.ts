import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { DiskTriangleParams } from '../../curve/modules/poincare-triangle/geometry';
import { renderPoincareTriangle } from '../../systems/rendering/poincareTriangleRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: DiskTriangleParams;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function usePoincareTriangleP5({ params }: Options) {
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const draw = useCallback((p: p5) => {
    renderPoincareTriangle(p, paramsRef.current);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureSquareCanvas, undefined, {
    loop: false,
    redrawKey: params,
  });

  return { canvasHostRef };
}
