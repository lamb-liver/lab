import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createComplexArithmeticGeometryAnimState,
  stepComplexArithmeticGeometryAnimation,
} from '../../curve/modules/complex-arithmetic-geometry/animation';
import type { ParamValues } from '../../curve/types';
import { renderComplexArithmeticGeometryScene } from '../../systems/rendering/complexArithmeticGeometryRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useComplexArithmeticGeometryP5({
  defaultParams,
  targetParams,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createComplexArithmeticGeometryAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const lastSmoothKeyRef = useRef('');
  const onSmoothParamsChangeRef = useRef(onSmoothParamsChange);

  useEffect(() => {
    onSmoothParamsChangeRef.current = onSmoothParamsChange;
  }, [onSmoothParamsChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepComplexArithmeticGeometryAnimation(
      animRef.current,
      targetParamsRef.current,
    );

    const anim = animRef.current;
    const smoothKey = [
      anim.smoothR1.toFixed(3),
      anim.smoothR2.toFixed(3),
      anim.smoothTheta1.toFixed(3),
      anim.smoothTheta2.toFixed(3),
    ].join(':');

    if (smoothKey !== lastSmoothKeyRef.current) {
      lastSmoothKeyRef.current = smoothKey;
      onSmoothParamsChangeRef.current({
        r1: anim.smoothR1,
        r2: anim.smoothR2,
        theta1: anim.smoothTheta1,
        theta2: anim.smoothTheta2,
      });
    }

    renderComplexArithmeticGeometryScene(p, {
      width: p.width,
      height: p.height,
      r1: anim.params.r1,
      r2: anim.params.r2,
      smoothR1: anim.smoothR1,
      smoothR2: anim.smoothR2,
      smoothTheta1: anim.smoothTheta1,
      smoothTheta2: anim.smoothTheta2,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
