import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PASCAL_PRIMES, pascalsTriangleModule } from '../../curve/modules/pascals-triangle';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { usePascalsTriangleP5 } from '../curve/usePascalsTriangleP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function PascalsTriangleCurveRoot({ controlsMountId }: Props) {
  const module = pascalsTriangleModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const { canvasHostRef } = usePascalsTriangleP5({
    targetParams,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams);
  const prime = Math.round(targetParams.prime ?? 2);

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

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

          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div ref={canvasHostRef} className="curve-work-canvas-host work-canvas" aria-label="帕斯卡三角形互動視覺化" />
      {controls}
    </>
  );
}
