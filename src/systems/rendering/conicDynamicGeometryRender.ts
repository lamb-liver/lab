import { canvas2d } from './canvas2d';
import type p5 from 'p5';
import { LATUS, VIEW_H, VIEW_W } from '../../curve/modules/conic-dynamic-geometry/constants';
import {
  buildEccentricityPaths,
  buildFocusScene,
  chooseEccentricityMetricPath,
  currentScale,
  getDirectrixRatio,
  getEccentricityKind,
  getFocusMovingPoint,
  getFocusRelationValue,
  getPointOnPath,
  revealPath,
} from '../../curve/modules/conic-dynamic-geometry/geometry';
import type {
  ConicMode,
  ConicPath,
  FocusCurveType,
  FocusScene,
  PathPoint,
} from '../../curve/modules/conic-dynamic-geometry/types';

type ConicDynamicGeometrySnap = {
  width: number;
  height: number;
  mode: ConicMode;
  focusCurve: FocusCurveType;
  smoothE: number;
  reveal: number;
  pointClock: number;
  showConstruction: boolean;
};

const ACCENT: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [255, 255, 255];

const PATH_LAYERS = [
  { weight: 7.5, alpha: 13 },
  { weight: 3.6, alpha: 34 },
  { weight: 1.45, alpha: 220 },
];

function setDash(p: p5, pattern: number[]): void {
  const ctx = canvas2d(p);
  ctx.setLineDash(pattern);
}

function drawPath(
  p: p5,
  points: ReadonlyArray<PathPoint>,
  closed: boolean,
  layers: Array<{ weight: number; alpha: number }>,
  scale: number,
): void {
  if (!points || points.length < 2) return;

  for (const layer of layers) {
    p.push();
    p.noFill();
    p.stroke(...ACCENT, layer.alpha);
    p.strokeWeight(layer.weight / scale);
    p.strokeJoin(p.ROUND);
    p.strokeCap(p.ROUND);

    p.beginShape();
    for (const pt of points) {
      p.vertex(pt.x, pt.y);
    }

    if (closed) {
      p.endShape(p.CLOSE);
    } else {
      p.endShape();
    }

    p.pop();
  }
}

function drawGhostPaths(
  p: p5,
  paths: ReadonlyArray<ConicPath>,
  scale: number,
): void {
  for (const path of paths) {
    drawPath(p, path.points, path.closed, [{ weight: 1, alpha: 12 }], scale);
  }
}

function drawRevealPaths(
  p: p5,
  paths: ReadonlyArray<ConicPath>,
  progress: number,
  scale: number,
): void {
  for (const path of paths) {
    const visible = revealPath(path.points, progress);
    const shouldClose = path.closed && progress >= 0.999;

    drawPath(p, visible, shouldClose, PATH_LAYERS, scale);
  }
}

function drawGrid(p: p5, scale: number): void {
  p.push();

  // 關鍵修正：guide / grid 只能是線框，不能吃到 p5 預設白色 fill。
  p.noFill();

  p.stroke(...GUIDE, 7);
  p.strokeWeight(1 / scale);
  p.line(-VIEW_W * 0.5, 0, VIEW_W * 0.5, 0);
  p.line(0, -VIEW_H * 0.5, 0, VIEW_H * 0.5);

  p.stroke(...GUIDE, 4);
  p.strokeWeight(1 / scale);

  for (let r = 100; r <= 240; r += 100) {
    p.ellipse(0, 0, r * 2, r * 2);
  }

  p.pop();
}

function drawEccentricityConstruction(
  p: p5,
  e: number,
  pt: PathPoint,
  scale: number,
): void {
  p.push();

  p.noStroke();
  p.fill(...ACCENT, 210);
  p.circle(0, 0, 6 / scale);

  if (e < 0.045) {
    p.noStroke();
    p.fill(255, 255, 255, 120);
    p.circle(pt.x, pt.y, 5.5 / scale);

    p.stroke(...ACCENT, 58);
    p.strokeWeight(1.1 / scale);
    p.line(0, 0, pt.x, pt.y);

    p.pop();
    return;
  }

  const d = LATUS / e;

  p.stroke(...GUIDE, 18);
  p.strokeWeight(1 / scale);
  setDash(p, [6 / scale, 9 / scale]);
  p.line(d, -VIEW_H, d, VIEW_H);
  setDash(p, []);

  p.stroke(...ACCENT, 70);
  p.strokeWeight(1.15 / scale);
  p.line(0, 0, pt.x, pt.y);

  p.stroke(...GUIDE, 28);
  p.strokeWeight(1 / scale);
  p.line(pt.x, pt.y, d, pt.y);

  p.noStroke();
  p.fill(255, 255, 255, 140);
  p.circle(pt.x, pt.y, 5.8 / scale);

  p.fill(...GUIDE, 70);
  p.circle(d, pt.y, 3.5 / scale);

  p.pop();
}

