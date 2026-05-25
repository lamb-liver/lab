# 曲線視覺風格系統（Art System）

> 工程規格：所有數學曲線作品共用同一套 rendering / UI 語言。  
> **只替換 geometry，不重做 style。**  
> 參考實作：`roseModule` + `roseRenderPreset`（`src/systems/rendering/presets.ts`）

---

## 1. 目的與邊界

| 是 | 不是 |
|----|------|
| 極簡、安靜、可進作品集的數學視覺 | 工程 debug 視圖 |
| 固定視覺語言 + 可替換曲線模組 | 繪圖計算機 / 科學繪圖 / 教學圖解 |
| Rose、Lissajous、Spirograph、Harmonograph、Fourier 共用 | 每條曲線各做一套 UI / glow |

**一句話**：Curve 是唯一主角；其餘元素（grid、guide、UI）視覺權重必須更低。

---

## 2. 視覺層級（固定）

```
1. Curve（含 glow 主線）
2. Glow 光暈層
3. Guide / Grid
4. UI 文字
```

**禁止**：guide 比 curve 更亮、更粗、更吸睛。

---

## 3. Design Tokens

### 3.1 色彩

| Token | 值 | 用途 |
|-------|-----|------|
| `bg.canvas` | `rgb(10, 10, 10)` | p5 `background`；畫布 host 背景 |
| `color.accent` | `rgb(212, 184, 122)` | 曲線主色（金） |
| `color.guide` | `rgb(255, 255, 255)` | 網格 / guide 線（必須低 alpha） |
| `color.ui.title` | accent + bold + 小字 | 曲線名稱 |
| `color.ui.meta` | 灰、小字 | 公式、參數 |

**避免**：高彩度、多 accent、純白主體、大面積實心色塊。

### 3.2 透明度區間

| 元素 | alpha 範圍 |
|------|------------|
| Guide / grid | 6–18 |
| Ghost curve | ≈ 16 |
| Outer glow | ≈ 16 |
| Middle glow | ≈ 42 |
| Core line | ≈ 230 |
| UI | 低對比，融入背景 |

### 3.3 線寬（曲線 glow 標準）

| 層 | strokeWeight | stroke alpha |
|----|--------------|--------------|
| Outer glow | ≈ 7 | ≈ 16 |
| Middle glow | ≈ 3.5 | ≈ 42 |
| Core line | ≈ 1.5 | ≈ 230 |

實作對應 `CurveStyle.reveal.layers`（由外到內繪製）：

```ts
// 目標結構（src/systems/rendering/types.ts）
type CurveStyle = {
  ghost: { stroke: StrokeRGBA; weight: number };
  reveal: { layers: Array<{ stroke: StrokeRGBA; weight: number }> };
};
```

> **Rose 現況**：`presets.ts` 為 2 層 reveal（soft + crisp），ghost weight=1。新曲線應朝上表三層靠攏，或統一升級 `roseRenderPreset`。

---

## 4. 渲染規則

### 4.1 背景

```ts
background(10, 10, 10);
```

- 畫布容器 CSS 背景與 p5 一致（`#0a0a0a`）。
- 不用漸層、不用純白底。

### 4.2 Guide / Grid

**只提供空間感，不是主體。**

| 規則 | 說明 |
|------|------|
| 僅 outline | `noFill()`，禁止實心 guide |
| 低 alpha | `stroke(255, 255, 255, 6–18)` |
| 細、少、不密集 | 忌 HUD 風、粗網格、高亮軸 |

```ts
// 正確
noFill();
stroke(255, 255, 255, 10);
ellipse(0, 0, r * 2);

// 錯誤
fill(255);
ellipse(...);
```

實作：`polarGrid.ts` · `cartesianGrid.ts` · `harmonograph` / `spirograph` grid · `fourierRender.ts`（依 `RenderConfig.grid`）。

### 4.3 Ghost Curve

| 項目 | 規格 |
|------|------|
| 目的 | 完整 shape reference；reveal 時維持構圖 |
| 強度 | **永遠弱於** reveal 主線 |
| 建議 | accent @ alpha≈16，weight≈1 |

實作：`renderGhostCurve` → `config.curveStyle.ghost`。

### 4.4 Reveal 主線（多層 glow）

