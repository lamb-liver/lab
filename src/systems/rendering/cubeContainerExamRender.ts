import type p5 from "p5";
import {
  CENTER,
  CUBE_EDGES,
  CUBE_VERTICES,
  HEXAGON,
  TETRAHEDRON,
  diskPoints,
  project,
  type OptionKey,
  type Vec3,
} from "../../exam/gaokao-2023-i-cube-container/geometry";
import { withDash } from "./p5PlotHelpers";

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;

type Scene = { width: number; height: number; option: OptionKey; yaw: number };

const PITCH = 0.5;

export function renderCubeContainerExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  const scale = Math.min(scene.width, scene.height) * 0.5;
  const cx = scene.width / 2;
  const cy = scene.height / 2;
  const at = (v: Vec3) => {
    const q = project(v, scene.yaw, PITCH);
    return { x: cx + q.x * scale, y: cy + q.y * scale };
  };
  const seg = (a: Vec3, b: Vec3) => {
    const A = at(a);
    const B = at(b);
    p.line(A.x, A.y, B.x, B.y);
  };

  p.stroke(...WHITE, 110);
  p.strokeWeight(1.2);
  for (const [i, j] of CUBE_EDGES) seg(CUBE_VERTICES[i], CUBE_VERTICES[j]);

  if (scene.option === "A") {
    // 球的輪廓在正交投影下是圓
    const c = at(CENTER);
    p.noFill();
    p.stroke(...GOLD, 230);
    p.strokeWeight(2);
    p.circle(c.x, c.y, 0.99 * scale);
    withDash(p, [3, 4], () => {
      p.stroke(...CYAN, 150);
      p.strokeWeight(1);
      p.circle(c.x, c.y, 1 * scale);
    });
  } else if (scene.option === "B") {
    p.stroke(...GOLD, 230);
    p.strokeWeight(2);
    for (let i = 0; i < 4; i += 1)
      for (let j = i + 1; j < 4; j += 1) seg(TETRAHEDRON[i], TETRAHEDRON[j]);
    p.noStroke();
    p.fill(...GOLD);
    for (const v of TETRAHEDRON) {
      const q = at(v);
      p.circle(q.x, q.y, 7);
    }
  } else if (scene.option === "C") {
    withDash(p, [3, 4], () => {
      p.stroke(...CYAN, 180);
      p.strokeWeight(1.4);
      seg([0, 0, 0], [1, 1, 1]);
    });
    // 1.8 的細棒沿著體對角線，兩端各多出 (1.8 − √3)/2
    const ext = (1.8 - Math.sqrt(3)) / 2 / Math.sqrt(3);
    const a: Vec3 = [-ext, -ext, -ext];
    const b: Vec3 = [1 + ext, 1 + ext, 1 + ext];
    p.stroke(...GOLD, 230);
    p.strokeWeight(3);
    seg(a, b);
    p.noStroke();
    p.fill(240, 110, 100);
    for (const v of [a, b]) {
      const q = at(v);
      p.circle(q.x, q.y, 9);
    }
  } else {
    p.noStroke();
    p.fill(...CYAN, 40);
    p.beginShape();
    for (const v of HEXAGON) {
      const q = at(v);
      p.vertex(q.x, q.y);
    }
    p.endShape(p.CLOSE);
    p.stroke(...CYAN, 200);
    p.strokeWeight(1.4);
    for (let i = 0; i < 6; i += 1) seg(HEXAGON[i], HEXAGON[(i + 1) % 6]);
    p.noFill();
    p.stroke(...GOLD, 230);
    p.strokeWeight(2);
    p.beginShape();
    for (const v of diskPoints(0.6)) {
      const q = at(v);
      p.vertex(q.x, q.y);
    }
    p.endShape(p.CLOSE);
  }
}
