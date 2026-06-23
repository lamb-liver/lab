# p5.js → React（羊·實驗）

本文件記錄如何把 p5 Web Editor sketch 接到 Astro + React。  
**參考實作（27 互動）**：

| 類型 | slug |
|------|------|
| morph 曲線 | `rose-curve`、`lissajous-curve`、`harmonograph-curve`、`spirograph-curve` |
| reveal / 時間軸 | `standing-wave`、`interference-fringes`、`chladni-figures`、`parabolic-reflection`、`conic-envelope`、`conic-focus-locus`、`catenary`、`equiangular-spiral`、`affine-transform-pattern`、`rotation-scale-composition`、`affine-ifs-fractal`、`riemann-sum`、`tangent-approximation`、`linear-transform-grid` |
| 數列 / 碎形幾何 | `arithmetic-geometric-sequences`、`fibonacci-spiral`、`sierpinski-triangle` |
| 自訂 p5 引擎 | `vector-field-streamlines`、`complex-arithmetic-geometry`、`complex-polar-form`、`euler-formula-rotation`、`julia-set`、`complex-phase-portrait` |  
**視覺規格**：見 [`art.md`](art.md)；Works 細節見 [`workart.md`](workart.md)，Explore 細節見 [`exploreart.md`](exploreart.md)。
**React × p5 架構契約（morph 曲線）**：見 [`reactkey.md`](reactkey.md)。  
**Explore 互動**（傅立葉級數）見下方「Explore 視覺化」章節；不走 CurveModule / portal 舞台。

---

## 原則

| 規則 | 說明 |
|------|------|
| Instance mode | `new p5(sketch, container)`，禁止 global `setup` / `draw` |
| React 管 UI | slider、按鈕、統計在 DOM；不用 p5 `createSlider` / `text()` |
| p5 只渲染 | `draw` 內只做 `renderFrame(p, snap, config)` |
| 不重建 instance | p5 `useEffect` 建立一次；`targetParams` 用 `useRef` 同步 |
| morph 滑桿 urgent 更新 | `patchTargetParams` 在 `setState` 前寫 ref；勿 `startTransition` |
| Immutable snapshot | `RenderSnap` 不含 React state；renderer 不讀 React |
| 零 p5 依賴模組 | `curve/modules/*` 可單測 |
| 參數單一真相 | `paramSchema: ParamDef[]` 驅動標準 range 控件；特殊控件另做元件 |
| 點列策略依曲線 | 能快取才宣告 `cacheStrategy`；省略即每幀 resample |
| draw → React | 平滑參數同步用 `useSmoothParamNotifier`（`src/components/curve/`）；**emit 的是 delta patch**，Root 必須 merge；`getMetadata` 用 `resolveSmoothParams` 防呆 |
| 時間推進一律時間正規化 | `time`、`phase`、`rotation`、`reveal` 不直接每幀固定 `+= value`；per-second 常數用 clamped `dtSec`，per-frame 常數用 `frameScale(deltaMs)`，smoothing lerp 用 60fps 等效 alpha。 |
| 數值控件更新單一路徑 | 標準 `ParamControls` 用 `<input type="range">` 且只綁 `onInput`；按鈕只用於模式切換、重置、顯示開關等離散命令。range 不要同時綁 `onInput` 與 `onChange`，也不要用 wrapper pseudo-element 畫假軌道。 |
| Work smoke slug 以 route 為準 | `smoke:work` slug 取 `src/curve/registry.ts` / `src/works/interactiveRegistry.ts` / `src/content/works/*.md` 的公開 slug，不取 module 資料夾名或 `*CurveRoot` 元件名。可疑時先跑正向 `--list`，再用錯誤別名確認會被拒絕。 |
| `CurveHookWorkRoot` hook 契約 | common hook 仍固定收到 `defaultParams` / `targetParams` / reveal / smooth callbacks；不要因單一 hook 內部改用 `targetParams` 初始化，就局部刪掉 common option。要刪只能一起改 `CurveHookWorkRoot` 與所有 common hook 呼叫端。 |
| `sample` 語意 | morph 曲線：`purpose: 'default'` 供 runtime 點列；自訂 p5 互動：`sample` **主要**供 `purpose: 'thumbnail'`（runtime 不走 sample） |

寬版 prototype 移植到作品頁時，先確認 `.work-detail__canvas` 是方形/近方形視窗。不要把 prototype 的大段 canvas 內文字、狀態面板或寬版座標原樣保留；文字移到 React controls / content，幾何 world view 依方形 canvas 重新定框。

---

## 目錄

