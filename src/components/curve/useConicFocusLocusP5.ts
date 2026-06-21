import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createConicFocusLocusAnimState,
  stepConicFocusLocusAnimation,
} from '../../curve/modules/conic-focus-locus/animation';
import { REVEAL_SPEED } from '../../curve/modules/conic-focus-locus';
import type { ParamValues } from '../../curve/types';
import { renderConicFocusLocusScene } from '../../systems/rendering/conicFocusLocusRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (semiMajorAxis: number, eccentricity: number) => void;
};

export function useConicFocusLocusP5({
  targetParams,
  onRevealPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createConicFocusLocusAnimState(targetParams));
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const lastRevealPctRef = useRef(-1);
  const lastParamKeyRef = useRef('');
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const onSmoothParamsChangeRef = useRef(onSmoothParamsChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    onSmoothParamsChangeRef.current = onSmoothParamsChange;
  }, [onSmoothParamsChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepConicFocusLocusAnimation(
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

    const paramKey = `${Math.floor(anim.currentSemiMajorAxis)}:${Math.floor(anim.currentEccentricity * 100)}`;
    if (paramKey !== lastParamKeyRef.current) {
      lastParamKeyRef.current = paramKey;
      onSmoothParamsChangeRef.current(anim.currentSemiMajorAxis, anim.currentEccentricity);
    }

    renderConicFocusLocusScene(p, {
      width: p.width,
      height: p.height,
      currentSemiMajorAxis: anim.currentSemiMajorAxis,
      currentEccentricity: anim.currentEccentricity,
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
