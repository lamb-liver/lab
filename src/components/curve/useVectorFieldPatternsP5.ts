import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { VectorFieldPatternParams } from '../../curve/modules/vector-field-patterns';
import type { Vec2 } from '../../curve/modules/vector-field-patterns/geometry';
import { renderVectorFieldPatternsScene } from '../../systems/rendering/vectorFieldPatternsRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: VectorFieldPatternParams;
  streamlines: Vec2[][];
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useVectorFieldPatternsP5({ params, streamlines }: Options) {
  const paramsRef = useRef(params);
  const streamlinesRef = useRef(streamlines);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    streamlinesRef.current = streamlines;
  }, [streamlines]);

  const draw = useCallback((p: p5) => {
    renderVectorFieldPatternsScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
      streamlines: streamlinesRef.current,
    });
  }, []);

  const redrawKey = `${params.pattern}|${params.density}|${params.normalized ? 1 : 0}|${
    params.showStreamlines ? 1 : 0
  }|${streamlines.length}`;
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw],
    measureSquareCanvas,
    undefined,
    { loop: false, redrawKey },
  );

  return { canvasHostRef };
}
