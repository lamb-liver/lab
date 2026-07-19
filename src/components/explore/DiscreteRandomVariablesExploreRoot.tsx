import { canvas2d } from '../../systems/rendering/canvas2d';
import { useCallback, useMemo, useRef, useState, type MutableRefObject } from 'react';
import type p5 from 'p5';
import {
  buildModel,
  clamp,
  createDefaultDiscreteState,
  INITIAL_POSITION_PMF,
  setProbabilityAt,
  syncTailThreshold,
  type DiscreteMode,
  type DiscreteState,
  type DistributionModel,
  type DistributionRow,
  type SpreadShape,
  type TailModel,
} from '../../explore/discrete-random-variables/geometry';
import { useRectP5CanvasHost, type ExtendSketch } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/discrete-random-variables-explore.css';

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Layout = {
  desktop: boolean;
  pad: number;
  visual: Rect;
  sidebar: Rect;
};

type ButtonHit = Rect & {
  kind: 'spread' | 'tailModel' | 'reset';
  value: string;
};

type SliderHit = Rect & {
  key: 'n' | 'p' | 'k';
  min: number;
  max: number;
  step: number;
};

type BarHit = Rect & {
  index: number;
};

type UiHits = {
  buttons: ButtonHit[];
  sliders: SliderHit[];
  bars: BarHit[];
};

type DragState =
  | { type: 'slider'; slider: SliderHit }
  | { type: 'bar'; index: number }
  | null;

type RuntimeState = DiscreteState & {
  dragging: DragState;
};

type ChartSnapshot = {
  plot: Rect;
};

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

const MODES: Array<{ id: DiscreteMode; label: string }> = [
  { id: 'position', label: '位置' },
  { id: 'spread', label: '展寬' },
  { id: 'tail', label: '尾端' },
];

const SPREAD_SHAPES: Array<{ id: SpreadShape; label: string }> = [
  { id: 'compact', label: '集中' },
  { id: 'uniform', label: '均勻' },
  { id: 'bimodal', label: '雙峰' },
];

const TAIL_MODELS: Array<{ id: TailModel; label: string }> = [
  { id: 'binomial', label: '二項' },
  { id: 'geometric', label: '幾何' },
];

function createRuntimeState(): RuntimeState {
  return {
    ...createDefaultDiscreteState(),
    dragging: null,
  };
}

function createUiHits(): UiHits {
  return { buttons: [], sliders: [], bars: [] };
}

function measureCanvas(host: HTMLElement): { width: number; height: number } {
  const width = Math.max(320, Math.floor(host.clientWidth || 920));
  const height =
    width < 760
      ? Math.round(clamp(width * 1.48, 560, 940))
      : Math.round(clamp(width * 0.62, 520, 760));

  return { width, height };
}

function isCanvasPointer(p: p5, host: HTMLElement, event?: Event): boolean {
  const target = event?.target;
  if (target instanceof HTMLCanvasElement) return host.contains(target);
  return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
}