- 不要 instant 全出；需**生成 / 漸進 / 繪製感**。
- **時間驅動**（explore 傅立葉）：`reveal += (deltaTime / 1000) * speedPerSec`（例：`0.12` / sec）。
- **幀驅動**（作品 CurveModule）：`revealSpeed` ≈ **0.0015–0.0025** / frame；Rose = `0.0024`。
- 模式：依曲線選 `byTheta` 或 `byArcLength`（見 `p5toreact.md`）。
- **語意**：`revealProgress` 為 0–1 **比例**；`threshold = totalArc × progress`（每幀依當前點列重算）。連續 morph 中改 shape 可能視覺跳變，見 [`reactkey.md`](reactkey.md) Reveal 一節。

實作：`filterRevealed` + `renderGlowStroke`（`reveal.ts`）。

### 4.5 Epicycles 導引（Explore 傅立葉）

| 項目 | 規格 |
|------|------|
| 用途 | 生長最前端：嵌套圓 + 半徑連線 |
| 強度 | `stroke(255,255,255,12–20)`，細線，低於主曲線 |
| 同步 | `tAtArcLength(points, totalLength * reveal)`，guide 端點對齊 reveal 邊緣 |

實作：`renderFourierEpicycles`（`fourierRender.ts`）。

### 4.6 構圖

| 項目 | 規格 |
|------|------|
| 曲線佔比 | 畫面 **70%–85%** |
| 對齊 | centered、symmetrical、visually balanced |
| 避免 | 過多留白、curve 過小 |

邏輯畫布基準：`BASE_CANVAS_SIZE = 600`；polar grid `extent` 隨 canvas 等比縮放。

---

## 5. UI 規則

**融入背景，不搶 curve。**

| 禁止 | 正確 |
|------|------|
| 黑框 panel、實心資訊塊、強邊界 overlay | 直接文字、低權重 |
| debug / 工程資訊 | curve name、formula、parameters |
| 高亮白色方框 | mono 小字 + muted 色 |

### 5.1 作品集（`/works`）

- **舞台**：`.work-detail__stage` — canvas **左**、`.controls-panel--stage` **右**（React portal）。
- 桌面 ≥1024px：右欄 `sticky`；手機：canvas 上、控制下（均在 prose 之前）。
- 控件：`ParamControls` + `StatsPanel`（+ `DeltaPhaseControl` 若需 δ）；由 `getMetadata` 驅動公式與 stats。

### 5.2 視覺化（`/explore`）

- **不走 portal**；控件內嵌於各 `*ExploreRoot`（非作品頁 `createPortal`）。
- 列表卡片：`ExploreCard` + frontmatter `coverImage`（`public/explore/{slug}-{主題}-cover.png`）。

#### 5.2.1 傅立葉（`fourier-series`）

- 佈局：`.fourier-explore` — canvas 上、`.fourier-explore__toolbar` 下（方形容器 + `min(34vh, 400px)` 限高）。
- reveal 用 `deltaTime`；公式/meta 降權在工具列下方。

#### 5.2.2 波疊加（`trig-wave-interference`）

- 佈局：`.wave-explore__stage` — **圖左**（`.wave-explore__visual`）· **控件右**（`.wave-explore__sidebar`，對照作品頁 `.controls-panel--stage`）。
- 桌面 ≥1024px：sidebar `position: sticky; top: var(--nav-height)`；`max-height: calc(100vh - var(--nav-height))`；`overflow-y: auto` + `overscroll-behavior: contain`。
- 手機：canvas 上、sidebar 下（單欄堆疊）。
- 舞台隔離：`wave-explore__stage { contain: layout }`，避免滑桿拖曳與外層捲動互搶。

**DOM 結構（固定）**

```text
wave-explore
└─ wave-explore__stage          [contain: layout]
   ├─ wave-explore__visual      ← canvas + 視覺區標題（WAVE SUPERPOSITION）
   └─ wave-explore__sidebar     [sticky · overscroll-behavior: contain]
      ├─ mode-switch
      ├─ state-info             ← 干涉 / 拍頻文案（勿放回 canvas 下）
      ├─ wave-a-controls
      ├─ wave-b-controls
      └─ formula
```

**Canvas 高度（勿以 vh 為主）**

```ts
// src/explore/wave-superposition/canvasSize.ts
height = clamp(300px, width × ratio, 520px)
// 拍頻：ratio × 0.75（BEAT_HEIGHT_SCALE）
// vh 僅作可選上限：min(height, floor(innerHeight × 0.42))
```

