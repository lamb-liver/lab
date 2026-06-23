import { useCallback, useState } from 'react';
import { BASIS_OPTIONS } from '../../curve/modules/function-graph-transform/constants';
import {
  DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS,
  functionGraphTransformModule,
  paramsForMetadata,
  type BasisKind,
  type FunctionGraphTransformParams,
} from '../../curve/modules/function-graph-transform';
import ParamControls from '../curve/ParamControls';
import { useFunctionGraphTransformP5 } from '../curve/useFunctionGraphTransformP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function FunctionGraphTransformCurveRoot({ controlsMountId }: Props) {
  const module = functionGraphTransformModule;
  const [params, setParams] = useState<FunctionGraphTransformParams>(
    DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<FunctionGraphTransformParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useFunctionGraphTransformP5({
    params,
    onParamsChange,
  });


  const sliderValues = paramsForMetadata(params);
  const metadata = module.getMetadata(sliderValues, {
    revealPct: 100,
    smoothParams: sliderValues,
  });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
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
    </WorkControlsPortal>
  );

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
