import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createStandingWaveAnimState,
  stepStandingWaveAnimation,
} from '../../curve/modules/standing-wave/animation';
import { REVEAL_SPEED } from '../../curve/modules/standing-wave';
import type { ParamValues } from '../../curve/types';
import { renderStandingWaveScene } from '../../systems/rendering/standingWaveRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothAmplitudeChange: (amplitude: number) => void;
};

export function useStandingWaveP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
  onSmoothAmplitudeChange,
}: Options) {
  const animRef = useRef(createStandingWaveAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const lastRevealPctRef = useRef(-1);
  const lastAmplitudeKeyRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const onSmoothAmplitudeChangeRef = useRef(onSmoothAmplitudeChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    onSmoothAmplitudeChangeRef.current = onSmoothAmplitudeChange;
  }, [onSmoothAmplitudeChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepStandingWaveAnimation(
      animRef.current,
      targetParamsRef.current,
      REVEAL_SPEED,
    );

    const anim = animRef.current;
    const pct = Math.floor(anim.revealProgress * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    const ampKey = Math.floor(anim.currentAmplitude);
    if (ampKey !== lastAmplitudeKeyRef.current) {
      lastAmplitudeKeyRef.current = ampKey;
      onSmoothAmplitudeChangeRef.current(anim.currentAmplitude);
    }

    renderStandingWaveScene(p, {
      width: p.width,
      height: p.height,
      currentAmplitude: anim.currentAmplitude,
      spatialFrequency: Math.round(anim.params.spatialFrequency),
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
