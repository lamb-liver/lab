import { useCallback, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { clipRect } from '../../systems/rendering/p5PlotHelpers';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/exponential-logarithm-explore.css';

type Mode = 'inverse' | 'e' | 'compare';
type AxisMode = 'linear' | 'logY';

type Params = {
  mode: Mode;
  axisMode: AxisMode;
  a: number;
  b: number;
  n: number;
  areaX: number;
  compareA: number;
};

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Point = {
  x: number;
  y: number;
};

type CurveStyle = {
  alpha?: number;
  glow?: boolean;
  weight?: number;
  color?: readonly [number, number, number];
};

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const WHITE = [255, 255, 255] as const;
const TEXT = [232, 232, 232] as const;
const MUTED = [140, 140, 140] as const;

const DEFAULT_PARAMS: Params = {
  mode: 'inverse',
  axisMode: 'linear',
  a: 2,
  b: 1,
  n: 24,
  areaX: Math.E,
  compareA: 2,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mapNumber(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function lerpNumber(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function avoidOne(value: number, current: number) {
  if (Math.abs(value - 1) < 0.035) return current;
  return value;
}

function fmt(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  if (Object.is(value, -0) || Math.abs(value) < 1e-12) return '0';

  return value.toFixed(digits).replace(/\.?0+$/, '');
}

function exponentialCanvasHeight(width: number, mode: Mode = 'inverse') {
  return (
    mode === 'e' && width < 520
      ? Math.round(clamp(width * 1.32, 440, 520))
      : width < 520
      ? Math.round(clamp(width * 1.05, 360, 430))
      : Math.round(clamp(width * 0.64, 380, 560))
  );
}

function measureExponentialCanvas(host: HTMLElement, mode: Mode = 'inverse') {
  const width = Math.max(320, Math.floor(host.clientWidth || 640));
  const height = exponentialCanvasHeight(width, mode);
  return { width, height };
}

function stageRect(p: p5): Rect {
  return {
    x: 22,
    y: 22,
    w: Math.max(260, p.width - 44),
    h: Math.max(300, p.height - 44),
  };
}

function insetRect(rect: Rect, left: number, top: number, right: number, bottom: number): Rect {
  return {
    x: rect.x + left,
    y: rect.y + top,
    w: rect.w - left - right,
    h: rect.h - top - bottom,
  };
}

function toScreen(rect: Rect, x: number, y: number, xMin: number, xMax: number, yMin: number, yMax: number) {
  return {
    x: mapNumber(x, xMin, xMax, rect.x, rect.x + rect.w),
    y: mapNumber(y, yMin, yMax, rect.y + rect.h, rect.y),
  };
}

function mapLogY(rect: Rect, y: number, yMin: number, yMax: number) {
  const ly = Math.log(y);
  const lMin = Math.log(yMin);
  const lMax = Math.log(yMax);
  return mapNumber(ly, lMin, lMax, rect.y + rect.h, rect.y);
}

function sampleFunction(xMin: number, xMax: number, count: number, fn: (x: number) => number) {
  const points: Point[] = [];

  for (let i = 0; i <= count; i += 1) {
    const x = lerpNumber(xMin, xMax, i / count);
    points.push({ x, y: fn(x) });
  }

  return points;
}

function drawFrame(p: p5, title: string, subtitle: string) {
  const stage = stageRect(p);

  p.background(10, 10, 10);
  p.noFill();
  p.stroke(...WHITE, 18);
  p.strokeWeight(1);
  p.rect(stage.x, stage.y, stage.w, stage.h, 14);

  p.noStroke();
  p.fill(...GOLD);
  p.textStyle(p.BOLD);
  p.textSize(14);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text(title, stage.x + 22, stage.y + 32);

  p.fill(150);
  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.text(subtitle, stage.x + 22, stage.y + 54);

  return stage;
}

function drawCartesianPlot(
  p: p5,
  rect: Rect,
  cfg: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    xStep?: number;
    yStep?: number;
    compact?: boolean;
  },
) {
  const xStep = cfg.xStep ?? 1;
  const yStep = cfg.yStep ?? 1;

  clipRect(p, rect, () => {
    p.strokeWeight(1);

    for (let x = Math.ceil(cfg.xMin / xStep) * xStep; x <= cfg.xMax; x += xStep) {
      const point = toScreen(rect, x, 0, cfg.xMin, cfg.xMax, cfg.yMin, cfg.yMax);
      p.stroke(...WHITE, Math.abs(x) < 1e-9 ? 38 : 12);
      p.line(point.x, rect.y, point.x, rect.y + rect.h);
    }

    for (let y = Math.ceil(cfg.yMin / yStep) * yStep; y <= cfg.yMax; y += yStep) {
      const point = toScreen(rect, 0, y, cfg.xMin, cfg.xMax, cfg.yMin, cfg.yMax);
      p.stroke(...WHITE, Math.abs(y) < 1e-9 ? 38 : 12);
      p.line(rect.x, point.y, rect.x + rect.w, point.y);
    }
  });

  p.noFill();
  p.stroke(...WHITE, 20);
  p.rect(rect.x, rect.y, rect.w, rect.h, 10);

  if (!cfg.compact) {
    p.noStroke();
    p.fill(...MUTED, 180);
    p.textSize(11);
    p.textAlign(p.RIGHT, p.TOP);
    p.text('x', rect.x + rect.w - 8, rect.y + rect.h + 8);
    p.textAlign(p.LEFT, p.TOP);
    p.text('y', rect.x - 20, rect.y + 8);
  }
}

function drawLogYPlot(
  p: p5,
  rect: Rect,
  cfg: { xMin: number; xMax: number; yMin: number; yMax: number },
) {
  clipRect(p, rect, () => {
    p.strokeWeight(1);

    for (let x = Math.ceil(cfg.xMin); x <= cfg.xMax; x += 1) {
      const sx = mapNumber(x, cfg.xMin, cfg.xMax, rect.x, rect.x + rect.w);
      p.stroke(...WHITE, Math.abs(x) < 1e-9 ? 38 : 12);
      p.line(sx, rect.y, sx, rect.y + rect.h);
    }

    for (const yv of [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10]) {
      const sy = mapLogY(rect, yv, cfg.yMin, cfg.yMax);
      p.stroke(...WHITE, Math.abs(yv - 1) < 1e-9 ? 38 : 12);
      p.line(rect.x, sy, rect.x + rect.w, sy);
    }
  });

  p.noFill();
  p.stroke(...WHITE, 20);
  p.rect(rect.x, rect.y, rect.w, rect.h, 10);
}

function drawCurve(
  p: p5,
  rect: Rect,
  points: Point[],
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  style: CurveStyle = {},
) {
  const color = style.color ?? GOLD;
  const layers = style.glow
    ? [
        { weight: 8, alpha: 16 },
        { weight: 4, alpha: 42 },
        { weight: style.weight ?? 1.5, alpha: style.alpha ?? 230 },
      ]
    : [{ weight: style.weight ?? 1, alpha: style.alpha ?? 80 }];

  for (const layer of layers) {
    clipRect(p, rect, () => {
      p.noFill();
      p.stroke(...color, layer.alpha);
      p.strokeWeight(layer.weight);
      p.strokeCap(p.ROUND);
      p.strokeJoin(p.ROUND);

      p.beginShape();
      let drawing = false;

      for (const point of points) {
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
          if (drawing) {
            p.endShape();
            p.beginShape();
            drawing = false;
          }
          continue;
        }

        const screen = toScreen(rect, point.x, point.y, xMin, xMax, yMin, yMax);
        p.vertex(screen.x, screen.y);
        drawing = true;
      }

      p.endShape();
    });
  }
}

function drawCurveLogY(
  p: p5,
  rect: Rect,
  points: Point[],
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  style: CurveStyle = {},
) {
  const color = style.color ?? GOLD;
  const layers = style.glow
    ? [
        { weight: 8, alpha: 16 },
        { weight: 4, alpha: 42 },
        { weight: style.weight ?? 1.5, alpha: style.alpha ?? 230 },
      ]
    : [{ weight: style.weight ?? 1, alpha: style.alpha ?? 80 }];

  for (const layer of layers) {
    clipRect(p, rect, () => {
      p.noFill();
      p.stroke(...color, layer.alpha);
      p.strokeWeight(layer.weight);
      p.strokeCap(p.ROUND);
      p.strokeJoin(p.ROUND);

      p.beginShape();
      let drawing = false;

      for (const point of points) {
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y) || point.y <= 0) {
          if (drawing) {
            p.endShape();
            p.beginShape();
            drawing = false;
          }
          continue;
        }

        const sx = mapNumber(point.x, xMin, xMax, rect.x, rect.x + rect.w);
        const sy = mapLogY(rect, point.y, yMin, yMax);
        p.vertex(sx, sy);
        drawing = true;
      }

      p.endShape();
    });
  }
}