```
src/curve/
  types.ts, defaults.ts, constants.ts
  resolveSmoothParams.ts      # getMetadata：params + partial smooth patch 合併
  registry.ts               # workCurveBySlug（縮圖、靜態預覽）
  animation.ts              # 通用 stepAnimation（Rose 用）
  cache.ts                  # createCurveCache + integerBlend 奇偶護欄
  morphFrame.ts             # executeMorphDrawFrame、getMorphDisplayPoints（零 React）
  modules/
    rose/index.ts
    lissajous/index.ts
    harmonograph/index.ts
    spirograph/index.ts
    standing-wave/index.ts
    standing-wave/geometry.ts
    standing-wave/animation.ts
    interference-fringes/index.ts
    interference-fringes/geometry.ts
    interference-fringes/animation.ts

src/lib/
  curveThumbnail.ts         # 建置期 SVG（defaultParams + sample）

src/systems/rendering/
  types.ts, polarGrid.ts, cartesianGrid.ts
  polyline.ts, reveal.ts, frame.ts, fourierRender.ts, standingWaveRender.ts, interferenceFringeRender.ts
  presets.ts                # rose | lissajous | harmonograph | spirograph

src/components/curve/
  CurveWorkRoot.tsx         # 通用生命週期（Rose）
  useMorphCurveP5.ts        # Lissajous / Harmonograph / Spirograph
  useMorphCurveP5.draw.test.ts  # draw wiring 契約（stepAnimationRef.current）
  ParamControls.tsx, StatsPanel.tsx
  useSmoothParamNotifier.ts # draw → React delta patch；量化後才 setState
  DeltaPhaseControl.tsx     # δ：刻度 + 磁吸 + 快速定點

src/works/
  interactiveRegistry.ts    # isWorkInteractive、controlsMountId

src/explore/
  interactiveRegistry.ts    # isExploreInteractive

src/components/works/
  WorkInteractiveStage.tsx  # slug → *CurveRoot（[slug].astro 唯一掛載點）

src/components/works/
  StandingWaveCurveRoot.tsx
  InterferenceFringesCurveRoot.tsx

src/components/curve/
  useStandingWaveP5.ts      # 駐波：時間驅動 + 自訂 renderer
  useInterferenceFringesP5.ts

src/components/explore/
  ExploreInteractiveStage.tsx

src/components/
  WorkCard.astro            # 作品集卡片 + 曲線縮圖

src/content/works/
  rose-curve.md
  lissajous-curve.md
  harmonograph-curve.md
  spirograph-curve.md
  standing-wave.md
  interference-fringes.md

src/explore/fourier/
  constants.ts, path.ts           # path cache、tAtArcLength（零 p5）

src/content/explore/
  fourier-series.md

public/explore/
  fourier-series-epicycles-cover.png   # legacy Fourier ExploreCard 封面

public/images/explore-covers/
  {slug}.png                           # 新 ExploreCard 封面

scripts/explore-covers/
  {slug}.*                             # 新 Explore cover 可重現來源檔

src/styles/pages/
  work-detail.css           # .work-detail__stage、accordion、controls 分組

src/styles/components/
  breadcrumb.css            # .detail-top-nav、breadcrumb
  filter.css, list-search.css
  explore-touch.css

src/styles/components/explore/
  explore-toolbar.css       # Explore 共用 toolbar / mode token
  fourier-explore.css       # explore 主題專屬 layout

src/lib/
  listFilter.ts             # 列表 filter 純邏輯（DOM 在 ListSearchFilterScript.astro）

src/components/
  Breadcrumb.astro, ListSearchFilterScript.astro
```

站點殼層 UX（breadcrumb、列表 filter、Footer、首頁 section）見 [`site-ux.md`](site-ux.md)。

---

## 作品掛載（`pages/works/[slug].astro`）

查 `isWorkInteractive(entry.id)` → 渲染 `WorkInteractiveStage` + portal 右欄。  
新增互動作品時同步三處：

| 步驟 | 檔案 |
|------|------|
| 1 | `curve/modules/{name}/` + `content/works/{slug}.md` |
| 2 | `curve/registry.ts` 登記 slug |
| 3 | `WorkInteractiveStage.tsx` 的 `rootBySlug` 加 Root |

`controlsMountId` 慣例：`{slug}-controls`（`works/interactiveRegistry.ts`）。

### 舊式硬編碼（已移除）

~~依 `entry.id` if/else 掛載各 `*CurveRoot`~~ — 改由 Stage + registry 查表。

### 舞台佈局（canvas 左 · 控制右 · 互動優先）

互動作品：**compact header 在舞台上方**，進頁即可看到標題與 canvas；控制緊接 canvas，prose 在舞台下方。

```html
<div class="container detail-top-nav">
  <Breadcrumb … />
  <a class="back-link back-link--top">← 返回作品集</a>
</div>
<header class="container work-detail__header">
  <h1>…</h1> <!-- 全頁唯一 h1 -->
  <div class="work-detail__header-tags">…</div>
</header>
<div class="work-detail__stage">
  <details class="work-detail__controls">
    <summary class="work-detail__controls-toggle">調整參數</summary>
    <aside class="controls-panel controls-panel--stage" id="{slug}-controls" />
  </details>
  <div class="work-detail__canvas">
    <*CurveRoot />          <!-- 只渲染 canvas host，控制以 portal 掛到上方 aside -->
  </div>
</div>
<div class="container work-detail">
  <article class="prose">…</article>   <!-- 說明全文在舞台下方 -->
</div>
```

React 以 `createPortal` 將控制面板掛入 `.controls-panel--stage`（`sticky`，高度 `min(70vh, 680px)`）。  
`CurveWorkRoot` portal 內含 `ParamControls` + `StatsPanel`（無單群組 section label；多群組自訂 Root 見 [`site-ux.md`](site-ux.md) §4.4）。
DOM 順序須讓 `<details.work-detail__controls>` / `<aside id="{slug}-controls">` 早於 React island 存在；CSS grid 再把 canvas 放左、控制放右。若先 hydrate `CurveRoot` 才出現 portal mount，參數控制會消失。

| 斷點 | 行為 |
|------|------|
| ≥1024px | canvas **左** · 控制 **右**（320px 欄）；`<details>` 視覺上恆開，summary 隱藏 |
| <1024px | canvas 上 · 控制下；`<details>` **預設收合**，summary 可展開 |

`<details>` 收合時 `<aside>` 仍在 DOM；參數初始值來自 React `defaultParams`，不讀 slider DOM。見 [`site-ux.md`](site-ux.md) §4.3。

**不要**把 portal 目標放在 prose 區塊旁——控制會被擠到頁面中段以下。
**不要**在 renderer 內重畫頁面標題——Canvas HUD 只留必要短讀數或模式，標題由 Astro header 提供。

---

## 作品集列表與排序（`content/utils.ts`）

| 用途 | 函式 | 排序 |
|------|------|------|
| `/works` 列表 | `getPublishedAsc` | **舊→新**（越新越靠後） |
| 首頁「最新作品」 | `getPublishedInteractive` + `excludeEntryIds` | 池內 **新→舊**，取前 N = **最新 N 篇** |
| 靜態路由 | `getStaticPathsFromCollection` | 順序不影響路由 |

`getPublishedAsc` 對外只承諾：排除 draft，並依 `order` 舊→新排序。

`featured: true` 決定是否進首頁池；**不**改變 `/works` 的 asc 規則。

### 列表搜尋與篩選

| 層 | 檔案 | 職責 |
|----|------|------|
| 邏輯 | `src/lib/listFilter.ts` | grid 顯示/計數、URL param、清除篩選 |
| 客戶端 | `ListSearchFilterScript.astro` | 搜尋、`data-filter-scroll` fade、事件 |

