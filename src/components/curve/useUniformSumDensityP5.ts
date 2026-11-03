import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { UniformSumParams } from '../../curve/modules/uniform-sum-density/geometry';
import { renderUniformSumDensity } from '../../systems/rendering/uniformSumDensityRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: UniformSumParams;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useUniformSumDensityP5({ params }: Options) {
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const draw = useCallback((p: p5) => {
    renderUniformSumDensity(p, paramsRef.current);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureSquareCanvas, undefined, {
    loop: false,
    redrawKey: `${params.a}|${params.b}`,
  });

  return { canvasHostRef };
}
