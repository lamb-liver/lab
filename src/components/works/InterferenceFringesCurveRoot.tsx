import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { interferenceFringesModule } from '../../curve/modules/interference-fringes';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { mergeSmoothParams } from '../curve/useMorphCurveP5';
import { useInterferenceFringesP5 } from '../curve/useInterferenceFringesP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function InterferenceFringesCurveRoot({
  controlsMountId = 'interference-fringes-controls',
}: Props) {
  const module = interferenceFringesModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothSourceDistance, setSmoothSourceDistance] = useState(
    module.defaultParams.sourceDistance,
  );
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothSourceDistanceChange = useCallback(
    (distance: number) => setSmoothSourceDistance(distance),
    [],
  );

  const { canvasHostRef } = useInterferenceFringesP5({
    defaultParams: module.defaultParams,
    targetParams,
    onRevealPctChange,
    onSmoothSourceDistanceChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: mergeSmoothParams(targetParams, {
      sourceDistance: smoothSourceDistance,
    }),
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
        aria-label="干涉條紋動畫"
      />
      {controls}
    </>
  );
}