列表頁容器：`data-list-filter` + `data-filter-param` + `data-search-param`。  
結果計數：`[data-filter-count]`；空結果：`[data-filter-clear]`。  
完整 UX 契約見 [`site-ux.md`](site-ux.md) §6。

---

## Explore 視覺化（`/explore/[slug]`）

與作品集分離：**不用** `CurveModule`、**不用** `createPortal`、**不用** `work-detail__stage`。

| slug | 元件 | 說明 |
|------|------|------|
| `fourier-series` | `FourierSeriesExploreRoot` | 1D 方波 / 2D 軌道；epicycles |
| `trig-wave-interference` | `WaveSuperpositionExploreRoot` | 圖左 sidebar 右；`canvasSize` clamp(300, w×ratio, 520)；見 `exploreart.md` |

### 佈局（傅立葉）

```
.fourier-explore
├── .fourier-explore__canvas      ← p5
└── .fourier-explore__toolbar     ← N 滑桿、模式切換（canvas 下、一屏可見）
    └── .fourier-explore__meta    ← 公式（降權）
```

掛載：`pages/explore/[slug].astro` 查 `isExploreInteractive` → `ExploreInteractiveStage`；頂部 `.detail-top-nav`（breadcrumb + 返回）；Markdown prose 在互動區下方。

Explore 詳情引入 `explore-toolbar.css` + `explore-touch.css`（見 [`site-ux.md`](site-ux.md) §5）。

新增互動 explore：`explore/interactiveRegistry.ts` + `ExploreInteractiveStage.tsx` 的 `rootBySlug`。

### Path cache（`src/explore/fourier/path.ts`）

```
mode 或 N 變更 → buildFourierPath() 一次（含 arcLength LUT）
每 frame draw  → reveal slice + renderFourierEpicycles
```

- reveal：`reveal += REVEAL_SPEED_PER_SEC * dtSec`，其中 `dtSec = Math.min(p.deltaTime, 50) / 1000`（**勿**固定 `+= 0.002`）
- guide 的 `currentT`：`tAtArcLength(points, totalLength * revealProgress)`

### Explore input / timing rules

- Explore 的 range input 只保留一條更新路徑，不要同時使用 `onInput` 與 `onChange`。
- 若常數語意是 per-second，例如 `REVEAL_SPEED_PER_SEC`，使用：

```ts
const dtSec = Math.min(p.deltaTime, 50) / 1000;
revealProgress += REVEAL_SPEED_PER_SEC * dtSec;
```

- 若常數語意是原本 60fps 下調好的 per-frame speed，使用：

```ts
const frameScale = Math.min(p.deltaTime, 50) / 16.666;
value += SPEED_PER_FRAME * frameScale;
```

- 不要把 per-second 常數乘 `frameScale`。
- smoothing lerp 若原本是 60fps per-frame alpha，使用 60fps 等效公式：

```ts
const frameScale = deltaMs / 16.666;
const alpha = 1 - Math.pow(1 - PARAM_LERP, frameScale);
current = lerp(current, target, alpha);
```

- `reveal` / `phase` / `pointClock` 這種視覺連續動畫要 clamp delta，避免切回分頁時瞬間跳動。
- smoothing 追目標值時可依視覺語意決定是否 clamp；例如 Matrix smoothing 可以不 clamp，讓切回分頁後快速追上 target。

### Explore 列表封面

```yaml
# src/content/explore/{slug}.md
coverImage: /explore/fourier-series-epicycles-cover.png
```

`ExploreCard.astro` 讀 `entry.data.coverImage`；無則顯示「主題佔位」。  
現行 Explore cover 命名、來源檔與驗收規格見 [`exploreart.md`](exploreart.md)。

### Explore vs Works

| | Works | Explore |
|---|-------|---------|
| 模組 | `CurveModule` + `registry` | `src/explore/*` 自建 path |
| 控件 | portal → 右欄 | 內嵌 React DOM |
| 縮圖 | 建置期 SVG | 靜態 PNG `coverImage` |
| reveal | `deltaTime` / `frameScale(deltaMs)` 正規化 | 建議 `deltaTime` 驅動 |

---

## 作品集縮圖（`WorkCard` + `curveThumbnail`）

> **實作規格（封面優化版）**：現行工程契約見本節與 `src/lib/curveThumbnail.ts`；視覺語言見 [`workart.md`](workart.md)。

### 目的

卡片縮圖 = **作品概念的 build-time SVG 封面**，非文字佔位、非動畫第 0 幀、非完整 UI 截圖。

- 結果型作品可使用完成態主圖形。
- 概念型作品應使用 thumbnail 專用構圖呈現關係，例如分區、路徑、命中狀態、疊合關係。
- 過程型作品應避免平線、鬼線、未完成態或只剩 guide。
- Thumbnail 場景允許不同於互動初始參數；只能在 `purpose: 'thumbnail'` 分支或 thumbnail builder 內處理。
- `#0a0a0a` 底 + accent 金線為主；概念型可用少量次要色區分語意。

### 資料流（建置期，無 p5）

```
entry.id → workCurveBySlug[slug]
       → module.sample(defaultParams, { purpose: 'thumbnail', revealProgress: 1 })
       → normalizeToThumbnailSpec
       → fitToView (excludeFromBbox-aware)
       → multi-path SVG → WorkCard set:html
```

`defaultParams` 是建置期入口參數；各模組可在 `purpose: 'thumbnail'` 內改用封面專用場景，不必讓縮圖等同 runtime 初始畫面。

### 型別契約

`CurveModule.sample` 與 `SampleOptions` 語意見 `src/curve/types.ts` 註解。**自訂 p5 互動**（Julia、相位圖、Euler 旋轉等）的 runtime 繪製在 hook + renderer；`sample(..., { purpose: 'thumbnail' })` 僅服務建置期卡片縮圖，勿假設 `default` 回傳值等於畫布幾何。

`SampleOptions`：

```ts
type SampleOptions = {
  step: number;
  revealProgress?: number;
  purpose?: 'default' | 'thumbnail';
};
```

`purpose === 'thumbnail'` 時，`sample()` 可回傳 `ThumbnailSpec`：

