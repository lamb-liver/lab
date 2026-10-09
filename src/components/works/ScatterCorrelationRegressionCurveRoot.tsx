import { useCallback, useRef, useState } from 'react';
import {
  createScatterPoints,
  flipYDirection,
  getScatterCorrelationMetadata,
  paramsFromValues,
  scaleCloud,
  scatterCorrelationRegressionModule,
  translatePoints,
} from '../../curve/modules/scatter-correlation-regression';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import {
  useScatterCorrelationRegressionP5,
  type ScatterCorrelationWorkState,
} from '../curve/useScatterCorrelationRegressionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string; locale?: 'en' };

const EN_LABELS: Record<string, string> = {
  n: 'Sample size n',
  beta: 'Linear trend β',
  curve: 'Curvature c',
  noise: 'Noise σ',
};

function createState(params: ParamValues): ScatterCorrelationWorkState {
  return {
    params,
    points: createScatterPoints(paramsFromValues(params)),
    selectedIndex: -1,
    showMeanAxes: true,
    showResiduals: false,
  };
}

export default function ScatterCorrelationRegressionCurveRoot({ controlsMountId, locale }: Props) {
  const module = scatterCorrelationRegressionModule;
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
  const stateRef = useRef<ScatterCorrelationWorkState>(createState(module.defaultParams));
  const [redrawKey, rerender] = useState(0);

  const onStateChange = useCallback(() => rerender((n) => n + 1), []);
  const updateState = useCallback((update: (state: ScatterCorrelationWorkState) => void) => {
    update(stateRef.current);
    rerender((n) => n + 1);
  }, []);

  const { canvasHostRef } = useScatterCorrelationRegressionP5({
    stateRef,
    onStateChange,
    redrawKey,
    locale,
  });


  const state = stateRef.current;
  const metadata = getScatterCorrelationMetadata(state.params, state.points);
  const shown = en ? { ...metadata, title: 'Scatter diagram, correlation, and the regression line' } : metadata;
  const text = (zh: string, english: string) => (en ? english : zh);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <ParamControls
        module={controlsModule}
        values={state.params}
        onChange={(key, value) =>
          updateState((next) => {
            next.params = { ...next.params, [key]: value };
            next.points = createScatterPoints(paramsFromValues(next.params));
            next.selectedIndex = -1;
          })
        }
      />

      <div className="curve-work-mode-toggle" aria-label={text('顯示選項', 'Display')}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={state.showMeanAxes}
          onClick={() => updateState((next) => { next.showMeanAxes = !next.showMeanAxes; })}
        >
          {text('平均軸', 'Mean axes')}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={state.showResiduals}
          onClick={() => updateState((next) => { next.showResiduals = !next.showResiduals; })}
        >
          {text('殘差', 'Residuals')}
        </button>
      </div>

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={text('點雲操作', 'Edit the cloud')}>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = translatePoints(next.points, -0.6, 0); })}>
          {text('左移', 'Shift left')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = translatePoints(next.points, 0.6, 0); })}>
          {text('右移', 'Shift right')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = scaleCloud(next.points, 0.82); })}>
          {text('縮小', 'Shrink')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = scaleCloud(next.points, 1.16); })}>
          {text('放大', 'Enlarge')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = flipYDirection(next.points); next.params = { ...next.params, beta: -(next.params.beta ?? 0) }; next.selectedIndex = -1; })}>
          {text('反轉 y', 'Flip y')}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = createScatterPoints(paramsFromValues(next.params)); next.selectedIndex = -1; })}>
          {text('重設', 'Reset')}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Scatter diagram, correlation, and the regression line' : '散布圖相關與迴歸線互動視覺化'}
      />
      {controls}
    </>
  );
}
