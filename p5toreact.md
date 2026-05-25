# p5.js → React（羊·實驗）

本文件記錄如何把 p5 Web Editor sketch 接到 Astro + React。  
**參考實作**：`rose-curve`、`lissajous-curve`、`harmonograph-curve`、`spirograph-curve`、`standing-wave`、`interference-fringes`、`chladni-figures`、`parabolic-reflection`、`conic-envelope`、`conic-focus-locus`、`catenary`、`equiangular-spiral`、`vector-field-streamlines`。  
**視覺規格**：見 [`art.md`](art.md)（glow、grid、hierarchy，只換 geometry 不重做 style）。  
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
| 參數單一真相 | `paramSchema: ParamDef[]` 驅動標準控件；特殊控件另做元件 |
| 點列策略依曲線 | 能快取則 `cache`；需每幀 morph 則 `cacheStrategy: 'none'` |

---

## 目錄

```
src/curve/
  types.ts, defaults.ts, constants.ts
  registry.ts               # workCurveBySlug（縮圖、靜態預覽）
  animation.ts              # 通用 stepAnimation（Rose 用）
  cache.ts                  # createCurveCache + integerBlend 奇偶護欄
  morphFrame.ts             # executeMorphDrawFrame、getMorphDisplayPoints（零 React）
  morphPathCache.ts         # createMorphPathCache（toFixed key；none 模組 bypass）
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
  fourier-series-epicycles-cover.png   # ExploreCard 封面

src/styles/pages/
  work-detail.css           # .work-detail__stage 舞台佈局

src/styles/components/explore/
  fourier-explore.css       # explore 工具列
```

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

### 舞台佈局（canvas 左 · 控制右）

互動作品使用 **`.work-detail__stage`** 雙欄 grid，進頁即可在 canvas 右側看到滑桿，無需捲到 Markdown 區：

```html
<div class="work-detail__stage">
  <div class="work-detail__canvas">
    <*CurveRoot />          <!-- 只渲染 canvas host -->
  </div>
  <aside class="controls-panel controls-panel--stage" id="{slug}-controls" />
</div>
<div class="container work-detail">
  <h1>…</h1>
  <article class="prose">…</article>   <!-- 說明全文寬，在舞台下方 -->
</div>
```

React 以 `createPortal` 將控制面板掛入右側 `.controls-panel--stage`（`sticky`，高度 `min(70vh, 680px)`）。

| 斷點 | 行為 |
|------|------|
| ≥1024px | canvas **左** · 控制 **右**（320px 欄） |
| <1024px | canvas 上 · 控制下（仍緊接 canvas，在 prose 之前） |

**不要**把 portal 目標放在 `.detail-grid` 的 prose 旁——控制會被擠到頁面中段以下。

---

## 作品集列表與排序（`content/utils.ts`）

| 用途 | 函式 | 排序 |
|------|------|------|
| `/works` 列表 | `getPublishedAsc` | **舊→新**（越新越靠後） |
| 首頁「最新作品」 | `getFeaturedOrLatest` | 池內 **新→舊**，取前 N = **最新 N 篇** |
| 靜態路由 | `getStaticPathsFromCollection` | 順序不影響路由 |

```ts
// 列表：玫瑰 → … → 繁花（依 date 舊→新）
export const getPublishedAsc = (entries) =>
  entries.filter(isPublished).sort(sortByDateAsc);
```

`featured: true` 決定是否進首頁池；**不**改變 `/works` 的 asc 規則。

---

## Explore 視覺化（`/explore/[slug]`）

與作品集分離：**不用** `CurveModule`、**不用** `createPortal`、**不用** `work-detail__stage`。

| slug | 元件 | 說明 |
|------|------|------|
| `fourier-series` | `FourierSeriesExploreRoot` | 1D 方波 / 2D 軌道；epicycles |
| `trig-wave-interference` | `WaveSuperpositionExploreRoot` | 圖左 sidebar 右；`canvasSize` clamp(300, w×ratio, 520)；見 `art.md` §5.2.2 |

### 佈局（傅立葉）

```
.fourier-explore
├── .fourier-explore__canvas      ← p5
└── .fourier-explore__toolbar     ← N 滑桿、模式切換（canvas 下、一屏可見）
    └── .fourier-explore__meta    ← 公式（降權）
```

掛載：`pages/explore/[slug].astro` 查 `isExploreInteractive` → `ExploreInteractiveStage`；Markdown prose 在互動區下方。

新增互動 explore：`explore/interactiveRegistry.ts` + `ExploreInteractiveStage.tsx` 的 `rootBySlug`。

