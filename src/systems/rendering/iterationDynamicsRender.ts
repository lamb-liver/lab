/**
 * 疊代動力學的 p5 渲染。只接收參數 + 純幾何輸出，不含 React 狀態。
 */
import type p5 from 'p5';
import {
  BIF_STYLE,
  CHAOS_STYLE,
  CHAOS_VERTICES,
  COBWEB_STEPS,
  COBWEB_STYLE,
  CURVE_SAMPLES,
} from '../../explore/iteration-dynamics/constants';
import {
  cobwebPath,
  logisticCurvePoints,
  type BifurcationColumn,
  type Point,
} from '../../explore/iteration-dynamics/geometry';

const PAD = 34;

/** 蛛網圖：單位框、對角線 y=x、邏輯斯蒂拋物線、蛛網階梯與起點。 */
export function renderCobweb(p: p5, r: number, x0: number): void {
  const size = Math.min(p.width, p.height);
  const plot = size - PAD * 2;
  const toX = (x: number): number => PAD + x * plot;
  const toY = (y: number): number => size - PAD - y * plot;

  p.push();

  // 單位框
  p.noFill();
  p.stroke(COBWEB_STYLE.axis);
  p.strokeWeight(1);
  p.rect(PAD, PAD, plot, plot);

  // 對角線 y = x
  p.stroke(COBWEB_STYLE.diagonal);
  p.line(toX(0), toY(0), toX(1), toY(1));

  // 邏輯斯蒂拋物線 y = r x(1-x)
  p.stroke(COBWEB_STYLE.curve);
  p.strokeWeight(2);
  p.beginShape();
  for (const [x, y] of logisticCurvePoints(r, CURVE_SAMPLES)) p.vertex(toX(x), toY(y));
  p.endShape();

  // 蛛網階梯
  p.stroke(COBWEB_STYLE.web);
  p.strokeWeight(1);
  p.beginShape();
  for (const [x, y] of cobwebPath(r, x0, COBWEB_STEPS)) p.vertex(toX(x), toY(y));
  p.endShape();

  // 起點 x0
  p.noStroke();
  p.fill(COBWEB_STYLE.start);
  p.circle(toX(x0), toY(0), 7);

  // 座標端點標示
  p.fill(COBWEB_STYLE.axis);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  p.text('0', toX(0), size - PAD + 5);
  p.text('1', toX(1), size - PAD + 5);

  p.pop();
}

/** 分岔圖：r（橫軸）對吸引子 x（縱軸）的散點。data 由呼叫端 memoize。 */
export function renderBifurcation(p: p5, data: BifurcationColumn[]): void {
  if (data.length === 0) return;
  const size = Math.min(p.width, p.height);
  const plot = size - PAD * 2;
  const rMin = data[0]!.r;
  const rMax = data[data.length - 1]!.r;
  const span = rMax - rMin || 1;
  const toX = (r: number): number => PAD + ((r - rMin) / span) * plot;
  const toY = (x: number): number => size - PAD - x * plot;

  p.push();

  // 單位框
  p.noFill();
  p.stroke(BIF_STYLE.axis);
  p.strokeWeight(1);
  p.rect(PAD, PAD, plot, plot);

  // 吸引子散點
  p.stroke(BIF_STYLE.point);
  p.strokeWeight(1);
  for (const col of data) {
    const px = toX(col.r);
    for (const x of col.xs) p.point(px, toY(x));
  }

  // r 軸端點標示
  p.noStroke();
  p.fill(BIF_STYLE.axis);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  p.text(rMin.toFixed(0), toX(rMin), size - PAD + 5);
  p.text(rMax.toFixed(0), toX(rMax), size - PAD + 5);

  p.pop();
}

/** 混沌遊戲：畫出三角形頂點與前 count 個散點（漸進累積）。 */
export function renderChaosGame(p: p5, points: Point[], count: number): void {
  const size = Math.min(p.width, p.height);
  const plot = size - PAD * 2;
  const toX = (x: number): number => PAD + x * plot;
  const toY = (y: number): number => PAD + y * plot;

  p.push();

  // 散點
  p.stroke(CHAOS_STYLE.point);
  p.strokeWeight(1.4);
  const n = Math.min(count, points.length);
  for (let i = 0; i < n; i += 1) {
    const [x, y] = points[i]!;
    p.point(toX(x), toY(y));
  }

  // 三角形頂點
  p.noStroke();
  p.fill(CHAOS_STYLE.vertex);
  for (const [x, y] of CHAOS_VERTICES) p.circle(toX(x), toY(y), 8);

  p.pop();
}

/** 分岔圖上標出目前 r 的垂直線，串接蛛網圖的同一個 r。 */
export function renderBifurcationMarker(
  p: p5,
  r: number,
  rMin: number,
  rMax: number,
): void {
  const size = Math.min(p.width, p.height);
  const plot = size - PAD * 2;
  const span = rMax - rMin || 1;
  const px = PAD + ((r - rMin) / span) * plot;

  p.push();
  p.stroke(BIF_STYLE.marker);
  p.strokeWeight(1.5);
  p.line(px, PAD, px, size - PAD);
  p.noStroke();
  p.fill(BIF_STYLE.marker);
  p.textSize(11);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(`r=${r.toFixed(2)}`, px, PAD - 3);
  p.pop();
}