function drawPlotLabel(p: p5, rect: Rect, label: string, dx: number, dy: number, alpha: number) {
  p.noStroke();
  p.fill(...TEXT, alpha);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(label, rect.x + dx, rect.y + dy);
}

function drawBottomNote(p: p5, rect: Rect, label: string) {
  p.noStroke();
  p.fill(...MUTED, 190);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(label, rect.x + rect.w / 2, rect.y + rect.h - 18);
}

function drawMiniPanelTitle(p: p5, rect: Rect, label: string) {
  p.noStroke();
  p.fill(...TEXT, 220);
  p.textSize(13);
  p.textStyle(p.BOLD);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text(label, rect.x, rect.y);
  p.textStyle(p.NORMAL);
}

function drawInverseMode(p: p5, params: Params) {
  const stage = drawFrame(
    p,
    '指數與對數',
    params.axisMode === 'linear' ? '互為反函數，沿 y = x 對稱' : 'log y 座標把倍增關係變成直線',
  );
  const compact = p.width < 520;
  const plot = insetRect(stage, compact ? 30 : 54, 74, compact ? 22 : 36, 54);

  if (params.axisMode === 'linear') {
    drawCartesianPlot(p, plot, {
      xMin: -4,
      xMax: 4,
      yMin: -4,
      yMax: 4,
      xStep: 1,
      yStep: 1,
    });

    const expPts = sampleFunction(-4, 4, 360, (x) => params.b * params.a ** x);
    const logPts = sampleFunction(0.02, 4, 360, (x) => Math.log(x / params.b) / Math.log(params.a));
    const diagPts = sampleFunction(-4, 4, 80, (x) => x);

    drawCurve(p, plot, expPts, -4, 4, -4, 4, { glow: true, alpha: 235, weight: 1.7 });
    drawCurve(p, plot, logPts, -4, 4, -4, 4, {
      glow: true,
      alpha: 205,
      weight: 1.35,
      color: BLUE,
    });
    drawCurve(p, plot, diagPts, -4, 4, -4, 4, {
      alpha: 42,
      weight: 1,
      color: WHITE,
    });

    drawPlotLabel(p, plot, 'y = b · aˣ', 18, 34, 230);
    drawPlotLabel(p, plot, 'y = logₐ(x / b)', 18, 54, 180);
    drawBottomNote(p, stage, '線性座標：指數與對數沿 y = x 互為鏡像');
    return;
  }

  drawLogYPlot(p, plot, {
    xMin: -4,
    xMax: 4,
    yMin: 0.05,
    yMax: 16,
  });

  const expPts = sampleFunction(-4, 4, 360, (x) => params.b * params.a ** x);
  const logPositivePts = sampleFunction(0.02, 4, 360, (x) => {
    const y = Math.log(x / params.b) / Math.log(params.a);
    return y > 0 ? y : NaN;
  });

  drawCurveLogY(p, plot, expPts, -4, 4, 0.05, 16, { glow: true, alpha: 235, weight: 1.7 });
  drawLogStraightEmphasis(p, plot, expPts, -4, 4, 0.05, 16);
  drawCurveLogY(p, plot, logPositivePts, -4, 4, 0.05, 16, {
    alpha: 130,
    weight: 1.15,
    color: BLUE,
  });

  drawPlotLabel(p, plot, 'log y 座標', 18, 34, 230);
  drawPlotLabel(p, plot, `斜率 ln a = ${fmt(Math.log(params.a), 3)}`, 18, 54, 165);
  drawBottomNote(p, stage, 'log y 座標：把倍增關係改寫成直線斜率');
}

