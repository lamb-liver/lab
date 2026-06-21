import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { BASE_CANVAS_SIZE } from '../../curve/constants';
import {
  createTangentApproximationAnimState,
  stepTangentApproximationAnimation,
} from '../../curve/modules/tangent-approximation/animation';
import { COLLAPSE_SPEED } from '../../curve/modules/tangent-approximation';
import type { ParamValues } from '../../curve/types';
import { renderTangentApproximationScene } from '../../systems/rendering/tangentApproximationRender';
import { useP5CanvasHost } from './useP5CanvasHost';
import { useSmoothParamNotifier } from './useSmoothParamNotifier';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useTangentApproximationP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(
    createTangentApproximationAnimState(defaultParams, BASE_CANVAS_SIZE),
  );
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
    animRef.current = stepTangentApproximationAnimation(
      animRef.current,
      targetParamsRef.current,
      p.width,
      COLLAPSE_SPEED,
    );

    const anim = animRef.current;
    const pct = Math.floor(anim.collapseProgress * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    notifySmoothParams({ dx: anim.smoothDx });

    renderTangentApproximationScene(p, {
      width: p.width,
      height: p.height,
      waveFrequency: anim.params.waveFrequency,
      time: anim.time,
      smoothDx: anim.smoothDx,
      ghostCurve: anim.ghostCurve,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
