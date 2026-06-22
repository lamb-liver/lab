import { useCallback, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  canvasToWorld as canvasToScatterWorld,
  worldToCanvas as worldToScatterCanvas,
} from '../../curve/modules/scatter-correlation-regression/geometry';
import {
  clamp,
  createBoxplotValues,
  createOutlierBase,
  createScatterPoints,
  nextBoxplotValue,
  nextScatterPoint,
  quartileSummary,
  regression,
  type DataPoint,
  type RegressionFit,
  type QuartileSummary,
} from '../../explore/data-analysis/geometry';
import {
  clipRect,
  drawBottomLabel,
  drawUnitPlotFrame,
  withDash,
} from '../../systems/rendering/p5PlotHelpers';
import { useRectP5CanvasHost, type ExtendSketch } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/data-analysis-explore.css';

type Mode = 'scatter' | 'outlier' | 'boxplot';

type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type DragState =
  | { type: 'scatter-point'; index: number }
  | { type: 'outlier-point' }
  | { type: 'box-value'; index: number };

type DataAnalysisState = {
  mode: Mode;
  showGuides: boolean;
  dragging: DragState | null;
  scatter: {
    targetN: number;
    slope: number;
    noise: number;
    selectedIndex: number;
    points: DataPoint[];
  };
  outlier: {
    base: DataPoint[];
    point: DataPoint;
  };
  boxplot: {
    targetN: number;
    selectedIndex: number;
    values: number[];
  };
};

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;
const RED = [231, 111, 81] as const;

const MODE_OPTIONS: Array<{ key: Mode; label: string }> = [
  { key: 'scatter', label: '散布與迴歸' },
  { key: 'outlier', label: '離群值影響' },
  { key: 'boxplot', label: '百分位盒鬚' },
];

function createInitialState(): DataAnalysisState {
  return {
    mode: 'scatter',
    showGuides: false,
    dragging: null,
    scatter: {
      targetN: 12,
      slope: 0.75,
      noise: 1,
      selectedIndex: -1,
      points: createScatterPoints(12, 0.75, 1),
    },
    outlier: {
      base: createOutlierBase(),
      point: { x: 8.8, y: 2.2 },
    },
    boxplot: {
      targetN: 13,
      selectedIndex: -1,
      values: createBoxplotValues(13),
    },
  };
}

function measureCanvas(host: HTMLElement): { width: number; height: number } {
  const width = Math.max(300, Math.round(host.clientWidth || 720));
  const height = Math.round(clamp(width * 0.62, 340, 520));
  return { width, height };
}

function resetScatterData(state: DataAnalysisState) {
  state.scatter.points = createScatterPoints(
    state.scatter.targetN,
    state.scatter.slope,
    state.scatter.noise,
  );
  state.scatter.selectedIndex = -1;
}

function resetBoxplotData(state: DataAnalysisState) {
  state.boxplot.values = createBoxplotValues(state.boxplot.targetN);
  state.boxplot.selectedIndex = -1;
}

function resetCurrentData(state: DataAnalysisState) {
  if (state.mode === 'scatter') resetScatterData(state);
  if (state.mode === 'outlier') state.outlier.point = { x: 8.8, y: 2.2 };
  if (state.mode === 'boxplot') resetBoxplotData(state);
}

function setMode(state: DataAnalysisState, mode: Mode) {
  state.mode = mode;
  state.dragging = null;
  state.scatter.selectedIndex = -1;
  state.boxplot.selectedIndex = -1;
}

function addCurrentData(state: DataAnalysisState) {
  if (state.mode === 'scatter') {
    state.scatter.points.push(
      nextScatterPoint(state.scatter.points, state.scatter.slope, state.scatter.noise),
    );
    state.scatter.selectedIndex = state.scatter.points.length - 1;
    state.scatter.targetN = state.scatter.points.length;
  }

  if (state.mode === 'boxplot') {
    state.boxplot.values.push(nextBoxplotValue(state.boxplot.values.length));
    state.boxplot.selectedIndex = state.boxplot.values.length - 1;
    state.boxplot.targetN = state.boxplot.values.length;
  }
}

