import { useCallback, useState } from 'react';
import {
  DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS,
  unitCircleTrigDefinitionModule,
  type UnitCircleTrigDefinitionParams,
} from '../../curve/modules/unit-circle-trig-definition';
import {
  THETA_MAX,
  THETA_MIN,
  getTrigValues,
  normalizeAngle,
  quadrantLabel,
  signLabel,
} from '../../curve/modules/unit-circle-trig-definition/geometry';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useUnitCircleTrigDefinitionP5 } from '../curve/useUnitCircleTrigDefinitionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

function englishMetadata(metadata: CurveMetadata, theta: number): CurveMetadata {
  const thetaNorm = normalizeAngle(theta);
  const { cosValue, sinValue, tanValue } = getTrigValues(thetaNorm);
  return {
    ...metadata,
    title: 'Unit circle and trigonometric definitions',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'tan') {
        return { ...stat, value: Number.isFinite(tanValue) ? stat.value : 'undefined' };
      }
      if (stat.key === 'quadrant') {
        return {
          ...stat,
          label: 'Quadrant',
          value: `${quadrantLabel(thetaNorm, 'en')} | cos ${signLabel(cosValue)} sin ${signLabel(sinValue)}`,
        };
      }
      return stat;
    }),
  };
}

function paramsForMetadata(params: UnitCircleTrigDefinitionParams): ParamValues {
  return {
    theta: params.theta,
    showRadians: params.showRadians ? 1 : 0,
    showSpecialAngles: params.showSpecialAngles ? 1 : 0,
    showQuadrants: params.showQuadrants ? 1 : 0,
    showTangent: params.showTangent ? 1 : 0,
  };
}

export default function UnitCircleTrigDefinitionCurveRoot({ controlsMountId, locale }: Props) {
  const module = unitCircleTrigDefinitionModule;
  const [params, setParams] = useState<UnitCircleTrigDefinitionParams>({
    ...DEFAULT_UNIT_CIRCLE_TRIG_DEFINITION_PARAMS,
  });


  const onThetaChange = useCallback((theta: number) => {
    setParams((prev) => ({ ...prev, theta }));
  }, []);

  const { canvasHostRef } = useUnitCircleTrigDefinitionP5({ params, onThetaChange, locale });

  const metadata = module.getMetadata(paramsForMetadata(params));
  const shown = locale === 'en' ? englishMetadata(metadata, params.theta) : metadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showRadians}
          onClick={() => setParams((prev) => ({ ...prev, showRadians: !prev.showRadians }))}
        >
          {locale === 'en'
            ? params.showRadians
              ? 'Angle display: radians'
              : 'Angle display: degrees'
            : params.showRadians
              ? '角度顯示：弧度'
              : '角度顯示：度'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showQuadrants}
          onClick={() =>
            setParams((prev) => ({ ...prev, showQuadrants: !prev.showQuadrants }))
          }
        >
          {locale === 'en'
            ? params.showQuadrants
              ? 'Quadrant signs: on'
              : 'Quadrant signs: off'
            : params.showQuadrants
              ? '象限正負：開'
              : '象限正負：關'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showSpecialAngles}
          onClick={() =>
            setParams((prev) => ({ ...prev, showSpecialAngles: !prev.showSpecialAngles }))
          }
        >
          {locale === 'en'
            ? params.showSpecialAngles
              ? 'Special angles: on'
              : 'Special angles: off'
            : params.showSpecialAngles
              ? '特殊角：開'
              : '特殊角：關'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showTangent}
          onClick={() => setParams((prev) => ({ ...prev, showTangent: !prev.showTangent }))}
        >
          {locale === 'en'
            ? params.showTangent
              ? 'Tangent line: on'
              : 'Tangent line: off'
            : params.showTangent
              ? '正切線：開'
              : '正切線：關'}
        </button>
      </div>

      <div className="control-field">
        <label htmlFor="unit-circle-theta">
          {locale === 'en' ? 'Angle θ' : '角度 θ'}
          <span className="control-field__value">
            {shown.stats.find((s) => s.key === 'theta')?.value}
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
          {locale === 'en' ? 'Reset θ = 45°' : '重設 θ = 45°'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en'
            ? 'Unit circle: cosine is the x-coordinate and sine is the y-coordinate'
            : '單位圓與三角函數定義互動'
        }
      />
      {controls}
    </>
  );
}
