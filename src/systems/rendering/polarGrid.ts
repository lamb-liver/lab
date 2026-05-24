import type p5 from 'p5';

const TAU = Math.PI * 2;

export function renderPolarGrid(p: p5, size: number): void {
  const extent = (size / 600) * 260;
  const ringStep = (size / 600) * 60;

  p.noFill();

  p.stroke(255, 255, 255, 10);
  p.strokeWeight(1);
  for (let r = ringStep; r <= extent + ringStep; r += ringStep) {
    p.circle(0, 0, r * 2);
  }

  p.stroke(255, 255, 255, 12);
  p.line(-extent, 0, extent, 0);
  p.line(0, -extent, 0, extent);

  p.stroke(255, 255, 255, 7);
  for (let a = 0; a < TAU; a += Math.PI / 6) {
    p.line(0, 0, Math.cos(a) * extent, Math.sin(a) * extent);
  }
}
