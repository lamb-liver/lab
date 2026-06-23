import { useCallback, useState } from 'react';
import { conicEnvelopeModule } from '../../curve/modules/conic-envelope';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useConicEnvelopeP5 } from '../curve/useConicEnvelopeP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function ConicEnvelopeCurveRoot({ controlsMountId }: Props) {
  const module = conicEnvelopeModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothRatio, setSmoothRatio] = useState(module.defaultParams.deformationRatio);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothRatioChange = useCallback((ratio: number) => setSmoothRatio(ratio), []);

  const { canvasHostRef } = useConicEnvelopeP5({
    targetParams,
    onRevealPctChange,
    onSmoothRatioChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      deformationRatio: smoothRatio,
    },
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
        aria-label="二次曲線包絡線動畫"
      />
      {controls}
    </>
  );
}
