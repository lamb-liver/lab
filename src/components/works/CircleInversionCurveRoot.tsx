import { useCallback, useState } from 'react';
import { circleInversionModule } from '../../curve/modules/circle-inversion';
import {
  DEFAULT_CIRCLE_INVERSION,
  type CircleInversionParams,
} from '../../curve/modules/circle-inversion/geometry';
import ParamControls from '../curve/ParamControls';
import { useCircleInversionP5 } from '../curve/useCircleInversionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function CircleInversionCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<CircleInversionParams>({ ...DEFAULT_CIRCLE_INVERSION });

  const onChange = useCallback((next: CircleInversionParams) => {
    setParams(next);
  }, []);

  const { canvasHostRef } = useCircleInversionP5({ params, onChange });
  const metadata = circleInversionModule.getMetadata(params);

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="圓反演：直線與圓的像"
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
        <ParamControls
          module={circleInversionModule}
          values={params}
          onChange={(key, value) => setParams((prev) => ({ ...prev, [key]: value }))}
        />
        <div className="curve-work-mode-toggle">
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed="false"
            onClick={() => setParams({ ...DEFAULT_CIRCLE_INVERSION })}
          >
            還原
          </button>
        </div>
      </WorkControlsPortal>
    </>
  );
}
