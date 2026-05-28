import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { modeFromValue } from '../../curve/modules/conditional-probability-bayes/geometry';
import type { ParamValues } from '../../curve/types';
import { renderConditionalProbabilityBayesScene } from '../../systems/rendering/conditionalProbabilityBayesRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

export function useConditionalProbabilityBayesP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const revealRef = useRef(0);
  const lastKeyRef = useRef(JSON.stringify(defaultParams));
  const lastPctRef = useRef(-1);
  const onRevealPctRef = useRef(onRevealPctChange);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);
  useEffect(() => {
    onRevealPctRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

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
    const pct = Math.floor(revealRef.current * 100);
    if (pct !== lastPctRef.current) {
      lastPctRef.current = pct;
      onRevealPctRef.current(pct);
    }
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
