import { useCallback, useState } from 'react';
import { interferenceFringesModule } from '../../curve/modules/interference-fringes';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useInterferenceFringesP5 } from '../curve/useInterferenceFringesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function InterferenceFringesCurveRoot({ controlsMountId }: Props) {
  const module = interferenceFringesModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothSourceDistance, setSmoothSourceDistance] = useState(
    module.defaultParams.sourceDistance,
  );

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothSourceDistanceChange = useCallback(
    (distance: number) => setSmoothSourceDistance(distance),
    [],
  );

  const { canvasHostRef } = useInterferenceFringesP5({
    targetParams,
    onRevealPctChange,
    onSmoothSourceDistanceChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      sourceDistance: smoothSourceDistance,
    },
  });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <ParamControls
        module={module}
        values={targetParams}
        onChange={(key, value) => {
          setTargetParams((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="干涉條紋動畫"
      />
      {controls}
    </>
  );
}
