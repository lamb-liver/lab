import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createAffineTransformPatternAnimState,
  stepAffineTransformPatternAnimation,
} from '../../curve/modules/affine-transform-pattern/animation';
import { REVEAL_SPEED } from '../../curve/modules/affine-transform-pattern';
import type { ParamValues } from '../../curve/types';
import { renderAffineTransformPatternScene } from '../../systems/rendering/affineTransformPatternRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useAffineTransformPatternP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createAffineTransformPatternAnimState(defaultParams));
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
    animRef.current = stepAffineTransformPatternAnimation(
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

    const smoothKey = `${Math.round(anim.currentRotationDeg)}:${Math.round(anim.currentTranslation)}`;
    if (smoothKey !== lastSmoothKeyRef.current) {
      lastSmoothKeyRef.current = smoothKey;
      onSmoothParamsChangeRef.current({
        rotationDeg: anim.currentRotationDeg,
        translation: anim.currentTranslation,
        evolutionSpeed: anim.params.evolutionSpeed,
      });
    }

    renderAffineTransformPatternScene(p, {
      width: p.width,
      height: p.height,
      currentRotationDeg: anim.currentRotationDeg,
      currentTranslation: anim.currentTranslation,
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