| 規則 | 說明 |
|------|------|
| 主控制 | `width × ratio` + px clamp |
| 禁止 | `height: 40vh` 單獨作主高度（ultrawide / 13" 筆電體驗差） |
| vh | 只當 **upper bound**，在 `measureWaveCanvas` / draw resize 時套用 |
| 量測寬度 | 左欄 `.wave-explore__canvas` host，非整頁寬度 |

### 5.3 列表縮圖

| 區塊 | 來源 |
|------|------|
| `/works` | 建置期 SVG（`curveThumbnail` + `registry`） |
| `/explore` | 靜態 PNG cover（`coverImage` 欄位） |

縮圖補充規範（已實作）：

- 多幾何作品使用 `ThumbnailSpec.paths[]`；禁止把不相鄰分支硬串成單折線。
- `excludeFromBbox: true` 的 path 僅繪製，不參與定框（典型：ghost）。
- 粒子型縮圖（Chladni / IFS）用「**單一 path + 多段 `M L`**」點雲筆觸，避免數千個 `<path>` 造成卡片頁負擔。
- 點雲筆觸允許以 `NaN` 分段（建置期會轉成多子路徑），維持視覺與效能平衡。

---

## 6. 程式對照

### 6.1 新增作品曲線（`/works`）

```
geometry     →  src/curve/modules/<name>/index.ts
style        →  src/systems/rendering/presets.ts
compose      →  renderFrame(p, snap, renderPreset)
lifecycle    →  CurveWorkRoot 或 *CurveRoot + useMorphCurveP5 + portal
```

### 6.2 新增 explore 互動（`/explore`）

```
geometry     →  src/explore/<name>/path.ts        零 p5、path cache
render       →  src/systems/rendering/fourierRender.ts（或新 renderer）
lifecycle    →  src/components/explore/*ExploreRoot.tsx
cover        →  public/explore/{slug}-{主題}-cover.png + frontmatter coverImage
```

**檢查清單（作品）**

- [ ] `renderPreset.background` = `[10, 10, 10]`
- [ ] `curveStyle` 使用 accent `(212, 184, 122)` + 分層 glow
- [ ] ghost 弱於 reveal；grid/guide 僅低 alpha 線框
- [ ] `work-detail__stage` 右欄 portal；滑桿一屏可見
- [ ] 連續 lerp 參數：`cacheStrategy: none` + `patchTargetParams`（見 `reactkey.md`）
- [ ] 未重做 glow / hierarchy 語言

**檢查清單（explore）**

- [ ] reveal 用 `deltaTime`（非固定每幀增量）
- [ ] mode / N 離散參數：path cache；draw 只做 slice + guide
- [ ] 2D 文案用「接近方形的週期軌道」，不稱「真正方形」
- [ ] 列表 `coverImage` 已設

---

## 7. 工作流程

```
p5 Web Editor prototype
    → 視覺成立（glow、hierarchy、composition、reveal）
    → 再抽 CurveModule + systems/rendering
```

**不要**先 abstraction 再調視覺。  
**不要**在新曲線重做：glow system、UI style、hierarchy、rendering 哲學、構圖語言。

---

## 8. 反模式速查

| 反模式 | 後果 |
|--------|------|
| `fill(255)` guide | 搶主角、破壞安靜感 |
| 纯白 UI 框 | 像工具軟體，不像作品 |
| 單層、無 glow 曲線 | 暗底上幾乎消失 |
| instant 全曲線 | 失去生成感 |
| 每曲線自訂一套色 | 作品集不統一 |
| guide 亮於 curve | 層級顛倒 |

---

## 9. 參考

| 資源 | 路徑 |
|------|------|
| Style reference 曲線 | `src/curve/modules/rose/` |
| 渲染 preset | `src/systems/rendering/presets.ts` |
| 傅立葉 renderer | `src/systems/rendering/fourierRender.ts` |
| 作品舞台 CSS | `src/styles/pages/work-detail.css` |
| explore 詳頁 CSS | `src/styles/pages/explore-detail.css` |
| explore 控件 CSS | `src/styles/components/explore/fourier-explore.css` |
| p5 ↔ React 整合 | `p5toreact.md` |
| Morph 曲線 React × p5 契約 | `reactkey.md` |

---

*本文件由 `Curve_Visualization_Style_System_中文.docx` 整理為工程規格；原 docx 已移除。*
