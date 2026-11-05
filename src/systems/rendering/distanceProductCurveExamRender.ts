import type p5 from "p5";
import {
  A,
  F,
  X_RIGHT,
  bound,
  distanceToF,
  distanceToLine,
  upperY,
} from "../../exam/gaokao-2024-i-distance-product-curve/geometry";
import { clipRect, withDash } from "./p5PlotHelpers";

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;

type Scene = { width: number; height: number; x: number; showBound: boolean };

const X0 = -2.4;
const X1 = 3.2;

export function renderDistanceProductCurveExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont(
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif',
  );
  const pad = 16;
  const unit = (scene.width - 2 * pad) / (X1 - X0);
  const yHalf = (scene.height - 2 * pad) / unit / 2;
  const sx = (x: number) => pad + (x - X0) * unit;
  const sy = (y: number) => scene.height / 2 - y * unit;
  const plot = {
    x: pad,
    y: pad,
    w: scene.width - 2 * pad,
    h: scene.height - 2 * pad,
  };

  // 格線與座標軸
  p.stroke(...WHITE, 22);
  p.strokeWeight(1);
  for (let x = -2; x <= 3; x += 1)
    p.line(sx(x), plot.y, sx(x), plot.y + plot.h);
  for (let y = -Math.floor(yHalf); y <= yHalf; y += 1)
    p.line(plot.x, sy(y), plot.x + plot.w, sy(y));
  p.stroke(...WHITE, 100);
  p.line(plot.x, sy(0), plot.x + plot.w, sy(0));
  p.line(sx(0), plot.y, sx(0), plot.y + plot.h);
  p.noStroke();
  p.fill(...WHITE, 140);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  for (const x of [-2, -1, 1, 2, 3]) p.text(String(x), sx(x), sy(0) + 4);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text("1", sx(0) - 4, sy(1));
  p.text("−1", sx(0) - 4, sy(-1));

  // 準線 x = −2
  withDash(p, [4, 4], () => {
    p.stroke(...CYAN, 160);
    p.line(sx(A), plot.y, sx(A), plot.y + plot.h);
  });
  p.noStroke();
  p.fill(...CYAN, 220);
  p.textAlign(p.LEFT, p.TOP);
  p.text("x = −2", sx(A) + 4, plot.y + 2);

  // y = 1
  withDash(p, [2, 4], () => {
    p.stroke(...WHITE, 90);
    p.line(sx(0), sy(1), sx(X_RIGHT), sy(1));
  });

  clipRect(p, plot, () => {
    if (scene.showBound) {
      p.noFill();
      p.stroke(...CYAN, 130);
      p.strokeWeight(1.2);
      for (const sign of [1, -1]) {
        p.beginShape();
        for (let i = 0; i <= 200; i += 1) {
          const x = -1.5 + ((X1 + 1.5) * i) / 200;
          p.vertex(sx(x), sy(sign * bound(x)));
        }
        p.endShape();
      }
    }
    p.noFill();
    p.stroke(...GOLD, 230);
    p.strokeWeight(2);
    for (const sign of [1, -1]) {
      p.beginShape();
      for (let i = 0; i <= 400; i += 1) {
        const x = A + 0.02 + ((X_RIGHT - A - 0.02) * i) / 400;
        const y = upperY(x);
        if (y !== null) p.vertex(sx(x), sy(sign * y));
      }
      p.vertex(sx(X_RIGHT), sy(0));
      p.endShape();
    }
  });

  // 焦點與動點
  const y = upperY(scene.x) ?? 0;
  const P = { x: sx(scene.x), y: sy(y) };
  p.stroke(...WHITE, 200);
  p.strokeWeight(1.4);
  p.line(P.x, P.y, sx(F.x), sy(F.y));
  p.stroke(...CYAN, 200);
  p.line(P.x, P.y, sx(A), P.y);
  p.noStroke();
  p.fill(...WHITE);
  p.circle(sx(F.x), sy(F.y), 7);
  p.textAlign(p.LEFT, p.TOP);
  p.text("F", sx(F.x) + 4, sy(F.y) + 4);
  p.fill(...GOLD);
  p.circle(P.x, P.y, 10);
  p.fill(...GOLD, 240);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BOTTOM);
  const pf = distanceToF(scene.x, y);
  const d = distanceToLine(scene.x);
  p.text(
    `${pf.toFixed(2)} × ${d.toFixed(2)} = ${(pf * d).toFixed(2)}`,
    Math.min(P.x + 8, scene.width - 150),
    P.y - 8,
  );
}
