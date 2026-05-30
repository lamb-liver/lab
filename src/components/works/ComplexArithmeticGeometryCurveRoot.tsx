import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { complexArithmeticGeometryModule } from '../../curve/modules/complex-arithmetic-geometry';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useComplexArithmeticGeometryP5 } from '../curve/useComplexArithmeticGeometryP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

export default function ComplexArithmeticGeometryCurveRoot({
  controlsMountId = 'complex-arithmetic-geometry-controls',
}: Props) {
  const module = complexArithmeticGeometryModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useComplexArithmeticGeometryP5({
    defaultParams: module.defaultParams,
    targetParams,
    onSmoothParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, { smoothParams, revealPct: 100 });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>
          <ParamControls
            module={module}
            values={targetParams}
            onChange={(key, value) => {
              setTargetParams((prev) => ({ ...prev, [key]: value }));
            }}
          />
          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="複數四則運算幾何動畫"
      />
      {controls}
    </>
  );
}
