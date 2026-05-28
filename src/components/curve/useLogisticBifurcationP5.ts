import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { LOGISTIC_REVEAL_SPEED } from '../../curve/modules/logistic-bifurcation';
import type { ParamValues } from '../../curve/types';
import { renderLogisticBifurcationScene } from '../../systems/rendering/logisticBifurcationRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  playing: boolean;
  replayNonce: number;
  onRevealPctChange: (pct: number) => void;
};

export function useLogisticBifurcationP5({
  defaultParams,
  targetParams,
  playing,
  replayNonce,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const playingRef = useRef(playing);
  const revealRef = useRef(0);
  const lastKeyRef = useRef(paramsKey(defaultParams));
  const lastReplayNonceRef = useRef(replayNonce);
  const lastRevealPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    if (replayNonce !== lastReplayNonceRef.current) {
      lastReplayNonceRef.current = replayNonce;
      revealRef.current = 0;
    }
  }, [replayNonce]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const key = paramsKey(params);
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      revealRef.current = 0;
    }

    if (playingRef.current) {
      revealRef.current = Math.min(1, revealRef.current + LOGISTIC_REVEAL_SPEED);
    }

    const pct = Math.floor(revealRef.current * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    renderLogisticBifurcationScene(p, {
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
    (params.r ?? 3.5).toFixed(4),
    (params.x0 ?? 0.2).toFixed(4),
    Math.round(params.mode ?? 3),
    params.showFeig ?? 1,
    params.showCobweb ?? 1,
  ].join('|');
}
