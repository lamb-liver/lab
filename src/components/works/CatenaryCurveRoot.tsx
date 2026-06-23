import { useCallback, useState } from 'react';
import { catenaryModule } from '../../curve/modules/catenary';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useCatenaryP5 } from '../curve/useCatenaryP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function CatenaryCurveRoot({ controlsMountId }: Props) {
  const module = catenaryModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [pullPct, setPullPct] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);

  const onPullPctChange = useCallback((pct: number) => setPullPct(pct), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useCatenaryP5({
    targetParams,
    onPullPctChange,
    onSmoothParamsChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct: pullPct,
    smoothParams,
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
        aria-label="曳物線動畫"
      />
      {controls}
    </>
  );
}