### Path cache（`src/explore/fourier/path.ts`）

```
mode 或 N 變更 → buildFourierPath() 一次（含 arcLength LUT）
每 frame draw  → reveal slice + renderFourierEpicycles
```

- reveal：`reveal += (p.deltaTime / 1000) * REVEAL_SPEED_PER_SEC`（**勿**固定 `+= 0.002`）
- guide 的 `currentT`：`tAtArcLength(points, totalLength * revealProgress)`

### Explore 列表封面

```yaml
# src/content/explore/{slug}.md
coverImage: /explore/fourier-series-epicycles-cover.png
```

`ExploreCard.astro` 讀 `entry.data.coverImage`；無則顯示「主題佔位」。  
命名慣例：`public/explore/{slug}-{主題}-cover.png`。

### Explore vs Works

| | Works | Explore |
|---|-------|---------|
| 模組 | `CurveModule` + `registry` | `src/explore/*` 自建 path |
| 控件 | portal → 右欄 | 內嵌 React DOM |
| 縮圖 | 建置期 SVG | 靜態 PNG `coverImage` |
| reveal | 多為 per-frame speed | 建議 `deltaTime` 驅動 |

---

## 作品集縮圖（`WorkCard` + `curveThumbnail`）

> **實作規格（reveal 100% 完成態）**：見 [`docs/work-thumbnail-spec.md`](docs/work-thumbnail-spec.md)。

### 目的

卡片縮圖 = **`defaultParams` 下 reveal 100% 的幾何快照**（`#0a0a0a` 底 + accent 金線），非文字佔位、非動畫第 0 幀。

### 資料流（建置期，無 p5）

```
entry.id → workCurveBySlug[slug]
       → module.sample(defaultParams, { purpose: 'thumbnail', revealProgress: 1 })
       → normalizeToThumbnailSpec
       → fitToView (excludeFromBbox-aware)
       → multi-path SVG → WorkCard set:html
```

### 型別契約

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
  strokeWidth?: number;
  excludeFromBbox?: boolean;
};

type ThumbnailSpec = {
  paths: ThumbnailPath[];
};
```

### 已落地規則

1. `curveThumbnail.ts` 支援 legacy 單 path（`CurvePoint[]`）與多 path（`ThumbnailSpec`）混用。
2. `fitToView` 只用 `excludeFromBbox !== true` 的 path 算 bbox，但繪製時仍包含全部 path。
3. 每個 `ThumbnailPath` 會輸出一條 SVG `<path>`，支援 `opacity`、`stroke-width`、`closed`。
4. 點雲類（如 Chladni / IFS）使用細線寬（0.5）並保持 round cap/join。

### 目前縮圖策略摘要

1. S 類（rose/lissajous/harmonograph/spirograph）：單 path 完成態，必要時 `closed: true`。
2. M 類幾何（interference/grid/riemann/tangent/catenary 等）：多 path 輸出，避免把不相鄰分支硬接成鬼線。
3. 粒子類：
   - `chladni-figures`：固定 seed 粒子雲（`>= 2000` 點）
   - `affine-ifs-fractal`：固定 seed IFS（`>= 5000` 點）
4. `catenary`：6 paths（ghost 上下 + dynamic 上下 + rope 上下），ghost 排除 bbox。

### 新增作品時

1. 實作 `CurveModule`
2. 登記 `src/curve/registry.ts`（slug 與 `{slug}.md` 檔名一致）
3. 未登記 → 仍顯示「縮圖佔位」

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
  getMetadata: (params, runtime?) => CurveMetadata;
  renderPreset: RenderConfig;
  cacheStrategy?: 'none' | 'integerBlend' | 'exact';
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
        → getMorphDisplayPoints（none → 每幀 sample）
    → renderFrame(p, RenderSnap, renderPreset)
    → UI 節流 setState（revealPct、smoothDelta…）
```

架構契約見 [`reactkey.md`](reactkey.md)。

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

`cacheStrategy: 'none'` — 每幀 `module.sample(anim.params)`。

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

`cacheStrategy: 'none'` → `getMorphDisplayPoints` 每幀 `sample`（見 [`reactkey.md`](reactkey.md)）。採樣約 3140 點，單幀渲染可接受。

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

`cacheStrategy: 'none'`。概念同 Harmonograph 的離散+連續分層。

---

## 參考實作 E：Standing Wave（`StandingWaveCurveRoot`）

```
y = 2A sin(kx) cos(ωt)    包絡 ±2A sin(kx)
```

