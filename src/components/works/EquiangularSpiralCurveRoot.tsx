import { useCallback, useState } from 'react';
import { equiangularSpiralModule } from '../../curve/modules/equiangular-spiral';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useEquiangularSpiralP5 } from '../curve/useEquiangularSpiralP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function EquiangularSpiralCurveRoot({ controlsMountId }: Props) {
  const module = equiangularSpiralModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealTheta, setRevealTheta] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);

  const onRevealThetaChange = useCallback((theta: number) => setRevealTheta(theta), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useEquiangularSpiralP5({
    targetParams,
    onRevealThetaChange,
    onSmoothParamsChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct: 0,
    smoothParams,
    revealTheta,
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
        aria-label="等角螺線動畫"
      />
      {controls}
    </>
  );
}
