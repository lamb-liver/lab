import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  createBoxplotValues,
  getPercentileBoxPlotMetadata,
  paramsFromValues,
  percentileBoxPlotModule,
  shiftValues,
  stretchValues,
} from '../../curve/modules/percentile-box-plot';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import {
  usePercentileBoxPlotP5,
  type PercentileBoxPlotWorkState,
} from '../curve/usePercentileBoxPlotP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId?: string };

function createState(params: ParamValues): PercentileBoxPlotWorkState {
  return {
    params,
    values: createBoxplotValues(paramsFromValues(params)),
    selectedIndex: -1,
    showPercentiles: true,
    showSortedRanks: false,
  };
}

function resetValues(state: PercentileBoxPlotWorkState) {
  state.values = createBoxplotValues(paramsFromValues(state.params));
  state.selectedIndex = -1;
}

export default function PercentileBoxPlotCurveRoot({
  controlsMountId = 'percentile-box-plot-controls',
}: Props) {
  const module = percentileBoxPlotModule;
  const stateRef = useRef<PercentileBoxPlotWorkState>(createState(module.defaultParams));
  const [redrawKey, rerender] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onStateChange = useCallback(() => rerender((n) => n + 1), []);
  const updateState = useCallback((update: (state: PercentileBoxPlotWorkState) => void) => {
    update(stateRef.current);
    rerender((n) => n + 1);
  }, []);

  const { canvasHostRef } = usePercentileBoxPlotP5({ stateRef, onStateChange, redrawKey });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const state = stateRef.current;
  const metadata = getPercentileBoxPlotMetadata(state.params, state.values);

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <ParamControls
            module={module}
            values={state.params}
            onChange={(key, value) =>
              updateState((next) => {
                next.params = { ...next.params, [key]: key === 'n' ? Math.round(value) : value };
                if (key !== 'fenceK') resetValues(next);
              })
            }
          />

          <div className="curve-work-mode-toggle" aria-label="顯示選項">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={state.showPercentiles}
              onClick={() => updateState((next) => { next.showPercentiles = !next.showPercentiles; })}
            >
              百分位
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={state.showSortedRanks}
              onClick={() => updateState((next) => { next.showSortedRanks = !next.showSortedRanks; })}
            >
              順位
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={false}
              onClick={() => updateState((next) => {
                if (next.selectedIndex >= 0 && next.values.length > 5) {
                  next.values.splice(next.selectedIndex, 1);
                  next.selectedIndex = -1;
                  next.params = { ...next.params, n: next.values.length };
                }
              })}
            >
              刪除
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={false}
              onClick={() => updateState(resetValues)}
            >
              重置
            </button>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="資料操作">
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.values = shiftValues(next.values, -0.5); })}>
              左移
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.values = shiftValues(next.values, 0.5); })}>
              右移
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.values = stretchValues(next.values, 0.82); })}>
              收攏
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.values = stretchValues(next.values, 1.18); })}>
              拉開
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
        aria-label="百分位數與盒鬚圖互動視覺化"
      />
      {controls}
    </>
  );
}
