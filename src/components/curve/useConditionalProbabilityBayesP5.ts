import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { modeFromValue } from '../../curve/modules/conditional-probability-bayes/geometry';
import type { ParamValues } from '../../curve/types';
import { renderConditionalProbabilityBayesScene } from '../../systems/rendering/conditionalProbabilityBayesRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
};

export function useConditionalProbabilityBayesP5({
  targetParams,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const revealRef = useRef(0);
  const lastKeyRef = useRef(JSON.stringify(targetParams));

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const key = `${Math.round(params.mode ?? 0)}|${Math.round(params.scenario ?? 0)}|${Math.round(params.pA ?? 1)}|${Math.round(params.pBgA ?? 95)}|${Math.round(params.pBgNotA ?? 5)}`;
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      revealRef.current = 0;
    }
    revealRef.current = Math.min(1, revealRef.current + 0.025);
    renderConditionalProbabilityBayesScene(p, {
      width: p.width,
      height: p.height,
      params,
      mode: modeFromValue(params.mode),
      reveal: revealRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
