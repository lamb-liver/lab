import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createRiemannSumAnimState,
  stepRiemannSumAnimation,
} from '../../curve/modules/riemann-sum/animation';
import { REVEAL_SPEED } from '../../curve/modules/riemann-sum';
import type { ParamValues } from '../../curve/types';
import { renderRiemannSumScene } from '../../systems/rendering/riemannSumRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useRiemannSumP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createRiemannSumAnimState(defaultParams));
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
    animRef.current = stepRiemannSumAnimation(
      animRef.current,
      targetParamsRef.current,
      REVEAL_SPEED,
    );

    const anim = animRef.current;
    const pct = Math.floor(anim.activeDomain * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    const smoothKey = `${Math.round(anim.currentPartitionCount)}`;
    if (smoothKey !== lastSmoothKeyRef.current) {
      lastSmoothKeyRef.current = smoothKey;
      onSmoothParamsChangeRef.current({
        partitionCount: anim.currentPartitionCount,
        waveFrequency: anim.params.waveFrequency,
        timeSpeed: anim.params.timeSpeed,
      });
    }

    renderRiemannSumScene(p, {
      width: p.width,
      height: p.height,
      currentPartitionCount: anim.currentPartitionCount,
      waveFrequency: anim.params.waveFrequency,
      time: anim.time,
      activeDomain: anim.activeDomain,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
