import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { buffonNeedleModule } from '../../curve/modules/buffon-needle';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useBuffonNeedleP5 } from '../curve/useBuffonNeedleP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId?: string };

export default function BuffonNeedleCurveRoot({ controlsMountId = 'buffon-needle-controls' }: Props) {
  const module = buffonNeedleModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useBuffonNeedleP5({
    defaultParams: module.defaultParams,
    targetParams,
    resetNonce,
    onRevealPctChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, { revealPct, smoothParams: targetParams });

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
              setResetNonce((prev) => prev + 1);
            }}
          />

          <div className="curve-work-mode-toggle" aria-label="experiment control">
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setResetNonce((prev) => prev + 1)}>
              reset
            </button>
          </div>

          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div ref={canvasHostRef} className="curve-work-canvas-host work-canvas" aria-label="蒲豐投針互動視覺化" />
      {controls}
    </>
  );
}