export default function DiscreteRandomVariablesExploreRoot() {
  const stateRef = useRef<RuntimeState>(createRuntimeState());
  const uiRef = useRef<UiHits>(createUiHits());
  const lastChartRef = useRef<ChartSnapshot | null>(null);
  const [redrawKey, redraw] = useState(0);

  const setMode = useCallback((mode: DiscreteMode) => {
    const state = stateRef.current;
    state.mode = mode;
    state.dragging = null;
    syncTailThreshold(state);
    redraw((n) => n + 1);
  }, []);

  const draw = useCallback((p: p5) => {
    const state = stateRef.current;
    const ui = createUiHits();
    uiRef.current = ui;

    p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");
    p.background(...BG);

    const layout = getLayout(p.width, p.height);
    const frameModel = buildModel(state);

    drawStage(p, layout);
    drawChart(p, layout.visual, frameModel, state, ui, lastChartRef);
    drawSidebar(p, layout.sidebar, frameModel, state, ui);
  }, []);

  const extendSketch = useMemo<ExtendSketch>(() => {
    return (p, host) => {
      const commit = () => redraw((n) => n + 1);

      p.mousePressed = (event?: Event) => {
        if (!isCanvasPointer(p, host, event)) return;
        const state = stateRef.current;
        const ui = uiRef.current;

        for (const btn of ui.buttons) {
          if (hit(p.mouseX, p.mouseY, btn)) {
            handleButton(state, btn);
            commit();
            return false;
          }
        }

        for (const slider of ui.sliders) {
          if (hit(p.mouseX, p.mouseY, slider)) {
            state.dragging = { type: 'slider', slider };
            updateSliderFromMouse(p, state, slider);
            commit();
            return false;
          }
        }

        if (state.mode === 'position') {
          for (const bar of ui.bars) {
            if (hit(p.mouseX, p.mouseY, bar)) {
              state.selectedIndex = bar.index;
              state.dragging = { type: 'bar', index: bar.index };
              updateBarFromMouse(p, state, lastChartRef.current, bar.index);
              commit();
              return false;
            }
          }
        }

        return undefined;
      };

      p.mouseDragged = () => {
        const state = stateRef.current;
        if (!state.dragging) return;

        if (state.dragging.type === 'slider') {
          updateSliderFromMouse(p, state, state.dragging.slider);
          commit();
          return false;
        }

        updateBarFromMouse(p, state, lastChartRef.current, state.dragging.index);
        commit();
        return false;
      };

      p.mouseReleased = () => {
        if (!stateRef.current.dragging) return;
        stateRef.current.dragging = null;
        commit();
        return false;
      };
    };
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureCanvas, extendSketch, {
    loop: false,
    redrawKey,
  });
  const currentMode = stateRef.current.mode;

  return (
    <div className="discrete-random-variables-explore">
      <div className="discrete-random-variables-explore__stage">
        <div className="discrete-random-variables-explore__visual">
          <div className="discrete-random-variables-explore__toolbar" aria-label="離散隨機變數模式">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                data-active={currentMode === mode.id}
                aria-pressed={currentMode === mode.id}
                onClick={() => setMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div
            ref={canvasHostRef}
            className="discrete-random-variables-explore__canvas"
            role="img"
            aria-label="離散隨機變數互動視覺化"
          />
        </div>
      </div>
    </div>
  );
}

function getLayout(width: number, height: number): Layout {
  const pad = width < 760 ? 14 : 24;
  const desktop = width >= 900;
  const sidebarW = desktop ? 304 : width - pad * 2;

  if (desktop) {
    return {
      desktop,
      pad,
      visual: {
        x: pad,
        y: pad,
        w: width - sidebarW - pad * 3,
        h: height - pad * 2,
      },
      sidebar: {
        x: width - sidebarW - pad,
        y: pad,
        w: sidebarW,
        h: height - pad * 2,
      },
    };
  }

  const visualH = Math.min(height * 0.55, width * 0.76);

  return {
    desktop,
    pad,
    visual: {
      x: pad,
      y: pad,
      w: width - pad * 2,
      h: visualH,
    },
    sidebar: {
      x: pad,
      y: pad + visualH + 14,
      w: sidebarW,
      h: height - visualH - pad * 2 - 14,
    },
  };
}

function drawStage(p: p5, layout: Layout) {
  p.noFill();
  strokeWhite(p, 14);
  p.strokeWeight(1);
  p.rect(layout.visual.x, layout.visual.y, layout.visual.w, layout.visual.h, 18);

  if (layout.desktop) {
    strokeWhite(p, 18);
    p.line(
      layout.sidebar.x - 14,
      layout.sidebar.y + 8,
      layout.sidebar.x - 14,
      layout.sidebar.y + layout.sidebar.h - 8,
    );
    return;
  }

  strokeWhite(p, 14);
  p.line(
    layout.sidebar.x + 8,
    layout.sidebar.y - 8,
    layout.sidebar.x + layout.sidebar.w - 8,
    layout.sidebar.y - 8,
  );
}

function drawChart(
  p: p5,
  area: Rect,
  model: DistributionModel,
  state: RuntimeState,
  ui: UiHits,
  lastChartRef: MutableRefObject<ChartSnapshot | null>,
) {
  const { rows, stats, yMax } = model;
  const m = {
    l: area.w < 520 ? 38 : 54,
    r: 24,
    t: 34,
    b: 56,
  };
  const plot = {
    x: area.x + m.l,
    y: area.y + m.t,
    w: area.w - m.l - m.r,
    h: area.h - m.t - m.b,
  };

  lastChartRef.current = { plot };

  drawGrid(p, plot);
  drawSigmaBand(p, plot, rows, stats);
  drawBars(p, plot, rows, model, state, ui);
  drawMeanLine(p, plot, rows, stats);
  drawAxes(p, plot, rows, yMax);
  drawBottomLegend(p, area, rows, state);
}

function drawGrid(p: p5, plot: Rect) {
  strokeWhite(p, 10);
  p.strokeWeight(1);

  for (let i = 0; i <= 4; i += 1) {
    const y = mapValue(i, 0, 4, plot.y + plot.h, plot.y);
    p.line(plot.x, y, plot.x + plot.w, y);
  }

  strokeWhite(p, 7);
  for (let i = 0; i <= 6; i += 1) {
    const x = mapValue(i, 0, 6, plot.x, plot.x + plot.w);
    p.line(x, plot.y, x, plot.y + plot.h);
  }
}

function drawSigmaBand(
  p: p5,
  plot: Rect,
  rows: DistributionRow[],
  stats: DistributionModel['stats'],
) {
  const minX = rows[0].x;
  const maxX = rows[rows.length - 1].x;
  const left = stats.mean - stats.sigma;
  const right = stats.mean + stats.sigma;

  if (right < minX || left > maxX) return;

  const x1 = xToScreen(clamp(left, minX, maxX), plot, rows);
  const x2 = xToScreen(clamp(right, minX, maxX), plot, rows);

  p.noStroke();
  fillAccent(p, 16);
  p.rect(x1, plot.y, Math.max(1, x2 - x1), plot.h);
}

function drawBars(
  p: p5,
  plot: Rect,
  rows: DistributionRow[],
  model: DistributionModel,
  state: RuntimeState,
  ui: UiHits,
) {
  const slot = plot.w / rows.length;
  const barW = Math.max(4, slot * 0.62);

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const cx = plot.x + slot * (i + 0.5);
    const h = mapValue(row.p, 0, model.yMax, 0, plot.h);
    const x = cx - barW / 2;
    const y = plot.y + plot.h - h;
    const isSelected = state.mode === 'position' && i === state.selectedIndex;
    const isTail =
      state.mode === 'tail' && model.stats.threshold !== null && row.x >= model.stats.threshold;

    if (row.bucket) fillAccent(p, isTail ? 180 : 118);
    else if (isTail) fillAccent(p, 150);
    else if (isSelected) fillAccent(p, 220);
    else fillAccent(p, 86);

    p.noStroke();
    p.rect(x, y, barW, h, 4, 4, 1, 1);

    strokeAccent(p, isSelected || isTail || row.bucket ? 210 : 80);
    p.strokeWeight(isSelected || isTail || row.bucket ? 1.4 : 1);
    p.noFill();
    p.rect(x, y, barW, h, 4, 4, 1, 1);

    if (row.bucket) drawBucketMark(p, cx, y - 8);

    ui.bars.push({ x, y: plot.y, w: barW, h: plot.h, index: i });
  }
}

function drawBucketMark(p: p5, x: number, y: number) {
  strokeWhite(p, 100);
  p.strokeWeight(1);
  p.noFill();
  p.line(x - 6, y, x + 6, y);
  p.line(x + 6, y, x + 2, y - 4);
  p.line(x + 6, y, x + 2, y + 4);
}

function drawMeanLine(
  p: p5,
  plot: Rect,
  rows: DistributionRow[],
  stats: DistributionModel['stats'],
) {
  const minX = rows[0].x;
  const maxX = rows[rows.length - 1].x;

  if (stats.mean < minX) {
    drawMeanArrow(p, plot.x, plot.y - 8, -1);
    return;
  }

  if (stats.mean > maxX) {
    drawMeanArrow(p, plot.x + plot.w, plot.y - 8, 1);
    return;
  }

  const x = xToScreen(stats.mean, plot, rows);
  const ctx = canvas2d(p);

  strokeWhite(p, 80);
  p.strokeWeight(1);
  ctx.setLineDash([4, 6]);
  p.line(x, plot.y, x, plot.y + plot.h);
  ctx.setLineDash([]);

  p.noStroke();
  fillWhite(p, 160);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('μ', x, plot.y - 5);
}

function drawMeanArrow(p: p5, x: number, y: number, dir: number) {
  strokeWhite(p, 120);
  p.strokeWeight(1);
  p.noFill();

  const len = 28;
  const x0 = x - dir * len;
  const x1 = x;

  p.line(x0, y, x1, y);
  p.line(x1, y, x1 - dir * 6, y - 5);
  p.line(x1, y, x1 - dir * 6, y + 5);

  p.noStroke();
  fillWhite(p, 150);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('μ', x0 + dir * 8, y - 4);
}

function drawAxes(p: p5, plot: Rect, rows: DistributionRow[], yMax: number) {
  strokeWhite(p, 34);
  p.strokeWeight(1);
  p.line(plot.x, plot.y + plot.h, plot.x + plot.w, plot.y + plot.h);
  p.line(plot.x, plot.y, plot.x, plot.y + plot.h);

  fillWhite(p, 92);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);

  const step = rows.length > 24 ? 4 : rows.length > 13 ? 2 : 1;
  const slot = plot.w / rows.length;

  for (let i = 0; i < rows.length; i += 1) {
    if (i % step !== 0 && i !== rows.length - 1) continue;
    const row = rows[i];
    const x = plot.x + slot * (i + 0.5);
    p.text(row.label, x, plot.y + plot.h + 9);
  }

  p.textAlign(p.RIGHT, p.CENTER);
  p.text(formatProb(yMax), plot.x - 8, plot.y);
  p.text('0', plot.x - 8, plot.y + plot.h);
}