function drawLogStraightEmphasis(
  p: p5,
  rect: Rect,
  points: Point[],
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
) {
  const visible = points.filter(
    (point) =>
      Number.isFinite(point.x) &&
      Number.isFinite(point.y) &&
      point.y > 0 &&
      point.y >= yMin &&
      point.y <= yMax,
  );

  if (visible.length < 2) return;

  const first = visible[0];
  const last = visible[visible.length - 1];
  const p1 = {
    x: mapNumber(first.x, xMin, xMax, rect.x, rect.x + rect.w),
    y: mapLogY(rect, first.y, yMin, yMax),
  };
  const p2 = {
    x: mapNumber(last.x, xMin, xMax, rect.x, rect.x + rect.w),
    y: mapLogY(rect, last.y, yMin, yMax),
  };

  clipRect(p, rect, () => {
    p.stroke(...WHITE, 52);
    p.strokeWeight(1.2);
    p.line(p1.x, p1.y, p2.x, p2.y);

    p.noStroke();
    p.fill(...GOLD, 230);
    p.circle(p1.x, p1.y, 6);
    p.circle(p2.x, p2.y, 6);
  });
}

function drawEMode(p: p5, params: Params) {
  const stage = drawFrame(p, 'e 的誕生', '同一個 e：複利極限與 ln(e)=1 的面積端點');
  const narrow = p.width < 720;
  const sidePad = narrow ? 28 : 46;
  const gap = narrow ? 18 : 38;
  const panelW = narrow ? stage.w - sidePad * 2 : (stage.w - sidePad * 2 - gap) / 2;
  const panelH = narrow ? (stage.h - 142) / 2 : stage.h - 136;
  const left = {
    x: stage.x + sidePad,
    y: stage.y + 72,
    w: panelW,
    h: Math.max(120, panelH),
  };
  const right = narrow
    ? {
        x: left.x,
        y: left.y + left.h + 30,
        w: panelW,
        h: Math.max(126, panelH),
      }
    : {
        x: left.x + panelW + gap,
        y: left.y,
        w: panelW,
        h: Math.max(160, panelH),
      };

  const leftAnchor = drawCompoundPanel(p, left, params.n, !narrow && panelH >= 300);
  const rightAnchor = drawHyperbolaPanel(p, right, params.areaX);

  if (!narrow) drawEConnection(p, leftAnchor, rightAnchor);
  drawBottomNote(p, stage, 'e 連結複利極限與自然對數的單位面積');
}

