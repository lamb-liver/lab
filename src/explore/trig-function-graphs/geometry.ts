export const TAU = Math.PI * 2;

export type TrigFunctionGraphMode = 'radian' | 'unfold' | 'transform';

export type TrigFunctionGraphParams = {
  mode: TrigFunctionGraphMode;
  theta: number;
  amplitude: number;
  period: number;
  phase: number;
  verticalShift: number;
  showCos: boolean;
};

export type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CircleLayout = {
  cx: number;
  cy: number;
  r: number;
};

export type GraphWorld = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};

export type TrigFunctionGraphLayout = {
  visual: PlotRect;
  circle: CircleLayout;
  graph: PlotRect;
  graphWorld: GraphWorld;
};

export type ThetaDragTarget = 'circle' | 'graph';

export const DEFAULT_PARAMS: TrigFunctionGraphParams = {
  mode: 'radian',
  theta: Math.PI * 0.72,
  amplitude: 1.2,
  period: TAU,
  phase: 0,
  verticalShift: 0,
  showCos: false,
};

export const MODE_OPTIONS: Array<{
  id: TrigFunctionGraphMode;
  label: string;
  caption: string;
}> = [
  { id: 'radian', label: '弧度', caption: '角度先被讀成弧長比例，單位圓上 r=1。' },
  { id: 'unfold', label: '展開', caption: '把圓上的縱座標沿 x 軸展開，形成 y=sin x。' },
  { id: 'transform', label: '參數', caption: '振幅、週期、相位與中線把基本正弦波變成函數族。' },
];

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function mapLinear(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function measureTrigFunctionGraphCanvas(host: HTMLElement): { width: number; height: number } {
  const width = Math.max(280, Math.round(host.clientWidth > 0 ? host.clientWidth : 560));
  const ratio = width < 720 ? 1.22 : 0.68;
  const height = Math.max(360, Math.min(Math.round(width * ratio), 640));
  return { width, height };
}

export function computeTrigFunctionGraphLayout(
  width: number,
  height: number,
  mode: TrigFunctionGraphMode,
): TrigFunctionGraphLayout {
  const pad = width >= 900 ? 42 : 24;
  const visual = {
    x: pad,
    y: 38,
    w: Math.max(120, width - pad * 2),
    h: Math.max(260, height - 76),
  };
  const isRadian = mode === 'radian';
  const circleR = isRadian
    ? Math.min(visual.w * 0.24, visual.h * 0.34, 150)
    : Math.min(visual.w * 0.2, visual.h * 0.27, 116);
  const circle = {
    cx: isRadian ? visual.x + visual.w * 0.34 : visual.x + circleR + 26,
    cy: visual.y + visual.h * 0.46,
    r: circleR,
  };
  const graphGap = mode === 'radian' ? 112 : mode === 'transform' ? 96 : 62;
  const graphX = circle.cx + circle.r + graphGap;
  const graph = {
    x: graphX,
    y: visual.y + 54,
    w: Math.max(80, visual.x + visual.w - graphX),
    h: Math.max(120, visual.h - 108),
  };

  if (width < 720) {
    circle.cx = visual.x + visual.w * 0.5;
    circle.cy = visual.y + visual.h * 0.28;
    circle.r = isRadian ? Math.min(visual.w * 0.34, 112) : Math.min(visual.w * 0.31, 92);

    graph.x = visual.x;
    graph.y = circle.cy + circle.r + 64;
    graph.w = visual.w;
    graph.h = Math.max(118, visual.y + visual.h - graph.y - 28);
  }

  return {
    visual,
    circle,
    graph,
    graphWorld: {
      xmin: -Math.PI,
      xmax: Math.PI * 4.25,
      ymin: -3.6,
      ymax: 3.6,
    },
  };
}

export function pointOnCircle(theta: number, circle: CircleLayout) {
  return {
    x: circle.cx + Math.cos(theta) * circle.r,
    y: circle.cy - Math.sin(theta) * circle.r,
  };
}

export function graphX(x: number, layout: TrigFunctionGraphLayout) {
  const { graph, graphWorld } = layout;
  return mapLinear(x, graphWorld.xmin, graphWorld.xmax, graph.x, graph.x + graph.w);
}

export function graphY(y: number, layout: TrigFunctionGraphLayout) {
  const { graph, graphWorld } = layout;
  return mapLinear(y, graphWorld.ymin, graphWorld.ymax, graph.y + graph.h, graph.y);
}

export function worldX(px: number, layout: TrigFunctionGraphLayout) {
  const { graph, graphWorld } = layout;
  return mapLinear(px, graph.x, graph.x + graph.w, graphWorld.xmin, graphWorld.xmax);
}

export function transformedSin(x: number, params: TrigFunctionGraphParams) {
  const omega = TAU / params.period;
  return params.amplitude * Math.sin(omega * (x - params.phase)) + params.verticalShift;
}

export function equivalentAngle(theta: number) {
  let angle = theta % TAU;
  if (angle > Math.PI) angle -= TAU;
  if (angle <= -Math.PI) angle += TAU;
  return angle;
}

export function thetaFromCircle(
  currentTheta: number,
  mx: number,
  my: number,
  circle: CircleLayout,
) {
  const raw = Math.atan2(circle.cy - my, mx - circle.cx);
  return raw + Math.round((currentTheta - raw) / TAU) * TAU;
}

export function thetaFromGraph(mx: number, layout: TrigFunctionGraphLayout) {
  return clamp(worldX(mx, layout), -Math.PI, TAU * 2);
}

export function pickThetaDrag(
  mx: number,
  my: number,
  layout: TrigFunctionGraphLayout,
  mode: TrigFunctionGraphMode,
): ThetaDragTarget | null {
  const { circle, graph } = layout;
  if (Math.hypot(mx - circle.cx, my - circle.cy) <= circle.r + 30) return 'circle';
  if (
    mode !== 'radian' &&
    mx >= graph.x &&
    mx <= graph.x + graph.w &&
    my >= graph.y &&
    my <= graph.y + graph.h
  ) {
    return 'graph';
  }
  return null;
}

export function fmt(v: number, digits = 2) {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < 0.005 || Object.is(v, -0)) return '0';
  return Number(v.toFixed(digits)).toString();
}