function deleteSelected(state: DataAnalysisState) {
  if (state.mode === 'scatter') {
    const { selectedIndex, points } = state.scatter;
    if (selectedIndex >= 0 && points.length > 3) {
      points.splice(selectedIndex, 1);
      state.scatter.selectedIndex = -1;
      state.scatter.targetN = points.length;
    }
  }

  if (state.mode === 'boxplot') {
    const { selectedIndex, values } = state.boxplot;
    if (selectedIndex >= 0 && values.length > 5) {
      values.splice(selectedIndex, 1);
      state.boxplot.selectedIndex = -1;
      state.boxplot.targetN = values.length;
    }
  }
}

export default function DataAnalysisExploreRoot() {
  const stateRef = useRef<DataAnalysisState>(createInitialState());
  const [redrawKey, rerender] = useState(0);

  const commit = useCallback((update: (state: DataAnalysisState) => void) => {
    update(stateRef.current);
    rerender((n) => n + 1);
  }, []);

  const draw = useCallback((p: p5) => {
    p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");
    p.background(...BG);
    drawMode(p, computePlot(p.width, p.height), stateRef.current);
  }, []);

  const extendSketch = useMemo<ExtendSketch>(() => {
    return (p) => {
      p.mousePressed = () => {
        const state = stateRef.current;
        const plot = computePlot(p.width, p.height);

        if (state.mode === 'scatter') {
          const index = nearestScatterPoint(p, plot, state.scatter.points, p.mouseX, p.mouseY);
          state.scatter.selectedIndex = index;
          if (index >= 0) {
            state.dragging = { type: 'scatter-point', index };
            rerender((n) => n + 1);
            return false;
          }
        }

        if (state.mode === 'outlier') {
          const point = worldToScatterCanvas(plot, state.outlier.point.x, state.outlier.point.y);
          if (p.dist(p.mouseX, p.mouseY, point.x, point.y) <= 18) {
            state.dragging = { type: 'outlier-point' };
            return false;
          }
        }

        if (state.mode === 'boxplot') {
          const index = nearestBoxValue(p, plot, state.boxplot.values, p.mouseX, p.mouseY);
          state.boxplot.selectedIndex = index;
          if (index >= 0) {
            state.dragging = { type: 'box-value', index };
            rerender((n) => n + 1);
            return false;
          }
        }

        state.dragging = null;
        rerender((n) => n + 1);
        return false;
      };

      p.mouseDragged = () => {
        const state = stateRef.current;
        if (!state.dragging) return false;

        const plot = computePlot(p.width, p.height);

        if (state.dragging.type === 'scatter-point') {
          state.scatter.points[state.dragging.index] = canvasToScatterWorld(plot, p.mouseX, p.mouseY);
          rerender((n) => n + 1);
          return false;
        }

        if (state.dragging.type === 'outlier-point') {
          state.outlier.point = canvasToScatterWorld(plot, p.mouseX, p.mouseY);
          rerender((n) => n + 1);
          return false;
        }

        if (state.dragging.type === 'box-value') {
          state.boxplot.values[state.dragging.index] = screenToValue(plot, p.mouseX);
          rerender((n) => n + 1);
          return false;
        }

        return false;
      };

      p.mouseReleased = () => {
        stateRef.current.dragging = null;
        return false;
      };

      p.doubleClicked = () => {
        const state = stateRef.current;
        const plot = computePlot(p.width, p.height);

        if (!hitPlot(plot, p.mouseX, p.mouseY)) return false;

        if (state.mode === 'scatter') {
          state.scatter.points.push(canvasToScatterWorld(plot, p.mouseX, p.mouseY));
          state.scatter.selectedIndex = state.scatter.points.length - 1;
          state.scatter.targetN = state.scatter.points.length;
        }

        if (state.mode === 'boxplot') {
          state.boxplot.values.push(screenToValue(plot, p.mouseX));
          state.boxplot.selectedIndex = state.boxplot.values.length - 1;
          state.boxplot.targetN = state.boxplot.values.length;
        }

        rerender((n) => n + 1);
        return false;
      };
    };
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureCanvas, extendSketch, {
    loop: false,
    redrawKey,
  });
  const state = stateRef.current;
  const scatterFit = regression(state.scatter.points);
  const baseFit = regression(state.outlier.base);
  const outlierFit = regression([...state.outlier.base, state.outlier.point]);
  const boxSummary = quartileSummary(state.boxplot.values);

  return (
    <div className="data-analysis-explore">
      <div className="data-analysis-explore__stage">
        <div className="data-analysis-explore__visual">
          <div
            ref={canvasHostRef}
            className="data-analysis-explore__canvas"
            role="img"
            aria-label="資料分析互動視覺化"
          />
        </div>

        <aside className="data-analysis-explore__sidebar">
          <div className="data-analysis-explore__block">
            <p className="data-analysis-explore__block-title">模式</p>
            <div className="data-analysis-explore__modes" aria-label="資料分析模式">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className="data-analysis-explore__mode"
                  data-active={state.mode === option.key}
                  aria-pressed={state.mode === option.key}
                  onClick={() => commit((next) => setMode(next, option.key))}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="data-analysis-explore__block">
            <p className="data-analysis-explore__block-title">參數</p>
            {state.mode === 'scatter' ? (
              <>
                <RangeControl
                  id="data-analysis-scatter-n"
                  label="點數 n"
                  value={state.scatter.targetN}
                  min={5}
                  max={20}
                  step={1}
                  format={(v) => String(Math.round(v))}
                  onChange={(value) =>
                    commit((next) => {
                      next.scatter.targetN = Math.round(value);
                      resetScatterData(next);
                    })
                  }
                />
                <RangeControl
                  id="data-analysis-scatter-b"
                  label="趨勢 b"
                  value={state.scatter.slope}
                  min={-1.4}
                  max={1.4}
                  step={0.01}
                  format={(v) => fmt(v, 2)}
                  onChange={(value) =>
                    commit((next) => {
                      next.scatter.slope = value;
                      resetScatterData(next);
                    })
                  }
                />
                <RangeControl
                  id="data-analysis-scatter-noise"
                  label="雜訊 σ"
                  value={state.scatter.noise}
                  min={0}
                  max={2.4}
                  step={0.01}
                  format={(v) => fmt(v, 2)}
                  onChange={(value) =>
                    commit((next) => {
                      next.scatter.noise = value;
                      resetScatterData(next);
                    })
                  }
                />
              </>
            ) : null}

            {state.mode === 'outlier' ? (
              <>
                <Stat label="離群 xₒ" value={fmt(state.outlier.point.x, 2)} />
                <Stat label="離群 yₒ" value={fmt(state.outlier.point.y, 2)} />
              </>
            ) : null}

            {state.mode === 'boxplot' ? (
              <RangeControl
                id="data-analysis-boxplot-n"
                label="資料數 n"
                value={state.boxplot.targetN}
                min={6}
                max={22}
                step={1}
                format={(v) => String(Math.round(v))}
                onChange={(value) =>
                  commit((next) => {
                    next.boxplot.targetN = Math.round(value);
                    resetBoxplotData(next);
                  })
                }
              />
            ) : null}
          </div>

          <div className="data-analysis-explore__block">
            <div className="data-analysis-explore__actions">
              <button type="button" onClick={() => commit(resetCurrentData)}>
                重置資料
              </button>
              <button
                type="button"
                data-active={state.showGuides}
                aria-pressed={state.showGuides}
                onClick={() =>
                  commit((next) => {
                    next.showGuides = !next.showGuides;
                  })
                }
              >
                {state.showGuides ? '隱藏輔助' : '顯示輔助'}
              </button>
              {state.mode !== 'outlier' ? (
                <>
                  <button type="button" onClick={() => commit(addCurrentData)}>
                    新增資料
                  </button>
                  <button type="button" onClick={() => commit(deleteSelected)}>
                    刪除選取
                  </button>
                </>
              ) : null}
            </div>
            <p className="data-analysis-explore__hint">
              {state.mode === 'outlier'
                ? '拖動紅點觀察迴歸線變化'
                : '拖動資料點；雙擊圖面可新增'}
            </p>
          </div>

          <div className="data-analysis-explore__block">
            <p className="data-analysis-explore__block-title">統計</p>
            {state.mode === 'scatter' ? (
              <ScatterStats points={state.scatter.points} fit={scatterFit} />
            ) : null}
            {state.mode === 'outlier' && baseFit && outlierFit ? (
              <OutlierStats point={state.outlier.point} baseFit={baseFit} allFit={outlierFit} />
            ) : null}
            {state.mode === 'boxplot' ? (
              <BoxplotStats count={state.boxplot.values.length} summary={boxSummary} />
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

function RangeControl({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="data-analysis-explore__field">
      <label htmlFor={id}>
        {label}
        <span className="data-analysis-explore__val">{format(value)}</span>
      </label>
      <div className="range-wrap">
        <input
          id={id}
          type="range"
          className="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={(event) => onChange(Number(event.currentTarget.value))}
        />
      </div>
    </div>
  );
}

function ScatterStats({ points, fit }: { points: DataPoint[]; fit: RegressionFit | null }) {
  if (!fit) {
    return (
      <>
        <Stat label="n" value={String(points.length)} />
        <Stat label="r" value="-" />
      </>
    );
  }

  return (
    <>
      <Stat label="n" value={String(points.length)} />
      <Stat label="r" value={fmt(fit.r, 3)} />
      <Stat label="x̄, ȳ" value={`${fmt(fit.xbar, 2)}, ${fmt(fit.ybar, 2)}`} />
      <Stat label="ŷ" value={formatRegression(fit)} />
      <p className="data-analysis-explore__formula">r = Σdxdy / √(Σdx²Σdy²)</p>
    </>
  );
}

function OutlierStats({
  point,
  baseFit,
  allFit,
}: {
  point: DataPoint;
  baseFit: RegressionFit;
  allFit: RegressionFit;
}) {
  return (
    <>
      <Stat label="r₀" value={fmt(baseFit.r, 3)} />
      <Stat label="r" value={fmt(allFit.r, 3)} />
      <Stat label="b₀" value={fmt(baseFit.b, 3)} />
      <Stat label="b" value={fmt(allFit.b, 3)} />
      <p className="data-analysis-explore__formula">
        槓桿 ≈ |xₒ - x̄₀| = {fmt(Math.abs(point.x - baseFit.xbar), 2)}
      </p>
    </>
  );
}

function BoxplotStats({ count, summary }: { count: number; summary: QuartileSummary }) {
  return (
    <>
      <Stat label="n" value={String(count)} />
      <Stat label="Q₁, Q₂, Q₃" value={`${fmt(summary.q1, 2)}, ${fmt(summary.q2, 2)}, ${fmt(summary.q3, 2)}`} />
      <Stat label="IQR" value={fmt(summary.iqr, 2)} />
      <Stat label="離群" value={String(summary.outliers.length)} />
      <p className="data-analysis-explore__formula">鬚：1.5 IQR 內</p>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <p className="data-analysis-explore__stat">
      {label}
      <span>{value}</span>
    </p>
  );
}

function computePlot(width: number, height: number): PlotRect {
  const padX = Math.max(42, width * 0.075);
  const padTop = Math.max(30, height * 0.09);
  const padBottom = Math.max(58, height * 0.15);

  return {
    x: padX,
    y: padTop,
    w: Math.max(120, width - padX * 1.55),
    h: Math.max(120, height - padTop - padBottom),
  };
}

function drawMode(p: p5, plot: PlotRect, state: DataAnalysisState) {
  if (state.mode === 'scatter') drawScatterMode(p, plot, state);
  if (state.mode === 'outlier') drawOutlierMode(p, plot, state);
  if (state.mode === 'boxplot') drawBoxplotMode(p, plot, state);
}

function drawScatterMode(p: p5, plot: PlotRect, state: DataAnalysisState) {
  const fit = regression(state.scatter.points);
  drawUnitPlotFrame(p, plot);

  if (state.showGuides && fit) drawMeanGuides(p, plot, fit.xbar, fit.ybar);
  if (fit) drawRegressionLine(p, plot, fit, ACCENT, false);

  state.scatter.points.forEach((point, i) => {
    const pos = worldToScatterCanvas(plot, point.x, point.y);
    const selected = i === state.scatter.selectedIndex;
    drawPoint(p, pos.x, pos.y, selected ? 7 : 5, selected ? ACCENT : GUIDE, selected ? 230 : 150);
  });

  if (fit) {
    const mean = worldToScatterCanvas(plot, fit.xbar, fit.ybar);
    drawMeanPoint(p, mean.x, mean.y);
  }

  drawBottomLabel(p, plot, '點雲 / 平均點 / 迴歸線');
}

function drawOutlierMode(p: p5, plot: PlotRect, state: DataAnalysisState) {
  const baseFit = regression(state.outlier.base);
  const outlierFit = regression([...state.outlier.base, state.outlier.point]);
  drawUnitPlotFrame(p, plot);

  if (baseFit) drawRegressionLine(p, plot, baseFit, GUIDE, true);
  if (outlierFit) drawRegressionLine(p, plot, outlierFit, ACCENT, false);

  state.outlier.base.forEach((point) => {
    const pos = worldToScatterCanvas(plot, point.x, point.y);
    drawPoint(p, pos.x, pos.y, 5, GUIDE, 110);
  });

  const outlier = worldToScatterCanvas(plot, state.outlier.point.x, state.outlier.point.y);
  drawPoint(p, outlier.x, outlier.y, 8, RED, 230);
  drawOutlierRing(p, outlier.x, outlier.y);

  if (state.showGuides && baseFit) {
    const meanPos = worldToScatterCanvas(plot, baseFit.xbar, baseFit.ybar);
    const outlierX = worldToScatterCanvas(plot, state.outlier.point.x, baseFit.ybar);
    withDash(p, [5, 6], () => {
      p.stroke(255, 255, 255, 24);
      p.strokeWeight(1);
      p.line(meanPos.x, meanPos.y, outlierX.x, outlierX.y);
    });
  }

  drawBottomLabel(p, plot, '灰線：無離群　金線：加入離群');
}

function drawBoxplotMode(p: p5, plot: PlotRect, state: DataAnalysisState) {
  const q = quartileSummary(state.boxplot.values);
  drawBoxAxis(p, plot);

  const y = plot.y + plot.h * 0.44;
  const low = valueToScreen(plot, q.whiskerLow);
  const high = valueToScreen(plot, q.whiskerHigh);
  const q1 = valueToScreen(plot, q.q1);
  const q2 = valueToScreen(plot, q.q2);
  const q3 = valueToScreen(plot, q.q3);

  p.stroke(...ACCENT, 30);
  p.strokeWeight(9);
  p.line(low, y, high, y);

  p.stroke(...ACCENT, 220);
  p.strokeWeight(1.6);
  p.line(low, y, high, y);
  p.line(low, y - 18, low, y + 18);
  p.line(high, y - 18, high, y + 18);

  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 18);
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 220);
  p.strokeWeight(1.5);
  p.rect(q1, y - 38, q3 - q1, 76, 7);

  p.stroke(...ACCENT, 245);
  p.strokeWeight(2);
  p.line(q2, y - 42, q2, y + 42);

  if (state.showGuides) {
    withDash(p, [4, 6], () => {
      p.stroke(255, 255, 255, 24);
      p.strokeWeight(1);
      p.line(q1, plot.y, q1, plot.y + plot.h);
      p.line(q2, plot.y, q2, plot.y + plot.h);
      p.line(q3, plot.y, q3, plot.y + plot.h);
    });
  }

  drawBoxplotValues(p, plot, q, state);
  drawBottomLabel(p, plot, '盒：Q₁-Q₃　線：Q₂　鬚：1.5 IQR 內');
}

function drawBoxAxis(p: p5, plot: PlotRect) {
  const y = plot.y + plot.h * 0.78;

  p.stroke(255, 255, 255, 18);
  p.strokeWeight(1);
  p.line(plot.x, y, plot.x + plot.w, y);

  for (let v = 0; v <= 10; v += 2) {
    const x = valueToScreen(plot, v);
    p.stroke(255, 255, 255, 15);
    p.line(x, y - 5, x, y + 5);

    p.noStroke();
    p.fill(255, 255, 255, 62);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text(String(v), x, y + 10);
  }
}

function drawBoxplotValues(
  p: p5,
  plot: PlotRect,
  q: QuartileSummary,
  state: DataAnalysisState,
) {
  const baseY = plot.y + plot.h * 0.78;

  state.boxplot.values.forEach((value, i) => {
    const x = valueToScreen(plot, value);
    const y = baseY - 18 + (i % 2) * 11;
    const isOutlier = value < q.lowerFence || value > q.upperFence;
    const selected = i === state.boxplot.selectedIndex;
    drawPoint(p, x, y, selected ? 7 : 5, isOutlier ? RED : GUIDE, selected ? 230 : 150);
  });
}

function drawMeanGuides(p: p5, plot: PlotRect, xbar: number, ybar: number) {
  const a = worldToScatterCanvas(plot, xbar, 0);
  const b = worldToScatterCanvas(plot, xbar, 10);
  const c = worldToScatterCanvas(plot, 0, ybar);
  const d = worldToScatterCanvas(plot, 10, ybar);

  withDash(p, [5, 6], () => {
    p.stroke(255, 255, 255, 22);
    p.strokeWeight(1);
    p.line(a.x, a.y, b.x, b.y);
    p.line(c.x, c.y, d.x, d.y);
  });
}

function drawMeanPoint(p: p5, x: number, y: number) {
  p.noFill();
  p.stroke(...ACCENT, 220);
  p.strokeWeight(1.4);
  p.circle(x, y, 13);
  p.line(x - 6, y, x + 6, y);
  p.line(x, y - 6, x, y + 6);
}

function drawRegressionLine(
  p: p5,
  plot: PlotRect,
  fit: RegressionFit,
  color: readonly [number, number, number],
  dashed: boolean,
) {
  const p1 = worldToScatterCanvas(plot, 0, fit.a);
  const p2 = worldToScatterCanvas(plot, 10, fit.a + fit.b * 10);

  clipRect(p, plot, () => {
    if (dashed) {
      withDash(p, [8, 7], () => {
        p.stroke(color[0], color[1], color[2], 120);
        p.strokeWeight(1.2);
        p.line(p1.x, p1.y, p2.x, p2.y);
      });
      return;
    }

    p.stroke(color[0], color[1], color[2], 18);
    p.strokeWeight(7);
    p.line(p1.x, p1.y, p2.x, p2.y);
    p.stroke(color[0], color[1], color[2], 44);
    p.strokeWeight(3.5);
    p.line(p1.x, p1.y, p2.x, p2.y);
    p.stroke(color[0], color[1], color[2], 235);
    p.strokeWeight(1.55);
    p.line(p1.x, p1.y, p2.x, p2.y);
  });
}

function drawOutlierRing(p: p5, x: number, y: number) {
  p.noFill();
  p.stroke(RED[0], RED[1], RED[2], 70);
  p.strokeWeight(7);
  p.circle(x, y, 24);
  p.stroke(RED[0], RED[1], RED[2], 190);
  p.strokeWeight(1.2);
  p.circle(x, y, 18);
}

function drawPoint(
  p: p5,
  x: number,
  y: number,
  r: number,
  color: readonly [number, number, number],
  alpha: number,
) {
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha * 0.18);
  p.circle(x, y, r * 4.6);
  p.fill(color[0], color[1], color[2], alpha);
  p.circle(x, y, r * 2);
}

function nearestScatterPoint(
  p: p5,
  plot: PlotRect,
  points: DataPoint[],
  mx: number,
  my: number,
) {
  let best = -1;
  let bestD = Infinity;

  points.forEach((point, i) => {
    const pos = worldToScatterCanvas(plot, point.x, point.y);
    const d = p.dist(mx, my, pos.x, pos.y);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });

  return bestD <= 15 ? best : -1;
}

function nearestBoxValue(p: p5, plot: PlotRect, values: number[], mx: number, my: number) {
  const baseY = plot.y + plot.h * 0.78;
  let best = -1;
  let bestD = Infinity;

  values.forEach((value, i) => {
    const x = valueToScreen(plot, value);
    const y = baseY - 18 + (i % 2) * 11;
    const d = p.dist(mx, my, x, y);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });

  return bestD <= 15 ? best : -1;
}

function valueToScreen(plot: PlotRect, value: number): number {
  return worldToScatterCanvas(plot, value, 0).x;
}

function screenToValue(plot: PlotRect, x: number): number {
  return canvasToScatterWorld(plot, x, plot.y + plot.h).x;
}

function hitPlot(plot: PlotRect, x: number, y: number): boolean {
  return x >= plot.x && x <= plot.x + plot.w && y >= plot.y && y <= plot.y + plot.h;
}

function fmt(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(digits).replace('-0.00', '0.00').replace('-0.000', '0.000');
}

function formatRegression(fit: RegressionFit): string {
  const sign = fit.b < 0 ? '-' : '+';
  return `${fmt(fit.a, 2)} ${sign} ${fmt(Math.abs(fit.b), 2)}x`;
}
