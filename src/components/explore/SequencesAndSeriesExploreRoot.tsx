import { useCallback, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/sequences-and-series-explore.css';

type Mode = 'sequence' | 'series' | 'logistic';
type SequenceType = 'arith' | 'geom' | 'recurrence';
type SeriesType = 'geometric' | 'harmonic' | 'basel';

type Params = {
  mode: Mode;
  sequence: {
    type: SequenceType;
    n: number;
    a1: number;
    d: number;
    q: number;
    lambda: number;
    c: number;
  };
  series: {
    type: SeriesType;
    n: number;
    q: number;
  };
  logistic: {
    r: number;
    x0: number;
    iter: number;
  };
};

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const RED = [231, 111, 81] as const;
const WHITE = [255, 255, 255] as const;

const DEFAULT_PARAMS: Params = {
  mode: 'sequence',
  sequence: {
    type: 'arith',
    n: 24,
    a1: 1,
    d: 0.6,
    q: 0.72,
    lambda: 0.78,
    c: 0.25,
  },
  series: {
    type: 'geometric',
    n: 60,
    q: 0.55,
  },
  logistic: {
    r: 3.2,
    x0: 0.42,
    iter: 90,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fmt(value: number, digits = 3) {
  if (!Number.isFinite(value)) return '∞';
  const threshold = 10 ** -(digits + 1);
  if (Math.abs(value) < threshold) return '0';
  return value.toFixed(digits).replace(/\.?0+$/, '');
}

function measureSequencesCanvas(host: HTMLElement) {
  const width = Math.max(320, Math.floor(host.clientWidth || 640));
  const height = Math.round(clamp(width * 0.62, 340, 560));
  return { width, height };
}

function plotRect(width: number, height: number): Rect {
  return {
    x: 54,
    y: 36,
    w: Math.max(220, width - 96),
    h: Math.max(220, height - 92),
  };
}

function splitLogisticRects(width: number, height: number) {
  const outer = plotRect(width, height);
  const gap = 34;
  const topH = Math.max(116, outer.h * 0.42);
  return {
    orbit: { x: outer.x, y: outer.y, w: outer.w, h: topH },
    bifurcation: {
      x: outer.x,
      y: outer.y + topH + gap,
      w: outer.w,
      h: Math.max(126, outer.h - topH - gap),
    },
  };
}

function sequenceValues(params: Params['sequence']) {
  const values: number[] = [];
  let previous = params.a1;

  for (let i = 0; i < params.n; i += 1) {
    const n = i + 1;
    if (params.type === 'arith') values.push(params.a1 + i * params.d);
    if (params.type === 'geom') values.push(params.a1 * params.q ** i);
    if (params.type === 'recurrence') {
      if (i === 0) values.push(previous);
      else {
        previous = params.lambda * previous + params.c;
        values.push(previous);
      }
    }
  }

  return values;
}

function seriesValues(params: Params['series']) {
  const partials: number[] = [];
  let sum = 0;

  for (let i = 1; i <= params.n; i += 1) {
    if (params.type === 'geometric') sum += params.q ** (i - 1);
    if (params.type === 'harmonic') sum += 1 / i;
    if (params.type === 'basel') sum += 1 / i ** 2;
    partials.push(sum);
  }

  return partials;
}

function logisticOrbit(params: Params['logistic']) {
  const count = Math.max(220, params.iter);
  const values = [params.x0];
  let x = params.x0;

  for (let i = 0; i < count; i += 1) {
    x = params.r * x * (1 - x);
    values.push(x);
  }

  return values;
}

function valueRange(values: number[]) {
  const finite = values.filter(Number.isFinite);
  const min = Math.min(0, ...finite);
  const max = Math.max(1, ...finite);
  const pad = Math.max((max - min) * 0.12, 0.2);
  return { min: min - pad, max: max + pad };
}

function drawFrame(p: p5, rect: Rect, yRange: { min: number; max: number }) {
  p.noFill();
  p.stroke(...WHITE, 18);
  p.strokeWeight(1);

  for (let i = 0; i <= 4; i += 1) {
    const x = rect.x + (rect.w * i) / 4;
    const y = rect.y + (rect.h * i) / 4;
    p.line(x, rect.y, x, rect.y + rect.h);
    p.line(rect.x, y, rect.x + rect.w, y);
  }

  const zeroT = (0 - yRange.min) / (yRange.max - yRange.min);
  if (zeroT >= 0 && zeroT <= 1) {
    const zeroY = rect.y + rect.h - zeroT * rect.h;
    p.stroke(...WHITE, 42);
    p.line(rect.x, zeroY, rect.x + rect.w, zeroY);
  }

  p.stroke(...WHITE, 55);
  p.rect(rect.x, rect.y, rect.w, rect.h);
}

function yToScreen(value: number, rect: Rect, range: { min: number; max: number }) {
  const t = (value - range.min) / (range.max - range.min || 1);
  return rect.y + rect.h - t * rect.h;
}

function drawSeriesBlocks(p: p5, params: Params['series'], rect: Rect) {
  if (params.type !== 'geometric' || Math.abs(params.q) >= 1) return;

  const limit = 1 / (1 - params.q);
  const strip = {
    x: rect.x + rect.w * 0.06,
    y: rect.y + rect.h + 22,
    w: rect.w * 0.72,
    h: 18,
  };
  const shown = Math.min(8, params.n);
  let cursor = strip.x;

  p.noStroke();
  for (let i = 0; i < shown; i += 1) {
    const ratio = params.q ** i / limit;
    const w = Math.max(2, strip.w * ratio);
    p.fill(...GOLD, 150 - i * 12);
    p.rect(cursor, strip.y, w, strip.h, 2);
    cursor += w;
  }

  p.stroke(...WHITE, 90);
  p.strokeWeight(1);
  p.line(strip.x + strip.w, strip.y - 6, strip.x + strip.w, strip.y + strip.h + 6);
  p.stroke(...GOLD, 140);
  p.line(cursor + 8, strip.y + strip.h / 2, strip.x + strip.w - 8, strip.y + strip.h / 2);
}

function renderSequence(p: p5, params: Params['sequence']) {
  const rect = plotRect(p.width, p.height);
  const values = sequenceValues(params);
  const range = valueRange(values);

  drawFrame(p, rect, range);

  p.stroke(...GOLD, 75);
  p.strokeWeight(1);
  p.noFill();
  p.beginShape();
  values.forEach((value, index) => {
    const x = rect.x + (rect.w * index) / Math.max(1, values.length - 1);
    p.vertex(x, yToScreen(value, rect, range));
  });
  p.endShape();

  values.forEach((value, index) => {
    const x = rect.x + (rect.w * index) / Math.max(1, values.length - 1);
    const y = yToScreen(value, rect, range);
    const zeroY = yToScreen(0, rect, range);
    p.stroke(...WHITE, 30);
    p.line(x, zeroY, x, y);
    p.noStroke();
    p.fill(...GOLD, 210);
    p.circle(x, y, 6);
  });

  p.noStroke();
  p.fill(...WHITE, 120);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text('a_n', rect.x + 8, rect.y + 8);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text('n', rect.x + rect.w - 8, rect.y + rect.h - 8);
}

function renderSeries(p: p5, params: Params['series']) {
  const rect = plotRect(p.width, p.height - 34);
  const values = seriesValues(params);
  const range = valueRange(values);
  const limit =
    params.type === 'geometric' && Math.abs(params.q) < 1
      ? 1 / (1 - params.q)
      : params.type === 'basel'
        ? Math.PI ** 2 / 6
        : null;

  drawFrame(p, rect, range);

  if (limit !== null) {
    const y = yToScreen(limit, rect, range);
    p.stroke(...BLUE, 120);
    p.strokeWeight(1.5);
    for (let x = rect.x; x < rect.x + rect.w; x += 12) {
      p.line(x, y, x + 6, y);
    }
  }

  p.noFill();
  p.stroke(...GOLD, 210);
  p.strokeWeight(2);
  p.beginShape();
  values.forEach((value, index) => {
    const x = rect.x + (rect.w * index) / Math.max(1, values.length - 1);
    p.vertex(x, yToScreen(value, rect, range));
  });
  p.endShape();

  p.noStroke();
  values.forEach((value, index) => {
    if (index % Math.ceil(values.length / 36) !== 0 && index !== values.length - 1) {
      return;
    }
    const x = rect.x + (rect.w * index) / Math.max(1, values.length - 1);
    p.fill(...GOLD, 170);
    p.circle(x, yToScreen(value, rect, range), 5);
  });

  drawSeriesBlocks(p, params, rect);
}

function renderLogistic(p: p5, params: Params['logistic']) {
  const rects = splitLogisticRects(p.width, p.height);
  const orbit = logisticOrbit(params);
  const shown = orbit.slice(0, params.iter + 1);

  drawFrame(p, rects.orbit, { min: -0.04, max: 1.04 });
  p.noFill();
  p.stroke(...GOLD, 210);
  p.strokeWeight(1.8);
  p.beginShape();
  shown.forEach((value, index) => {
    const x = rects.orbit.x + (rects.orbit.w * index) / Math.max(1, shown.length - 1);
    p.vertex(x, yToScreen(value, rects.orbit, { min: -0.04, max: 1.04 }));
  });
  p.endShape();

  shown.forEach((value, index) => {
    if (index % Math.ceil(shown.length / 42) !== 0 && index !== shown.length - 1) return;
    const x = rects.orbit.x + (rects.orbit.w * index) / Math.max(1, shown.length - 1);
    p.noStroke();
    p.fill(...GOLD, 170);
    p.circle(x, yToScreen(value, rects.orbit, { min: -0.04, max: 1.04 }), 4);
  });

  drawFrame(p, rects.bifurcation, { min: 0, max: 1 });

  p.strokeWeight(1);
  for (let i = 0; i <= 360; i += 1) {
    const r = 2.6 + (1.4 * i) / 360;
    let x = 0.5;
    for (let j = 0; j < 260; j += 1) x = r * x * (1 - x);
    p.stroke(...GOLD, 46);
    for (let j = 0; j < 72; j += 1) {
      x = r * x * (1 - x);
      const px = rects.bifurcation.x + ((r - 2.6) / 1.4) * rects.bifurcation.w;
      const py = yToScreen(x, rects.bifurcation, { min: 0, max: 1 });
      p.point(px, py);
    }
  }

  const rX = rects.bifurcation.x + ((params.r - 2.6) / 1.4) * rects.bifurcation.w;
  p.stroke(...RED, 155);
  p.strokeWeight(1.4);
  p.line(rX, rects.bifurcation.y, rX, rects.bifurcation.y + rects.bifurcation.h);

  p.noStroke();
  p.fill(...WHITE, 120);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text('orbit', rects.orbit.x + 8, rects.orbit.y + 8);
  p.text('bifurcation', rects.bifurcation.x + 8, rects.bifurcation.y + 8);
}

function renderScene(p: p5, params: Params) {
  p.background(10, 10, 10);
  p.textFont('monospace');

  if (params.mode === 'sequence') renderSequence(p, params.sequence);
  if (params.mode === 'series') renderSeries(p, params.series);
  if (params.mode === 'logistic') renderLogistic(p, params.logistic);
}

function modeLabel(mode: Mode) {
  if (mode === 'sequence') return '數列';
  if (mode === 'series') return '級數';
  return 'Logistic';
}

function sequenceFormula(params: Params['sequence']) {
  if (params.type === 'arith') return `a_n = ${fmt(params.a1)} + (n - 1)${fmt(params.d)}`;
  if (params.type === 'geom') return `a_n = ${fmt(params.a1)} · ${fmt(params.q)}^(n - 1)`;
  return `a_n = ${fmt(params.lambda)}a_(n-1) + ${fmt(params.c)}`;
}

function seriesFormula(params: Params['series']) {
  if (params.type === 'geometric') return `S_n = Σ ${fmt(params.q)}^(k-1)`;
  if (params.type === 'harmonic') return 'S_n = Σ 1/k';
  return 'S_n = Σ 1/k^2';
}

export default function SequencesAndSeriesExploreRoot() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const paramsRef = useRef(params);

  paramsRef.current = params;

  const dragLogisticR = useCallback((p: p5) => {
    if (paramsRef.current.mode !== 'logistic') return;

    const { bifurcation } = splitLogisticRects(p.width, p.height);
    const inside =
      p.mouseX >= bifurcation.x &&
      p.mouseX <= bifurcation.x + bifurcation.w &&
      p.mouseY >= bifurcation.y &&
      p.mouseY <= bifurcation.y + bifurcation.h;

    if (!inside) return;

    const r = 2.6 + ((p.mouseX - bifurcation.x) / bifurcation.w) * 1.4;
    setParams((prev) => ({
      ...prev,
      logistic: { ...prev.logistic, r: clamp(r, 2.6, 4) },
    }));
  }, []);

  const draw = useCallback((p: p5) => renderScene(p, paramsRef.current), []);
  const extendSketch = useCallback((p: p5) => {
    p.mousePressed = () => dragLogisticR(p);
    p.mouseDragged = () => dragLogisticR(p);
  }, [dragLogisticR]);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSequencesCanvas,
    extendSketch,
    { loop: false, redrawKey: params },
  );

  const stats = useMemo(() => {
    if (params.mode === 'sequence') {
      const values = sequenceValues(params.sequence);
      return [
        `目前模式：${modeLabel(params.mode)}`,
        `公式：${sequenceFormula(params.sequence)}`,
        `末項 a_${params.sequence.n} = ${fmt(values.at(-1) ?? 0, 4)}`,
      ];
    }

    if (params.mode === 'series') {
      const values = seriesValues(params.series);
      const current = values.at(-1) ?? 0;
      const limit =
        params.series.type === 'geometric' && Math.abs(params.series.q) < 1
          ? 1 / (1 - params.series.q)
          : params.series.type === 'basel'
            ? Math.PI ** 2 / 6
            : null;
      return [
        `目前模式：${modeLabel(params.mode)}`,
        `公式：${seriesFormula(params.series)}`,
        limit === null
          ? `部分和 S_${params.series.n} = ${fmt(current, 4)}`
          : `S_${params.series.n} = ${fmt(current, 4)}，極限 ${fmt(limit, 4)}`,
      ];
    }

    return [
      `目前模式：${modeLabel(params.mode)}`,
      `x_(n+1) = r x_n(1 - x_n)`,
      `r = ${fmt(params.logistic.r, 3)}，x0 = ${fmt(params.logistic.x0, 3)}`,
    ];
  }, [params]);

  return (
    <div className="sequences-series-explore">
      <div className="sequences-series-explore__stage">
        <div className="sequences-series-explore__visual">
          <div
            ref={canvasHostRef}
            className="sequences-series-explore__canvas"
            role="img"
            aria-label="數列與級數視覺化"
          />
        </div>

        <aside className="sequences-series-explore__sidebar">
          <div className="sequences-series-explore__block">
            <p className="sequences-series-explore__block-title">參數</p>

            <label className="sequences-series-explore__field">
              <span className="sequences-series-explore__field-label">模式</span>
              <select
                className="sequences-series-explore__select"
                value={params.mode}
                onChange={(e) =>
                  setParams((prev) => ({ ...prev, mode: e.target.value as Mode }))
                }
              >
                <option value="sequence">數列圖像</option>
                <option value="series">級數累加</option>
                <option value="logistic">單峰疊代</option>
              </select>
            </label>

            {params.mode === 'sequence' ? (
              <>
                <label className="sequences-series-explore__field">
                  <span className="sequences-series-explore__field-label">類型</span>
                  <select
                    className="sequences-series-explore__select"
                    value={params.sequence.type}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        sequence: {
                          ...prev.sequence,
                          type: e.target.value as SequenceType,
                        },
                      }))
                    }
                  >
                    <option value="arith">等差</option>
                    <option value="geom">等比</option>
                    <option value="recurrence">遞迴</option>
                  </select>
                </label>

                <RangeControl
                  id="seq-n"
                  label="項數 n"
                  min={4}
                  max={80}
                  step={1}
                  value={params.sequence.n}
                  display={String(params.sequence.n)}
                  onValue={(n) =>
                    setParams((prev) => ({
                      ...prev,
                      sequence: { ...prev.sequence, n },
                    }))
                  }
                />
                <RangeControl
                  id="seq-a1"
                  label="首項 a1"
                  min={-4}
                  max={4}
                  step={0.1}
                  value={params.sequence.a1}
                  display={fmt(params.sequence.a1, 2)}
                  onValue={(a1) =>
                    setParams((prev) => ({
                      ...prev,
                      sequence: { ...prev.sequence, a1 },
                    }))
                  }
                />
                {params.sequence.type === 'arith' ? (
                  <RangeControl
                    id="seq-d"
                    label="公差 d"
                    min={-1.5}
                    max={1.5}
                    step={0.05}
                    value={params.sequence.d}
                    display={fmt(params.sequence.d, 2)}
                    onValue={(d) =>
                      setParams((prev) => ({
                        ...prev,
                        sequence: { ...prev.sequence, d },
                      }))
                    }
                  />
                ) : null}
                {params.sequence.type === 'geom' ? (
                  <RangeControl
                    id="seq-q"
                    label="公比 q"
                    min={-1.2}
                    max={1.4}
                    step={0.01}
                    value={params.sequence.q}
                    display={fmt(params.sequence.q, 2)}
                    onValue={(q) =>
                      setParams((prev) => ({
                        ...prev,
                        sequence: { ...prev.sequence, q },
                      }))
                    }
                  />
                ) : null}
                {params.sequence.type === 'recurrence' ? (
                  <>
                    <RangeControl
                      id="seq-lambda"
                      label="遞迴係數 λ"
                      min={-1.2}
                      max={1.2}
                      step={0.01}
                      value={params.sequence.lambda}
                      display={fmt(params.sequence.lambda, 2)}
                      onValue={(lambda) =>
                        setParams((prev) => ({
                          ...prev,
                          sequence: { ...prev.sequence, lambda },
                        }))
                      }
                    />
                    <RangeControl
                      id="seq-c"
                      label="常數 c"
                      min={-2}
                      max={2}
                      step={0.05}
                      value={params.sequence.c}
                      display={fmt(params.sequence.c, 2)}
                      onValue={(c) =>
                        setParams((prev) => ({
                          ...prev,
                          sequence: { ...prev.sequence, c },
                        }))
                      }
                    />
                  </>
                ) : null}
              </>
            ) : null}

            {params.mode === 'series' ? (
              <>
                <label className="sequences-series-explore__field">
                  <span className="sequences-series-explore__field-label">類型</span>
                  <select
                    className="sequences-series-explore__select"
                    value={params.series.type}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        series: { ...prev.series, type: e.target.value as SeriesType },
                      }))
                    }
                  >
                    <option value="geometric">等比級數</option>
                    <option value="harmonic">調和級數</option>
                    <option value="basel">巴塞爾級數</option>
                  </select>
                </label>
                <RangeControl
                  id="series-n"
                  label="部分和 n"
                  min={4}
                  max={220}
                  step={1}
                  value={params.series.n}
                  display={String(params.series.n)}
                  onValue={(n) =>
                    setParams((prev) => ({
                      ...prev,
                      series: { ...prev.series, n },
                    }))
                  }
                />
                {params.series.type === 'geometric' ? (
                  <RangeControl
                    id="series-q"
                    label="公比 q"
                    min={-0.95}
                    max={0.95}
                    step={0.01}
                    value={params.series.q}
                    display={fmt(params.series.q, 2)}
                    onValue={(q) =>
                      setParams((prev) => ({
                        ...prev,
                        series: { ...prev.series, q },
                      }))
                    }
                  />
                ) : null}
              </>
            ) : null}

            {params.mode === 'logistic' ? (
              <>
                <RangeControl
                  id="logistic-r"
                  label="成長率 r"
                  min={2.6}
                  max={4}
                  step={0.001}
                  value={params.logistic.r}
                  display={fmt(params.logistic.r, 3)}
                  onValue={(r) =>
                    setParams((prev) => ({
                      ...prev,
                      logistic: { ...prev.logistic, r },
                    }))
                  }
                />
                <RangeControl
                  id="logistic-x0"
                  label="初值 x0"
                  min={0.01}
                  max={0.99}
                  step={0.01}
                  value={params.logistic.x0}
                  display={fmt(params.logistic.x0, 2)}
                  onValue={(x0) =>
                    setParams((prev) => ({
                      ...prev,
                      logistic: { ...prev.logistic, x0 },
                    }))
                  }
                />
                <RangeControl
                  id="logistic-iter"
                  label="疊代數"
                  min={20}
                  max={220}
                  step={1}
                  value={params.logistic.iter}
                  display={String(params.logistic.iter)}
                  onValue={(iter) =>
                    setParams((prev) => ({
                      ...prev,
                      logistic: { ...prev.logistic, iter },
                    }))
                  }
                />
              </>
            ) : null}
          </div>

          <div className="sequences-series-explore__block">
            <p className="sequences-series-explore__block-title">觀察</p>
            {stats.map((line) => (
              <p key={line} className="sequences-series-explore__stat">
                {line}
              </p>
            ))}
            <p className="sequences-series-explore__hint">
              分岔圖可直接拖曳紅線調整 r。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RangeControl({
  id,
  label,
  min,
  max,
  step,
  value,
  display,
  onValue,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onValue: (value: number) => void;
}) {
  return (
    <div className="control-field">
      <label htmlFor={id}>
        {label}
        <span className="sequences-series-explore__val">{display}</span>
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
          onInput={(e) => onValue(Number((e.target as HTMLInputElement).value))}
        />
      </div>
    </div>
  );
}