function drawCompoundPanel(p: p5, rect: Rect, n: number, showBlocks: boolean) {
  drawMiniPanelTitle(p, rect, '連續複利極限');

  const plot = {
    x: rect.x,
    y: rect.y + 34,
    w: rect.w,
    h: showBlocks ? Math.max(120, rect.h * 0.52) : Math.max(96, rect.h * 0.62),
  };

  drawCartesianPlot(p, plot, {
    xMin: 1,
    xMax: 240,
    yMin: 1.98,
    yMax: 2.85,
    xStep: 60,
    yStep: 0.2,
    compact: true,
  });

  const points: Point[] = [];
  for (let i = 1; i <= 240; i += 1) {
    points.push({ x: i, y: (1 + 1 / i) ** i });
  }

  drawCurve(p, plot, points, 1, 240, 1.98, 2.85, { glow: true, alpha: 230, weight: 1.5 });

  const eLine = sampleFunction(1, 240, 8, () => Math.E);
  drawCurve(p, plot, eLine, 1, 240, 1.98, 2.85, {
    alpha: 46,
    weight: 1,
    color: WHITE,
  });

  const current = (1 + 1 / n) ** n;
  const point = toScreen(plot, n, current, 1, 240, 1.98, 2.85);

  p.noStroke();
  p.fill(...GOLD, 240);
  p.circle(point.x, point.y, 8);

  p.fill(...TEXT, 205);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text(`n = ${n}`, rect.x, plot.y + plot.h + 14);
  p.text(`終值 ${fmt(current, 5)}`, rect.x, plot.y + plot.h + 31);

  if (showBlocks) {
    drawCompoundBlocks(p, {
      x: rect.x,
      y: plot.y + plot.h + 56,
      w: rect.w,
      n,
      maxBarH: 24,
    });
  }

  return {
    x: plot.x + plot.w,
    y: toScreen(plot, 240, Math.E, 1, 240, 1.98, 2.85).y,
  };
}

