import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { deriveBuffonData, generateNeedle } from '../../curve/modules/buffon-needle/geometry';
import type { ParamValues } from '../../curve/types';
import { renderBuffonNeedleScene } from '../../systems/rendering/buffonNeedleRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  resetNonce: number;
  onRevealPctChange: (pct: number) => void;
};

export function useBuffonNeedleP5({ defaultParams, targetParams, resetNonce, onRevealPctChange }: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const resetNonceRef = useRef(resetNonce);
  const stateRef = useRef<{
    needles: ReturnType<typeof generateNeedle>[];
    estimateHistory: Array<number | null>;
    totalThrows: number;
    hitCount: number;
  }>({
    needles: [],
    estimateHistory: [],
    totalThrows: 0,
    hitCount: 0,
  });
  const onRevealPctRef = useRef(onRevealPctChange);
  const lastPctRef = useRef(-1);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);
  useEffect(() => {
    onRevealPctRef.current = onRevealPctChange;
  }, [onRevealPctChange]);
  useEffect(() => {
    resetNonceRef.current = resetNonce;
    stateRef.current = { needles: [], estimateHistory: [], totalThrows: 0, hitCount: 0 };
  }, [resetNonce]);

  const draw = useCallback((p: p5) => {
    const data = deriveBuffonData(targetParamsRef.current);
    const throwsPerFrame = data.speed;
    for (let i = 0; i < throwsPerFrame; i += 1) {
      const needle = generateNeedle(data);
      stateRef.current.needles.push(needle);
      stateRef.current.totalThrows += 1;
      if (needle.hit) stateRef.current.hitCount += 1;
      const est =
        stateRef.current.hitCount > 0
          ? (2 * data.l * stateRef.current.totalThrows) / (data.d * stateRef.current.hitCount)
          : null;
      stateRef.current.estimateHistory.push(est);
      if (stateRef.current.needles.length > 260) stateRef.current.needles.shift();
      if (stateRef.current.estimateHistory.length > 520) stateRef.current.estimateHistory.shift();
    }

    renderBuffonNeedleScene(p, {
      width: p.width,
      height: p.height,
      params: targetParamsRef.current,
      needles: stateRef.current.needles,
      estimateHistory: stateRef.current.estimateHistory,
      totalThrows: stateRef.current.totalThrows,
      hitCount: stateRef.current.hitCount,
    });

    const pct = Math.min(100, Math.floor((stateRef.current.totalThrows / 520) * 100));
    if (pct !== lastPctRef.current) {
      lastPctRef.current = pct;
      onRevealPctRef.current(pct);
    }
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
