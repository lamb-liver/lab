import type p5 from 'p5';
import { JULIA_CFG } from './config';
import { driftPath, lerpToward } from './math';
import {
  buildCoordinateTables,
  renderJuliaTile,
} from './renderer';

type TileCoord = { x: number; y: number };

export type JuliaTargetParams = {
  autoDrift: number;
  cx: number;
  cy: number;
  maxIter: number;
};

type JuliaEngineOptions = {
  onRenderProgress?: (pct: number) => void;
  onSmoothCChange?: (cx: number, cy: number) => void;
};

export class JuliaEngine {
  private pg: p5.Graphics | null = null;
  private ctx2d: CanvasRenderingContext2D | null = null;
  private imgData: ImageData | null = null;
  private zxTable = new Float32Array(0);
  private zyTable = new Float32Array(0);
  private renderQueue: TileCoord[] = [];
  private width = 0;
  private height = 0;

  private cx = -0.7269;
  private cy = 0.1889;
  private scx = -0.7269;
  private scy = 0.1889;
  private qx = 0;
  private qy = 0;
  private qMaxIter = JULIA_CFG.MAX_ITER;
  private t = 0;
  private autoDrift = true;
  private maxIter = JULIA_CFG.MAX_ITER;
  private guideAlpha = 0;
  private lastInteract = 0;
  private totalTiles = 0;

  constructor(private readonly options: JuliaEngineOptions = {}) {}

  rebuild(p: p5): void {
    this.width = p.width;
    this.height = p.height;
    this.pg = p.createGraphics(this.width, this.height);
    this.pg.pixelDensity(1);
    this.ctx2d = (this.pg as unknown as { drawingContext: CanvasRenderingContext2D })
      .drawingContext;
    this.imgData = this.ctx2d.createImageData(this.width, this.height);
    const tables = buildCoordinateTables(this.width, this.height, JULIA_CFG.ZOOM);
    this.zxTable = tables.zxTable;
    this.zyTable = tables.zyTable;
    this.rebuildQueue();
  }

  markInteraction(nowMs: number): void {
    this.lastInteract = nowMs;
  }

  syncTarget(target: JuliaTargetParams): void {
    this.autoDrift = Math.round(target.autoDrift) === 1;
    if (!this.autoDrift) {
      this.cx = target.cx;
      this.cy = target.cy;
    }
    const nextMaxIter = Math.round(target.maxIter);
    if (nextMaxIter !== this.maxIter) {
      this.maxIter = nextMaxIter;
      this.rebuildQueue();
    }
  }

  frame(p: p5, target: JuliaTargetParams, nowMs: number): boolean {
    if (this.width !== p.width || this.height !== p.height || !this.pg || !this.imgData) {
      this.rebuild(p);
    }

    this.syncTarget(target);
    this.updateMotion(nowMs);
    this.renderTiles();

    p.background(10, 10, 10);
    p.image(this.pg!, 0, 0);
    this.drawGuide(p);

    const rendered = this.totalTiles - this.renderQueue.length;
    const pct = this.totalTiles > 0 ? Math.floor((rendered / this.totalTiles) * 100) : 100;
    this.options.onRenderProgress?.(pct);

    const smoothKey = `${this.scx.toFixed(4)}:${this.scy.toFixed(4)}`;
    if (smoothKey !== this.lastSmoothKey) {
      this.lastSmoothKey = smoothKey;
      this.options.onSmoothCChange?.(this.scx, this.scy);
    }

    return this.renderQueue.length > 0 || this.guideAlpha > 0.01;
  }

  private lastSmoothKey = '';

  private rebuildQueue(): void {
    this.renderQueue.length = 0;
    for (let y = 0; y < this.height; y += JULIA_CFG.TILE) {
      for (let x = 0; x < this.width; x += JULIA_CFG.TILE) {
        this.renderQueue.push({ x, y });
      }
    }
    this.totalTiles = this.renderQueue.length;
    this.qMaxIter = this.maxIter;
  }

  private updateMotion(nowMs: number): void {
    this.t += JULIA_CFG.DRIFT_SPD;

    if (this.autoDrift) {
      const dp = driftPath(this.t);
      this.cx = dp.x;
      this.cy = dp.y;
    }

    this.scx = lerpToward(this.scx, this.cx, JULIA_CFG.LERP_F);
    this.scy = lerpToward(this.scy, this.cy, JULIA_CFG.LERP_F);

    const nqx = Math.round(this.scx * JULIA_CFG.QUANT) / JULIA_CFG.QUANT;
    const nqy = Math.round(this.scy * JULIA_CFG.QUANT) / JULIA_CFG.QUANT;

    if (nqx !== this.qx || nqy !== this.qy || this.maxIter !== this.qMaxIter) {
      this.qx = nqx;
      this.qy = nqy;
      this.qMaxIter = this.maxIter;
      this.rebuildQueue();
    }

    const idleSec = (nowMs - this.lastInteract) / 1000;
    this.guideAlpha = lerpToward(this.guideAlpha, idleSec < 2 ? 1 : 0, 0.06);
  }

  private renderTiles(): void {
    if (!this.imgData || !this.ctx2d) return;

    for (let i = 0; i < JULIA_CFG.TILES_PER_FRAME; i++) {
      const tile = this.renderQueue.shift();
      if (!tile) break;

      renderJuliaTile({
        target: this.imgData.data,
        width: this.width,
        height: this.height,
        startX: tile.x,
        startY: tile.y,
        tileSize: JULIA_CFG.TILE,
        cx: this.scx,
        cy: this.scy,
        zoom: JULIA_CFG.ZOOM,
        maxIter: this.maxIter,
        zxTable: this.zxTable,
        zyTable: this.zyTable,
      });
    }

    this.ctx2d.putImageData(this.imgData, 0, 0);
  }

  private drawGuide(p: p5): void {
    if (this.guideAlpha < 0.01) return;

    const a = this.guideAlpha;
    p.stroke(255, 255, 255, 10 * a);
    p.strokeWeight(0.5);
    p.line(p.width / 2, 0, p.width / 2, p.height);
    p.line(0, p.height / 2, p.width, p.height / 2);
  }
}