function drawBottomLegend(p: p5, area: Rect, rows: DistributionRow[], state: RuntimeState) {
  const y = area.y + area.h - 20;
  let label = '';

  if (state.mode === 'position') label = '拖動長條：質量重分配，總和維持 1';
  else if (state.mode === 'spread') label = '同一中心：比較質量離 μ 的距離';
  else if (state.tailModel === 'binomial') label = `固定上界：X = 0, 1, ..., ${Math.round(state.n)}`;
  else label = `${rows[rows.length - 1].label} 是尾巴收納桶；統計仍讀無限幾何分佈`;

  fillWhite(p, 95);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(label, area.x + area.w / 2, y);
}

function drawSidebar(
  p: p5,
  area: Rect,
  model: DistributionModel,
  state: RuntimeState,
  ui: UiHits,
) {
  let y = area.y + 8;

  y = drawParamSection(p, area, y, model, state, ui);
  y += 18;
  y = drawStatsSection(p, area, y, model, state);
  y += 18;
  drawFormulaSection(p, area, y, state);
}

function drawParamSection(
  p: p5,
  area: Rect,
  y: number,
  model: DistributionModel,
  state: RuntimeState,
  ui: UiHits,
) {
  fillWhite(p, 150);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text('參數', area.x, y);
  y += 22;

  if (state.mode === 'position') {
    const selected = state.selectedIndex;
    const prob = state.positionPmf[selected];

    drawReadout(p, area.x, y, area.w, '位置 xᵢ', String(selected));
    y += 28;
    drawReadout(p, area.x, y, area.w, '機率 pᵢ', formatProb(prob));
    y += 28;
    y += 4;
    drawSmallHint(p, area.x, y, '在主圖拖動長條高度');
    y += 24;

    return drawSmallButton(p, area.x, y, area.w, '重設質量', 'reset', 'position', ui);
  }

  if (state.mode === 'spread') {
    y = drawButtonRow(
      p,
      area.x,
      y,
      area.w,
      SPREAD_SHAPES.map((shape) => ({
        label: shape.label,
        active: state.spreadShape === shape.id,
        kind: 'spread' as const,
        value: shape.id,
      })),
      ui,
    );

    y += 14;
    drawReadout(p, area.x, y, area.w, '中心 μ', formatNum(model.stats.mean, 2));
    y += 28;
    drawReadout(p, area.x, y, area.w, '形狀 S', currentSpreadLabel(state));
    y += 28;

    return y;
  }

  y = drawButtonRow(
    p,
    area.x,
    y,
    area.w,
    TAIL_MODELS.map((tailModel) => ({
      label: tailModel.label,
      active: state.tailModel === tailModel.id,
      kind: 'tailModel' as const,
      value: tailModel.id,
    })),
    ui,
  );
  y += 14;

  if (state.tailModel === 'binomial') {
    const n = Math.round(clamp(state.n, 4, 20));
    const k = Math.round(clamp(state.k, 0, n));

    y = drawSlider(p, area.x, y, area.w, {
      key: 'n',
      label: '試驗數 n',
      min: 4,
      max: 20,
      step: 1,
      value: n,
      format: (v) => String(Math.round(v)),
    }, ui);
    y = drawSlider(p, area.x, y, area.w, {
      key: 'p',
      label: '成功率 p',
      min: 0.05,
      max: 0.95,
      step: 0.01,
      value: clamp(state.p, 0.05, 0.95),
      format: formatProb,
    }, ui);
    y = drawSlider(p, area.x, y, area.w, {
      key: 'k',
      label: '門檻 k',
      min: 0,
      max: n,
      step: 1,
      value: k,
      format: (v) => String(Math.round(v)),
    }, ui);

    return y;
  }

  const maxK = model.rows[model.rows.length - 1].x;
  const k = Math.round(clamp(state.k, 1, maxK));

  y = drawSlider(p, area.x, y, area.w, {
    key: 'p',
    label: '成功率 p',
    min: 0.05,
    max: 0.9,
    step: 0.01,
    value: clamp(state.p, 0.05, 0.9),
    format: formatProb,
  }, ui);
  y = drawSlider(p, area.x, y, area.w, {
    key: 'k',
    label: '門檻 k',
    min: 1,
    max: maxK,
    step: 1,
    value: k,
    format: (v) => String(Math.round(v)),
  }, ui);

  return y;
}

