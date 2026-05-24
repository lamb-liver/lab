import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createParabolicReflectionAnimState,
  stepParabolicReflectionAnimation,
} from '../../curve/modules/parabolic-reflection/animation';
import { REVEAL_SPEED } from '../../curve/modules/parabolic-reflection';
import type { ParamValues } from '../../curve/types';
import { renderParabolicReflectionScene } from '../../systems/rendering/parabolicReflectionRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothFocalLengthChange: (focalLength: number) => void;
};

export function useParabolicReflectionP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
  onSmoothFocalLengthChange,
}: Options) {
  const animRef = useRef(createParabolicReflectionAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const lastRevealPctRef = useRef(-1);
  const lastFocalKeyRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const onSmoothFocalLengthChangeRef = useRef(onSmoothFocalLengthChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    onSmoothFocalLengthChangeRef.current = onSmoothFocalLengthChange;
  }, [onSmoothFocalLengthChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepParabolicReflectionAnimation(
      animRef.current,
      targetParamsRef.current,
      REVEAL_SPEED,
    );

    const anim = animRef.current;
    const pct = Math.floor(anim.revealProgress * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    const focalKey = Math.floor(anim.currentFocalLength);
    if (focalKey !== lastFocalKeyRef.current) {
      lastFocalKeyRef.current = focalKey;
      onSmoothFocalLengthChangeRef.current(anim.currentFocalLength);
    }

    renderParabolicReflectionScene(p, {
      width: p.width,
      height: p.height,
      currentFocalLength: anim.currentFocalLength,
      rayCount: Math.round(anim.targetParams.rayCount),
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
