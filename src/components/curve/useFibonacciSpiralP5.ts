import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { FIBONACCI_REVEAL_SPEED } from '../../curve/modules/fibonacci-spiral';
import type { ParamValues } from '../../curve/types';
import { renderFibonacciSpiralScene } from '../../systems/rendering/fibonacciSpiralRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

export function useFibonacciSpiralP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const revealRef = useRef(0);
  const lastNRef = useRef(Math.round(defaultParams.n ?? 10));
  const lastRevealPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const n = Math.round(params.n ?? 10);
    if (n !== lastNRef.current) {
      lastNRef.current = n;
      revealRef.current = 0;
    }

    revealRef.current += (1 - revealRef.current) * FIBONACCI_REVEAL_SPEED;
    const pct = Math.min(100, Math.floor(revealRef.current * 100));
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    renderFibonacciSpiralScene(p, {
      width: p.width,
      height: p.height,
      params,
      revealProgress: revealRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