function drawStatsSection(
  p: p5,
  area: Rect,
  y: number,
  model: DistributionModel,
  state: RuntimeState,
) {
  const { stats } = model;

  fillWhite(p, 150);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text('統計', area.x, y);
  y += 22;

  const rows =
    state.mode === 'tail'
      ? [
          ['Σpᵢ', formatNum(stats.sum, 3)],
          ['μ = E(X)', formatNum(stats.mean, 3)],
          ['σ² = Var(X)', formatNum(stats.variance, 3)],
          [`P(X >= ${stats.threshold})`, formatProb(stats.tailProb ?? NaN)],
        ]
      : [
          ['Σpᵢ', formatNum(stats.sum, 3)],
          ['μ = E(X)', formatNum(stats.mean, 3)],
          ['σ² = Var(X)', formatNum(stats.variance, 3)],
          ['σ', formatNum(stats.sigma, 3)],
        ];

  for (const [label, value] of rows) {
    drawReadout(p, area.x, y, area.w, label, value);
    y += 28;
  }

  return y;
}

function drawFormulaSection(p: p5, area: Rect, y: number, state: RuntimeState) {
  fillWhite(p, 150);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text('公式', area.x, y);
  y += 22;

  const formulas = getFormulaLines(state);

  fillWhite(p, 105);
  p.textSize(12);
  for (const formula of formulas) {
    p.text(formula, area.x, y);
    y += 22;
  }

  return y;
}