| 參數 | 行為 |
|------|------|
| k（spatialFrequency） | 變更 → reveal 歸零；瞬間對齊 |
| A（amplitude） | lerp **0.08**；不重置 reveal |
| ω（timeSpeed） | 每幀累加 `time`；不重置 reveal |

- **不走** `renderFrame` / `useMorphCurveP5`：時間驅動 + 包絡 ghost 圖層
- reveal 依水平寬度比例（非 arcLength / theta）
- `sample()` 供列表縮圖（t = 0、reveal = 1）

---

## 參考實作 F：Interference Fringes（`InterferenceFringesCurveRoot`）

```
Δr = nλ    x = a cosh(t), y = b sinh(t)    b = √(c² − a²), c = d/2
```

| 參數 | 行為 |
|------|------|
| λ（wavelength） | 變更 → reveal 歸零 |
| d（sourceDistance） | 變更 → reveal 歸零；**顯示** lerp 0.08 |
| ω（timeSpeed） | 每幀累加 `time`；不重置 reveal |

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
| rotationSpeed | 每幀累加 `time`；渲染層 `rotate(time)` |

- **不走** `renderFrame` / morph cache：參數曲線 + reveal θ 呼吸
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
| flowSpeed | 每幀累加 `time`；場與種子半徑隨 t 變 |

- 固定 `CAMERA_SCALE = 120`；邊界 $|x|,|y|>5$ 截斷
- 種子：均分角度 + 呼吸半徑 $1.2+0.25\sin(1.5t+i)$
- 見 `vectorFieldStreamlinesRender.ts`；縮圖為多 path（24 條流線快照）

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
| 連續 morph | k lerp | δ | δ + d | d | A | d（顯示） |
| 滑桿 ref | — | `patchTargetParams` | 同上 | 同上 | — | — |
| 離散瞬跳 | — | a, b | a, b | R, r | k | λ, d（結構） |
| 特殊 UI | — | δ tick/snap | δ tick/snap + d | — | — | — |

---

## Cache 策略

| Strategy | 適用 |
|----------|------|
| `none` | δ / d 等每幀 morph（Lissajous、Harmonograph、Spirograph） |
| `integerBlend` | 單整數、同參數空間（Rose k；注意奇偶護欄） |
| `exact` | 多參數 `cacheKey` |

---

## 新增曲線檢查清單

1. `modules/xxx/index.ts` + `content/works/xxx.md`
2. `xxxRenderPreset`（對齊 `art.md`）
3. `CurveWorkRoot` 或專用 `XxxCurveRoot`
4. 採樣域、`revealMode`、`cacheStrategy`
5. 哪些參數 reset reveal？哪些 lerp？
6. 連續 lerp → `useMorphCurveP5` + `patchTargetParams`（見 [`reactkey.md`](reactkey.md)）
7. `[slug].astro`：`work-detail__stage` + `WorkInteractiveStage`（registry 查表）
8. `registry.ts` 登記（縮圖）
9. 驗收：作品頁（**滑桿在 canvas 右側、一屏可見**）、列表縮圖、`reveal === 1` 點列完整、**瀏覽器拖動連續參數滑桿**

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
| morph 曲線用 cache | `cacheStrategy: 'none'` + `getMorphDisplayPoints` |
| `none` 仍走 morphPathCache | 阻尼 lerp 時 toFixed(4) key 碰撞 → 過期點列 |
| target 只經 useEffect 寫 ref | slider 用 `patchTargetParams` 再 setState |
| 幀邏輯放 morphPathCache.ts | 應在 `morphFrame.ts`；ref 解引用在 hook |
| 測試只 assert stale cache | spy + 弧長 + `useMorphCurveP5.draw.test.ts` |
| 縮圖 `:global(svg)` / flex 置中 | `.card__thumb svg` + `display: block` |
| 忘記 `registry` | 卡片無預覽圖 |
| `/works` 用 `getPublished` | 改用 `getPublishedAsc` |
| 控制 panel 放在 prose 旁 `detail-grid` | 改用 `work-detail__stage` 右欄 |
| explore reveal 固定每幀 `+= 0.002` | 改用 `(deltaTime/1000) * speedPerSec` |
| `fourierRender` 裸用 `TWO_PI` 未 import | 模組內 `const TAU = Math.PI * 2` |
| /renderer 常數從 `curve/constants` import 被 Vite 剝離 | 渲染檔內建本地常數 |

---

## 工作流程

1. p5 prototype（視覺先成立 → `art.md`）
2. 抽 `CurveModule` + 選 Root 型別
3. Astro + portal 控件 + `registry` 縮圖

**不要**先 abstraction 再找視覺；**不要**重做 glow / UI 語言。

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
