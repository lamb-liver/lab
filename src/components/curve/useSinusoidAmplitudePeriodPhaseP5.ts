import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { SinusoidAmplitudePeriodPhaseParams } from '../../curve/modules/sinusoid-amplitude-period-phase';
import { renderSinusoidAmplitudePeriodPhaseScene } from '../../systems/rendering/sinusoidAmplitudePeriodPhaseRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: SinusoidAmplitudePeriodPhaseParams;
};

export function useSinusoidAmplitudePeriodPhaseP5({ params }: Options) {
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const draw = useCallback((p: p5) => {
    renderSinusoidAmplitudePeriodPhaseScene(p, paramsRef.current);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureSquare, undefined, {
    loop: false,
    redrawKey: params,
  });

  return { canvasHostRef };
}

function measureSquare(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}
