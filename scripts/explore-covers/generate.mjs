import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourceDir = __dirname;
const pngDir = resolve(__dirname, '../../public/images/explore-covers');
const W = 1600;
const H = 1000;
const C = {
  bg: '#0A0A0A',
  bg2: '#0F0F0F',
  gold: '#D4B87A',
  guide: '#D8D8D8',
  blue: '#5DADE2',
  red: '#E76F51',
};

mkdirSync(sourceDir, { recursive: true });
mkdirSync(pngDir, { recursive: true });

function doc(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="${C.bg}"/>
  ${body}
</svg>`;
}

function line(x1, y1, x2, y2, color = C.guide, width = 4, opacity = 0.3, extra = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round" ${extra}/>`;
}

function path(d, color = C.gold, width = 8, opacity = 1, extra = '') {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
}

function poly(points, fill, stroke = C.gold, opacity = 1, width = 4) {
  return `<polygon points="${points.map((p) => p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}" stroke-linejoin="round"/>`;
}

function circle(cx, cy, r, fill = C.gold, opacity = 1, stroke = 'none', width = 0) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}" stroke="${stroke}" stroke-width="${width}"/>`;
}

function arrowHead(x, y, angle, color = C.gold, opacity = 1) {
  const size = 22;
  const a1 = angle + Math.PI * 0.82;
  const a2 = angle - Math.PI * 0.82;
  const p1 = [x, y];
  const p2 = [x + Math.cos(a1) * size, y + Math.sin(a1) * size];
  const p3 = [x + Math.cos(a2) * size, y + Math.sin(a2) * size];
  return poly([p1, p2, p3], color, color, opacity, 1);
}

function rect(x, y, w, h, fill, stroke = C.gold, opacity = 1, sw = 4) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"/>`;
}

function limitsRiemannSum() {
  const base = 760;
  const x0 = 250;
  const dx = 120;
  const heights = [260, 305, 345, 378, 400, 410, 398, 365];
  const rects = heights
    .map((h, i) => rect(x0 + i * dx, base - h, dx, h, 'rgba(212,184,122,0.16)', C.gold, 0.82, 5))
    .join('\n');
  const redGaps = heights
    .slice(1, 7)
    .map((h, i) => {
      const x = x0 + (i + 1) * dx;
      const top = base - h;
      const curveY = top - (i % 2 === 0 ? 34 : 24);
      return poly([[x + 10, top], [x + dx - 10, top], [x + dx - 10, curveY], [x + 10, curveY + 10]], C.red, 'none', 0.22, 0);
    })
    .join('\n');
  const curve = path('M 210 715 C 360 545 500 390 690 355 C 850 325 990 315 1210 410 C 1330 465 1410 560 1460 650', C.gold, 10, 1, 'filter="url(#goldGlow)"');
  return doc(`
    ${line(220, base, 1390, base, C.guide, 4, 0.18)}
    ${rects}
    ${redGaps}
    ${curve}
  `);
}

function differentialEquations() {
  const segs = [];
  for (let y = 250; y <= 760; y += 70) {
    for (let x = 270; x <= 1320; x += 85) {
      const m = Math.sin((x - 780) / 220) * 0.7 - (y - 500) / 420;
      const a = Math.atan(m);
      const len = 42;
      const x1 = x - Math.cos(a) * len / 2;
      const y1 = y - Math.sin(a) * len / 2;
      const x2 = x + Math.cos(a) * len / 2;
      const y2 = y + Math.sin(a) * len / 2;
      segs.push(line(x1.toFixed(1), y1.toFixed(1), x2.toFixed(1), y2.toFixed(1), C.guide, 4, 0.42));
    }
  }
  const c1 = path('M 235 705 C 430 610 515 450 680 390 C 850 328 1010 410 1135 560 C 1215 655 1310 700 1400 670', C.gold, 9, 1, 'filter="url(#goldGlow)"');
  const c2 = path('M 255 440 C 420 360 560 350 690 435 C 815 520 905 660 1045 705 C 1170 745 1280 680 1385 555', C.gold, 7, 0.78);
  return doc(`${segs.join('\n')}\n${c1}\n${c2}`);
}