function drawCompoundBlocks(
  p: p5,
  cfg: { x: number; y: number; w: number; n: number; maxBarH: number },
) {
  const count = Math.min(24, Math.max(4, Math.round(cfg.n / 10)));
  const gap = 3;
  const bw = (cfg.w - gap * (count - 1)) / count;
  const growth = (1 + 1 / cfg.n) ** cfg.n;
  const baselineY = cfg.y + cfg.maxBarH;

  for (let i = 0; i < count; i += 1) {
    const t = i / Math.max(1, count - 1);
    const barH = mapNumber(growth ** t, 1, Math.E, 6, cfg.maxBarH);

    p.noStroke();
    p.fill(...GOLD, 28 + t * 65);
    p.rect(cfg.x + i * (bw + gap), baselineY - barH, bw, barH, 4);
  }

  p.noStroke();
  p.fill(...MUTED, 190);
  p.textSize(10.5);
  p.text('切分越細，越接近 e', cfg.x, baselineY + 10);
}

function drawHyperbolaPanel(p: p5, rect: Rect, areaX: number) {
  drawMiniPanelTitle(p, rect, 'ln(x) 的面積');

  const plot = {
    x: rect.x,
    y: rect.y + 34,
    w: rect.w,
    h: Math.max(102, rect.h * 0.62),
  };

  drawCartesianPlot(p, plot, {
    xMin: 0,
    xMax: 4,
    yMin: 0,
    yMax: 2.4,
    xStep: 1,
    yStep: 0.5,
    compact: true,
  });

  drawLnArea(p, plot, 1, areaX, GOLD, 34);
  drawLnArea(p, plot, 1, Math.E, WHITE, 12);

  const hyperbola = sampleFunction(0.18, 4, 280, (x) => 1 / x);
  drawCurve(p, plot, hyperbola, 0, 4, 0, 2.4, { glow: true, alpha: 230, weight: 1.5 });

  const one = toScreen(plot, 1, 0, 0, 4, 0, 2.4);
  const end = toScreen(plot, areaX, 0, 0, 4, 0, 2.4);
  const ePoint = toScreen(plot, Math.E, 1 / Math.E, 0, 4, 0, 2.4);

  p.stroke(...GOLD, 120);
  p.strokeWeight(1);
  p.line(one.x, plot.y, one.x, plot.y + plot.h);
  p.line(end.x, plot.y, end.x, plot.y + plot.h);

  p.stroke(...WHITE, 45);
  p.line(ePoint.x, plot.y, ePoint.x, plot.y + plot.h);

  p.noStroke();
  p.fill(...TEXT, 205);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text(`面積 = ln(${fmt(areaX)})`, rect.x, plot.y + plot.h + 14);
  p.text('e 點：ln(e) = 1', rect.x, plot.y + plot.h + 31);

  return {
    x: ePoint.x,
    y: ePoint.y,
  };
}

function drawLnArea(
  p: p5,
  plot: Rect,
  x0: number,
  x1: number,
  color: readonly [number, number, number],
  alpha: number,
) {
  clipRect(p, plot, () => {
    p.noStroke();
    p.fill(...color, alpha);
    p.beginShape();

    const p0 = toScreen(plot, x0, 0, 0, 4, 0, 2.4);
    p.vertex(p0.x, p0.y);

    for (let i = 0; i <= 120; i += 1) {
      const x = lerpNumber(x0, x1, i / 120);
      const y = 1 / x;
      const point = toScreen(plot, x, y, 0, 4, 0, 2.4);
      p.vertex(point.x, point.y);
    }

    const p1 = toScreen(plot, x1, 0, 0, 4, 0, 2.4);
    p.vertex(p1.x, p1.y);
    p.endShape(p.CLOSE);
  });
}

function drawEConnection(p: p5, a: Point, b: Point) {
  if (!Number.isFinite(a.x) || !Number.isFinite(a.y) || !Number.isFinite(b.x) || !Number.isFinite(b.y)) {
    return;
  }

  const ctx = p.drawingContext;
  p.stroke(...GOLD, 42);
  p.strokeWeight(1);

  try {
    ctx.setLineDash([4, 6]);
    p.line(a.x, a.y, b.x, b.y);
  } finally {
    ctx.setLineDash([]);
  }

  p.noStroke();
  p.fill(...GOLD, 190);
  p.textSize(11);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('e', (a.x + b.x) / 2, (a.y + b.y) / 2 - 4);
}

