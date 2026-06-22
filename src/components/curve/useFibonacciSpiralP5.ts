import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { FIBONACCI_REVEAL_SPEED } from '../../curve/modules/fibonacci-spiral';
import type { ParamValues } from '../../curve/types';
import { renderFibonacciSpiralScene } from '../../systems/rendering/fibonacciSpiralRender';
import { useP5CanvasHost } from './useP5CanvasHost';

const FIBONACCI_REVEAL_COMPLETE_EPSILON = 0.001;

type Options = {
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

export function useFibonacciSpiralP5({
  targetParams,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const revealRef = useRef(0);
  const lastNRef = useRef(Math.round(targetParams.n ?? 10));
  const lastRevealPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const restartKey = Math.round(targetParams.n ?? 10);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const n = Math.round(params.n ?? 10);
    if (n !== lastNRef.current) {
      lastNRef.current = n;
      revealRef.current = 0;
    }

    revealRef.current += (1 - revealRef.current) * FIBONACCI_REVEAL_SPEED;
    if (1 - revealRef.current <= FIBONACCI_REVEAL_COMPLETE_EPSILON) {
      revealRef.current = 1;
    }
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

    return { keepLooping: revealRef.current < 1 };
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw], undefined, {
    mode: 'reveal',
    restartOn: [restartKey],
  });

  return { canvasHostRef };
}
