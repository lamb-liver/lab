import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createInterferenceFringesAnimState,
  stepInterferenceFringesAnimation,
} from '../../curve/modules/interference-fringes/animation';
import { REVEAL_SPEED } from '../../curve/modules/interference-fringes';
import type { ParamValues } from '../../curve/types';
import { renderInterferenceFringesScene } from '../../systems/rendering/interferenceFringeRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothSourceDistanceChange: (distance: number) => void;
};

export function useInterferenceFringesP5({
  targetParams,
  onRevealPctChange,
  onSmoothSourceDistanceChange,
}: Options) {
  const animRef = useRef(createInterferenceFringesAnimState(targetParams));
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const lastRevealPctRef = useRef(-1);
  const lastDistanceKeyRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const onSmoothSourceDistanceChangeRef = useRef(onSmoothSourceDistanceChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    onSmoothSourceDistanceChangeRef.current = onSmoothSourceDistanceChange;
  }, [onSmoothSourceDistanceChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepInterferenceFringesAnimation(
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

    const distanceKey = Math.floor(anim.currentSourceDistance);
    if (distanceKey !== lastDistanceKeyRef.current) {
      lastDistanceKeyRef.current = distanceKey;
      onSmoothSourceDistanceChangeRef.current(anim.currentSourceDistance);
    }

    renderInterferenceFringesScene(p, {
      width: p.width,
      height: p.height,
      currentSourceDistance: anim.currentSourceDistance,
      wavelength: anim.targetParams.wavelength,
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
