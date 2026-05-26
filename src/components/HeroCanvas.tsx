import { useCallback, useRef } from 'react';
import type p5 from 'p5';
import {
  createRotationScaleCompositionAnimState,
  stepRotationScaleCompositionAnimation,
} from '../curve/modules/rotation-scale-composition/animation';
import {
  REVEAL_SPEED,
  rotationScaleCompositionModule,
} from '../curve/modules/rotation-scale-composition';
import { renderRotationScaleCompositionScene } from '../systems/rendering/rotationScaleCompositionRender';
import { useRectP5CanvasHost } from './curve/useRectP5CanvasHost';

const MIN_HERO_CANVAS_SIZE = 320;
const HERO_PARAMS = {
  ...rotationScaleCompositionModule.defaultParams,
  evolutionSpeed: 0,
};

function measureHeroCanvas(host: HTMLElement) {
  return {
    width: Math.max(MIN_HERO_CANVAS_SIZE, host.clientWidth),
    height: Math.max(MIN_HERO_CANVAS_SIZE, host.clientHeight),
  };
}

export default function HeroCanvas() {
  const animRef = useRef(createRotationScaleCompositionAnimState(HERO_PARAMS));

  const draw = useCallback((p: p5) => {
    animRef.current = stepRotationScaleCompositionAnimation(
      animRef.current,
      HERO_PARAMS,
      REVEAL_SPEED,
    );

    const anim = animRef.current;
    renderRotationScaleCompositionScene(p, {
      width: p.width,
      height: p.height,
      currentRotationStepDeg: anim.currentRotationStepDeg,
      currentScaleFactor: anim.currentScaleFactor,
      time: anim.time,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureHeroCanvas);

  return (
    <div
      ref={canvasHostRef}
      className="hero-canvas-host-inner"
      aria-hidden="true"
    />
  );
}
