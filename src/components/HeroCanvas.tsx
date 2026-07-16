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

// Static stand-in for prefers-reduced-motion: the same rotation-scale motif
// as the animated hero, drawn once as SVG — same footprint, no p5, no motion.
function HeroCanvasStatic() {
  const squares = Array.from({ length: 7 }, (_, i) => {
    const scale = 0.92 ** i;
    const rotation = i * 9;
    const half = 150 * scale;
    return (
      <rect
        key={i}
        x={-half}
        y={-half}
        width={half * 2}
        height={half * 2}
        transform={`rotate(${rotation})`}
        fill="none"
        stroke="var(--color-accent, #d4b87a)"
        strokeWidth={1.2}
        opacity={0.16 + i * 0.09}
      />
    );
  });

  return (
    <div className="hero-canvas-host-inner hero-canvas-static" aria-hidden="true">
      <svg viewBox="-300 -200 600 400" preserveAspectRatio="xMidYMid slice" role="presentation">
        <g>{squares}</g>
      </svg>
    </div>
  );
}

export default function HeroCanvas() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <HeroCanvasStatic />;
  return <HeroCanvasAnimated />;
}
