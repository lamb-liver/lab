import { useState } from 'react';
import { poincareTriangleModule } from '../../curve/modules/poincare-triangle';
import {
  DEFAULT_DISK_TRIANGLE_PARAMS,
  R_MAX,
  R_MIN,
  type DiskTriangleParams,
} from '../../curve/modules/poincare-triangle/geometry';
import { usePoincareTriangleP5 } from '../curve/usePoincareTriangleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function PoincareTriangleCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<DiskTriangleParams>({ ...DEFAULT_DISK_TRIANGLE_PARAMS });
  const { canvasHostRef } = usePoincareTriangleP5({ params });
  const metadata = poincareTriangleModule.getMetadata(params);

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="圓盤上的三角形：三邊垂直碰到外圓"
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
        <div className="control-field">
          <label htmlFor="poincare-triangle-r">
            <span>離圓心</span>
            <span className="control-field__value">{params.r.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="poincare-triangle-r"
              type="range"
              className="range"
              min={R_MIN}
              max={R_MAX}
              step={0.01}
              value={params.r}
              onInput={(event) => {
                const r = Number(event.currentTarget.value);
                setParams({ r });
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