function sequencesAndSeries() {
  const x = 330;
  const y = 300;
  const totalW = 860;
  const h = 360;
  const parts = [0.5, 0.25, 0.125, 0.0625];
  let cursor = x;
  const blocks = parts.map((p, i) => {
    const w = totalW * p;
    const r = rect(cursor, y, w, h, `rgba(212,184,122,${0.24 - i * 0.025})`, C.gold, 0.95 - i * 0.1, 5);
    cursor += w;
    return r;
  }).join('\n');
  const boundaryX = x + totalW;
  const arrow = `${line(440, 740, boundaryX - 28, 740, C.gold, 8, 0.95)}${arrowHead(boundaryX - 18, 740, 0)}`;
  return doc(`
    ${blocks}
    ${line(boundaryX, 240, boundaryX, 720, C.guide, 5, 0.42, 'stroke-dasharray="18 18"')}
    ${arrow}
    ${path(`M ${x} ${y + h + 50} L ${boundaryX} ${y + h + 50}`, C.guide, 3, 0.18)}
  `);
}

function probabilityStatistics() {
  const outer = rect(390, 220, 820, 560, 'rgba(212,184,122,0.08)', C.gold, 0.95, 6);
  const split = [
    line(800, 220, 800, 780, C.guide, 4, 0.42),
    line(390, 505, 1210, 505, C.guide, 4, 0.42),
    rect(800, 220, 410, 285, 'rgba(93,173,226,0.16)', C.blue, 0.72, 5),
    rect(390, 505, 410, 275, 'rgba(212,184,122,0.18)', C.gold, 0.72, 5),
    rect(800, 505, 410, 275, 'rgba(212,184,122,0.28)', C.gold, 0.95, 5),
  ].join('\n');
  const dots = [];
  for (let i = 0; i < 90; i += 1) {
    const x = 250 + ((i * 97) % 1100);
    const y = 160 + ((i * 53) % 660);
    if (x > 390 && x < 1210 && y > 220 && y < 780) continue;
    dots.push(circle(x, y, 5 + (i % 3), C.blue, 0.16));
  }
  return doc(`${dots.join('\n')}\n${outer}\n${split}`);
}

function permutationsCombinations() {
  const grid = [];
  for (let x = 370; x <= 1190; x += 105) grid.push(line(x, 210, x, 790, C.guide, 3, 0.16));
  for (let y = 250; y <= 740; y += 85) grid.push(line(320, y, 1260, y, C.guide, 3, 0.16));
  const paths = [
    'M 370 740 L 475 740 L 580 655 L 685 655 L 790 570 L 895 485 L 1000 485 L 1105 400 L 1210 315',
    'M 370 740 L 475 655 L 580 655 L 685 570 L 790 570 L 895 570 L 1000 485 L 1105 400 L 1210 315',
    'M 370 740 L 370 655 L 475 655 L 580 570 L 685 485 L 790 485 L 895 400 L 1000 400 L 1210 315',
  ];
  const dots = [];
  for (let x = 370; x <= 1210; x += 105) {
    for (let y = 315; y <= 740; y += 85) dots.push(circle(x, y, 7, C.guide, 0.24));
  }
  return doc(`
    ${grid.join('\n')}
    ${dots.join('\n')}
    ${paths.map((d, i) => path(d, C.gold, i === 0 ? 9 : 6, i === 0 ? 1 : 0.45, i === 0 ? 'filter="url(#goldGlow)"' : '')).join('\n')}
    ${circle(370, 740, 16, C.gold, 0.95)}
    ${circle(1210, 315, 18, C.gold, 1)}
  `);
}

