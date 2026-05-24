import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createLinearTransformGridAnimState,
  stepLinearTransformGridAnimation,
} from '../../curve/modules/linear-transform-grid/animation';
import { REVEAL_SPEED } from '../../curve/modules/linear-transform-grid';
import type { ParamValues } from '../../curve/types';
import { renderLinearTransformGridScene } from '../../systems/rendering/linearTransformGridRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useLinearTransformGridP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createLinearTransformGridAnimState(defaultParams));
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
    animRef.current = stepLinearTransformGridAnimation(
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

    const smoothKey = `${anim.currentShearX.toFixed(2)}:${anim.currentScaleY.toFixed(2)}`;
    if (smoothKey !== lastSmoothKeyRef.current) {
      lastSmoothKeyRef.current = smoothKey;
      onSmoothParamsChangeRef.current({
        shearX: anim.currentShearX,
        scaleY: anim.currentScaleY,
        transformSpeed: anim.params.transformSpeed,
      });
    }

    renderLinearTransformGridScene(p, {
      width: p.width,
      height: p.height,
      currentShearX: anim.currentShearX,
      currentScaleY: anim.currentScaleY,
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
