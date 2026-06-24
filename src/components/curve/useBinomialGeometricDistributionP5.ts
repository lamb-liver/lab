import { useCallback, useEffect, useMemo, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type { ParamValues } from '../../curve/types';
import { renderBinomialGeometricDistributionScene } from '../../systems/rendering/binomialGeometricDistributionRender';
import { useRectP5CanvasHost } from './useRectP5CanvasHost';

type Options = {
  targetParams: ParamValues;
};

function measureSquare(host: HTMLElement) {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useBinomialGeometricDistributionP5({ targetParams }: Options) {
  const targetParamsRef = useRef<ParamValues>(targetParams);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    renderBinomialGeometricDistributionScene(p, {
      width: p.width,
      height: p.height,
      params: targetParamsRef.current,
    });
  }, []);

  const redrawKey = useMemo(() => JSON.stringify(targetParams), [targetParams]);
  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureSquare, undefined, {
    loop: false,
    redrawKey,
  });

  return { canvasHostRef };
}
