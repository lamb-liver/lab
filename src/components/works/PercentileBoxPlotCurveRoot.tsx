import { useCallback, useRef, useState } from 'react';
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
import {
  usePercentileBoxPlotP5,
  type PercentileBoxPlotWorkState,
} from '../curve/usePercentileBoxPlotP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string; locale?: 'en' };

const EN_LABELS: Record<string, string> = {
  n: 'Sample size n',
  spread: 'Spread s',
  skew: 'Skew γ',
  fenceK: 'Whisker multiple k',
};

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

export default function PercentileBoxPlotCurveRoot({ controlsMountId, locale }: Props) {
  const module = percentileBoxPlotModule;
  const en = locale === 'en';
  const controlsModule = en
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: EN_LABELS[def.key] ?? def.label,
        })),
      }
    : module;
  const stateRef = useRef<PercentileBoxPlotWorkState>(createState(module.defaultParams));
  const [redrawKey, rerender] = useState(0);

  const onStateChange = useCallback(() => rerender((n) => n + 1), []);
  const updateState = useCallback((update: (state: PercentileBoxPlotWorkState) => void) => {
    update(stateRef.current);
    rerender((n) => n + 1);
  }, []);

  const { canvasHostRef } = usePercentileBoxPlotP5({ stateRef, onStateChange, redrawKey, locale });


  const state = stateRef.current;
  const metadata = getPercentileBoxPlotMetadata(state.params, state.values);
  const shown = en ? { ...metadata, title: 'Percentiles and a box plot' } : metadata;
  const text = (zh: string, english: string) => (en ? english : zh);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <ParamControls
        module={controlsModule}
        values={state.params}
        onChange={(key, value) =>
          updateState((next) => {
            next.params = { ...next.params, [key]: key === 'n' ? Math.round(value) : value };
            if (key !== 'fenceK') resetValues(next);
          })
        }
      />

      <div className="curve-work-mode-toggle" aria-label={text('顯示選項', 'Display')}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={state.showPercentiles}
          onClick={() => updateState((next) => { next.showPercentiles = !next.showPercentiles; })}
        >
          {text('百分位', 'Percentiles')}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={state.showSortedRanks}
          onClick={() => updateState((next) => { next.showSortedRanks = !next.showSortedRanks; })}
        >
          {text('順位', 'Ranks')}
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
          {text('刪除', 'Delete')}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={false}
          onClick={() => updateState(resetValues)}
        >
          {text('重設', 'Reset')}
        </button>
      </div>

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={text('資料操作', 'Edit the sample')}>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.values = shiftValues(next.values, -0.5); })}>
          {text('左移', 'Shift left')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.values = shiftValues(next.values, 0.5); })}>
          {text('右移', 'Shift right')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.values = stretchValues(next.values, 0.82); })}>
          {text('收攏', 'Pull in')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.values = stretchValues(next.values, 1.18); })}>
          {text('拉開', 'Pull apart')}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Percentiles and a box plot' : '百分位數與盒鬚圖互動視覺化'}
      />
      {controls}
    </>
  );
}