function getFormulaLines(state: RuntimeState): string[] {
  if (state.mode === 'tail' && state.tailModel === 'binomial') {
    return [
      'X ~ B(n, p)',
      'P(X=x)=C(n,x)p^x(1-p)^(n-x)',
      'μ = np',
      'σ² = np(1-p)',
    ];
  }

  if (state.mode === 'tail' && state.tailModel === 'geometric') {
    return ['X ~ Geom(p)', 'P(X=x)=p(1-p)^(x-1)', 'P(X>=k)=(1-p)^(k-1)', 'μ = 1/p'];
  }

  return ['P(X = xᵢ) = pᵢ', 'Σ pᵢ = 1', 'μ = Σ xᵢpᵢ', 'σ² = Σ(xᵢ - μ)²pᵢ'];
}

function drawButtonRow(
  p: p5,
  x: number,
  y: number,
  w: number,
  items: Array<{ label: string; active: boolean; kind: ButtonHit['kind']; value: string }>,
  ui: UiHits,
) {
  const gap = 8;
  const btnW = (w - gap * (items.length - 1)) / items.length;
  const btnH = 34;

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const bx = x + i * (btnW + gap);

    drawPillButton(p, bx, y, btnW, btnH, item.label, item.active);
    ui.buttons.push({ x: bx, y, w: btnW, h: btnH, kind: item.kind, value: item.value });
  }

  return y + btnH;
}

