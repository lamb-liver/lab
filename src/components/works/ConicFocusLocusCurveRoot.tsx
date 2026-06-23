import { useCallback, useState } from 'react';
import { conicFocusLocusModule } from '../../curve/modules/conic-focus-locus';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useConicFocusLocusP5 } from '../curve/useConicFocusLocusP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function ConicFocusLocusCurveRoot({ controlsMountId }: Props) {
  const module = conicFocusLocusModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothA, setSmoothA] = useState(module.defaultParams.semiMajorAxis);
  const [smoothE, setSmoothE] = useState(module.defaultParams.eccentricity);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothParamsChange = useCallback((a: number, e: number) => {
    setSmoothA(a);
    setSmoothE(e);
  }, []);

  const { canvasHostRef } = useConicFocusLocusP5({
    targetParams,
    onRevealPctChange,
    onSmoothParamsChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      semiMajorAxis: smoothA,
      eccentricity: smoothE,
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
        aria-label="焦點軌跡動畫"
      />
      {controls}
    </>
  );
}