```ts
type ThumbnailPath = {
  points: CurvePoint[];
  opacity?: number;
  closed?: boolean;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  excludeFromBbox?: boolean;
};

type ThumbnailCircle = {
  x: number;
  y: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
};

type ThumbnailSpec = {
  paths: ThumbnailPath[];
  circles?: ThumbnailCircle[];
  coordinateSystem?: 'math' | 'canvas';
};
```

### 已落地規則

1. `curveThumbnail.ts` 支援 legacy 單 path（`CurvePoint[]`）與多 path（`ThumbnailSpec`）混用。
2. `fitToView` 只用 `excludeFromBbox !== true` 的 path 算 bbox，但繪製時仍包含全部 path。
3. 每個 `ThumbnailPath` 會輸出一條 SVG `<path>`，支援 `opacity`、`stroke`、`stroke-width`、`fill`、`closed`。
4. `circles` 支援圓點標記（例如端點、節點），並參與 bbox。
5. `coordinateSystem: 'canvas'` 可用於手工封面構圖；預設仍是 `math`。
6. 點雲類可使用單 path + `NaN` 分段輸出多子路徑，維持視覺與效能平衡。

### 目前縮圖策略摘要

1. 結果型（rose/lissajous/harmonograph/spirograph/spiral/fractal）：主體置中，必要時 `closed: true`；點雲需小尺寸可辨。
2. 概念型（Bayes/Buffon/binomial/Catalan/vector/series 等）：用封面專用幾何表達關係，可用 fill/circle/少量次要色，但不加 UI 文字。
3. 過程型（interference/grid/riemann/tangent/catenary 等）：多 path 輸出；避免把不相鄰分支硬接成鬼線；ghost / guide 視情況 `excludeFromBbox`。
4. 函數與級數型（exponential/logarithmic/Basel 等）：縮圖要顯示對比、填充、尺度或極限關係，不只是一條曲線。

### 新增作品時

1. 實作 `CurveModule`
2. 登記 `src/curve/registry.ts`（slug 與 `{slug}.md` 檔名一致）
3. 實作 `purpose: 'thumbnail'` 分支或 builder，封面需符合 `workart.md`
4. 未登記 → 仍顯示「縮圖佔位」

### 縮圖踩坑

| 症狀 | 原因 | 修正 |
|------|------|------|
| HTML 有 `<svg>` 但空白 | 一般 CSS 寫 `:global(svg)` | 改 `.card__thumb svg`（`:global` 僅 scoped style 有效） |
| 高度塌縮 | `.card__thumb` flex 置中 | 有 SVG 時 `card__thumb--has-svg { display: block }` |

---

## 何時用 `CurveWorkRoot` vs 專用 `*CurveRoot`

| 情境 | 做法 |
|------|------|
| 參數皆可 `paramSchema` + 通用 lerp / cache | `CurveWorkRoot`（Rose） |
| 頻率瞬跳 + 連續參數 morph（δ、d…） | 專用 `*CurveRoot` + `stepXxxAnimation` |
| 時間驅動 + 多圖層（包絡 ghost） | 專用 `*CurveRoot` + `useStandingWaveP5` + `standingWaveRender` |
| 粒子系統（沙粒沉積） | 專用 `*CurveRoot` + `useChladniP5` + `chladniRender` |
| 分段光線 + ghost 曲線 | 專用 `*CurveRoot` + `useParabolicReflectionP5` + `parabolicReflectionRender` |
| 直線族包絡 + ghost | 專用 `*CurveRoot` + `useConicEnvelopeP5` + `conicEnvelopeRender` |
| 橢圓 + 焦點連線 | 專用 `*CurveRoot` + `useConicFocusLocusP5` + `conicFocusLocusRender` |
| δ 需刻度／磁吸 | `DeltaPhaseControl`；d 等用一般 range |

---

## CurveModule

```ts
type CurveModule = {
  id: string;
  paramSchema: ParamDef[];
  defaultParams: ParamValues;   // 可含 schema 外 key（delta, d…）
  sample: (params, { step }) => CurvePoint[] | ThumbnailSpec;
  getMetadata: (params, runtime?) => CurveMetadata;  // smooth 用 resolveSmoothParams(params, runtime)
  renderPreset?: RenderConfig; // 省略即 lissajousRenderPreset
  cacheStrategy?: 'integerBlend'; // 省略即每幀 sample
  sampleStep?: number;
  animation?: { lerp: number; revealSpeed: number };
};
```

---

## 資料流（通用）

```
React targetParams → useRef（slider 用 patchTargetParams 同步寫入）
    ↓（可選）cache.rebuildForTarget
p5 draw
    → executeMorphDrawFrame（morphFrame.ts）
        → stepAnimationRef.current(state, targetParamsRef.current, …)
        → getMorphDisplayPoints（每幀 sample）
    → renderFrame(p, RenderSnap, renderPreset)
    → UI 節流 setState（revealPct、smoothDelta…）
```

架構契約見 [`reactkey.md`](reactkey.md)。

---

## 平滑參數同步（draw → React）

p5 `draw` 內的平滑值（`smoothR`、`smoothTheta`…）需節流同步到 React 的 `StatsPanel`。  
`useSmoothParamNotifier` **只 emit 有變化的欄位（delta patch）**，不是完整 `ParamValues` 包。

### 接線契約

**P5 hook**（`useXxxP5.ts`）：

```ts
const notifySmoothParams = useSmoothParamNotifier({
  getParams: () => targetParamsRef.current, // 目標參數變更時重置量化快取
  onChange: onSmoothParamsChange,
});

// draw 內
notifySmoothParams({ r1: anim.smoothR1, theta2: anim.smoothTheta2, … });
```

**Root**（`*CurveRoot.tsx`）— **必須 merge**，禁止覆蓋：

```ts
const onSmoothParamsChange = useCallback(
  (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
  [],
);
```

`getParams` 可改為 `() => animRef.current.params`（與 `targetParamsRef.current` 等價，依模組選一）；  
當使用者拖 slider、目標參數簽名變更時，notifier 會清空量化快取，避免 patch 漏欄後顯示值卡住。

### getMetadata 防呆

`runtime.smoothParams` 在 runtime 可能是 **partial**。  
`getMetadata` 不要寫 `runtime?.smoothParams ?? params`（partial 會整包取代 params，缺欄 `.toFixed()` 崩潰）。