function drawSmallButton(
  p: p5,
  x: number,
  y: number,
  w: number,
  label: string,
  kind: ButtonHit['kind'],
  value: string,
  ui: UiHits,
) {
  const h = 34;
  drawPillButton(p, x, y, w, h, label, false);
  ui.buttons.push({ x, y, w, h, kind, value });
  return y + h;
}

function drawPillButton(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  active: boolean,
) {
  p.noStroke();
  if (active) fillAccent(p, 34);
  else fillWhite(p, 8);
  p.rect(x, y, w, h, 999);

  if (active) strokeAccent(p, 145);
  else strokeWhite(p, 28);
  p.strokeWeight(1);
  p.noFill();
  p.rect(x, y, w, h, 999);

  p.noStroke();
  if (active) p.fill(235, 218, 176, 220);
  else fillWhite(p, 120);
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(label, x + w / 2, y + h / 2);
}

function drawSlider(
  p: p5,
  x: number,
  y: number,
  w: number,
  cfg: {
    key: SliderHit['key'];
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    format: (value: number) => string;
  },
  ui: UiHits,
) {
  const top = y;
  const trackY = y + 32;
  const trackH = 4;
  const h = 54;

  fillWhite(p, 78);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(cfg.label, x, top);

  fillWhite(p, 150);
  p.textAlign(p.RIGHT, p.TOP);
  p.text(cfg.format(cfg.value), x + w, top);

  strokeWhite(p, 24);
  p.strokeWeight(trackH);
  p.line(x, trackY, x + w, trackY);

  const t = inverseLerp(cfg.min, cfg.max, cfg.value);
  const hx = x + t * w;

  strokeAccent(p, 100);
  p.strokeWeight(trackH);
  p.line(x, trackY, hx, trackY);

  p.noStroke();
  fillAccent(p, 210);
  p.circle(hx, trackY, 13);

  ui.sliders.push({
    x,
    y: trackY - 14,
    w,
    h: 28,
    key: cfg.key,
    min: cfg.min,
    max: cfg.max,
    step: cfg.step,
  });

  return y + h;
}

