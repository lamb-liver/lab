import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { juliaSetModule } from '../../curve/modules/julia-set';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useJuliaP5 } from '../curve/useJuliaP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function JuliaSetCurveRoot({ controlsMountId }: Props) {
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
          <div
            className="curve-work-mode-toggle"
            role="group"
            aria-label="朱利亞集合參數漂移"
          >
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={Math.round(targetParams.autoDrift ?? 0) === 0}
              onClick={() =>
                setTargetParams((prev) => ({ ...prev, autoDrift: 0 }))
              }
            >
              手動 c
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={Math.round(targetParams.autoDrift ?? 0) === 1}
              onClick={() =>
                setTargetParams((prev) => ({ ...prev, autoDrift: 1 }))
              }
            >
              參數漂移
            </button>
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
