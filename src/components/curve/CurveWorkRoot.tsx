import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type p5 from 'p5';
import { createInitialState, stepAnimation } from '../../curve/animation';
import { createCurveCache } from '../../curve/cache';
import type { AnimationState, CurveModule, ParamKey, ParamValues } from '../../curve/types';
import { renderFrame } from '../../systems/rendering/frame';
import { lissajousRenderPreset } from '../../systems/rendering/presets';
import { useSmoothParamNotifier } from './useSmoothParamNotifier';
import ParamControls from './ParamControls';
import StatsPanel from './StatsPanel';
import { useP5CanvasHost } from './useP5CanvasHost';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  module: CurveModule;
  controlsMountId?: string;
  canvasAriaLabel?: string;
};

function paramsSnapshot(p: ParamValues): string {
  return JSON.stringify(p);
}

export default function CurveWorkRoot({
  module,
  controlsMountId = 'curve-work-controls',
  canvasAriaLabel = '曲線動畫',
}: Props) {
  const sampleStep = module.sampleStep ?? 0.006;
  const animConfig = module.animation ?? { lerp: 0.08, revealSpeed: 0.0024 };
  const renderPreset = module.renderPreset ?? lissajousRenderPreset;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const animRef = useRef<AnimationState>(createInitialState(module.defaultParams));
  const targetParamsRef = useRef<ParamValues>(module.defaultParams);
  const lastRevealPctRef = useRef(-1);
  const notifySmoothParams = useSmoothParamNotifier({
    getParams: () => targetParamsRef.current,
    onChange: (partial) => {
      setSmoothParams((prev) => ({ ...prev, ...partial }));
    },
  });
  const lastCachedTargetRef = useRef(paramsSnapshot(module.defaultParams));
  const cacheRef = useRef(createCurveCache(module));

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  useEffect(() => {
    targetParamsRef.current = targetParams;
    const snap = paramsSnapshot(targetParams);
    if (snap !== lastCachedTargetRef.current) {
      cacheRef.current.rebuildForTarget(targetParams, sampleStep);
      lastCachedTargetRef.current = snap;
    }
  }, [targetParams, sampleStep]);

  useEffect(() => {
    cacheRef.current.rebuildForTarget(module.defaultParams, sampleStep);
    return () => cacheRef.current.clear();
  }, [module, sampleStep]);

  const draw = useCallback(
    (p: p5) => {
      animRef.current = stepAnimation(
        animRef.current,
        targetParamsRef.current,
        animConfig.lerp,
        animConfig.revealSpeed,
        ['k'],
      );

      const anim = animRef.current;
      const points = cacheRef.current.getDisplayPoints(anim.params, sampleStep);

      const pct = Math.floor(anim.revealProgress * 100);
      if (pct !== lastRevealPctRef.current) {
        lastRevealPctRef.current = pct;
        setRevealPct(pct);
      }

      notifySmoothParams(anim.params);

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
    [module, sampleStep, animConfig.lerp, animConfig.revealSpeed, renderPreset],
  );

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  const setParam = (key: ParamKey, value: number) => {
    setTargetParams((prev) => ({ ...prev, [key]: value }));
  };

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams,
  });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>
          <ParamControls module={module} values={targetParams} onChange={setParam} />
          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={canvasAriaLabel}
      />
      {controls}
    </>
  );
}
