import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { standingWaveModule } from '../../curve/modules/standing-wave';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useStandingWaveP5 } from '../curve/useStandingWaveP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function StandingWaveCurveRoot({
  controlsMountId = 'standing-wave-controls',
}: Props) {
  const module = standingWaveModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothAmplitude, setSmoothAmplitude] = useState(module.defaultParams.amplitude);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothAmplitudeChange = useCallback(
    (amplitude: number) => setSmoothAmplitude(amplitude),
    [],
  );

  const { canvasHostRef } = useStandingWaveP5({
    defaultParams: module.defaultParams,
    targetParams,
    onRevealPctChange,
    onSmoothAmplitudeChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: { ...targetParams, amplitude: smoothAmplitude },
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
        aria-label="駐波圖動畫"
      />
      {controls}
    </>
  );
}
