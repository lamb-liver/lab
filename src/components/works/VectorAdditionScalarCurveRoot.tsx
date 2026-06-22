import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS,
  vectorAdditionScalarModule,
  type VectorAdditionScalarParams,
} from '../../curve/modules/vector-addition-scalar';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useVectorAdditionScalarP5 } from '../curve/useVectorAdditionScalarP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function VectorAdditionScalarCurveRoot({ controlsMountId }: Props) {
  const module = vectorAdditionScalarModule;
  const [params, setParams] = useState<VectorAdditionScalarParams>(
    DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS,
  );
  const [showComponents, setShowComponents] = useState(true);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onParamsChange = useCallback((patch: Partial<VectorAdditionScalarParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useVectorAdditionScalarP5({
    params,
    showComponents,
    onParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(params as ParamValues);

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>
          <ParamControls
            module={module}
            values={params}
            onChange={(key, value) => {
              setParams((prev) => ({ ...prev, [key]: value }));
            }}
          />
          <div className="curve-work-mode-toggle">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={showComponents}
              onClick={() => setShowComponents((prev) => !prev)}
            >
              分量線
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed="false"
              onClick={() => {
                setParams(DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS);
                setShowComponents(true);
              }}
            >
              重設
            </button>
          </div>
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
        aria-label="向量的加法與純量乘法互動"
      />
      {controls}
    </>
  );
}