```ts
import { resolveSmoothParams } from '../../resolveSmoothParams';

getMetadata: (params, runtime) => {
  const smooth = resolveSmoothParams(params, runtime);
  // 等同 { ...params, ...(runtime?.smoothParams ?? {}) }
  return {
    stats: [{ key: 'r1', label: 'r₁', value: smooth.r1.toFixed(2) }, …],
  };
};
```

### 踩坑（`complex-arithmetic-geometry` 實例）

| 症狀 | 原因 | 修正 |
|------|------|------|
| canvas 全黑 + 右欄控制空白 | Root 用 `setSmoothParams(params)` 覆蓋；第 2 幀只 emit `{ theta2 }` → `getMetadata` 讀 `smooth.r1.toFixed()` 拋錯 → React 整棵卸載 | Root merge patch；`getMetadata` 用 `resolveSmoothParams` |
| 統計只更新部分欄位、其餘 NaN | 同上，state 缺 key | 同上 |
| 連續漂移參數（θ₂ sin 擾動）特別易觸發 | 每幀只有漂移欄位量化後變化，patch 更小 | 同上；`getParams` 重置快取 |

掃描指令：

```bash
grep -R "setSmoothParams(params)" src/components src/curve -n
grep -R 'setSmoothParams((prev)' src/components src/curve -n
grep -R "runtime?.smoothParams ?? params" src/curve/modules -n
```

第一條應為 **0**；第三條應改為 `resolveSmoothParams(params, runtime)`。

---

## CurvePoint

```ts
type CurvePoint = {
  x: number;
  y: number;
  theta: number;      // 參數 t / θ（語意依曲線）
  arcLength: number;
};
```

---

## Render / Grid / Preset

```ts
type RenderConfig = {
  background: [10, 10, 10];
  grid: 'polar' | 'cartesian' | 'harmonograph' | 'spirograph' | 'none';
  curveStyle: CurveStyle;
  revealMode: 'byTheta' | 'byArcLength';
};
```

| 作品 | grid | reveal | speed | 備註 |
|------|------|--------|-------|------|
| Rose | `polar` | `byTheta` | 0.0024 | `CurveWorkRoot` + integerBlend |
| Lissajous | `cartesian` | `byArcLength` | 0.0018 | a/b 瞬跳；δ lerp 0.06 |
| Harmonograph | `harmonograph` | `byArcLength` | 0.0015 | a/b 瞬跳；δ、d lerp 0.08 |
| Spirograph | `spirograph` | `byArcLength` | 0.0015 | R/r 瞬跳；d lerp 0.08 |
| Standing Wave | 十字 guide | 水平寬度 reveal | 0.0024 | k 瞬跳；A lerp 0.08；自訂 renderer |

`frame.ts`：`polar` → `renderPolarGrid`；`cartesian` → `renderCartesianGrid`；`harmonograph` → 外圈+內圈；`spirograph` → 外圈+隨 R 大圓。駐波不走 `frame.ts`，見 `standingWaveRender.ts`。

---

## Reveal

### `byArcLength`

```ts
const threshold = points.at(-1).arcLength * revealProgress;
if (pt.arcLength <= threshold) { … }
```

### `byTheta`（Rose）

**禁止** `pt.theta % TWO_PI`。用 `maxTheta = points.at(-1).theta` 與 `pt.theta <= maxTheta * progress`。

### Time / reveal normalization

- `revealProgress` 語意是 0–1 的進度比例，不是 frame counter。
- `time`、`phase`、`rotation`、`reveal` 若會每幀推進，必須用 `deltaTime`、clamped `dtSec` 或 `frameScale(deltaMs)` 正規化。
- per-second 常數用 clamped `dtSec`：

```ts
const dtSec = Math.min(deltaMs, 50) / 1000;
revealProgress += REVEAL_SPEED_PER_SEC * dtSec;
time += TIME_SPEED_PER_SEC * dtSec;
```

- 若原本速度是以 60fps per-frame 調出的，用 `frameScale`：

```ts
const frameScale = Math.min(deltaMs, 50) / 16.666;
revealProgress += REVEAL_SPEED_PER_FRAME * frameScale;
phase += PHASE_SPEED_PER_FRAME * frameScale;
```

- smoothing lerp 若原本是 60fps per-frame alpha，用 60fps 等效公式：

```ts
const frameScale = deltaMs / 16.666;
const alpha = 1 - Math.pow(1 - PARAM_LERP, frameScale);
current = lerp(current, target, alpha);
```

- 不要把 per-second 常數乘 `frameScale`。

### Continuous parameter reset

- 連續參數（例如 `amplitude`、`phase`、`distance`、`growth`、`scale`）不應每個 input tick 都 reset reveal。
- 若連續 slider 會改變結構，可用 pending reset：等 smooth settled 或 timeout 後再 reset，不要拖動中每幀重播。
- settled / timeout 條件應使用 OR，不要使用 AND。
- timeout 可落在 300–500ms。
- 離散結構（例如 `mode`、toggle、`depth`、frequency count、topology、operation、iteration structure）仍可立即 reset reveal。
- `reveal` 這個 technical label 保留英文，不要翻成「顯示」。

---

## 參考實作 A：Rose（`CurveWorkRoot`）

- 奇數 k：θ∈$[0,\pi]$；偶數 k：θ∈$[0,2\pi]$；`integerBlend` + **奇偶護欄**（跨奇偶 → `round(k)` nearest）
- 通用 `stepAnimation`；target 變 → reveal 重置

---

## 參考實作 B：Lissajous（`LissajousCurveRoot`）

```
x = A sin(at + δ)    y = B sin(bt)     A=B=220    t∈$[0,2\pi]$    step=0.003
```

| 參數 | 行為 |
|------|------|
| a, b | 變更 → reveal 歸零；瞬間對齊 |
| δ | lerp 0.06；不重置 reveal；`DeltaPhaseControl` |

省略 `cacheStrategy` — 每幀 `module.sample(anim.params)`。

---

## 參考實作 C：Harmonograph（`HarmonographCurveRoot`）

