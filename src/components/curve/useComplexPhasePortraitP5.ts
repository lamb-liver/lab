import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createComplexPhasePortraitAnimState,
  stepComplexPhasePortraitAnimation,
} from '../../curve/modules/complex-phase-portrait/animation';
import { measureComplexPhasePortraitCanvas } from '../../curve/modules/complex-phase-portrait/index';
import { toPhasorSampleParams } from '../../curve/modules/complex-phase-portrait/geometry';
import type { ParamValues } from '../../curve/types';
import { renderComplexPhasePortraitScene } from '../../systems/rendering/complexPhasePortraitRender';
import { useRectP5CanvasHost } from './useRectP5CanvasHost';
import { useSmoothParamNotifier } from './useSmoothParamNotifier';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useComplexPhasePortraitP5({
  defaultParams,
  targetParams,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createComplexPhasePortraitAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const notifySmoothParams = useSmoothParamNotifier({
    getParams: () => targetParamsRef.current,
    onChange: onSmoothParamsChange,
  });


  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    const anim = animRef.current;
    stepComplexPhasePortraitAnimation(anim, targetParamsRef.current);

    const phasor = toPhasorSampleParams(
      anim.params.ampA,
      anim.params.freqB,
      anim.smoothPhase,
    );

    notifySmoothParams({ phase: anim.smoothPhase });

    renderComplexPhasePortraitScene(p, {
      width: p.width,
      height: p.height,
      ampA: anim.params.ampA,
      freqB: phasor.freqB,
      smoothPhase: anim.smoothPhase,
      time: anim.time,
      history: anim.history,
    });
  }, []);

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw],
    measureComplexPhasePortraitCanvas,
  );

  return { canvasHostRef };
}
