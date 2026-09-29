import { useCallback, useState } from 'react';
import { mandelbrotMapModule } from '../../curve/modules/mandelbrot-map';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useMandelbrotMapP5 } from '../curve/useMandelbrotMapP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function MandelbrotMapCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<ParamValues>({ ...mandelbrotMapModule.defaultParams });

  const onCChange = useCallback((cx: number, cy: number) => {
    setParams((prev) => ({ ...prev, cx, cy }));
  }, []);

  const { canvasHostRef } = useMandelbrotMapP5({ params, onCChange });

  const metadata = mandelbrotMapModule.getMetadata(params);

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="曼德博集合與對應的朱利亞集合"
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
        <ParamControls
          module={mandelbrotMapModule}
          values={params}
          onChange={(key, value) => setParams((prev) => ({ ...prev, [key]: value }))}
        />
      </WorkControlsPortal>
    </>
  );
}
