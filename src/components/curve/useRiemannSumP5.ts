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
import { useSmoothParamNotifier } from './useSmoothParamNotifier';

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
  const notifySmoothParams = useSmoothParamNotifier({
    getParams: () => targetParamsRef.current,
    onChange: onSmoothParamsChange,
  });
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

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

    notifySmoothParams({
      partitionCount: anim.currentPartitionCount,
    });

    renderRiemannSumScene(p, {
      width: p.width,
      height: p.height,
      currentPartitionCount: anim.currentPartitionCount,
      waveFrequency: targetParamsRef.current.waveFrequency,
      time: anim.time,
      activeDomain: anim.activeDomain,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