function drawTwoFocusRelation(
  p: p5,
  scene: FocusScene,
  pt: PathPoint,
  scale: number,
): void {
  if (!scene.foci) return;

  p.push();

  const f1 = scene.foci[0];
  const f2 = scene.foci[1];

  p.stroke(...ACCENT, 66);
  p.strokeWeight(1.1 / scale);
  p.line(f1.x, f1.y, pt.x, pt.y);
  p.line(f2.x, f2.y, pt.x, pt.y);

  p.noStroke();

  p.fill(...ACCENT, 190);
  p.circle(f1.x, f1.y, 6 / scale);
  p.circle(f2.x, f2.y, 6 / scale);

  p.fill(255, 255, 255, 138);
  p.circle(pt.x, pt.y, 5.8 / scale);

  p.pop();
}

function drawParabolaFocusRelation(
  p: p5,
  scene: FocusScene,
  pt: PathPoint,
  scale: number,
): void {
  if (scene.focus == null || scene.directrixX == null) return;

  p.push();

  const f = scene.focus;
  const d = scene.directrixX;

  p.stroke(...GUIDE, 18);
  p.strokeWeight(1 / scale);
  setDash(p, [6 / scale, 9 / scale]);
  p.line(d, -VIEW_H, d, VIEW_H);
  setDash(p, []);

  p.stroke(...ACCENT, 66);
  p.strokeWeight(1.1 / scale);
  p.line(f.x, f.y, pt.x, pt.y);

  p.stroke(...GUIDE, 28);
  p.strokeWeight(1 / scale);
  p.line(pt.x, pt.y, d, pt.y);

  p.noStroke();

  p.fill(...ACCENT, 190);
  p.circle(f.x, f.y, 6 / scale);

  p.fill(255, 255, 255, 138);
  p.circle(pt.x, pt.y, 5.8 / scale);

  p.fill(...GUIDE, 70);
  p.circle(d, pt.y, 3.5 / scale);

  p.pop();
}

function drawFocusRelation(
  p: p5,
  scene: FocusScene,
  pt: PathPoint | null,
  scale: number,
): void {
  if (!pt) return;

  if (scene.type === 'ellipse' || scene.type === 'hyperbola') {
    drawTwoFocusRelation(p, scene, pt, scale);
    return;
  }

  drawParabolaFocusRelation(p, scene, pt, scale);
}

function drawEccentricityMode(
  p: p5,
  snap: ConicDynamicGeometrySnap,
  scale: number,
): void {
  const paths = buildEccentricityPaths(snap.smoothE);
  const metricPath = chooseEccentricityMetricPath(
    paths,
    snap.smoothE,
    snap.pointClock,
  );
  const movingPoint = getPointOnPath(metricPath, snap.pointClock % 1);

  drawGrid(p, scale);
  drawGhostPaths(p, paths, scale);
  drawRevealPaths(p, paths, snap.reveal, scale);

  if (snap.showConstruction && movingPoint) {
    drawEccentricityConstruction(p, snap.smoothE, movingPoint, scale);
  }
}

function drawFocusLocusMode(
  p: p5,
  snap: ConicDynamicGeometrySnap,
  scale: number,
): void {
  const scene = buildFocusScene(snap.focusCurve);
  const { point } = getFocusMovingPoint(scene, snap.pointClock);

  drawGrid(p, scale);
  drawGhostPaths(p, scene.paths, scale);
  drawRevealPaths(p, scene.paths, snap.reveal, scale);
  drawFocusRelation(p, scene, point, scale);
}

export function renderConicDynamicGeometryScene(
  p: p5,
  snap: ConicDynamicGeometrySnap,
): void {
  p.background(10, 10, 10);

  const scale = currentScale(snap.width, snap.height);

  p.push();
  p.translate(snap.width * 0.5, snap.height * 0.53);
  p.scale(scale, -scale);

  if (snap.mode === 'eccentricity') {
    drawEccentricityMode(p, snap, scale);
  } else {
    drawFocusLocusMode(p, snap, scale);
  }

  p.pop();
}

export function buildSidebarState(snap: ConicDynamicGeometrySnap): {
  modeLabel: string;
  valueLabel: string;
  noteLabel: string;
  formulaLabel: string;
} {
  if (snap.mode === 'eccentricity') {
    const paths = buildEccentricityPaths(snap.smoothE);
    const metricPath = chooseEccentricityMetricPath(
      paths,
      snap.smoothE,
      snap.pointClock,
    );
    const movingPoint = getPointOnPath(metricPath, snap.pointClock % 1);
    const ratio = getDirectrixRatio(snap.smoothE, movingPoint);

    let note = `PF / Pd ≈ ${ratio}`;
    if (snap.smoothE < 0.045) {
      note = '圓只作為 e → 0 的極限顯示，不顯示準線比值。';
    }

    return {
      modeLabel: '模式：離心率',
      valueLabel: `e = ${snap.smoothE.toFixed(2)} · ${getEccentricityKind(
        snap.smoothE,
      )}`,
      noteLabel: note,
      formulaLabel:
        '[focus-directrix]\nPF / Pd = e\n\ne < 1 橢圓\ne = 1 拋物線\ne > 1 雙曲線',
    };
  }

  const scene = buildFocusScene(snap.focusCurve);
  const { point } = getFocusMovingPoint(scene, snap.pointClock);
  const valueText = getFocusRelationValue(scene, point);

  return {
    modeLabel: '模式：焦點軌跡',
    valueLabel: scene.title,
    noteLabel: `${valueText}\n${scene.constantText}`,
    formulaLabel: `[${scene.title}]\n${scene.formula}`,
  };
}