function drawCompareMode(p: p5, params: Params) {
  const stage = drawFrame(p, '換底與比較', '所有對數函數都通過 (1, 0)，底數只改變尺度');
  const compact = p.width < 520;
  const plot = insetRect(stage, compact ? 32 : 56, 74, compact ? 24 : 38, 58);

  drawCartesianPlot(p, plot, {
    xMin: 0,
    xMax: 10,
    yMin: -4,
    yMax: 4,
    xStep: 1,
    yStep: 1,
  });

  for (const base of [0.2, 0.4, 0.7, 1.4, 2, 3, 5, 8]) {
    const points = sampleFunction(0.05, 10, 320, (x) => Math.log(x) / Math.log(base));
    drawCurve(p, plot, points, 0, 10, -4, 4, {
      alpha: 38,
      weight: 1,
      color: WHITE,
    });
  }

  const currentPts = sampleFunction(0.05, 10, 420, (x) => Math.log(x) / Math.log(params.compareA));
  drawCurve(p, plot, currentPts, 0, 10, -4, 4, {
    glow: true,
    alpha: 235,
    weight: 1.8,
    color: BLUE,
  });

  const cross = toScreen(plot, 1, 0, 0, 10, -4, 4);
  p.stroke(...GOLD, 150);
  p.strokeWeight(1);
  p.line(cross.x - 9, cross.y, cross.x + 9, cross.y);
  p.line(cross.x, cross.y - 9, cross.x, cross.y + 9);

  p.noStroke();
  p.fill(...TEXT, 220);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text('(1, 0)', cross.x + 10, cross.y + 8);

  drawPlotLabel(p, plot, `目前：y = log₍${fmt(params.compareA)}₎x`, 18, 34, 230);
  drawPlotLabel(p, plot, params.compareA < 1 ? '底數小於 1：遞減' : '底數大於 1：遞增', 18, 54, 160);
  drawBottomNote(p, stage, '所有對數函數都通過 (1, 0)，因為 logₐ1 = 0');
}

function renderScene(p: p5, params: Params) {
  if (params.mode === 'inverse') {
    drawInverseMode(p, params);
  } else if (params.mode === 'e') {
    drawEMode(p, params);
  } else {
    drawCompareMode(p, params);
  }
}

function modeTitle(mode: Mode) {
  if (mode === 'inverse') return '反函數與座標';
  if (mode === 'e') return '連續複利與 ln';
  return '對數函數族';
}

type ModeButtonProps = {
  active: boolean;
  children: string;
  onClick: () => void;
};

