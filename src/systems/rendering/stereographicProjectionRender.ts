import type p5 from 'p5';
import { degToRad, type Vec3 } from '../../curve/projection3d';
import {
  meridian,
  readStereo,
  ring,
  STEREO_VIEW,
  type StereoParams,
} from '../../curve/modules/stereographic-projection/geometry';
import { createScene3dLayout, drawLabel, screenOf, type Rgb } from './scene3d';

const GOLD: Rgb = [212, 184, 122];
const WHITE: Rgb = [255, 255, 255];

export function renderStereographicProjection(p: p5, params: StereoParams): void {
  const layout = createScene3dLayout(p.width, p.height, { scaleDivisor: 7 });
  const reading = readStereo(params);
  const at = (point: Vec3) => screenOf(layout, point, STEREO_VIEW);

  p.background(10, 10, 10);

  const strokePath = (points: Vec3[], color: Rgb, weight: number, alpha: number) => {
    p.stroke(color[0], color[1], color[2], alpha);
    p.strokeWeight(weight);
    p.noFill();
    p.beginShape();
    for (const point of points) {
      const screen = at(point);
      p.vertex(screen.x, screen.y);
    }
    p.endShape();
  };

  for (const azim of [0, 45, 90, 135]) strokePath(meridian(azim), GOLD, 1.15, 80);
  strokePath(ring(1, 0), WHITE, 1.45, 150);

  const parallelRadius = Math.sin(degToRad(reading.colat));
  if (parallelRadius > 0.02) {
    strokePath(ring(parallelRadius, Math.cos(degToRad(reading.colat))), GOLD, 1.6, 210);
  }
  if (reading.radius > 0.04) strokePath(ring(reading.radius, 0), WHITE, 1.15, 80);

  const far = reading.colat <= 90 ? reading.image : reading.point;
  const from = at(reading.north);
  const to = at(far);
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 220);
  p.strokeWeight(1.7);
  p.line(from.x, from.y, to.x, to.y);

  const dot = (point: Vec3, color: Rgb, diameter: number) => {
    const screen = at(point);
    p.noStroke();
    p.fill(color[0], color[1], color[2], 230);
    p.circle(screen.x, screen.y, diameter);
  };
  dot(reading.north, GOLD, 6);
  dot(reading.image, WHITE, 7);
  dot(reading.point, GOLD, 8);
  drawLabel(p, at(reading.north), 'N', GOLD);
}