```
x = A sin(at + δ) · e^(-dt)    y = B sin(bt) · e^(-dt)
A = B = 250    t ∈ $[0, 10\pi]$    step = 0.01（寫死 module）
```

| 參數 | 行為 |
|------|------|
| a, b | 變更 → reveal 歸零；瞬間對齊 |
| δ | lerp **0.08**；不重置 reveal；`DeltaPhaseControl` |
| d（阻尼） | lerp **0.08**；不 reset reveal；range 0–0.05；**`patchTargetParams` 同步 ref** |

```ts
// stepHarmonographAnimation — 概念
if (round(a,b) 變了) { reveal = 0; snap a,b }
params.delta = lerp(..., 0.08)
params.d     = lerp(..., 0.08)
```

省略 `cacheStrategy` → `getMorphDisplayPoints` 每幀 `sample`（見 [`reactkey.md`](reactkey.md)）。採樣約 3140 點，單幀渲染可接受。

---

## 參考實作 D：Spirograph（`SpirographCurveRoot`）

```
x = (R-r)cos(t) + d·cos((R-r)t/r)    y = (R-r)sin(t) - d·sin((R-r)t/r)
t ∈ $[0, 2\pi\cdot r/gcd(R,r)]$    step = 0.02
```

| 參數 | 行為 |
|------|------|
| R, r | 變更 → reveal 歸零；瞬間對齊 |
| d | lerp **0.08**；不重置 reveal |

省略 `cacheStrategy`。概念同 Harmonograph 的離散+連續分層。

---

## 參考實作 E：Standing Wave（`StandingWaveCurveRoot`）

```
y = 2A sin(kx) cos(ωt)    包絡 ±2A sin(kx)
```

| 參數 | 行為 |
|------|------|
| k（spatialFrequency） | 變更 → reveal 歸零；瞬間對齊 |
| A（amplitude） | lerp **0.08**；不重置 reveal |
| ω（timeSpeed） | 用 `deltaTime` / `frameScale(deltaMs)` 推進 `time`；不重置 reveal |

- **不走** `renderFrame` / `useMorphCurveP5`：時間驅動 + 包絡 ghost 圖層
- reveal 依水平寬度比例（非 arcLength / theta）
- `sample(..., { purpose: 'thumbnail' })` 只供列表封面；可使用封面專用時間 / 構圖，不代表 runtime 初始畫面

---

## 參考實作 F：Interference Fringes（`InterferenceFringesCurveRoot`）

```
Δr = nλ    x = a cosh(t), y = b sinh(t)    b = √(c² − a²), c = d/2
```

| 參數 | 行為 |
|------|------|
| λ（wavelength） | 變更 → reveal 歸零 |
| d（sourceDistance） | 連續結構參數；smooth / pending reset，避免拖動中每幀重播 |
| ω（timeSpeed） | 用 `deltaTime` / `frameScale(deltaMs)` 推進 `time`；不重置 reveal |

- 多條雙曲線 fringes + envelope ghost；波源點 ±d/2
- reveal 依雙曲參數 t 範圍（`maxT = 1.2 × progress`）
- 不走 `renderFrame`；見 `interferenceFringeRender.ts`

---

## 參考實作 G：Equiangular Spiral（`EquiangularSpiralCurveRoot`）

```
r = a e^(bθ)    x = r cos θ, y = r sin θ    a = 4（常數）
```

| 參數 | 行為 |
|------|------|
| growthB | lerp **0.08**；變更時重建 ghost / active |
| maxTheta | lerp **0.08**；相機依終點半徑重算 zoom |
| rotationSpeed | 用 `deltaTime` / `frameScale(deltaMs)` 推進 `time`；渲染層 `rotate(time)` |

- **不走** `renderFrame` / morph pipeline：參數曲線 + reveal θ 呼吸
- ghost 至 $\theta_{\max}$；active 至 $\theta_{\mathrm{reveal}}$（含 $\sin$ 擾動）
- 見 `equiangularSpiralRender.ts`、`equiangular-spiral/camera.ts`

---

## 參考實作 H：Vector Field Streamlines（`VectorFieldStreamlinesCurveRoot`）

```
F = 漩渦 (−y,x)/(r²+ε) + 0.25(sin(2y+0.8t), cos(2x+0.8t))    RK2 積分
```

| 參數 | 行為 |
|------|------|
| streamlineCount | 瞬間對齊；每幀重算 N 條流線 |
| integrationSteps | 瞬間對齊；RK2 步數 |
| flowSpeed | 用 `deltaTime` / `frameScale(deltaMs)` 推進 `time`；場與種子半徑隨 t 變 |

- 固定 `CAMERA_SCALE = 120`；邊界 $|x|,|y|>5$ 截斷
- 種子：均分角度 + 呼吸半徑 $1.2+0.25\sin(1.5t+i)$
- 見 `vectorFieldStreamlinesRender.ts`；縮圖為多 path（24 條流線快照）

---

## 參考實作 I：Sierpinski Triangle（`SierpinskiTriangleCurveRoot`）

```
遞迴：每層移除中心三角形（scale = 1/2, copies = 3）
IFS：P(k+1) = 0.5 * (P(k) + V(i)),  V(i) ∈ {v1, v2, v3}
```

| 參數 | 行為 |
|------|------|
| depth | 變更時重建 recursive topology 與 deterministic chaos points；reset reveal |
| mode（recursive / chaos / compare） | 切換 recursive / chaos / 左右對照；reset reveal |

- **不走** `renderFrame` / morph pipeline：拓樸遞迴 + IFS attractor 使用專用 hook `useSierpinskiTriangleP5`。
- 幾何權威在 `src/curve/modules/sierpinski-triangle/geometry.ts`：`buildRecursiveTopology`、`buildChaosSteps`、`buildRootTriangle` 同源。
- chaos game 使用固定 seed PRNG（`mulberry32`），讓 runtime 與縮圖可重現；每點皆為 `P(k+1)=0.5*(P(k)+V_i)`。
- compare 模式左右 panel 使用同一個 root triangle builder：左遞迴、右 chaos，僅 offset / panelWidth 不同。
- 作品頁 canvas 採近方形 world view（`SIERPINSKI_VIEW = 900×900`）；不要保留寬版 prototype 的左側文字欄。
- 說明文字、公式與狀態統計放在 React controls / `StatsPanel`，canvas 內只畫 root guide、solid/void triangles、chaos points、recent affine maps。

