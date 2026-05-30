import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { equiangularSpiralModule } from '../../curve/modules/equiangular-spiral';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useEquiangularSpiralP5 } from '../curve/useEquiangularSpiralP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function EquiangularSpiralCurveRoot({
  controlsMountId = 'equiangular-spiral-controls',
}: Props) {
  const module = equiangularSpiralModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealTheta, setRevealTheta] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealThetaChange = useCallback((theta: number) => setRevealTheta(theta), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useEquiangularSpiralP5({
    defaultParams: module.defaultParams,
    targetParams,
    onRevealThetaChange,
    onSmoothParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct: 0,
    smoothParams,
    revealTheta,
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
              setTargetParams((prev) => ({ ...prev, [key]: value }));
            }}
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
        aria-label="等角螺線動畫"
      />
      {controls}
    </>
  );
}
