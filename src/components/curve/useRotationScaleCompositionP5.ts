import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createRotationScaleCompositionAnimState,
  stepRotationScaleCompositionAnimation,
} from '../../curve/modules/rotation-scale-composition/animation';
import { REVEAL_SPEED } from '../../curve/modules/rotation-scale-composition';
import type { ParamValues } from '../../curve/types';
import { renderRotationScaleCompositionScene } from '../../systems/rendering/rotationScaleCompositionRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useRotationScaleCompositionP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createRotationScaleCompositionAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const lastRevealPctRef = useRef(-1);
  const lastSmoothKeyRef = useRef('');
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
    animRef.current = stepRotationScaleCompositionAnimation(
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

    const smoothKey = `${anim.currentRotationStepDeg.toFixed(2)}:${anim.currentScaleFactor.toFixed(3)}`;
    if (smoothKey !== lastSmoothKeyRef.current) {
      lastSmoothKeyRef.current = smoothKey;
      onSmoothParamsChangeRef.current({
        rotationStepDeg: anim.currentRotationStepDeg,
        scaleFactor: anim.currentScaleFactor,
        evolutionSpeed: anim.params.evolutionSpeed,
      });
    }

    renderRotationScaleCompositionScene(p, {
      width: p.width,
      height: p.height,
      currentRotationStepDeg: anim.currentRotationStepDeg,
      currentScaleFactor: anim.currentScaleFactor,
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
