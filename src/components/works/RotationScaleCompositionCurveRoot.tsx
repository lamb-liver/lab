import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { rotationScaleCompositionModule } from '../../curve/modules/rotation-scale-composition';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useRotationScaleCompositionP5 } from '../curve/useRotationScaleCompositionP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function RotationScaleCompositionCurveRoot({
  controlsMountId = 'rotation-scale-composition-controls',
}: Props) {
  const module = rotationScaleCompositionModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams(params),
    [],
  );

  const { canvasHostRef } = useRotationScaleCompositionP5({
    defaultParams: module.defaultParams,
    targetParams,
    onRevealPctChange,
    onSmoothParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams,
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
        aria-label="旋轉縮放疊加動畫"
      />
      {controls}
    </>
  );
}
