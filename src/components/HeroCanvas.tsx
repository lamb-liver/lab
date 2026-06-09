import { useCallback, useRef, useSyncExternalStore } from 'react';
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

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

function measureHeroCanvas(host: HTMLElement) {
  return {
    width: Math.max(MIN_HERO_CANVAS_SIZE, host.clientWidth),
    height: Math.max(MIN_HERO_CANVAS_SIZE, host.clientHeight),
  };
}

function HeroCanvasAnimated() {
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

export default function HeroCanvas() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return null;
  return <HeroCanvasAnimated />;
}
