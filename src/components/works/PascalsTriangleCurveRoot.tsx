import { useState } from 'react';
import { PASCAL_PRIMES, pascalsTriangleModule } from '../../curve/modules/pascals-triangle';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { usePascalsTriangleP5 } from '../curve/usePascalsTriangleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function PascalsTriangleCurveRoot({ controlsMountId }: Props) {
  const module = pascalsTriangleModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);

  const { canvasHostRef } = usePascalsTriangleP5({
    targetParams,
  });

  const metadata = module.getMetadata(targetParams);
  const prime = Math.round(targetParams.prime ?? 2);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle" aria-label="模運算素數">
        {PASCAL_PRIMES.map((p) => (
          <button
            key={p}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={prime === p}
            onClick={() => setTargetParams((prev) => ({ ...prev, prime: p }))}
          >
            模 {p}
          </button>
        ))}
      </div>

      <ParamControls
        module={module}
        values={targetParams}
        onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div ref={canvasHostRef} className="curve-work-canvas-host work-canvas" aria-label="帕斯卡三角形互動視覺化" />
      {controls}
    </>
  );
}
