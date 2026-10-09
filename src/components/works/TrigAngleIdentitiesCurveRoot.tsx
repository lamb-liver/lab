import { useCallback, useState } from 'react';
import {
  DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS,
  trigAngleIdentitiesModule,
  type FormulaId,
  type TrigAngleIdentitiesParams,
} from '../../curve/modules/trig-angle-identities';
import {
  ANGLE_MAX,
  ANGLE_MIN,
  FORMULAS,
  formatAngle,
} from '../../curve/modules/trig-angle-identities/geometry';
import type { ParamValues } from '../../curve/types';
import { useTrigAngleIdentitiesP5 } from '../curve/useTrigAngleIdentitiesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

function paramsForMetadata(params: TrigAngleIdentitiesParams): ParamValues {
  // formulaId 是 FormulaId 字串；getMetadata 內部以 formulaIdFromParam 還原
  return {
    formulaId: params.formulaId,
    alpha: params.alpha,
    beta: params.beta,
    showRadians: params.showRadians ? 1 : 0,
    reverseRead: params.reverseRead ? 1 : 0,
    showGuides: params.showGuides ? 1 : 0,
  } as unknown as ParamValues;
}

export default function TrigAngleIdentitiesCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = trigAngleIdentitiesModule;
  const [params, setParams] = useState<TrigAngleIdentitiesParams>({
    ...DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS,
  });


  const onAnglesChange = useCallback(
    (patch: Partial<Pick<TrigAngleIdentitiesParams, 'alpha' | 'beta'>>) => {
      setParams((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const { canvasHostRef } = useTrigAngleIdentitiesP5({ params, onAnglesChange, locale });

  const metadata = module.getMetadata(paramsForMetadata(params));

  const setFormulaId = (formulaId: FormulaId) => {
    setParams((prev) => ({ ...prev, formulaId }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {FORMULAS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.formulaId === item.id}
            onClick={() => setFormulaId(item.id)}
          >
            {item.shortLabel}
          </button>
        ))}
      </div>

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showRadians}
          onClick={() => setParams((prev) => ({ ...prev, showRadians: !prev.showRadians }))}
        >
          {en
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
          aria-pressed={params.showGuides}
          onClick={() => setParams((prev) => ({ ...prev, showGuides: !prev.showGuides }))}
        >
          {en
            ? params.showGuides
              ? 'Composition guide: on'
              : 'Composition guide: off'
            : params.showGuides
              ? '合成 guide：開'
              : '合成 guide：關'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.reverseRead}
          onClick={() => setParams((prev) => ({ ...prev, reverseRead: !prev.reverseRead }))}
        >
          {en
            ? params.reverseRead
              ? 'Reading: product-to-sum'
              : 'Reading: sum-to-product'
            : params.reverseRead
              ? '讀法：積化和差'
              : '讀法：和差化積'}
        </button>
      </div>

      <div className="control-field">
        <label htmlFor="trig-angle-alpha">
          {en ? 'Angle α' : '角 α'}
          <span className="control-field__value">
            {formatAngle(params.alpha, params.showRadians)}
          </span>
        </label>
        <div className="range-wrap">
          <input
            id="trig-angle-alpha"
            type="range"
            className="range"
            min={ANGLE_MIN}
            max={ANGLE_MAX}
            step={0.01}
            value={params.alpha}
            onInput={(event) =>
              setParams((prev) => ({
                ...prev,
                alpha: Number((event.target as HTMLInputElement).value),
              }))
            }
          />
        </div>
      </div>

      <div className="control-field">
        <label htmlFor="trig-angle-beta">
          {en ? 'Angle β' : '角 β'}
          <span className="control-field__value">
            {formatAngle(params.beta, params.showRadians)}
          </span>
        </label>
        <div className="range-wrap">
          <input
            id="trig-angle-beta"
            type="range"
            className="range"
            min={ANGLE_MIN}
            max={ANGLE_MAX}
            step={0.01}
            value={params.beta}
            onInput={(event) =>
              setParams((prev) => ({
                ...prev,
                beta: Number((event.target as HTMLInputElement).value),
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
              alpha: DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.alpha,
              beta: DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS.beta,
            }))
          }
        >
          {en ? 'Reset α=120°, β=30°' : '重設 α=120°，β=30°'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Trigonometric identities and angle sums' : '三角恆等式與角度合成互動'}
      />
      {controls}
    </>
  );
}
