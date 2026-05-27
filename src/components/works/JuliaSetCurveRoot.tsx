import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { juliaSetModule } from '../../curve/modules/julia-set';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useJuliaP5 } from '../curve/useJuliaP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function JuliaSetCurveRoot({
  controlsMountId = 'julia-set-controls',
}: Props) {
  const module = juliaSetModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [renderPct, setRenderPct] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>({
    cx: module.defaultParams.cx,
    cy: module.defaultParams.cy,
  });
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRenderProgress = useCallback((pct: number) => setRenderPct(pct), []);
  const onSmoothCChange = useCallback((cx: number, cy: number) => {
    setSmoothParams((prev) => ({ ...prev, cx, cy }));
  }, []);

  const { canvasHostRef } = useJuliaP5({
    defaultParams: module.defaultParams,
    targetParams,
    onRenderProgress,
    onSmoothCChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct: renderPct,
    smoothParams: {
      ...targetParams,
      cx: smoothParams.cx ?? targetParams.cx,
      cy: smoothParams.cy ?? targetParams.cy,
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
        aria-label="朱利亞集合分形"
      />
      {controls}
    </>
  );
}
