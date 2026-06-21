import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { parabolicReflectionModule } from '../../curve/modules/parabolic-reflection';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useParabolicReflectionP5 } from '../curve/useParabolicReflectionP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function ParabolicReflectionCurveRoot({
  controlsMountId = 'parabolic-reflection-controls',
}: Props) {
  const module = parabolicReflectionModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothFocalLength, setSmoothFocalLength] = useState(
    module.defaultParams.focalLength,
  );
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothFocalLengthChange = useCallback(
    (focalLength: number) => setSmoothFocalLength(focalLength),
    [],
  );

  const { canvasHostRef } = useParabolicReflectionP5({
    defaultParams: module.defaultParams,
    targetParams,
    onRevealPctChange,
    onSmoothFocalLengthChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      focalLength: smoothFocalLength,
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
        aria-label="拋物線反射動畫"
      />
      {controls}
    </>
  );
}
