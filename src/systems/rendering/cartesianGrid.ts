import type p5 from 'p5';

/** 利薩茹等笛卡爾曲線用的低權重參考框 */
export function renderCartesianGrid(p: p5, size: number): void {
  const extent = (size / 600) * 300;
  const ring = (size / 600) * 520;

  p.noFill();

  p.stroke(255, 255, 255, 10);
  p.strokeWeight(1);
  p.ellipse(0, 0, ring);

  p.stroke(255, 255, 255, 8);
  p.line(-extent, 0, extent, 0);
  p.line(0, -extent, 0, extent);
}

/** 繁花曲線：外圈 + 隨 R 變化的大圓邊界 */
export function renderSpirographGrid(p: p5, size: number, R: number): void {
  const scale = size / 600;
  const extent = scale * 300;
  const ringOuter = scale * 560;
  const ringR = Math.round(R) * 2 * scale;

  p.noFill();

  p.stroke(255, 255, 255, 10);
  p.strokeWeight(1);
  p.ellipse(0, 0, ringOuter);

  p.stroke(255, 255, 255, 6);
  p.ellipse(0, 0, ringR);

  p.stroke(255, 255, 255, 8);
  p.line(-extent, 0, extent, 0);
  p.line(0, -extent, 0, extent);
}

/** 諧振圖：外圈 + 內圈參考圓 */
export function renderHarmonographGrid(p: p5, size: number): void {
  const extent = (size / 600) * 300;
  const ringOuter = (size / 600) * 560;
  const ringInner = (size / 600) * 100;

  p.noFill();

  p.stroke(255, 255, 255, 10);
  p.strokeWeight(1);
  p.ellipse(0, 0, ringOuter);

  p.stroke(255, 255, 255, 6);
  p.ellipse(0, 0, ringInner);

  p.stroke(255, 255, 255, 8);
  p.line(-extent, 0, extent, 0);
  p.line(0, -extent, 0, extent);
}
