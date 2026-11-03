import type p5 from 'p5';
import {
  mapX,
  mapY,
  plotRect,
  readUniformSum,
  type UniformSumParams,
} from '../../curve/modules/uniform-sum-density/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

export function renderUniformSumDensity(p: p5, params: UniformSumParams): void {
  const plot = plotRect(p.width, p.height);
  const reading = readUniformSum(params);

  p.background(10, 10, 10);

  p.stroke(...WHITE, 70);
  p.strokeWeight(1.2);
  p.line(mapX(plot, 0), mapY(plot, 0), mapX(plot, reading.support), mapY(plot, 0));

  p.fill(...GOLD, 48);
  p.stroke(...GOLD, 220);
  p.strokeWeight(1.7);
  p.beginShape();
  for (const corner of reading.corners) p.vertex(mapX(plot, corner.x), mapY(plot, corner.y));
  p.endShape(p.CLOSE);

  p.noStroke();
  p.fill(...GOLD, 230);
  for (const corner of reading.corners) p.circle(mapX(plot, corner.x), mapY(plot, corner.y), 7);

  const bar = (y: number, length: number, color: readonly [number, number, number], label: string) => {
    p.stroke(...color, 210);
    p.strokeWeight(2.4);
    p.line(mapX(plot, 0), mapY(plot, y), mapX(plot, length), mapY(plot, y));
    p.noStroke();
    p.fill(...color, 210);
    p.textSize(13);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(label, mapX(plot, length + 0.08), mapY(plot, y));
  };

  bar(-0.22, reading.a, WHITE, 'a');
  bar(-0.46, reading.b, GOLD, 'b');
}
