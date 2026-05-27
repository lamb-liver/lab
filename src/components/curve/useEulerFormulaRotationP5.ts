import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createEulerFormulaRotationAnimState,
  stepEulerFormulaRotationAnimation,
} from '../../curve/modules/euler-formula-rotation/animation';
import { measureEulerFormulaRotationCanvas } from '../../curve/modules/euler-formula-rotation/index';
import type { ParamValues } from '../../curve/types';
import {
  createTrackBuffer,
  pushTrackValue,
  renderEulerFormulaRotationScene,
} from '../../systems/rendering/eulerFormulaRotationRender';
import { useRectP5CanvasHost } from './useRectP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useEulerFormulaRotationP5({
  defaultParams,
  targetParams,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createEulerFormulaRotationAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const trackRef = useRef(createTrackBuffer());
  const lastSmoothKeyRef = useRef('');
  const onSmoothParamsChangeRef = useRef(onSmoothParamsChange);

  useEffect(() => {
    onSmoothParamsChangeRef.current = onSmoothParamsChange;
  }, [onSmoothParamsChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepEulerFormulaRotationAnimation(
      animRef.current,
      targetParamsRef.current,
    );

    const anim = animRef.current;
    const theta = anim.time * anim.params.frequency + anim.smoothPhase;
    const phasorY = anim.params.amplitude * Math.sin(theta);
    trackRef.current = pushTrackValue(trackRef.current, phasorY);

    const smoothKey = anim.smoothPhase.toFixed(3);
    if (smoothKey !== lastSmoothKeyRef.current) {
      lastSmoothKeyRef.current = smoothKey;
      onSmoothParamsChangeRef.current({ phase: anim.smoothPhase });
    }

    renderEulerFormulaRotationScene(p, {
      width: p.width,
      height: p.height,
      amplitude: anim.params.amplitude,
      frequency: anim.params.frequency,
      smoothPhase: anim.smoothPhase,
      time: anim.time,
      trackValues: trackRef.current,
    });
  }, []);

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw],
    measureEulerFormulaRotationCanvas,
  );

  return { canvasHostRef };
}
