import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BASIS_OPTIONS } from '../../curve/modules/function-graph-transform/constants';
import {
  DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS,
  functionGraphTransformModule,
  paramsForMetadata,
  type BasisKind,
  type FunctionGraphTransformParams,
} from '../../curve/modules/function-graph-transform';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useFunctionGraphTransformP5 } from '../curve/useFunctionGraphTransformP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function FunctionGraphTransformCurveRoot({ controlsMountId }: Props) {
  const module = functionGraphTransformModule;
  const [params, setParams] = useState<FunctionGraphTransformParams>(
    DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS,
  );
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onParamsChange = useCallback((patch: Partial<FunctionGraphTransformParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useFunctionGraphTransformP5({
    params,
    onParamsChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const sliderValues = paramsForMetadata(params);
  const metadata = module.getMetadata(sliderValues, {
    revealPct: 100,
    smoothParams: sliderValues,
  });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <p className="curve-work-controls__formula">基底 f(x)</p>
          <div
            className="curve-work-mode-toggle"
            style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
          >
            {BASIS_OPTIONS.map((basis) => (
              <button
                key={basis.id}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={params.basis === basis.id}
                onClick={() => onParamsChange({ basis: basis.id as BasisKind })}
              >
                {basis.label}
              </button>
            ))}
          </div>

          <ParamControls
            module={module}
            values={sliderValues}
            onChange={(key, value) => {
              if (key === 'a' || key === 'b' || key === 'h' || key === 'k') {
                onParamsChange({ [key]: value });
              }
            }}
          />

          <div className="curve-work-mode-toggle">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.advanced}
              onClick={() => onParamsChange({ advanced: !params.advanced })}
            >
              {params.advanced ? '進階 guide：開' : '進階 guide：關'}
            </button>
          </div>

          <p className="curve-work-controls__formula">也可在圖上拖動 P 控制點</p>
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
        aria-label="函數圖形變換"
      />
      {controls}
    </>
  );
}
