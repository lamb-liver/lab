import { useCallback, useState } from 'react';
import {
  DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS,
  unitCircleTrigDefinitionModule,
  type UnitCircleTrigDefinitionParams,
} from '../../curve/modules/unit-circle-trig-definition';
import {
  THETA_MAX,
  THETA_MIN,
} from '../../curve/modules/unit-circle-trig-definition/geometry';
import type { ParamValues } from '../../curve/types';
import { useUnitCircleTrigDefinitionP5 } from '../curve/useUnitCircleTrigDefinitionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

function paramsForMetadata(params: UnitCircleTrigDefinitionParams): ParamValues {
  return {
    theta: params.theta,
    showRadians: params.showRadians ? 1 : 0,
    showSpecialAngles: params.showSpecialAngles ? 1 : 0,
    showQuadrants: params.showQuadrants ? 1 : 0,
    showTangent: params.showTangent ? 1 : 0,
  };
}

export default function UnitCircleTrigDefinitionCurveRoot({ controlsMountId }: Props) {
  const module = unitCircleTrigDefinitionModule;
  const [params, setParams] = useState<UnitCircleTrigDefinitionParams>({
    ...DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS,
  });


  const onThetaChange = useCallback((theta: number) => {
    setParams((prev) => ({ ...prev, theta }));
  }, []);

  const { canvasHostRef } = useUnitCircleTrigDefinitionP5({ params, onThetaChange });

  const metadata = module.getMetadata(paramsForMetadata(params));

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showRadians}
          onClick={() => setParams((prev) => ({ ...prev, showRadians: !prev.showRadians }))}
        >
          {params.showRadians ? '角度顯示：弧度' : '角度顯示：度'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showQuadrants}
          onClick={() =>
            setParams((prev) => ({ ...prev, showQuadrants: !prev.showQuadrants }))
          }
        >
          {params.showQuadrants ? '象限正負：開' : '象限正負：關'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showSpecialAngles}
          onClick={() =>
            setParams((prev) => ({ ...prev, showSpecialAngles: !prev.showSpecialAngles }))
          }
        >
          {params.showSpecialAngles ? '特殊角：開' : '特殊角：關'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showTangent}
          onClick={() => setParams((prev) => ({ ...prev, showTangent: !prev.showTangent }))}
        >
          {params.showTangent ? '正切線：開' : '正切線：關'}
        </button>
      </div>

      <div className="control-field">
        <label htmlFor="unit-circle-theta">
          角度 θ
          <span className="control-field__value">
            {metadata.stats.find((s) => s.key === 'theta')?.value}
          </span>
        </label>
        <div className="range-wrap">
          <input
            id="unit-circle-theta"
            type="range"
            className="range"
            min={THETA_MIN}
            max={THETA_MAX}
            step={0.01}
            value={params.theta}
            onInput={(event) =>
              setParams((prev) => ({
                ...prev,
                theta: Number((event.target as HTMLInputElement).value),
              }))
            }
          />
        </div>
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() =>
            setParams((prev) => ({
              ...prev,
              theta: DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS.theta,
            }))
          }
        >
          重設 θ = 45°
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="單位圓與三角函數定義互動"
      />
      {controls}
    </>
  );
}
