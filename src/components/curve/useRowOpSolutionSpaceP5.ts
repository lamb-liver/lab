import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { RowOpParams } from '../../curve/modules/row-op-solution-space/geometry';
import { renderRowOpSolutionSpace } from '../../systems/rendering/rowOpSolutionSpaceRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: RowOpParams;
  locale?: 'en';
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useRowOpSolutionSpaceP5({ params, locale }: Options) {
  const paramsRef = useRef(params);
  const localeRef = useRef(locale);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const draw = useCallback((p: p5) => {
    renderRowOpSolutionSpace(p, paramsRef.current, localeRef.current);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureSquareCanvas, undefined, {
    loop: false,
    redrawKey: `${params.preset}|${params.k}|${locale ?? ''}`,
  });

  return { canvasHostRef };
}
