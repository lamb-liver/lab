import type p5 from 'p5';
import {
  C_MAX,
  C_MIN,
  ILL_BINS,
  WELL_BINS,
  falseAlarmRate,
  missRate,
  totalError,
} from '../../exam/gaokao-2023-ii-screening-threshold/geometry';
import { withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;

type Scene = { width: number; height: number; c: number; en: boolean };

export function renderScreeningThresholdExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const left = 48;
  const right = scene.width - 16;
  const sx = (x: number) =>
    left + ((x - C_MIN) / (C_MAX - C_MIN)) * (right - left);
  const H = scene.height;
  const panelH = (H - 60) / 3;
  const panels: {
    bins: typeof ILL_BINS | typeof WELL_BINS;
    color: readonly [number, number, number];
    top: number;
    label: string;
    shadeBelow: boolean;
  }[] = [
    {
      bins: ILL_BINS,
      color: GOLD,
      top: 14,
      label: scene.en ? 'Patients' : '患病者',
      shadeBelow: true,
    },
    {
      bins: WELL_BINS,
      color: CYAN,
      top: 14 + panelH + 10,
      label: scene.en ? 'Healthy' : '未患病者',
      shadeBelow: false,
    },
  ];
  const dMax = 0.014;
  const cx = sx(scene.c);

  for (const panel of panels) {
    const bottom = panel.top + panelH - 14;
    const sy = (d: number) => bottom - (d / dMax) * (bottom - panel.top - 14);
    for (const b of panel.bins) {
      p.noStroke();
      p.fill(...panel.color, 60);
      p.rect(
        sx(b.from),
        sy(b.density),
        sx(b.to) - sx(b.from),
        bottom - sy(b.density),
      );
      // 誤判的部分
      const a = panel.shadeBelow ? b.from : Math.max(b.from, scene.c);
      const z = panel.shadeBelow ? Math.min(b.to, scene.c) : b.to;
      if (z > a) {
        p.fill(...panel.color, 200);
        p.rect(sx(a), sy(b.density), sx(z) - sx(a), bottom - sy(b.density));
      }
      p.fill(...WHITE, 150);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(String(b.density), (sx(b.from) + sx(b.to)) / 2, sy(b.density) - 2);
    }
    p.stroke(...WHITE, 90);
    p.strokeWeight(1);
    p.line(left, bottom, right, bottom);
    p.noStroke();
    p.fill(...panel.color, 240);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    p.text(panel.label, left + 4, panel.top);
    p.fill(...WHITE, 150);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    for (const x of [95, 100, 105]) p.text(String(x), sx(x), bottom + 2);
  }

  // f(c)
  const top = 14 + 2 * (panelH + 10);
  const bottom = H - 22;
  const fMax = 0.07;
  const sy = (f: number) => bottom - (f / fMax) * (bottom - top - 10);
  p.stroke(...WHITE, 90);
  p.line(left, bottom, right, bottom);
  p.line(left, top, left, bottom);
  withDash(p, [3, 4], () => {
    p.stroke(...WHITE, 60);
    p.line(left, sy(0.02), right, sy(0.02));
  });
  p.noStroke();
  p.fill(...WHITE, 160);
  p.textSize(10);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('0.02', left - 4, sy(0.02));
  p.text('f(c)', left - 4, top + 6);
  p.textAlign(p.CENTER, p.TOP);
  for (const x of [95, 100, 105]) p.text(String(x), sx(x), bottom + 2);
  p.noFill();
  p.stroke(...WHITE, 220);
  p.strokeWeight(2);
  p.beginShape();
  for (let i = 0; i <= 100; i += 1) {
    const c = C_MIN + ((C_MAX - C_MIN) * i) / 100;
    p.vertex(sx(c), sy(totalError(c)));
  }
  p.endShape();
  p.noStroke();
  p.fill(...GOLD);
  p.circle(cx, sy(totalError(scene.c)), 9);

  // 臨界線貫穿三格
  p.stroke(...GOLD, 220);
  p.strokeWeight(1.4);
  p.line(cx, 10, cx, bottom);
  p.noStroke();
  p.fill(...GOLD, 240);
  p.textSize(11);
  p.textAlign(cx > (left + right) / 2 ? p.RIGHT : p.LEFT, p.TOP);
  const off = cx > (left + right) / 2 ? -6 : 6;
  p.text(`c = ${scene.c.toFixed(1)}`, cx + off, top + 2);
  p.text(
    `p ${(missRate(scene.c) * 100).toFixed(2)}%  q ${(falseAlarmRate(scene.c) * 100).toFixed(2)}%`,
    cx + off,
    top + 16,
  );
}
