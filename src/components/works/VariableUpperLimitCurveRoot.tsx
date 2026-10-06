import { useState } from 'react';
import { variableUpperLimitModule } from '../../curve/modules/variable-upper-limit';
import {
  DEFAULT_UPPER_LIMIT_PARAMS,
  H_MAX,
  H_MIN,
  X_MAX,
  X_MIN,
  type UpperLimitParams,
} from '../../curve/modules/variable-upper-limit/geometry';
import { useVariableUpperLimitP5 } from '../curve/useVariableUpperLimitP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function VariableUpperLimitCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<UpperLimitParams>({ ...DEFAULT_UPPER_LIMIT_PARAMS });
  const { canvasHostRef } = useVariableUpperLimitP5({ params });
  const metadata = variableUpperLimitModule.getMetadata(params);

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="面積與右端高度：細條的高度比上寬度"
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
        <div className="control-field">
          <label htmlFor="variable-upper-limit-x">
            <span>右端 x</span>
            <span className="control-field__value">{params.x.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="variable-upper-limit-x"
              type="range"
              className="range"
              min={X_MIN}
              max={X_MAX}
              step={0.05}
              value={params.x}
              onInput={(event) => {
                const x = Number(event.currentTarget.value);
                setParams((prev) => ({ ...prev, x }));
              }}
            />
          </div>
        </div>
        <div className="control-field">
          <label htmlFor="variable-upper-limit-h">
            <span>細條寬度 h</span>
            <span className="control-field__value">{params.h.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="variable-upper-limit-h"
              type="range"
              className="range"
              min={H_MIN}
              max={H_MAX}
              step={0.01}
              value={params.h}
              onInput={(event) => {
                const h = Number(event.currentTarget.value);
                setParams((prev) => ({ ...prev, h }));
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
