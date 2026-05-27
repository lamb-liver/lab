import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createCatenaryAnimState,
  stepCatenaryAnimation,
} from '../../curve/modules/catenary/animation';
import { pullingOscillation } from '../../curve/modules/catenary/geometry';
import type { ParamValues } from '../../curve/types';
import { renderCatenaryScene } from '../../systems/rendering/catenaryRender';
import { useP5CanvasHost } from './useP5CanvasHost';
import { useSmoothParamNotifier } from './useSmoothParamNotifier';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onPullPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useCatenaryP5({
  defaultParams,
  targetParams,
  onPullPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createCatenaryAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const lastPullPctRef = useRef(-1);
  const onPullPctChangeRef = useRef(onPullPctChange);
  const notifySmoothParams = useSmoothParamNotifier(onSmoothParamsChange);

  useEffect(() => {
    onPullPctChangeRef.current = onPullPctChange;
  }, [onPullPctChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepCatenaryAnimation(
      animRef.current,
      targetParamsRef.current,
    );

    const anim = animRef.current;
    const pct = Math.round(pullingOscillation(anim.time) * 100);
    if (pct !== lastPullPctRef.current) {
      lastPullPctRef.current = pct;
      onPullPctChangeRef.current(pct);
    }

    notifySmoothParams({
        ropeLength: anim.smoothRopeLength,
        maxT: anim.smoothMaxT,
        timeSpeed: anim.params.timeSpeed,
      });

    renderCatenaryScene(p, {
      width: p.width,
      height: p.height,
      smoothRopeLength: anim.smoothRopeLength,
      smoothMaxT: anim.smoothMaxT,
      time: anim.time,
      ghostUpper: anim.ghostUpper,
      ghostLower: anim.ghostLower,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
