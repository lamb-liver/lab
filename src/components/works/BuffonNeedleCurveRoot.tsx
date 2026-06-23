import { useState } from 'react';
import { buffonNeedleModule } from '../../curve/modules/buffon-needle';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBuffonNeedleP5 } from '../curve/useBuffonNeedleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string };

export default function BuffonNeedleCurveRoot({ controlsMountId }: Props) {
  const module = buffonNeedleModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [resetNonce, setResetNonce] = useState(0);

  const { canvasHostRef } = useBuffonNeedleP5({
    targetParams,
    resetNonce,
  });

  const metadata = module.getMetadata(targetParams);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <ParamControls
        module={module}
        values={targetParams}
        onChange={(key, value) => {
          setTargetParams((prev) => ({ ...prev, [key]: value }));
          setResetNonce((prev) => prev + 1);
        }}
      />

      <div className="curve-work-mode-toggle" aria-label="實驗控制">
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setResetNonce((prev) => prev + 1)}>
          重設
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div ref={canvasHostRef} className="curve-work-canvas-host work-canvas" aria-label="蒲豐投針互動視覺化" />
      {controls}
    </>
  );
}
