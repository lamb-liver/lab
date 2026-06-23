import { useCallback, useMemo, useState } from 'react';
import { stepSpirographAnimation } from '../../curve/modules/spirograph/animation';
import {
  spirographModule,
  REVEAL_SPEED,
} from '../../curve/modules/spirograph';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useMorphCurveP5 } from '../curve/useMorphCurveP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function SpirographCurveRoot({ controlsMountId }: Props) {
  const module = spirographModule;
  const sampleStep = module.sampleStep ?? 0.02;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothD, setSmoothD] = useState(module.defaultParams.d);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const smoothSync = useMemo(
    () => [
      {
        pick: (p: ParamValues) => p.d,
        quantize: (v: number) => Math.floor(v * 10),
        onChange: setSmoothD,
      },
    ],
    [],
  );

  const { canvasHostRef, patchTargetParams } = useMorphCurveP5({
    module,
    sampleStep,
    revealSpeed: REVEAL_SPEED,
    stepAnimation: stepSpirographAnimation,
    targetParams,
    defaultParams: module.defaultParams,
    onRevealPctChange,
    smoothSync,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: { ...targetParams, d: smoothD },
  });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <ParamControls
        module={module}
        values={targetParams}
        onChange={(key, value) => {
          setTargetParams(patchTargetParams({ [key]: value }));
        }}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="繁花曲線動畫"
      />
      {controls}
    </>
  );
}
