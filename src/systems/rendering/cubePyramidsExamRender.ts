import type p5 from 'p5';
import {
  APEX,
  baseCorners,
  holds,
  type Axis,
  type Vec3,
} from '../../exam/amc12a-2025-22-cube-pyramids/geometry';

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const PURPLE = [198, 166, 235] as const;
const WHITE = [232, 232, 232] as const;
const RED = [240, 110, 100] as const;
const PITCH = 0.55;

type Color = readonly [number, number, number];

const AXIS_COLOR: Record<Axis, Color> = { x: GOLD, y: BLUE, z: PURPLE };

const CUBE: Vec3[] = [
  [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
  [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
];

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

export type CubePyramidScene = {
  width: number;
  height: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  onlyX: boolean;
};

type Screen = { x: number; y: number };

function project(v: Vec3, yaw: number): Screen {
  const x = v[0] - 0.5;
  const y = v[1] - 0.5;
  const z = v[2] - 0.5;
  const xr = x * Math.cos(yaw) - y * Math.sin(yaw);
  const yr = x * Math.sin(yaw) + y * Math.cos(yaw);
  return {
    x: xr,
    y: -(z * Math.cos(PITCH) - yr * Math.sin(PITCH)),
  };
}

export function renderCubePyramidsExam(p: p5, scene: CubePyramidScene): void {
  p.background(10, 10, 10);
  const scale = Math.min(scene.width, scene.height) * 0.46;
  const origin = { x: scene.width / 2, y: scene.height * 0.56 };
  const at = (v: Vec3): Screen => {
    const q = project(v, scene.yaw);
    return { x: origin.x + q.x * scale, y: origin.y + q.y * scale };
  };
  const ink = (color: Color, alpha: number) => {
    p.stroke(color[0], color[1], color[2], alpha);
  };

  const axes: Axis[] = scene.onlyX ? ['x'] : ['x', 'y', 'z'];
  for (const axis of axes) {
    const color = AXIS_COLOR[axis];
    const corners = baseCorners(axis);
    p.push();
    p.noStroke();
    p.fill(color[0], color[1], color[2], 70);
    p.beginShape();
    for (const corner of corners) {
      const s = at(corner);
      p.vertex(s.x, s.y);
    }
    p.endShape(p.CLOSE);
    p.noFill();
    ink(color, 230);
    p.strokeWeight(1.6);
    const tip = at(APEX);
    for (const corner of corners) {
      const s = at(corner);
      p.line(tip.x, tip.y, s.x, s.y);
    }
    p.beginShape();
    for (const corner of corners) {
      const s = at(corner);
      p.vertex(s.x, s.y);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }

  p.push();
  ink(WHITE, 120);
  p.strokeWeight(1.2);
  for (const [i, j] of EDGES) {
    const a = at(CUBE[i]);
    const b = at(CUBE[j]);
    p.line(a.x, a.y, b.x, b.y);
  }
  p.pop();

  const point: Vec3 = [scene.x, scene.y, scene.z];
  const dot = at(point);
  const ok = holds(scene.x, scene.y, scene.z);
  const color = ok ? GOLD : RED;
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], 40);
  p.circle(dot.x, dot.y, 22);
  p.fill(color[0], color[1], color[2], 245);
  p.circle(dot.x, dot.y, 9);
  p.pop();

  p.push();
  p.noStroke();
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  const tags: Array<[Vec3, string, Color]> = [
    [[1.08, 0, 0], 'x', GOLD],
    [[0, 1.08, 0], 'y', BLUE],
    [[0, 0, 1.08], 'z', PURPLE],
  ];
  for (const [pos, label, tagColor] of tags) {
    if (scene.onlyX && label !== 'x') continue;
    const s = at(pos);
    p.fill(tagColor[0], tagColor[1], tagColor[2], 210);
    p.text(label, s.x, s.y);
  }
  p.pop();
}
