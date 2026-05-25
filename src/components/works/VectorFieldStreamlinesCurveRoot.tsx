import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { vectorFieldStreamlinesModule } from '../../curve/modules/vector-field-streamlines';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useVectorFieldStreamlinesP5 } from '../curve/useVectorFieldStreamlinesP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function VectorFieldStreamlinesCurveRoot({
  controlsMountId = 'vector-field-streamlines-controls',
}: Props) {
  const module = vectorFieldStreamlinesModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const { canvasHostRef } = useVectorFieldStreamlinesP5({
    defaultParams: module.defaultParams,
    targetParams,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams);

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
        aria-label="向量場流線動畫"
      />
      {controls}
    </>
  );
}
