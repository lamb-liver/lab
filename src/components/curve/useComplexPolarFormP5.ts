import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createComplexPolarFormAnimState,
  stepComplexPolarFormAnimation,
} from '../../curve/modules/complex-polar-form/animation';
import type { ParamValues } from '../../curve/types';
import { renderComplexPolarFormScene } from '../../systems/rendering/complexPolarFormRender';
import { useP5CanvasHost } from './useP5CanvasHost';
import { useSmoothParamNotifier } from './useSmoothParamNotifier';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useComplexPolarFormP5({
  defaultParams,
  targetParams,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createComplexPolarFormAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const notifySmoothParams = useSmoothParamNotifier(onSmoothParamsChange);


  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepComplexPolarFormAnimation(
      animRef.current,
      targetParamsRef.current,
    );

    const anim = animRef.current;
    notifySmoothParams({
        r: anim.smoothR,
        theta: anim.smoothTheta,
      });

    renderComplexPolarFormScene(p, {
      width: p.width,
      height: p.height,
      smoothR: anim.smoothR,
      smoothTheta: anim.smoothTheta,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
