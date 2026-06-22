import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { conicEnvelopeModule } from '../../curve/modules/conic-envelope';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useConicEnvelopeP5 } from '../curve/useConicEnvelopeP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function ConicEnvelopeCurveRoot({ controlsMountId }: Props) {
  const module = conicEnvelopeModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothRatio, setSmoothRatio] = useState(module.defaultParams.deformationRatio);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothRatioChange = useCallback((ratio: number) => setSmoothRatio(ratio), []);

  const { canvasHostRef } = useConicEnvelopeP5({
    targetParams,
    onRevealPctChange,
    onSmoothRatioChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      deformationRatio: smoothRatio,
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
        aria-label="二次曲線包絡線動畫"
      />
      {controls}
    </>
  );
}
