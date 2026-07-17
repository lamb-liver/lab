import { useCallback, useState } from 'react';
import { FUNCTIONS } from '../../curve/modules/inverse-function-reflection/constants';
import {
  clampInputForMode,
  DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS,
  inputRangeForMode,
  inverseFunctionReflectionModule,
  paramsForMetadata,
  paramsForModeSwitch,
  type InverseFunctionMode,
  type InverseFunctionReflectionParams,
} from '../../curve/modules/inverse-function-reflection';
import ParamControls from '../curve/ParamControls';
import { useInverseFunctionReflectionP5 } from '../curve/useInverseFunctionReflectionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function InverseFunctionReflectionCurveRoot({ controlsMountId }: Props) {
  const module = inverseFunctionReflectionModule;
  const [params, setParams] = useState<InverseFunctionReflectionParams>(
    DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<InverseFunctionReflectionParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useInverseFunctionReflectionP5({
    params,
    onParamsChange,
  });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });

  const inputRange = inputRangeForMode(params.mode);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <p className="curve-work-controls__formula">函數 f(x)</p>
      <div
        className="curve-work-mode-toggle"
        style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
      >
        {FUNCTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="curve-work-mode-button"
            title={item.label}
            aria-pressed={params.mode === item.id}
            onClick={() => onParamsChange(paramsForModeSwitch(item.id as InverseFunctionMode))}
          >
            {item.short}
          </button>
        ))}
      </div>

      <div className="control-field">
        <label htmlFor={`${module.id}-input`}>輸入 x</label>
        <div className="range-wrap">
          <input
            id={`${module.id}-input`}
            type="range"
            className="range"
            min={inputRange.min}
            max={inputRange.max}
            step={0.05}
            value={params.input}
            onInput={(e) =>
              onParamsChange({
                input: clampInputForMode(params.mode, Number(e.currentTarget.value)),
              })
            }
          />
        </div>
      </div>

      {params.mode === 'exponential' ? (
        <ParamControls
          module={module}
          values={{ base: params.base }}
          onChange={(_key, value) => onParamsChange({ base: value })}
        />
      ) : null}

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.advanced}
          onClick={() => onParamsChange({ advanced: !params.advanced })}
        >
          {params.advanced ? 'guide：開' : 'guide：關'}
        </button>
      </div>

      <p className="curve-work-controls__formula">也可在圖上拖動點 P</p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="反函數鏡射"
      />
      {controls}
    </>
  );
}
