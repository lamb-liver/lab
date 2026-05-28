import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { deriveBinormalData, modeFromValue } from '../../curve/modules/binomial-to-normal/geometry';
import type { ParamValues } from '../../curve/types';
import { renderBinomialToNormalScene } from '../../systems/rendering/binomialToNormalRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  runNonce: number;
  resetNonce: number;
  onRevealPctChange: (pct: number) => void;
};

export function useBinomialToNormalP5({
  defaultParams,
  targetParams,
  runNonce,
  resetNonce,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const runNonceRef = useRef(runNonce);
  const resetNonceRef = useRef(resetNonce);
  const revealRef = useRef(0);
  const lastKeyRef = useRef(JSON.stringify(defaultParams));
  const lastPctRef = useRef(-1);
  const onRevealPctRef = useRef(onRevealPctChange);
  const trialRef = useRef<{ sequence: number[]; index: number; clock: number; success: number }>({
    sequence: [],
    index: 0,
    clock: 0,
    success: 0,
  });

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);
  useEffect(() => {
    onRevealPctRef.current = onRevealPctChange;
  }, [onRevealPctChange]);
  useEffect(() => {
    runNonceRef.current = runNonce;
    const data = deriveBinormalData(targetParamsRef.current);
    const sequence: number[] = [];
    for (let i = 0; i < data.n; i += 1) sequence.push(Math.random() < data.p ? 1 : 0);
    trialRef.current = { sequence, index: 0, clock: 0, success: 0 };
    revealRef.current = 0;
  }, [runNonce]);
  useEffect(() => {
    resetNonceRef.current = resetNonce;
    trialRef.current = { sequence: [], index: 0, clock: 0, success: 0 };
    revealRef.current = 0;
  }, [resetNonce]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const key = `${Math.round(params.mode ?? 0)}|${Math.round(params.n ?? 24)}|${Math.round(params.p ?? 50)}`;
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      revealRef.current = 0;
      trialRef.current = { sequence: [], index: 0, clock: 0, success: 0 };
    }
    revealRef.current = Math.min(1, revealRef.current + 0.025);
    const mode = modeFromValue(params.mode);
    if (mode === 'sim' && trialRef.current.sequence.length > 0 && trialRef.current.index < trialRef.current.sequence.length) {
      trialRef.current.clock += p.deltaTime;
      if (trialRef.current.clock > 90) {
        trialRef.current.success += trialRef.current.sequence[trialRef.current.index] ?? 0;
        trialRef.current.index += 1;
        trialRef.current.clock = 0;
      }
    }

    renderBinomialToNormalScene(p, {
      width: p.width,
      height: p.height,
      params,
      mode,
      reveal: revealRef.current,
      trialSequence: trialRef.current.sequence,
      trialIndex: trialRef.current.index,
      successCount: trialRef.current.success,
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