function drawReadout(p: p5, x: number, y: number, w: number, label: string, value: string) {
  fillWhite(p, 76);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, x, y + 12);

  fillWhite(p, 165);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(value, x + w, y + 12);
}

function drawSmallHint(p: p5, x: number, y: number, label: string) {
  fillWhite(p, 82);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(label, x, y);
}

function handleButton(state: RuntimeState, btn: ButtonHit) {
  if (btn.kind === 'spread') {
    state.spreadShape = btn.value as SpreadShape;
    return;
  }

  if (btn.kind === 'tailModel') {
    state.tailModel = btn.value as TailModel;
    syncTailThreshold(state);
    return;
  }

  if (btn.kind === 'reset' && btn.value === 'position') {
    state.positionPmf = [...INITIAL_POSITION_PMF];
    state.selectedIndex = 4;
  }
}

function updateSliderFromMouse(p: p5, state: RuntimeState, slider: SliderHit) {
  const t = clamp((p.mouseX - slider.x) / slider.w, 0, 1);
  const raw = lerp(slider.min, slider.max, t);
  const value = snapToStep(raw, slider.step);

  if (slider.key === 'n') {
    state.n = Math.round(clamp(value, slider.min, slider.max));
    syncTailThreshold(state);
    return;
  }

  if (slider.key === 'p') {
    state.p = clamp(value, slider.min, slider.max);
    syncTailThreshold(state);
    return;
  }

  state.k = Math.round(clamp(value, slider.min, slider.max));
  syncTailThreshold(state);
}

function updateBarFromMouse(
  p: p5,
  state: RuntimeState,
  lastChart: ChartSnapshot | null,
  index: number,
) {
  if (!lastChart) return;

  const { plot } = lastChart;
  const newP = clamp(mapValue(p.mouseY, plot.y + plot.h, plot.y, 0, 1), 0, 1);
  state.positionPmf = setProbabilityAt(state.positionPmf, index, newP);
}

function xToScreen(value: number, plot: Rect, rows: DistributionRow[]): number {
  const minX = rows[0].x;
  const maxX = rows[rows.length - 1].x;
  const slot = plot.w / rows.length;

  if (maxX === minX) return plot.x + plot.w / 2;

  const t = (value - minX) / (maxX - minX);
  return plot.x + slot / 2 + t * (plot.w - slot);
}

function currentSpreadLabel(state: RuntimeState): string {
  return SPREAD_SHAPES.find((shape) => shape.id === state.spreadShape)?.label ?? '集中';
}

function hit(px: number, py: number, box: Rect): boolean {
  return px >= box.x && px <= box.x + box.w && py >= box.y && py <= box.y + box.h;
}

function inverseLerp(a: number, b: number, value: number): number {
  if (Math.abs(b - a) < 1e-9) return 0;
  return clamp((value - a) / (b - a), 0, 1);
}

function snapToStep(value: number, step: number): number {
  if (!step) return value;
  return Math.round(value / step) * step;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mapValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (Math.abs(inMax - inMin) < 1e-9) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function formatNum(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '-';
  const fixed = value.toFixed(digits);
  return fixed.replace(/\.?0+$/, '');
}

function formatProb(value: number): string {
  return formatNum(value, 3);
}

function fillAccent(p: p5, alpha = 255) {
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], alpha);
}

function strokeAccent(p: p5, alpha = 255) {
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], alpha);
}

function fillWhite(p: p5, alpha = 255) {
  p.fill(WHITE[0], WHITE[1], WHITE[2], alpha);
}

function strokeWhite(p: p5, alpha = 255) {
  p.stroke(WHITE[0], WHITE[1], WHITE[2], alpha);
}
