import { useCallback, useState } from 'react';
import { parabolicReflectionModule } from '../../curve/modules/parabolic-reflection';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useParabolicReflectionP5 } from '../curve/useParabolicReflectionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function ParabolicReflectionCurveRoot({ controlsMountId }: Props) {
  const module = parabolicReflectionModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothFocalLength, setSmoothFocalLength] = useState(
    module.defaultParams.focalLength,
  );

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothFocalLengthChange = useCallback(
    (focalLength: number) => setSmoothFocalLength(focalLength),
    [],
  );

  const { canvasHostRef } = useParabolicReflectionP5({
    targetParams,
    onRevealPctChange,
    onSmoothFocalLengthChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      focalLength: smoothFocalLength,
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
        aria-label="拋物線反射動畫"
      />
      {controls}
    </>
  );
}
