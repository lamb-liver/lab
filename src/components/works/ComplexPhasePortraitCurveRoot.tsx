import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { complexPhasePortraitModule } from '../../curve/modules/complex-phase-portrait';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useComplexPhasePortraitP5 } from '../curve/useComplexPhasePortraitP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function ComplexPhasePortraitCurveRoot({
  controlsMountId = 'complex-phase-portrait-controls',
}: Props) {
  const module = complexPhasePortraitModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [smoothParams, setSmoothParams] = useState<ParamValues>({
    phase: module.defaultParams.phase,
  });
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useComplexPhasePortraitP5({
    defaultParams: module.defaultParams,
    targetParams,
    onSmoothParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, { smoothParams, revealPct: 100 });

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
        aria-label="相位圖"
      />
      {controls}
    </>
  );
}
