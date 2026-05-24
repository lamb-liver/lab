import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { stepLissajousAnimation } from '../../curve/modules/lissajous/animation';
import {
  lissajousModule,
  REVEAL_SPEED,
} from '../../curve/modules/lissajous';
import type { ParamValues } from '../../curve/types';
import DeltaPhaseControl from '../curve/DeltaPhaseControl';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { mergeSmoothParams, useMorphCurveP5 } from '../curve/useMorphCurveP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function LissajousCurveRoot({
  controlsMountId = 'lissajous-curve-controls',
}: Props) {
  const module = lissajousModule;
  const sampleStep = module.sampleStep ?? 0.003;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothDelta, setSmoothDelta] = useState(module.defaultParams.delta);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const smoothSync = useMemo(
    () => [
      {
        pick: (p: ParamValues) => p.delta,
        quantize: (v: number) => Math.floor(v * 50),
        onChange: setSmoothDelta,
      },
    ],
    [],
  );

  const { canvasHostRef, patchTargetParams } = useMorphCurveP5({
    module,
    sampleStep,
    revealSpeed: REVEAL_SPEED,
    stepAnimation: stepLissajousAnimation,
    targetParams,
    defaultParams: module.defaultParams,
    onRevealPctChange,
    smoothSync,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: mergeSmoothParams(targetParams, { delta: smoothDelta }),
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
                setTargetParams(patchTargetParams({ [key]: value }));
              }
            }}
          />
          <DeltaPhaseControl
            moduleId={module.id}
            targetDelta={targetParams.delta}
            displayDelta={smoothDelta}
            onTargetChange={(delta) => setTargetParams(patchTargetParams({ delta }))}
          />
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
        aria-label="利薩茹曲線動畫"
      />
      {controls}
    </>
  );
}
