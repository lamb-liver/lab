import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { BASEL_REVEAL_LERP } from '../../curve/modules/basel-problem';
import type { ParamValues } from '../../curve/types';
import { renderBaselProblemScene } from '../../systems/rendering/baselProblemRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  playing: boolean;
  replayNonce: number;
  onRevealPctChange: (pct: number) => void;
};

export function useBaselProblemP5({
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
    revealRef.current = 0;
  }, [replayNonce]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const key = paramsKey(params);
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      revealRef.current = 0;
    }

    if (playingRef.current) {
      revealRef.current += (1 - revealRef.current) * BASEL_REVEAL_LERP;
    }

    const pct = Math.min(100, Math.floor(revealRef.current * 100));
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    renderBaselProblemScene(p, {
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
    Math.round(params.N ?? 12),
    (params.p ?? 2).toFixed(2),
    Math.round(params.mode ?? 0),
  ].join('|');
}
