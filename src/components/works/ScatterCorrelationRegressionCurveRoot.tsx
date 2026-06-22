import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import StatsPanel from '../curve/StatsPanel';
import {
  useScatterCorrelationRegressionP5,
  type ScatterCorrelationWorkState,
} from '../curve/useScatterCorrelationRegressionP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string };

function createState(params: ParamValues): ScatterCorrelationWorkState {
  return {
    params,
    points: createScatterPoints(paramsFromValues(params)),
    selectedIndex: -1,
    showMeanAxes: true,
    showResiduals: false,
  };
}

export default function ScatterCorrelationRegressionCurveRoot({ controlsMountId }: Props) {
  const module = scatterCorrelationRegressionModule;
  const stateRef = useRef<ScatterCorrelationWorkState>(createState(module.defaultParams));
  const [redrawKey, rerender] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onStateChange = useCallback(() => rerender((n) => n + 1), []);
  const updateState = useCallback((update: (state: ScatterCorrelationWorkState) => void) => {
    update(stateRef.current);
    rerender((n) => n + 1);
  }, []);

  const { canvasHostRef } = useScatterCorrelationRegressionP5({
    stateRef,
    onStateChange,
    redrawKey,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const state = stateRef.current;
  const metadata = getScatterCorrelationMetadata(state.params, state.points);

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
                next.params = { ...next.params, [key]: value };
                next.points = createScatterPoints(paramsFromValues(next.params));
                next.selectedIndex = -1;
              })
            }
          />

          <div className="curve-work-mode-toggle" aria-label="顯示選項">
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={state.showMeanAxes}
              onClick={() => updateState((next) => { next.showMeanAxes = !next.showMeanAxes; })}
            >
              平均軸
            </button>
            <button
              type="button"
              className="curve-work-mode-button"
              aria-pressed={state.showResiduals}
              onClick={() => updateState((next) => { next.showResiduals = !next.showResiduals; })}
            >
              殘差
            </button>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="點雲操作">
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = translatePoints(next.points, -0.6, 0); })}>
              左移
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = translatePoints(next.points, 0.6, 0); })}>
              右移
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = scaleCloud(next.points, 0.82); })}>
              縮小
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = scaleCloud(next.points, 1.16); })}>
              放大
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = flipYDirection(next.points); next.params = { ...next.params, beta: -(next.params.beta ?? 0) }; next.selectedIndex = -1; })}>
              反轉 y
            </button>
            <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => updateState((next) => { next.points = createScatterPoints(paramsFromValues(next.params)); next.selectedIndex = -1; })}>
              重置
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
        aria-label="散布圖相關與迴歸線互動視覺化"
      />
      {controls}
    </>
  );
}
