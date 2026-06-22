import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import type { ParamValues } from '../../curve/types';
import { SEQUENCE_REVEAL_SPEED } from '../../curve/modules/arithmetic-geometric-sequences';
import { renderArithmeticGeometricSequencesScene } from '../../systems/rendering/arithmeticGeometricSequencesRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

export function useArithmeticGeometricSequencesP5({
  targetParams,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const revealRef = useRef(0);
  const lastParamsKeyRef = useRef(paramsKey(targetParams));
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
    const key = paramsKey(params);
    if (key !== lastParamsKeyRef.current) {
      lastParamsKeyRef.current = key;
      revealRef.current = 0;
    }

    revealRef.current += (1 - revealRef.current) * SEQUENCE_REVEAL_SPEED;
    const pct = Math.min(100, Math.floor(revealRef.current * 100));
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    renderArithmeticGeometricSequencesScene(p, {
      width: p.width,
      height: p.height,
      params,
      revealProgress: revealRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}

function paramsKey(params: ParamValues): string {
  return [
    params.mode,
    params.arithmeticA1,
    params.arithmeticD,
    Math.round(params.arithmeticN ?? 0),
    params.geometricA1,
    params.geometricR,
    Math.round(params.geometricN ?? 0),
  ].join('|');
}
