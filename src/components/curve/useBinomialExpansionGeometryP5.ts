import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { modeFromValue, normalizeLen } from '../../curve/modules/binomial-expansion-geometry/geometry';
import type { ParamValues } from '../../curve/types';
import { renderBinomialExpansionGeometryScene } from '../../systems/rendering/binomialExpansionGeometryRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

export function useBinomialExpansionGeometryP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const revealRef = useRef(0);
  const lastPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const a = normalizeLen(params.a);
    const b = normalizeLen(params.b);
    const mode = modeFromValue(params.mode);
    revealRef.current = Math.min(1, revealRef.current + 0.05);
    renderBinomialExpansionGeometryScene(p, {
      width: p.width,
      height: p.height,
      a,
      b,
      mode,
    });
    const pct = Math.floor(revealRef.current * 100);
    if (pct !== lastPctRef.current) {
      lastPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
