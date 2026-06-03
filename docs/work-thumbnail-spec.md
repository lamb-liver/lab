# 作品集縮圖規格（reveal 100% 完成態）

> **狀態**：**Implemented**（2026-05-27）。本檔保留為設計歷史；**現行權威來源**見下方。  
> **Primary authority**：
> - [`p5toreact.md` §作品集縮圖](p5toreact.md#作品集縮圖workcard--curvethumbnail)
> - [`src/lib/curveThumbnail.ts`](../src/lib/curveThumbnail.ts)
> - 各模組 `sample(..., { purpose: 'thumbnail', revealProgress: 1 })`  
> **範圍**：僅 `/works` 列表卡片（`WorkCard` + `curveThumbnail.ts`）。Explore 封面仍用手動 PNG（`coverImage`），本次不改。

---

## 1. 問題與目標

### 現況

- 縮圖在建置期呼叫 `module.sample(defaultParams)` → 單條 SVG `<path>`。
- 多數「有 reveal / 時間軸 / 多圖層」的作品，縮圖像動畫**開頭**或**簡化幾何**（例：干涉只取一條 envelope、線性網格只採一條豎線）。
- 傅立葉 explore 封面是手動 PNG，視覺正確，但走不同管線。

### 目標

列表縮圖 = **`defaultParams` 下、等同互動畫布 `reveal === 100%`（及對應完成態參數）的幾何快照**。

- **不**跑 p5、**不**錄屏、**不**手動 PNG（works）。
- **禁止**把不相鄰分支硬串成一條 polyline（會產生「鬼線」）。

### 不在範圍

- `equiangular-spiral`、`vector-field-streamlines`：已登記 `workCurveBySlug`，縮圖為多 path（ghost + active / 多條流線）。
- Explore `coverImage` 流程。

---

## 2. 架構契約

### 2.1 擴充 `SampleOptions`（`src/curve/types.ts`）

```ts
export type SamplePurpose = 'default' | 'thumbnail';

export type SampleOptions = {
  step: number;
  /** 縮圖專用；建置期入口強制傳 1 */
  revealProgress?: number;
  purpose?: SamplePurpose;
};
```

### 2.2 縮圖回傳型別

```ts
export type ThumbnailPath = {
  points: CurvePoint[];
  opacity?: number;        // 預設 1
  closed?: boolean;        // 閉合軌跡用
  strokeWidth?: number;    // 點雲 0.4–0.6；預設主線 ~1.2
  excludeFromBbox?: boolean; // ghost / 次要層：true
};

export type ThumbnailSpec = {
  paths: ThumbnailPath[];
};
```

`CurveModule.sample()` 行為：

- `purpose !== 'thumbnail'` → 維持現有 `CurvePoint[]`（或內部再包一層，由入口正規化）。
- `purpose === 'thumbnail'` → 回傳 `ThumbnailSpec`（建議在 `curveThumbnail.ts` 正規化，避免改動所有呼叫端）。

**實作建議**：在 `curveThumbnail.ts` 內：

```ts
function sampleForThumbnail(module: CurveModule): ThumbnailSpec {
  const raw = module.sample(module.defaultParams, {
    step: module.sampleStep ?? BASE_POINT_STEP,
    revealProgress: 1,
    purpose: 'thumbnail',
  });
  return normalizeToThumbnailSpec(raw);
}
```

### 2.3 `getThumbnailTime(slug, params)`（每模組）

- 各模組在 `geometry.ts` 或 `index.ts` **匯出** `getThumbnailTime(params): number`。
- Audit 表只寫語意，**不寫**依賴 easing 反推的常數（例如曳物線不要用 `time = π`）。
- **禁止** thumbnail 在 `t=0` 產生「看起來沒畫」的圖（駐波、黎曼等）。

### 2.4 曳物線特例（`catenary`）

Thumbnail **不**用 `pullingOscillation(time)` 反算時間。

- 直接以 **`dynamicT = maxT`**（`pulling = 1` 的幾何輸入）建 ghost / dynamic 曲線與繩段。
- `getThumbnailTime` 對 catenary 可忽略或恆回傳 0（僅供介面一致）。

### 2.5 `fitToView`（`src/lib/curveThumbnail.ts`）

1. 收集所有 path 的點，**僅** `excludeFromBbox !== true` 者參與 bbox。
2. 對 bbox 做 `fitToView` 得統一 transform。
3. **同一 transform** 套用到所有 path（含 ghost），避免曳物線 ghost 把動態軌壓扁。

SVG 輸出：

- 每 `ThumbnailPath` 一個 `<path>`（或合併策略見下）。
- 點雲：`stroke-linecap="round"`、`stroke-linejoin="round"`。
- 支援 `opacity`、`stroke-width` 屬性。

### 2.6 線段計數 vs `paths.length`

部分作品可用 **單一 `<path>` + 多段 `M L`** 表示多條線段（與多個 `<path>` 視覺等效）。

| 測試斷言 | 適用 |
|----------|------|
| `paths.length` | 干涉（固定公式）、單 path 類 |
| `segmentCount(spec) >= N` | 線性網格、仿射圖樣（允許 1 path 多子路徑） |
| `pointCount >= N` | 克拉尼、IFS |
| `maxAbsY(mainPath) > ε` | 駐波主波、黎曼主曲線 |

實作 `countSegments(spec)`：統計所有 path 內相鄰點對距離 > 閾值的邊數，或幾何層直接回傳 `segments.length`。

---

## 3. 分類（無 S+）

| 類 | 定義 | slug |
|----|------|------|
| **S** | 完成態本質為單一軌跡 | `rose-curve`, `lissajous-curve`, `harmonograph-curve`, `spirograph-curve` |
| **M** | 多獨立幾何；次要層用 `excludeFromBbox` | 其餘 12 個互動作品 |

---

## 4. Audit 表（實作依此表逐項驗收）

欄位說明：

- **完成態**：thumbnail 必須使用的 reveal / 層數 / 域參數。
- **時間**：`getThumbnailTime` 或「不依賴 time」。
- **輸出**：path 數或線段/點數；測試寫明斷言類型。

### S — 單 path

| slug | 完成態 | `getThumbnailTime` | paths | 測試 |
|------|--------|-------------------|-------|------|
| `rose-curve` | 全 θ 週期 | `0` | 1, `closed: true` | `points.length` 下限 |
| `lissajous-curve` | 全參數域 | `0` | 1, closed | 同上 |
| `harmonograph-curve` | 全週期 | `0` | 1 | 同上 |
| `spirograph-curve` | 全週期 | `0` | 1, closed | 同上 |

### M — 多 path / 多線段

| slug | 完成態 | 時間 / 輸入 | 幾何來源（與 renderer 同源） | 輸出 & 測試 |
|------|--------|-------------|------------------------------|-------------|
| `standing-wave` | `revealProgress = 1` | `getThumbnailTime = 0`（`cos(0)=1`，振幅最大；`π/(2·ω)` 會使 `cos(π/2)=0` 反而變平線） | `buildStandingWavePoints(..., reveal=1, t)` | **1 path** 主波（必要）。包絡 **預設不畫**；若畫則 **2 path**，`opacity: 0.35`, `excludeFromBbox: true`。測試：**主波** `max\|y\| > ε` |
| `interference-fringes` | `revealProgress = 1` | `0` | `buildInterferenceGeometry` → **僅 `envelopes[]`**（不畫 fringe 調製） | `maxOrder = floor(d/λ)`，`paths.length === 2*maxOrder+1`（預設 **5**）。測試：預設 `=== 5`，一般 `>= 4` |
| `chladni-figures` | `revealProgress = 1` | `0` | 固定 seed 迭代點雲（**非** `sampleChladniNodalLines` 稀疏掃線） | ≥ **2000** 點；`strokeWidth` **0.4–0.6**；round linecap。測試 `pointCount >= 2000` |
| `parabolic-reflection` | `reveal = 1` | `0` | 光線族全展開 geometry | 每條光線一 path 或 `segmentCount >= N` |
| `conic-envelope` | `reveal = 1` | `0` | 包絡 + 族線 | 多 path，`segmentCount` 或 `paths.length` 下限 |
| `conic-focus-locus` | `reveal = 1` | `0` | 橢圓 + 焦點連線 | ≥ 2 path |
| `linear-transform-grid` | `revealProgress = 1` | `getThumbnailTime` → **`Math.PI / 2`**（`m11 = 1 + sin(t)*0.4` 最大；避免「未變換正方形」縮圖） | `buildGridLines(canvas, matrix, 1)` | **`GRID_SEGMENT_COUNT = 22`**（11 垂直 + 11 水平，`i ∈ $[-5,5]$`）。可 1 path×22 段 M L 或 22 path。測試 **`segmentCount >= 22`**，不綁 `paths.length` |
| `affine-transform-pattern` | `reveal = 1`，平移距離滿 | `0` | `buildRecursiveTransformSegments`，**maxDepth = 2**（與 runtime 一致，不加深） | **20 個方形輪廓** → 建議 **20 path**（每方形 `M L L L`，不 Z）或 `segmentCount >= 20` |
| `rotation-scale-composition` | **`layerCount = STACK_LAYERS`（60）** | `0` | `buildStackedSegments(..., 60)` | 每 segment 一 path 或 `segmentCount >=` 預期值（由 geometry 匯出常數） |
| `affine-ifs-fractal` | `revealProgress = 1` | `0` | 固定 seed（與 runtime 同公式） | ≥ **5000** 點；`strokeWidth` 0.4–0.6。測試 `pointCount >= 5000` |
| `riemann-sum` | `activeDomain = 1` | `getThumbnailTime`：波形非平線（同駐波邏輯） | ① `buildRiemannCurvePoints(..., 1)` ② `buildRiemannRectangles(..., 1)` | **`1 + n` path**（`n = floor(partitionCount)`）：1 主曲線 + 每矩形 **1** 開放 path（`M-L-L-L` 三邊，**不加 Z**）。測試主曲線 `max\|y\| > ε` |
| `tangent-approximation` | `collapseProgress = 1` → `smoothDx ≈ target dx` | `getThumbnailTime`：非平線 | ghost 全曲線（低 opacity, `excludeFromBbox`）+ 割線 + 延伸線 | 2–3 path。測試割線 path 存在 |
| `catenary` | **`dynamicT = maxT`**（幾何 pulling=1） | **不依賴 time / easing** | ghost 上/下；dynamic 上/下；繩上/下 | **6 path**：ghost×2（`excludeFromBbox`）+ dynamic×2 + rope×2。bbox **僅** dynamic+rope |

### 常數匯出建議（避免魔數）

```ts
// linear-transform-grid/geometry.ts
export const GRID_SEGMENT_COUNT = (GRID_DENSITY + 1) * 2; // 22

// rotation-scale-composition/geometry.ts
export const STACK_LAYERS = 60;

// interference: 在 sample thumbnail 內計算並 export 或測試內聯 floor(d/λ)
```

---

## 5. 實作順序

```
1. types.ts          → SampleOptions, ThumbnailPath, ThumbnailSpec
2. curveThumbnail.ts → sampleForThumbnail, fitToView(excludeFromBbox), 多 path SVG
3. 測試基建         → countSegments, normalizeToThumbnailSpec, thumbnail.test.ts
4. 逐模組           → 按 audit 表改 sample(purpose:'thumbnail') + getThumbnailTime
5. registry 測試    → 每 slug 跑 thumbnail 斷言
6. p5toreact.md      → 更新「作品集縮圖」章節，刪除「單折線 = 完成態」的誤導描述
```

**不要**先做「單 path 湊合」再改多 path（已否決兩階段策略）。

### 建議修改檔案清單

| 檔案 | 動作 |
|------|------|
| `src/curve/types.ts` | 擴充型別 |
| `src/lib/curveThumbnail.ts` | 核心入口 + SVG |
| `src/lib/curveThumbnail.test.ts` | **新建** |
| `src/curve/modules/*/geometry.ts` | `getThumbnailTime`、thumbnail 幾何 |
| `src/curve/modules/*/index.ts` | `sample` thumbnail 分支 |
| `p5toreact.md` | 文檔 |
| `work-thumbnail-spec.md` | 本檔（實作後標記完成） |

`WorkCard.astro` **不必改**（仍 `getCurveThumbnailSvg(slug)`）。

---

## 6. 各模組實作要點（摘錄）

### `interference-fringes`

```ts
const geo = buildInterferenceGeometry({ ..., revealProgress: 1, time: 0 });
// paths = geo.envelopes.map(pts => ({ points: toCurvePoints(pts) }))
// 不要 sampleInterferenceFringesCurve 只取 envelopes[0]
```

### `linear-transform-grid`

```ts
const matrix = calculateMatrix(shearX, scaleY, getThumbnailTime(params));
const lines = buildGridLines(width, matrix, 1);
// → ThumbnailSpec：22 segments
```

### `riemann-sum`

```ts
// path 0: curve activeDomain=1
// paths 1..n: each rect as open 3-edge path
```

### `chladni-figures` / `affine-ifs-fractal`

- 固定 seed PRNG（可抽 `mulberry32` 到 `src/curve/prng.ts` 共用）。
- 克拉尼：模擬 runtime 粒子迭代至 ≥2000 點（不必模擬 8000）。
- IFS：≥5000 點，公式見 `affine-ifs-fractal/animation.ts` 內四分支機率。

### `catenary`

```ts
const upper = buildParametricCurve(t => evaluateTractrix(t, L), 0, maxT);
// dynamicT = maxT for dynamic + object + rope endpoints
```

### `equiangular-spiral`

```ts
// ghost: θ ∈ [0, maxTheta]；active: θ ∈ [0, maxTheta * 0.72]；head 單點
// ghost path → excludeFromBbox: true
```

### `vector-field-streamlines`

```ts
// buildAllStreamlines(24, 140, step, time: 0) → 每條流線一 path
// 勿將多條流線首尾相接成一條 polyline
```

---

## 7. 測試清單（`vitest`）

新建 `src/lib/curveThumbnail.test.ts` + 擴充各模組 test：

| 測試 | 內容 |
|------|------|
| 入口 | 所有 `workInteractiveSlugs` 呼叫 `getCurveThumbnailSvg` 非 null |
| 干涉 | 預設 params → 解析 SVG path 數或 metadata → **5** paths |
| 線性網格 | `segmentCount >= 22` |
| 駐波 | 主波 `max|y| > 0.05`（尺度依 geometry） |
| 克拉尼 / IFS | `pointCount >= 2000` / `5000` |
| 黎曼 | `paths.length === 1 + floor(n)` |
| 曳物線 | bbox 不含 ghost 時 dynamic 軌仍具合理 span |

既有 `registry.sync.test.ts` 保持通過。

---

## 8. 驗收（人工）

1. `npm run dev` → `/works` 逐卡對照同 slug 互動頁「reveal 100% 停住」。
2. 干涉：5 條雙曲線骨架可辨，非單弧。
3. 線性網格：變形網格，非一條線或正四方 ghost。
4. 駐波：明顯正弦波，非平線。
5. 克拉尼 / IFS：沙粒感，非稀疏掃線。

---

## 9. 參考

- 現有縮圖入口：`src/lib/curveThumbnail.ts`
- 作品登記：`src/curve/registry.ts`、`src/works/interactiveRegistry.ts`
- 視覺規格：`workart.md`（色票、glow）
- p5 遷移總則：`p5toreact.md`（實作後更新縮圖章節）

---

## 10. 已定決策紀錄（勿改動除非產品另議）

| 決策 | 內容 |
|------|------|
| 克拉尼 / IFS | 固定 seed 點雲；≥2000 / ≥5000 點；strokeWidth 0.4–0.6 |
| 駐波 | 不強制包絡；主波非平線即可 |
| 干涉 | **只 envelope**，預設 5 paths |
| 曳物線 | `dynamicT = maxT`，不用 `time=π` |
| 黎曼矩形 | `1 + n` path，每矩形一 path 三邊 |
| 仿射圖樣 | maxDepth=2 |
| 線性網格 | 22 線段；測試 segmentCount 非 paths.length |
| fitToView | ghost 用 `excludeFromBbox` |

---

*文件版本：v3.1 · 設計歷史 · 已實作（現行權威見 `p5toreact.md` 與 `src/lib/curveThumbnail.ts`）*