export function formatDeg(v: number) {
  return `${fmt((v * 180) / Math.PI, 1)}°`;
}

export function formatRad(v: number) {
  const candidates = [
    [-Math.PI, '-π'],
    [-Math.PI / 2, '-π/2'],
    [0, '0'],
    [Math.PI / 6, 'π/6'],
    [Math.PI / 4, 'π/4'],
    [Math.PI / 3, 'π/3'],
    [Math.PI / 2, 'π/2'],
    [Math.PI, 'π'],
    [Math.PI * 1.5, '3π/2'],
    [TAU, '2π'],
    [Math.PI * 2.5, '5π/2'],
    [Math.PI * 3, '3π'],
    [Math.PI * 4, '4π'],
  ] as const;

  for (const [value, label] of candidates) {
    if (Math.abs(v - value) < 0.025) return label;
  }

  return fmt(v, 2);
}

export function buildTrigFunctionGraphStats(params: TrigFunctionGraphParams) {
  if (params.mode === 'transform') {
    return [
      `|A| = ${fmt(Math.abs(params.amplitude))}`,
      `T = ${formatRad(params.period)}`,
      `φ = ${formatRad(params.phase)}`,
      `k = ${fmt(params.verticalShift)}`,
      `y(θ) = ${fmt(transformedSin(params.theta, params))}`,
    ];
  }

  return [
    `θ = ${formatRad(params.theta)} = ${formatDeg(params.theta)}`,
    `sin θ = ${fmt(Math.sin(params.theta))}`,
    `cos θ = ${fmt(Math.cos(params.theta))}`,
    params.mode === 'radian' ? 'r = 1，所以 s = θ' : '週期 = 2π',
  ];
}

export function buildTrigFunctionGraphFormulas(mode: TrigFunctionGraphMode) {
  if (mode === 'radian') return ['θ = s / r', 'r = 1 ⇒ θ = s'];
  if (mode === 'unfold') return ['P(θ) = (cos θ, sin θ)', 'y = sin x'];
  return ['y = A sin((2π/T)(x − φ)) + k', '振幅 |A|，中線 y = k'];
}
