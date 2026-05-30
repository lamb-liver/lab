import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createLogisticCurveAnimState,
  resetLogisticCurveAnimState,
  stepLogisticCurveAnimation,
} from '../../curve/modules/logistic-curve/animation';
import type { ParamValues } from '../../curve/types';
import { renderLogisticCurveScene } from '../../systems/rendering/logisticCurveRender';
import { useP5CanvasHost } from './useP5CanvasHost';
import { useSmoothParamNotifier } from './useSmoothParamNotifier';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  resetNonce: number;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useLogisticCurveP5({
  defaultParams,
  targetParams,
  resetNonce,
  onRevealPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createLogisticCurveAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const lastResetNonceRef = useRef(resetNonce);
  const lastRevealPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const notifySmoothParams = useSmoothParamNotifier({
    getParams: () => targetParamsRef.current,
    onChange: onSmoothParamsChange,
  });

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    if (resetNonce !== lastResetNonceRef.current) {
      lastResetNonceRef.current = resetNonce;
      animRef.current = resetLogisticCurveAnimState(targetParamsRef.current);
    }
  }, [resetNonce]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepLogisticCurveAnimation(
      animRef.current,
      targetParamsRef.current,
      p.deltaTime,
      p.millis(),
    );

    const anim = animRef.current;
    const params = targetParamsRef.current;

    const pct = Math.floor(anim.reveal * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    notifySmoothParams({
      L: anim.smooth.L,
      k: anim.smooth.k,
      a: anim.smooth.a,
      showDyDt: params.showDyDt,
      showExpCompare: params.showExpCompare,
    });

    renderLogisticCurveScene(p, {
      width: p.width,
      height: p.height,
      smooth: anim.smooth,
      reveal: anim.reveal,
      showDyDt: (params.showDyDt ?? 1) !== 0,
      showExpCompare: (params.showExpCompare ?? 1) !== 0,
    });
  }, [notifySmoothParams]);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
