import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { stepHarmonographAnimation } from '../../curve/modules/harmonograph/animation';
import {
  harmonographModule,
  REVEAL_SPEED,
} from '../../curve/modules/harmonograph';
import type { ParamValues } from '../../curve/types';
import DeltaPhaseControl from '../curve/DeltaPhaseControl';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useMorphCurveP5 } from '../curve/useMorphCurveP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function HarmonographCurveRoot({
  controlsMountId = 'harmonograph-curve-controls',
}: Props) {
  const module = harmonographModule;
  const sampleStep = module.sampleStep ?? 0.01;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothDelta, setSmoothDelta] = useState(module.defaultParams.delta);
  const [smoothD, setSmoothD] = useState(module.defaultParams.d);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const smoothSync = useMemo(
    () => [
      {
        pick: (p: ParamValues) => p.delta,
        quantize: (v: number) => Math.floor(v * 50),
        onChange: setSmoothDelta,
      },
      {
        pick: (p: ParamValues) => p.d,
        quantize: (v: number) => Math.floor(v * 1000),
        onChange: setSmoothD,
      },
    ],
    [],
  );

  const { canvasHostRef, patchTargetParams } = useMorphCurveP5({
    module,
    sampleStep,
    revealSpeed: REVEAL_SPEED,
    stepAnimation: stepHarmonographAnimation,
    targetParams,
    defaultParams: module.defaultParams,
    onRevealPctChange,
    smoothSync,
  });

  const commitTarget = useCallback(
    (patch: Partial<ParamValues>) => {
      setTargetParams(patchTargetParams(patch));
    },
    [patchTargetParams],
  );

  const handleDInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // 必須在 handler 同步讀 value；不可在 setState updater 內讀 e.currentTarget
      const d = Number(e.currentTarget.value);
      commitTarget({ d });
    },
    [commitTarget],
  );

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      delta: smoothDelta,
      d: smoothD,
    },
  });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>
          <ParamControls
            module={module}
            values={targetParams}
            onChange={(key, value) => {
              if (key === 'a' || key === 'b') {
                commitTarget({ [key]: value });
              }
            }}
          />
          <DeltaPhaseControl
            moduleId={module.id}
            targetDelta={targetParams.delta}
            displayDelta={smoothDelta}
            onTargetChange={(delta) => commitTarget({ delta })}
          />
          <div className="control-field">
            <label htmlFor={`${module.id}-d`}>阻尼 d</label>
            <div className="range-wrap">
              <input
                id={`${module.id}-d`}
                type="range"
                className="range"
                min={0}
                max={0.05}
                step={0.001}
                value={targetParams.d}
                onChange={handleDInput}
                onInput={handleDInput}
              />
            </div>
          </div>
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
        aria-label="諧振圖動畫"
      />
      {controls}
    </>
  );
}
