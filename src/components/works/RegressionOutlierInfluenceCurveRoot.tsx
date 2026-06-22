import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DEFAULT_OUTLIER,
  OUTLIER_PRESETS,
  getRegressionOutlierInfluenceMetadata,
} from '../../curve/modules/regression-outlier-influence';
import StatsPanel from '../curve/StatsPanel';
import {
  useRegressionOutlierInfluenceP5,
  type RegressionOutlierInfluenceWorkState,
} from '../curve/useRegressionOutlierInfluenceP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string };

function createState(): RegressionOutlierInfluenceWorkState {
  return {
    outlier: { ...DEFAULT_OUTLIER },
    dragging: false,
    showLeverage: true,
    showResidual: true,
    showMean: false,
  };
}

export default function RegressionOutlierInfluenceCurveRoot({ controlsMountId }: Props) {
  const stateRef = useRef<RegressionOutlierInfluenceWorkState>(createState());
  const [redrawKey, rerender] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onStateChange = useCallback(() => rerender((n) => n + 1), []);
  const updateState = useCallback((update: (state: RegressionOutlierInfluenceWorkState) => void) => {
    update(stateRef.current);
    rerender((n) => n + 1);
  }, []);

  const { canvasHostRef } = useRegressionOutlierInfluenceP5({
    stateRef,
    onStateChange,
    redrawKey,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const state = stateRef.current;
  const metadata = getRegressionOutlierInfluenceMetadata(state.outlier);

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle" aria-label="顯示選項">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={state.showLeverage}
              onClick={() => updateState((next) => { next.showLeverage = !next.showLeverage; })}
            >
              槓桿
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={state.showResidual}
              onClick={() => updateState((next) => { next.showResidual = !next.showResidual; })}
            >
              殘差
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={state.showMean}
              onClick={() => updateState((next) => { next.showMean = !next.showMean; })}
            >
              平均
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={false}
              onClick={() => updateState((next) => { next.outlier = { ...DEFAULT_OUTLIER }; })}
            >
              重置
            </button>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="離群點情境">
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.outlier = { ...OUTLIER_PRESETS.highLeverage }; })}>
              高槓桿
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.outlier = { ...OUTLIER_PRESETS.highResidual }; })}>
              大殘差
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.outlier = { ...OUTLIER_PRESETS.highInfluence }; })}>
              高影響
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.outlier = { ...OUTLIER_PRESETS.lowInfluence }; })}>
              低影響
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
        aria-label="離群值對迴歸影響互動視覺化"
      />
      {controls}
    </>
  );
}
