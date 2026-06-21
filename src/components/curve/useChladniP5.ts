import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createChladniAnimState,
  stepChladniAnimation,
} from '../../curve/modules/chladni-figures/animation';
import { REVEAL_SPEED } from '../../curve/modules/chladni-figures';
import type { Particle } from '../../curve/modules/chladni-figures/geometry';
import type { ParamValues } from '../../curve/types';
import {
  ensureChladniParticles,
  renderChladniScene,
  scatterChladniParticles,
} from '../../systems/rendering/chladniRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothModesChange: (m: number, n: number) => void;
};

export function useChladniP5({
  targetParams,
  onRevealPctChange,
  onSmoothModesChange,
}: Options) {
  const animRef = useRef(createChladniAnimState(targetParams));
  const particlesRef = useRef<Particle[]>([]);
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const lastRevealPctRef = useRef(-1);
  const lastModeKeyRef = useRef('');
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const onSmoothModesChangeRef = useRef(onSmoothModesChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    onSmoothModesChangeRef.current = onSmoothModesChange;
  }, [onSmoothModesChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepChladniAnimation(
      animRef.current,
      targetParamsRef.current,
      REVEAL_SPEED,
      p.deltaTime,
    );

    const anim = animRef.current;
    particlesRef.current = ensureChladniParticles(particlesRef.current, p.width);

    if (anim.resetParticles) {
      scatterChladniParticles(particlesRef.current, p.width);
    }

    const pct = Math.floor(anim.revealProgress * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    const modeKey = `${Math.floor(anim.currentM * 10)}:${Math.floor(anim.currentN * 10)}`;
    if (modeKey !== lastModeKeyRef.current) {
      lastModeKeyRef.current = modeKey;
      onSmoothModesChangeRef.current(anim.currentM, anim.currentN);
    }

    renderChladniScene(p, {
      width: p.width,
      height: p.height,
      currentM: anim.currentM,
      currentN: anim.currentN,
      time: anim.time,
      revealProgress: anim.revealProgress,
      particles: particlesRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