function ModeButton({ active, children, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      className={`exponential-logarithm-explore__mode${active ? ' is-active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type RangeFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
};

function RangeField({ label, value, min, max, step, display, onChange }: RangeFieldProps) {
  return (
    <label className="exponential-logarithm-explore__field">
      <span className="exponential-logarithm-explore__field-label">
        {label}
        <span className="exponential-logarithm-explore__val">{display}</span>
      </span>
      <input
        className="range-control"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

type StatsBlockProps = {
  rows: readonly (readonly [string, string])[];
};

function StatsBlock({ rows }: StatsBlockProps) {
  return (
    <div className="exponential-logarithm-explore__block">
      <p className="exponential-logarithm-explore__block-title">統計</p>
      {rows.map(([label, value]) => (
        <p className="exponential-logarithm-explore__stat" key={label}>
          {label}
          <span>{value}</span>
        </p>
      ))}
    </div>
  );
}

export default function ExponentialLogarithmExploreRoot() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const paramsRef = useRef(params);

  paramsRef.current = params;

  const patchParams = useCallback((patch: Partial<Params>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const measureCanvas = useCallback(
    (host: HTMLElement) => measureExponentialCanvas(host, paramsRef.current.mode),
    [],
  );
  const draw = useCallback((p: p5) => {
    const targetHeight = exponentialCanvasHeight(p.width, paramsRef.current.mode);
    if (Math.abs(p.height - targetHeight) > 1) p.resizeCanvas(p.width, targetHeight);
    p.textFont('sans-serif');
    renderScene(p, paramsRef.current);
  }, []);
  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureCanvas, undefined, {
    loop: false,
    redrawKey: params,
  });

  const stats = useMemo(() => {
    if (params.mode === 'inverse') {
      return [
        ['指數', `y = ${fmt(params.b)} · ${fmt(params.a)}ˣ`],
        ['對數', `log₍${fmt(params.a)}₎(x / ${fmt(params.b)})`],
        [
          params.axisMode === 'linear' ? '對稱軸' : '斜率',
          params.axisMode === 'linear' ? 'y = x' : `ln a = ${fmt(Math.log(params.a), 3)}`,
        ],
        ['共同點', 'logₐ1 = 0'],
      ] as const;
    }

    if (params.mode === 'e') {
      const compound = (1 + 1 / params.n) ** params.n;
      return [
        ['(1 + 1/n)ⁿ', fmt(compound, 5)],
        ['e', fmt(Math.E, 5)],
        ['誤差', fmt(Math.abs(Math.E - compound), 5)],
        [`ln(${fmt(params.areaX)})`, fmt(Math.log(params.areaX), 4)],
      ] as const;
    }

    return [
      ['目前函數', `y = log₍${fmt(params.compareA)}₎x`],
      ['底數行為', params.compareA < 1 ? 'a < 1：遞減' : 'a > 1：遞增'],
      ['共同點', '(1, 0)'],
      ['換底', 'logₐx = ln x / ln a'],
    ] as const;
  }, [params]);

  return (
    <div className="exponential-logarithm-explore">
      <div className="exponential-logarithm-explore__stage">
        <div className="exponential-logarithm-explore__visual">
          <div
            ref={canvasHostRef}
            className="exponential-logarithm-explore__canvas"
            role="img"
            aria-label="指數與對數互動視覺化"
          />
        </div>

        <aside className="exponential-logarithm-explore__sidebar">
          <div className="exponential-logarithm-explore__block">
            <p className="exponential-logarithm-explore__block-title">模式</p>
            <div className="exponential-logarithm-explore__modes">
              <ModeButton active={params.mode === 'inverse'} onClick={() => patchParams({ mode: 'inverse' })}>
                指數與對數
              </ModeButton>
              <ModeButton active={params.mode === 'e'} onClick={() => patchParams({ mode: 'e' })}>
                e 的誕生
              </ModeButton>
              <ModeButton active={params.mode === 'compare'} onClick={() => patchParams({ mode: 'compare' })}>
                換底與比較
              </ModeButton>
            </div>
          </div>

          <div className="exponential-logarithm-explore__block">
            <p className="exponential-logarithm-explore__block-title">{modeTitle(params.mode)}</p>

            {params.mode === 'inverse' ? (
              <>
                <button
                  type="button"
                  className="exponential-logarithm-explore__toggle"
                  onClick={() => patchParams({ axisMode: params.axisMode === 'linear' ? 'logY' : 'linear' })}
                >
                  {params.axisMode === 'linear' ? '線性座標' : 'log y 座標'}
                </button>
                <RangeField
                  label="底數 a"
                  min={0.2}
                  max={5}
                  step={0.01}
                  value={params.a}
                  display={fmt(params.a)}
                  onChange={(a) => setParams((prev) => ({ ...prev, a: avoidOne(a, prev.a) }))}
                />
                <RangeField
                  label="係數 b"
                  min={0.3}
                  max={3}
                  step={0.01}
                  value={params.b}
                  display={fmt(params.b)}
                  onChange={(b) => patchParams({ b })}
                />
              </>
            ) : null}

            {params.mode === 'e' ? (
              <>
                <RangeField
                  label="分割數 n"
                  min={1}
                  max={240}
                  step={1}
                  value={params.n}
                  display={`${params.n}`}
                  onChange={(n) => patchParams({ n: Math.max(1, Math.round(n)) })}
                />
                <RangeField
                  label="面積端點 x"
                  min={1.05}
                  max={4}
                  step={0.01}
                  value={params.areaX}
                  display={fmt(params.areaX)}
                  onChange={(areaX) => patchParams({ areaX })}
                />
              </>
            ) : null}

            {params.mode === 'compare' ? (
              <RangeField
                label="底數 a"
                min={0.1}
                max={10}
                step={0.01}
                value={params.compareA}
                display={fmt(params.compareA)}
                onChange={(compareA) =>
                  setParams((prev) => ({ ...prev, compareA: avoidOne(compareA, prev.compareA) }))
                }
              />
            ) : null}
          </div>

          <StatsBlock rows={stats} />
        </aside>
      </div>
    </div>
  );
}
