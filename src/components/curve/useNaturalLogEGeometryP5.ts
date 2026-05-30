import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { NAT_LOG_REVEAL_SPEED } from '../../curve/modules/natural-log-e-geometry';
import type { ParamValues } from '../../curve/types';
import { renderNaturalLogEGeometryScene } from '../../systems/rendering/naturalLogEGeometryRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

function paramsKey(params: ParamValues): string {
  return [params.mode, params.riemannMode].join('|');
}

function revealStep(p: p5, speed: number): number {
  const frameScale = Math.max(0, Math.min(3, (p.deltaTime || 1000 / 60) / (1000 / 60)));
  return speed * frameScale;
}

export function useNaturalLogEGeometryP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const revealRef = useRef(1);
  const lastKeyRef = useRef(paramsKey(defaultParams));
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

    revealRef.current = Math.min(1, revealRef.current + revealStep(p, NAT_LOG_REVEAL_SPEED));

    const pct = Math.floor(revealRef.current * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    renderNaturalLogEGeometryScene(p, {
      width: p.width,
      height: p.height,
      params,
      reveal: revealRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
