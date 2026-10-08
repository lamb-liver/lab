import { useCallback, useRef, useState } from 'react';
import {
  DEFAULT_OUTLIER,
  OUTLIER_PRESETS,
  getRegressionOutlierInfluenceMetadata,
} from '../../curve/modules/regression-outlier-influence';
import {
  useRegressionOutlierInfluenceP5,
  type RegressionOutlierInfluenceWorkState,
} from '../curve/useRegressionOutlierInfluenceP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string; locale?: 'en' };

function createState(): RegressionOutlierInfluenceWorkState {
  return {
    outlier: { ...DEFAULT_OUTLIER },
    dragging: false,
    showLeverage: true,
    showResidual: true,
    showMean: false,
  };
}

export default function RegressionOutlierInfluenceCurveRoot({ controlsMountId, locale }: Props) {
  const stateRef = useRef<RegressionOutlierInfluenceWorkState>(createState());
  const [redrawKey, rerender] = useState(0);

  const onStateChange = useCallback(() => rerender((n) => n + 1), []);
  const updateState = useCallback((update: (state: RegressionOutlierInfluenceWorkState) => void) => {
    update(stateRef.current);
    rerender((n) => n + 1);
  }, []);

  const { canvasHostRef } = useRegressionOutlierInfluenceP5({
    stateRef,
    onStateChange,
    redrawKey,
    locale,
  });


  const state = stateRef.current;
  const metadata = getRegressionOutlierInfluenceMetadata(state.outlier);
  const en = locale === 'en';
  const shown = en ? { ...metadata, title: "An outlier's effect on the regression line" } : metadata;
  const text = (zh: string, english: string) => (en ? english : zh);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle" aria-label={text('顯示選項', 'Display')}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={state.showLeverage}
          onClick={() => updateState((next) => { next.showLeverage = !next.showLeverage; })}
        >
          {text('槓桿', 'Leverage')}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={state.showResidual}
          onClick={() => updateState((next) => { next.showResidual = !next.showResidual; })}
        >
          {text('殘差', 'Residual')}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={state.showMean}
          onClick={() => updateState((next) => { next.showMean = !next.showMean; })}
        >
          {text('平均', 'Mean')}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={false}
          onClick={() => updateState((next) => { next.outlier = { ...DEFAULT_OUTLIER }; })}
        >
          {text('重設', 'Reset')}
        </button>
      </div>

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={text('離群點情境', 'Outlier presets')}>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.outlier = { ...OUTLIER_PRESETS.highLeverage }; })}>
          {text('高槓桿', 'High leverage')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.outlier = { ...OUTLIER_PRESETS.highResidual }; })}>
          {text('大殘差', 'Large residual')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.outlier = { ...OUTLIER_PRESETS.highInfluence }; })}>
          {text('高影響', 'High influence')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.outlier = { ...OUTLIER_PRESETS.lowInfluence }; })}>
          {text('低影響', 'Low influence')}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? "An outlier's effect on the regression line" : '離群值對迴歸影響互動視覺化'}
      />
      {controls}
    </>
  );
}