function complexEulerFormula() {
  const cx = 560, cy = 500, r = 210;
  const theta = -0.72;
  const px = cx + Math.cos(theta) * r;
  const py = cy + Math.sin(theta) * r;
  const wave = 'M 860 505 C 920 360 980 360 1040 505 S 1160 650 1220 505 S 1340 360 1400 505';
  const wave2 = 'M 860 575 C 920 705 980 705 1040 575 S 1160 445 1220 575 S 1340 705 1400 575';
  return doc(`
    ${circle(cx, cy, r, 'none', 1, C.guide, 4)}
    ${line(cx - 260, cy, cx + 270, cy, C.guide, 3, 0.22)}
    ${line(cx, cy + 250, cx, cy - 260, C.guide, 3, 0.22)}
    ${line(px, py, 860, 505, C.guide, 4, 0.25, 'stroke-dasharray="18 18"')}
    ${line(cx, cy, px, py, C.gold, 10, 1, 'filter="url(#goldGlow)"')}
    ${arrowHead(px, py, theta, C.gold, 1)}
    ${path(wave, C.blue, 8, 0.9, 'filter="url(#softGlow)"')}
    ${path(wave2, C.gold, 7, 0.75)}
    ${line(840, 540, 1420, 540, C.guide, 3, 0.18)}
  `);
}

function exponentialLogarithm() {
  const ox = 345, oy = 760, sx = 330, sy = 180;
  function map(x, y) { return [ox + x * sx, oy - y * sy]; }
  const expPts = [];
  for (let x = 0; x <= 1.55; x += 0.06) {
    const y = Math.exp(x) - 1;
    if (y <= 3) expPts.push(map(x, y));
  }
  const logPts = [];
  for (let x = 1; x <= 3; x += 0.06) {
    const y = Math.log(x) / Math.log(1.9);
    if (y >= 0 && y <= 3) logPts.push(map(x, y));
  }
  const toD = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const diagA = map(0, 0);
  const diagB = map(2.4, 2.4);
  return doc(`
    ${line(ox, oy, 1370, oy, C.guide, 4, 0.2)}
    ${line(ox, oy, ox, 190, C.guide, 4, 0.2)}
    ${line(diagA[0], diagA[1], diagB[0], diagB[1], C.guide, 5, 0.42, 'stroke-dasharray="18 18"')}
    ${path(toD(expPts), C.gold, 10, 1, 'filter="url(#goldGlow)"')}
    ${path(toD(logPts), C.blue, 9, 0.9, 'filter="url(#softGlow)"')}
  `);
}

function vectors() {
  const ox = 420, oy = 710;
  const bx = 1130, by = 450;
  const vx = 860, vy = 285;
  const t = 0.66;
  const px = ox + (bx - ox) * t;
  const py = oy + (by - oy) * t;
  const baseAngle = Math.atan2(by - oy, bx - ox);
  const vAngle = Math.atan2(vy - oy, vx - ox);
  return doc(`
    ${line(ox - 80, oy + 30, 1240, oy + 30, C.guide, 3, 0.14)}
    ${line(ox, oy, bx, by, C.guide, 6, 0.55)}
    ${arrowHead(bx, by, baseAngle, C.guide, 0.55)}
    ${line(ox, oy, vx, vy, C.gold, 10, 1, 'filter="url(#goldGlow)"')}
    ${arrowHead(vx, vy, vAngle, C.gold, 1)}
    ${line(ox, oy, px, py, C.gold, 9, 0.95)}
    ${line(px, py, vx, vy, C.guide, 5, 0.45, 'stroke-dasharray="20 16"')}
    ${circle(px, py, 14, C.gold, 0.95)}
  `);
}

function matrixLinearTransform() {
  const ghost = [];
  for (let x = 310; x <= 1290; x += 100) ghost.push(line(x, 220, x, 780, C.guide, 2, 0.07));
  for (let y = 220; y <= 780; y += 80) ghost.push(line(310, y, 1290, y, C.guide, 2, 0.07));
  const grid = [];
  const a = { x: 118, y: -35 };
  const b = { x: 42, y: 78 };
  const origin = { x: 520, y: 700 };
  for (let i = -2; i <= 6; i += 1) {
    const p1 = { x: origin.x + i * a.x - 4 * b.x, y: origin.y + i * a.y - 4 * b.y };
    const p2 = { x: origin.x + i * a.x + 4 * b.x, y: origin.y + i * a.y + 4 * b.y };
    grid.push(line(p1.x, p1.y, p2.x, p2.y, C.gold, 5, 0.62));
  }
  for (let j = -4; j <= 4; j += 1) {
    const p1 = { x: origin.x - 2 * a.x + j * b.x, y: origin.y - 2 * a.y + j * b.y };
    const p2 = { x: origin.x + 6 * a.x + j * b.x, y: origin.y + 6 * a.y + j * b.y };
    grid.push(line(p1.x, p1.y, p2.x, p2.y, C.gold, 5, 0.62));
  }
  const unit = [
    [origin.x, origin.y],
    [origin.x + a.x, origin.y + a.y],
    [origin.x + a.x + b.x, origin.y + a.y + b.y],
    [origin.x + b.x, origin.y + b.y],
  ];
  return doc(`
    ${ghost.join('\n')}
    ${grid.join('\n')}
    ${poly(unit, 'rgba(212,184,122,0.18)', C.gold, 1, 8)}
  `);
}

