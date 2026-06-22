import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { frameScale } from '../../curve/modules/animationTiming';
import { EXP_REVEAL_SPEED } from '../../curve/modules/exponential-growth-decay';
import type { ParamValues } from '../../curve/types';
import { renderExponentialGrowthDecayScene } from '../../systems/rendering/exponentialGrowthDecayRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

function paramsKey(params: ParamValues): string {
  return [params.mode, params.logScale, params.tangentMode].join('|');
}

export function useExponentialGrowthDecayP5({
  targetParams,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const revealRef = useRef(1);
  const lastKeyRef = useRef(paramsKey(targetParams));
  const lastRevealPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const key = paramsKey(params);
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      revealRef.current = 0;
    }

    revealRef.current = Math.min(
      1,
      revealRef.current + EXP_REVEAL_SPEED * frameScale(p.deltaTime),
    );

    const pct = Math.floor(revealRef.current * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    renderExponentialGrowthDecayScene(p, {
      width: p.width,
      height: p.height,
      params,
      reveal: revealRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
