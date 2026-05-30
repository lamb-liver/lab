import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createEquiangularSpiralAnimState,
  stepEquiangularSpiralAnimation,
} from '../../curve/modules/equiangular-spiral/animation';
import type { ParamValues } from '../../curve/types';
import { renderEquiangularSpiralScene } from '../../systems/rendering/equiangularSpiralRender';
import { useP5CanvasHost } from './useP5CanvasHost';
import { useSmoothParamNotifier } from './useSmoothParamNotifier';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealThetaChange: (theta: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useEquiangularSpiralP5({
  defaultParams,
  targetParams,
  onRevealThetaChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createEquiangularSpiralAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const lastRevealRef = useRef(-1);
  const onRevealThetaChangeRef = useRef(onRevealThetaChange);
  const notifySmoothParams = useSmoothParamNotifier({
    getParams: () => targetParamsRef.current,
    onChange: onSmoothParamsChange,
  });

  useEffect(() => {
    onRevealThetaChangeRef.current = onRevealThetaChange;
  }, [onRevealThetaChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepEquiangularSpiralAnimation(
      animRef.current,
      targetParamsRef.current,
    );

    const anim = animRef.current;
    const revealRounded = Math.round(anim.revealTheta * 100) / 100;
    if (revealRounded !== lastRevealRef.current) {
      lastRevealRef.current = revealRounded;
      onRevealThetaChangeRef.current(anim.revealTheta);
    }

    notifySmoothParams({
        growthB: anim.smoothGrowthB,
        maxTheta: anim.smoothMaxTheta,
        rotationSpeed: anim.params.rotationSpeed,
      });

    renderEquiangularSpiralScene(p, {
      width: p.width,
      height: p.height,
      smoothGrowthB: anim.smoothGrowthB,
      smoothMaxTheta: anim.smoothMaxTheta,
      time: anim.time,
      ghostPath: anim.ghostPath,
      activePath: anim.activePath,
      headPoint: anim.headPoint,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
