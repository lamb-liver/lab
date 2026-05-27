import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createAffineIfsFractalAnimState,
  stepAffineIfsFractalAnimation,
} from '../../curve/modules/affine-ifs-fractal/animation';
import { REVEAL_SPEED } from '../../curve/modules/affine-ifs-fractal';
import type { ParamValues } from '../../curve/types';
import { renderAffineIfsFractalScene } from '../../systems/rendering/affineIfsFractalRender';
import { useP5CanvasHost } from './useP5CanvasHost';
import { useSmoothParamNotifier } from './useSmoothParamNotifier';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
};

export function useAffineIfsFractalP5({
  defaultParams,
  targetParams,
  onRevealPctChange,
  onSmoothParamsChange,
}: Options) {
  const animRef = useRef(createAffineIfsFractalAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const lastRevealPctRef = useRef(-1);
  const notifySmoothParams = useSmoothParamNotifier(onSmoothParamsChange);
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepAffineIfsFractalAnimation(
      animRef.current,
      targetParamsRef.current,
      () => p.random(1),
      REVEAL_SPEED,
    );

    const anim = animRef.current;
    const pct = Math.floor(anim.revealProgress * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    notifySmoothParams({
        leafBend: anim.currentLeafBend,
        branchHeight: anim.currentBranchHeight,
        generationSpeed: anim.params.generationSpeed,
      });

    renderAffineIfsFractalScene(p, {
      width: p.width,
      height: p.height,
      grains: anim.grains,
      revealProgress: anim.revealProgress,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
