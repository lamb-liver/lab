import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createConicEnvelopeAnimState,
  stepConicEnvelopeAnimation,
} from '../../curve/modules/conic-envelope/animation';
import { REVEAL_SPEED } from '../../curve/modules/conic-envelope';
import type { ParamValues } from '../../curve/types';
import { renderConicEnvelopeScene } from '../../systems/rendering/conicEnvelopeRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothRatioChange: (ratio: number) => void;
};

export function useConicEnvelopeP5({
  targetParams,
  onRevealPctChange,
  onSmoothRatioChange,
}: Options) {
  const animRef = useRef(createConicEnvelopeAnimState(targetParams));
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const lastRevealPctRef = useRef(-1);
  const lastRatioKeyRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const onSmoothRatioChangeRef = useRef(onSmoothRatioChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    onSmoothRatioChangeRef.current = onSmoothRatioChange;
  }, [onSmoothRatioChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepConicEnvelopeAnimation(
      animRef.current,
      targetParamsRef.current,
      REVEAL_SPEED,
      p.deltaTime,
      p.millis(),
    );

    const anim = animRef.current;
    const pct = Math.floor(anim.revealProgress * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    const ratioKey = Math.floor(anim.currentRatio * 100);
    if (ratioKey !== lastRatioKeyRef.current) {
      lastRatioKeyRef.current = ratioKey;
      onSmoothRatioChangeRef.current(anim.currentRatio);
    }

    renderConicEnvelopeScene(p, {
      width: p.width,
      height: p.height,
      lineDensity: Math.round(targetParamsRef.current.lineDensity),
      currentRatio: anim.currentRatio,
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
