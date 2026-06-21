import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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
import StatsPanel from '../curve/StatsPanel';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId?: string;
};

function paramsForMetadata(params: TrigAngleIdentitiesParams): ParamValues {
  return {
    formulaId: params.formulaId,
    alpha: params.alpha,
    beta: params.beta,
    showRadians: params.showRadians ? 1 : 0,
    reverseRead: params.reverseRead ? 1 : 0,
    showGuides: params.showGuides ? 1 : 0,
  };
}

export default function TrigAngleIdentitiesCurveRoot({
  controlsMountId = 'trig-angle-identities-controls',
}: Props) {
  const module = trigAngleIdentitiesModule;
  const [params, setParams] = useState<TrigAngleIdentitiesParams>({
    ...DEFAULT_TRIG_ANGLE_IDENTITIES_PARAMS,
  });
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const onAnglesChange = useCallback(
    (patch: Partial<Pick<TrigAngleIdentitiesParams, 'alpha' | 'beta'>>) => {
      setParams((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const { canvasHostRef } = useTrigAngleIdentitiesP5({ params, onAnglesChange });

  const metadata = useMemo(
    () => module.getMetadata(paramsForMetadata(params)),
    [module, params],
  );

  const setFormulaId = (formulaId: FormulaId) => {
    setParams((prev) => ({ ...prev, formulaId }));
  };

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

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
              {params.showRadians ? '角度顯示：弧度' : '角度顯示：度'}
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.showGuides}
              onClick={() => setParams((prev) => ({ ...prev, showGuides: !prev.showGuides }))}
            >
              {params.showGuides ? '合成 guide：開' : '合成 guide：關'}
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={params.reverseRead}
              onClick={() => setParams((prev) => ({ ...prev, reverseRead: !prev.reverseRead }))}
            >
              {params.reverseRead ? '讀法：積化和差' : '讀法：和差化積'}
            </button>
          </div>

          <div className="control-field">
            <label htmlFor="trig-angle-alpha">
              角 α
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
              角 β
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
              重置 α=120°，β=30°
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
        aria-label="三角恆等式與角度合成互動"
      />
      {controls}
    </>
  );
}
