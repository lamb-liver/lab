import { useCallback, useState } from 'react';
import { standingWaveModule } from '../../curve/modules/standing-wave';
import ParamControls from '../curve/ParamControls';
import { useStandingWaveP5 } from '../curve/useStandingWaveP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
};

export default function StandingWaveCurveRoot({ controlsMountId }: Props) {
  const module = standingWaveModule;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothAmplitude, setSmoothAmplitude] = useState(module.defaultParams.amplitude);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothAmplitudeChange = useCallback(
    (amplitude: number) => setSmoothAmplitude(amplitude),
    [],
  );

  const { canvasHostRef } = useStandingWaveP5({
    targetParams,
    onRevealPctChange,
    onSmoothAmplitudeChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: { ...targetParams, amplitude: smoothAmplitude },
  });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <ParamControls
        module={module}
        values={targetParams}
        onChange={(key, value) => {
          setTargetParams((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </WorkControlsPortal>
  );

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
