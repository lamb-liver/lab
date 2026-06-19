import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { createMorphPathCache } from '../../curve/morphPathCache';
import { executeMorphDrawFrame } from '../../curve/morphFrame';
import type { MorphAnimStep } from '../../curve/morphFrame';
import type { AnimationState, CurveModule, ParamValues } from '../../curve/types';
import { renderFrame } from '../../systems/rendering/frame';
import { lissajousRenderPreset } from '../../systems/rendering/presets';
import { useP5CanvasHost } from './useP5CanvasHost';

export type { MorphAnimStep };

export type SmoothParamSync = {
  pick: (params: ParamValues) => number;
  quantize: (value: number) => number;
  onChange: (value: number) => void;
};

type Options = {
  module: CurveModule;
  sampleStep: number;
  revealSpeed: number;
  stepAnimation: MorphAnimStep;
  targetParams: ParamValues;
  defaultParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  smoothSync?: SmoothParamSync[];
};

export function useMorphCurveP5({
  module,
  sampleStep,
  revealSpeed,
  stepAnimation,
  targetParams,
  defaultParams,
  onRevealPctChange,
  smoothSync = [],
}: Options) {
  const renderPreset = module.renderPreset ?? lissajousRenderPreset;
  const animRef = useRef<AnimationState>({
    params: { ...defaultParams },
    targetParams: { ...defaultParams },
    revealProgress: 0,
    isComplete: false,
  });
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const pathCacheRef = useRef(createMorphPathCache(module));
  const lastRevealPctRef = useRef(-1);
  const lastSmoothKeysRef = useRef<number[]>(smoothSync.map(() => -1));
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const smoothSyncRef = useRef(smoothSync);
  const stepAnimationRef = useRef(stepAnimation);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  useEffect(() => {
    smoothSyncRef.current = smoothSync;
    lastSmoothKeysRef.current = smoothSync.map(() => -1);
  }, [smoothSync]);

  useEffect(() => {
    stepAnimationRef.current = stepAnimation;
  }, [stepAnimation]);

  // React commit 後的 fallback；slider 應改用 patchTargetParams 同步寫入
  targetParamsRef.current = targetParams;

  /** 同步寫 ref；須搭配 urgent setState（勿用 startTransition 包住） */
  const patchTargetParams = useCallback((patch: Partial<ParamValues>): ParamValues => {
    const next = { ...targetParamsRef.current, ...patch };
    targetParamsRef.current = next;
    return next;
  }, []);

  const draw = useCallback(
    (p: p5) => {
      const frame = executeMorphDrawFrame(
        module,
        pathCacheRef.current,
        animRef.current,
        targetParamsRef.current,
        sampleStep,
        stepAnimationRef.current,
        revealSpeed,
      );
      animRef.current = frame.state;
      const anim = frame.state;
      const points = frame.points;

      const pct = Math.floor(anim.revealProgress * 100);
      if (pct !== lastRevealPctRef.current) {
        lastRevealPctRef.current = pct;
        onRevealPctChangeRef.current(pct);
      }

      smoothSyncRef.current.forEach((sync, i) => {
        const value = sync.pick(anim.params);
        const key = sync.quantize(value);
        if (key !== lastSmoothKeysRef.current[i]) {
          lastSmoothKeysRef.current[i] = key;
          sync.onChange(value);
        }
      });

      renderFrame(
        p,
        {
          width: p.width,
          height: p.height,
          params: anim.params,
          revealProgress: anim.revealProgress,
          points,
        },
        renderPreset,
      );
    },
    [module, sampleStep, revealSpeed, renderPreset],
  );

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  useEffect(
    () => () => {
      pathCacheRef.current.clear();
    },
    [module],
  );

  return { canvasHostRef, animRef, patchTargetParams };
}

/** 從 target + 平滑狀態組 metadata 用 ParamValues */
export function mergeSmoothParams(
  target: ParamValues,
  smooth: Partial<ParamValues>,
): ParamValues {
  return { ...target, ...smooth };
}