接線：
1. `src/curve/modules/sierpinski-triangle/index.ts`：`CurveModule` metadata、thumbnail、default params。
2. `src/components/curve/useSierpinskiTriangleP5.ts`：instance mode + ref 同步 + reveal reset。
3. `src/systems/rendering/sierpinskiTriangleRender.ts`：snapshot renderer，不讀 React state。
4. `src/components/works/SierpinskiTriangleCurveRoot.tsx`：`depth`、`mode` controls + portal。

---

## 六曲線對照

| | Rose | Lissajous | Harmonograph | Spirograph | Standing Wave | Interference Fringes |
|---|------|-----------|--------------|------------|---------------|----------------------|
| Root | `CurveWorkRoot` | `LissajousCurveRoot` | `HarmonographCurveRoot` | `SpirographCurveRoot` | `StandingWaveCurveRoot` | `InterferenceFringesCurveRoot` |
| Hook | `useMorphCurveP5` | 同上 | 同上 | 同上 | `useStandingWaveP5` | `useInterferenceFringesP5` |
| Renderer | `renderFrame` | 同上 | 同上 | 同上 | `renderStandingWaveScene` | `renderInterferenceFringesScene` |
| Cache | `integerBlend` | `none` | `none` | `none` | `none` | `none` |
| Reveal | `byTheta` | `byArcLength` | `byArcLength` | `byArcLength` | 水平寬度 | 雙曲 t 範圍 |
| Grid | polar | cartesian | harmonograph | spirograph | 十字 guide | 十字 guide + 波源 |
| 連續 morph | k lerp | δ | δ + d | d | A | d（smooth） |
| 滑桿 ref | — | `patchTargetParams` | 同上 | 同上 | — | — |
| 離散瞬跳 | — | a, b | a, b | R, r | k | λ, d（結構） |
| 特殊 UI | — | δ tick/snap | δ tick/snap + d | — | — | — |

---

## Cache 策略

| Strategy | 適用 |
|----------|------|
| `none` | δ / d 等每幀 morph（Lissajous、Harmonograph、Spirograph） |
| `integerBlend` | 單整數、同參數空間（Rose k；注意奇偶護欄） |

---

## 新增曲線檢查清單

1. `modules/xxx/index.ts` + `content/works/xxx.md`
2. `xxxRenderPreset`（對齊 `workart.md`）
3. `CurveWorkRoot` 或專用 `XxxCurveRoot`
4. 採樣域、`revealMode`、`cacheStrategy`
5. 哪些參數 reset reveal？哪些 lerp？
6. 連續 lerp → `useMorphCurveP5` + `patchTargetParams`（見 [`reactkey.md`](reactkey.md)）
7. draw → React：`useSmoothParamNotifier` options API + Root merge patch + `resolveSmoothParams`（見上方「平滑參數同步」）
8. `[slug].astro`：`work-detail__stage` + `WorkInteractiveStage`（registry 查表）
9. `registry.ts` 登記（縮圖）
10. thumbnail 封面：`purpose: 'thumbnail'` 分支、非空 SVG、主體清楚、mobile 375px 可辨
11. 驗收：作品頁（**滑桿在 canvas 右側、一屏可見**）、列表封面、**瀏覽器拖動連續參數滑桿**

---

## Plot clipping and labels

- 內部 plot / operation plane 的主幾何可用局部 clip，避免向量、箭頭、輔助線、glow 穿出 plot。
- 不要用全 canvas clip 取代局部 plot clip；canvas 本身已會裁切外框。
- label 不應直接被 clip 消失；若 label 可能超出 plot，應在 clip 外繪製，並 clamp 到 plot 邊界內或邊界附近。
- 不要改變數學值來避免出框，只限制渲染可視範圍。

---

## 常見錯誤（對照表）