function trigWaveInterference() {
  const toWave = (y0, amp, freq, phase = 0) => {
    const pts = [];
    for (let x = 170; x <= 1430; x += 28) {
      const t = (x - 170) / 1260;
      const y = y0 + Math.sin(t * Math.PI * 2 * freq + phase) * amp;
      pts.push(`${pts.length ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };
  const envTop = toWave(500, 185, 1.5, 0).replaceAll('L', 'L');
  const envBot = toWave(500, -185, 1.5, 0);
  return doc(`
    ${path(toWave(500, 90, 6.2, 0.2), C.blue, 7, 0.34)}
    ${path(toWave(500, 85, 5.7, 1.1), C.guide, 7, 0.32)}
    ${path(toWave(500, 145, 5.95, 0.6), C.gold, 10, 1, 'filter="url(#goldGlow)"')}
    ${path(envTop, C.gold, 6, 0.62, 'stroke-dasharray="18 18"')}
    ${path(envBot, C.gold, 6, 0.62, 'stroke-dasharray="18 18"')}
  `);
}

function conicDynamicGeometry() {
  return doc(`
    ${line(300, 240, 300, 760, C.guide, 4, 0.15)}
    ${line(795, 230, 720, 770, C.guide, 4, 0.15)}
    ${line(1210, 240, 1115, 760, C.guide, 4, 0.15)}
    ${circle(410, 500, 10, C.gold, 0.7)}
    ${circle(750, 500, 10, C.gold, 0.7)}
    ${circle(1160, 500, 10, C.gold, 0.7)}
    ${path('M 500 320 C 645 320 705 405 705 500 C 705 595 645 680 500 680 C 355 680 295 595 295 500 C 295 405 355 320 500 320 Z', C.gold, 9, 1, 'filter="url(#goldGlow)"')}
    ${path('M 740 705 C 875 645 935 555 935 500 C 935 445 875 355 740 295', C.gold, 9, 1, 'filter="url(#goldGlow)"')}
    ${path('M 1090 300 C 1225 385 1295 455 1335 500 C 1295 545 1225 615 1090 700', C.gold, 9, 1, 'filter="url(#goldGlow)"')}
    ${path('M 1015 300 C 925 405 900 455 895 500 C 900 545 925 595 1015 700', C.gold, 6, 0.45)}
  `);
}

function functionEquations() {
  const ox = 260;
  const oy = 700;
  const pw = 1080;
  const ph = 390;
  const halfY = 5;

  function map(x, y) {
    return [
      ox + ((x + 5) / 10) * pw,
      oy - ((y + halfY) / (halfY * 2)) * ph,
    ];
  }

  function curvePath(fn, x0 = -4.6, x1 = 4.6, step = 0.08) {
    const pts = [];
    for (let x = x0; x <= x1 + 1e-9; x += step) {
      const y = fn(x);
      if (!Number.isFinite(y) || Math.abs(y) > halfY * 0.98) continue;
      const [px, py] = map(x, y);
      pts.push(`${pts.length ? 'L' : 'M'} ${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    return pts.join(' ');
  }

  const ghost = curvePath((x) => x * x);
  const active = curvePath((x) => 0.82 * ((1.15 * (x - 0.9)) ** 2) - 1.35);
  const cubic = curvePath((x) => 0.18 * (x + 2.2) * (x - 0.15) ** 2 * (x - 2.1), -4.2, 4.2, 0.07);

  const axisA = map(-5, 0);
  const axisB = map(5, 0);
  const nlY = 790;
  const nlX0 = 300;
  const nlX1 = 1300;
  const seg = (a, b) =>
    line(
      nlX0 + ((a + 5) / 10) * (nlX1 - nlX0),
      nlY,
      nlX0 + ((b + 5) / 10) * (nlX1 - nlX0),
      nlY,
      C.gold,
      8,
      0.92,
    );

  const roots = [-1.55, 2.35];
  const rootDots = roots
    .map((x) => {
      const [px, py] = map(x, 0);
      return circle(px, py, 12, C.gold, 0.95);
    })
    .join('\n');

  return doc(`
    ${line(axisA[0], axisA[1], axisB[0], axisB[1], C.guide, 4, 0.22)}
    ${line(nlX0, nlY, nlX1, nlY, C.guide, 4, 0.18)}
    ${seg(-4.8, -1.55)}
    ${seg(2.35, 4.8)}
    ${path(ghost, C.guide, 6, 0.28)}
    ${path(cubic, C.guide, 5, 0.2)}
    ${path(active, C.gold, 10, 1, 'filter="url(#goldGlow)"')}
    ${rootDots}
    ${circle(...map(0.9, -1.35), 14, C.gold, 0.9)}
  `);
}

function trigonometryFundamentals() {
  const cx = 560;
  const cy = 500;
  const r = 210;
  const theta = Math.PI / 4;
  const px = cx + Math.cos(theta) * r;
  const py = cy - Math.sin(theta) * r;

  const tri = [
    [1040, 710],
    [1210, 710],
    [1125, 560],
  ];

  return doc(`
    ${circle(cx, cy, r, 'none', 1, C.guide, 4)}
    ${line(cx - r * 1.12, cy, cx + r * 1.12, cy, C.guide, 3, 0.18)}
    ${line(cx, cy + r * 1.12, cx, cy - r * 1.12, C.guide, 3, 0.18)}
    ${line(px, py, px, cy, C.guide, 4, 0.28, 'stroke-dasharray="16 14"')}
    ${line(px, py, cx, py, C.guide, 4, 0.28, 'stroke-dasharray="16 14"')}
    ${line(cx, cy, px, py, C.gold, 10, 1, 'filter="url(#goldGlow)"')}
    ${path(`M ${cx + r * 0.3} ${cy} A ${r * 0.3} ${r * 0.3} 0 0 0 ${cx + Math.cos(theta) * r * 0.3} ${cy - Math.sin(theta) * r * 0.3}`, C.gold, 5, 0.72)}
    ${circle(px, py, 14, C.gold, 0.95)}
    ${poly(tri, 'rgba(212,184,122,0.08)', C.guide, 0.32, 4)}
    ${line(tri[0][0], tri[0][1], tri[1][0], tri[1][1], C.guide, 5, 0.32)}
    ${line(tri[1][0], tri[1][1], tri[2][0], tri[2][1], C.guide, 4, 0.22)}
    ${line(tri[2][0], tri[2][1], tri[0][0], tri[0][1], C.guide, 4, 0.22)}
    ${circle(1125, 632, 88, 'none', 0.22, C.guide, 3)}
  `);
}

const covers = {
  'limits-riemann-sum': limitsRiemannSum,
  'differential-equations-geometry': differentialEquations,
  'sequences-and-series': sequencesAndSeries,
  'probability-statistics': probabilityStatistics,
  'permutations-combinations': permutationsCombinations,
  'complex-euler-formula': complexEulerFormula,
  'exponential-logarithm': exponentialLogarithm,
  vectors,
  'matrix-linear-transform': matrixLinearTransform,
  'trig-wave-interference': trigWaveInterference,
  'conic-dynamic-geometry': conicDynamicGeometry,
  'trigonometry-fundamentals': trigonometryFundamentals,
  'function-equations': functionEquations,
};

for (const [slug, build] of Object.entries(covers)) {
  writeFileSync(resolve(sourceDir, `${slug}.svg`), build(), 'utf8');
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const slug of Object.keys(covers)) {
    const svgPath = resolve(sourceDir, `${slug}.svg`);
    await page.goto(pathToFileURL(svgPath).href, { waitUntil: 'load' });
    await page.screenshot({ path: resolve(pngDir, `${slug}.png`), type: 'png' });
    console.log(`generated ${slug}`);
  }
} finally {
  await browser.close();
}