| 錯誤 | 修正 |
|------|------|
| 每幀 `new p5()` | mount 一次，`remove()` |
| renderer 讀 React state | 只讀 `RenderSnap` |
| `byTheta` + `% TWO_PI` | `theta <= maxTheta * progress` |
| 跨奇偶 `integerBlend` | `round(k)` nearest |
| 通用 `stepAnimation` 用於 a/b 瞬跳需求 | 專用 `stepXxxAnimation` |
| δ/d 改動就 reset reveal | 僅 a/b（或頻率類）reset |
| morph 曲線用 cache | 省略 `cacheStrategy` + `getMorphDisplayPoints` 每幀 sample |
| target 只經 useEffect 寫 ref | slider 用 `patchTargetParams` 再 setState |
| 幀邏輯放 hook 內 | 應在 `morphFrame.ts`；ref 解引用在 hook |
| 測試只 assert stale cache | spy + 弧長 + `useMorphCurveP5.draw.test.ts` |
| 縮圖 `:global(svg)` / flex 置中 | `.card__thumb svg` + `display: block` |
| 忘記 `registry` | 卡片無預覽圖 |
| `/works` 用 `getPublished` | 改用 `getPublishedAsc` |
| 控制 panel 放在 prose 區塊旁 | 改用 `work-detail__stage` 右欄 |
| 寬版 prototype 的 canvas 文字原樣保留 | 文字移到 React controls / Markdown；canvas 只留幾何與低權重 guide |
| 寬版 prototype 座標塞進作品方形 canvas | 改成近方形 world view，讓主幾何佔畫面 70%–85% |
| explore reveal 固定每幀 `+= 0.002` | per-second reveal 用 clamped `dtSec`；per-frame 速度才用 `frameScale` |
| time / phase / reveal 每幀固定 `+= speed` | 用 `deltaTime`、clamped `dtSec` 或 `frameScale(deltaMs)` 正規化；避免 144Hz 跑更快、低 FPS 變慢 |
| Explore range 同時綁 `onInput` 與 `onChange` | 保留單一路徑，避免同次拖曳重複 setState |
| per-second 常數誤乘 `frameScale` | per-second 用 `dtSec`；per-frame 速度才用 `frameScale` |
| 固定每幀 lerp 導致高刷新率更快 | 用 `alpha = 1 - Math.pow(1 - PARAM_LERP, frameScale)` 做 60fps 等效 smoothing |
| 連續 slider 每次 input 都 reset reveal | 用 smooth / pending reset；settled 或 timeout 後再 reset |
| canvas 內使用全域座標當局部座標 | `translate()` 後的 renderer 要用局部可視邊界，例如 `width / 2 + offset` |
| 用 `width` 建構正方形主體 | 用 `Math.min(width, height)` 定框，避免手機或非正方 canvas 貼邊 |
| reveal 百分比與實際生成數不同步 | `revealProgress` 要對應固定總量，例如 `MAX_GRAINS * revealProgress` |
| 內部 plot 的向量 / glow / guide 畫出框 | 對 plot 內主幾何做局部 clip，不做全 canvas clip |
| label 被 plot clip 裁掉消失 | label 在 clip 外繪製，座標 clamp 到 plot 內 |
| metadata stats 回傳過多行 | metadata 層挑最重要的 3～4 行，不靠 `StatsPanel` 裁切 |
| 把 technical label 全翻成中文 | `reveal`、`mode`、`scale`、`phase`、`iteration`、`arg`、`det`、`dy/dx`、`Euler`、`De Moivre` 等可保留英文或符號；只翻普通 UI / debug 文字 |
| 普通 UI 英文和 technical label 混在一起處理 | 普通 UI 標題改中文；technical label 可保留英文或數學符號 |
| `StatsPanel` 靜默裁掉重要資訊 | metadata 層只回傳最重要的 3～4 行，不要靠 `slice(0, 4)` 補救順序錯誤 |
| `setSmoothParams(params)` 覆蓋整包 state | `useSmoothParamNotifier` emit delta patch；Root 用 `(prev) => ({ ...prev, ...params })` |
| `getMetadata` 寫 `runtime?.smoothParams ?? params` | partial smooth 缺欄 → `.toFixed()` 崩潰、React 卸載；改 `resolveSmoothParams(params, runtime)` |
| canvas 黑屏但 Astro 靜態區正常 | 常為 render 期 `getMetadata` 拋錯，不一定是 p5 renderer；先查 browser console |
| `fourierRender` 裸用 `TWO_PI` 未 import | 模組內 `const TAU = Math.PI * 2` |
| /renderer 常數從 `curve/constants` import 被 Vite 剝離 | 渲染檔內建本地常數 |

---

## 工作流程

1. p5 prototype（視覺先成立 → `art.md`，Works 細節見 `workart.md`）
2. 抽 `CurveModule` + 選 Root 型別
3. Astro + portal 控件 + `registry` 縮圖

**不要**先 abstraction 再找視覺；**不要**重做 glow / UI 語言。

---

## 複數幾何原型（2026-05）

以下三個 p5 prototype 已對齊目前規則：暗底、accent 單色、低權重 guide、主體 glow、60fps 取向。

| 主題 | 核心方程 | 互動參數 | 架構重點 |
|------|----------|----------|----------|
| 複數四則運算幾何（`complex-arithmetic-geometry`） | $z_1 + z_2$、$z_1 z_2$ | $r_1,\theta_1,r_2,\theta_2$ | out 參數覆寫 + 全域 Temp 池 + Camera 自動縮放 |
| 複數極座標形式（`complex-polar-form`） | $z=r(\cos\theta+i\sin\theta)$ | $r,\theta$ | art token 化（`T`,`CFG`）+ guide/projection 分層 + arc 標註 |
| 尤拉公式旋轉動畫（`euler-formula-rotation`） | $e^{i(\omega t+\delta)}=\cos(\omega t+\delta)+i\sin(\omega t+\delta)$ | $A,\omega,\delta$ | 複平面/時域雙區域 + 虛部投影 + 固定長度歷史緩衝 |

### 實作共通點（可直接作為 React 化需求）

- **零配置取向**：避免在 `draw()` 內反覆 new `{x,y}`，改用預配置快取或 out 參數，降低 GC 抖動。
- **自動縮放**：以當前最大幾何量（如 `r1+r2`、`r1*r2`、`r`）更新相機比例，避免節點出框。
- **平滑與時間調變**：滑桿輸入與畫面輸出分離（`smooth*`），並加入低振幅漂移維持生命感。
- **分層渲染**：先 guide/grid，再主向量 glow，最後節點與標籤；避免 UI/guide 搶過主曲線。

### React 轉接建議（最小改動）

1. 先把三個 prototype 抽為 `src/curve/modules/<slug>/index.ts`，保留公式與參數語意。
2. `paramSchema` 對應滑桿：四則運算（4 參數）、極座標（2 參數）、尤拉（3 參數）。
3. 如需每幀重算（時間驅動/漂移），省略 `cacheStrategy`；靜態幾何再考慮 cache。
4. renderer 端沿用現有 glow/grid 語言，不在單一作品重做視覺系統。

---

## 指令

```bash
npm run dev
# /works/rose-curve
# /works/lissajous-curve
# /works/harmonograph-curve
# /works/spirograph-curve
# /works/standing-wave
# /works/interference-fringes
# /works/chladni-figures
# /works/parabolic-reflection
# /works/conic-envelope
# /works/conic-focus-locus
# /explore/fourier-series   # explore 專用根元件，非 portal
```

---

## 延伸閱讀（content）

| 作品 | 連結 |
|------|------|
| 玫瑰線 | [維基（中文）](https://zh.wikipedia.org/zh-tw/%E7%8E%AB%E7%91%B0%E7%BA%BF) |
| 利薩茹 | [維基（中文）](https://zh.wikipedia.org/zh-tw/%E5%88%A9%E8%90%A8%E8%8C%B9%E6%9B%B2%E7%BA%BF) |
| 諧振圖 | [Harmonograph（Wikipedia 英文）](https://en.wikipedia.org/wiki/Harmonograph) |
| 萬花尺 | [維基（中文）](https://zh.wikipedia.org/zh-tw/%E8%90%AC%E8%8A%B1%E5%B0%BA) |
| 傅立葉級數 | [維基（中文）](https://zh.wikipedia.org/zh-tw/%E5%82%85%E9%87%8C%E5%8F%B6%E7%B4%9A%E6%95%B8) |
