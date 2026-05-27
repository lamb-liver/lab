# 羊·實驗

個人作品集網站：數學視覺化與 Generative Art 的實驗場地。以程式將數學形狀與演算法跑出來的圖案呈現出來，並用視覺化協助理解公式。

## 技術棧

- [Astro](https://astro.build) 6（靜態站）
- Content Collections（Git-based Markdown）
- [@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/) + [p5.js](https://p5js.org/)（作品互動曲線）
- 純手寫 CSS，無 UI framework、無外部字體

## 文件

| 文件 | 說明 |
|------|------|
| [`AGENTS.md`](AGENTS.md) | AI 入口：權威順序、架構入口、編輯原則 |
| [`art.md`](art.md) | 曲線視覺風格（glow、grid、色彩、hierarchy） |
| [`textstyle.md`](textstyle.md) | 視覺化主題頁 Markdown 文案結構與語氣 |
| [`p5toreact.md`](p5toreact.md) | p5 sketch → React / CurveModule 整合與踩坑 |
| [`reactkey.md`](reactkey.md) | Morph 曲線 React × p5 架構契約（模組邊界、ref、快取） |
| [`docs/architecture.md`](docs/architecture.md) | AI onboarding 系統地圖：data flow、ownership、registry 關係 |
| [`docs/editing-rules.md`](docs/editing-rules.md) | AI-assisted editing 原則與驗收規則 |
| [`docs/work-thumbnail-spec.md`](docs/work-thumbnail-spec.md) | 縮圖設計歷史（Implemented）；現行見 `p5toreact.md` + `curveThumbnail.ts` |

**Authority 層級**（衝突時）：`src/` runtime > [`AGENTS.md`](AGENTS.md) 的權威入口 > `art.md` / `p5toreact.md` / `reactkey.md` / `textstyle.md` > `docs/` 系統地圖與設計歷史 > [`.cursor/rules/code-review.mdc`](.cursor/rules/code-review.mdc)（僅 AI review workflow，非 runtime spec）。

| 工具 | 說明 |
|------|------|
| [`.cursor/rules/code-review.mdc`](.cursor/rules/code-review.mdc) | Local AI-assisted review workflow（Cursor）；**非** canonical spec |
| [`tools/archive/`](tools/archive/) | 一次性維護腳本（如 works 文案批次遷移） |

線上：[lamb-liver.github.io/lab](https://lamb-liver.github.io/lab/) · 倉庫 [lamb-liver/lab](https://github.com/lamb-liver/lab)

## 頁面

| 路徑 | 說明 |
|------|------|
| `/` | 首頁（Hero、最新作品 ×3、最新視覺化 ×3） |
| `/works` | 作品集列表（**舊→新**排序，含曲線預覽縮圖） |
| `/works/[slug]` | 單件作品（canvas 左 + **右側參數面板** + Markdown 說明） |
| `/explore` | 視覺化主題列表（**舊→新**排序，`ExploreCard` + 封面圖） |
| `/explore/[slug]` | 單個視覺化（互動區 + 說明；如傅立葉級數） |
| `/about` | 關於 |

## 互動作品（p5 + React）

| slug | 標題 | 說明 |
|------|------|------|
| `rose-curve` | 玫瑰曲線 | 極座標 `r = cos(kθ)`，`CurveWorkRoot` |
| `lissajous-curve` | 利薩茹曲線 | `x = A sin(at+δ)`, `y = B sin(bt)` |
| `harmonograph-curve` | 諧振圖 | 阻尼振子 `e^(-dt)`，t 至 10π |
| `spirograph-curve` | 繁花曲線 | 內擺線 Hypotrochoid，R/r 瞬跳、d morph |
| `standing-wave` | 駐波圖 | `y = 2A sin(kx) cos(ωt)`，包絡 ghost + 時間振盪 |
| `interference-fringes` | 干涉條紋 | 雙曲線包絡 + 波程差 Δr = nλ，d / λ lerp |
| `chladni-figures` | 克拉尼圖形 | 8000 粒子 + 模態 m/n，波節線沉積 |
| `parabolic-reflection` | 拋物線反射 | y²=4px 拋物 ghost + 焦點→鏡面→平行光 |
| `conic-envelope` | 二次曲線包絡線 | 直線族 x/x_A+y/y_B=1 + 呼吸動態 |
| `conic-focus-locus` | 焦點軌跡 | 橢圓 ghost + 雙焦點連線 + 軌道點 |
| `linear-transform-grid` | 線性變換網格 | 2x2 矩陣作用於平面網格 |
| `affine-transform-pattern` | 仿射變換圖樣 | 旋轉+縮放+平移遞迴圖樣 |
| `rotation-scale-composition` | 旋轉縮放疊加 | 疊層方形與矩陣複合 |
| `affine-ifs-fractal` | 碎形仿射疊代 | IFS 隨機迭代點雲 |
| `riemann-sum` | 黎曼和動態圖 | 曲線+矩形分割逼近面積 |
| `tangent-approximation` | 切線逼近動畫 | 割線收斂到切線 |
| `catenary` | 曳物線 | tractrix 上下軌 + rope |
| `equiangular-spiral` | 等角螺線 | r=ae^(bθ) ghost + reveal + 旋轉 |
| `vector-field-streamlines` | 向量場流線 | 漩渦場 RK2 流線積分 |
| `complex-arithmetic-geometry` | 複數四則運算的幾何意義 | $z_1+z_2$ 平行四邊形、$z_1 z_2$ 模角合成 |
| `complex-polar-form` | 複數的極座標形式 | $z=re^{i\theta}$ 投影與幅角弧 |
| `euler-formula-rotation` | 尤拉公式旋轉動畫 | 複平面旋轉 + 虛部時域波形 |
| `julia-set` | 朱利亞集合 | $z_{n+1}=z_n^2+c$ 分形 + 平滑逃逸著色 |
| `complex-phase-portrait` | 相位圖 | 雙相量首尾相接 + 滾動軌跡；A / b / δ |

### 視覺化（explore）

| slug | 標題 | 說明 |
|------|------|------|
| `fourier-series` | 傅立葉級數 | 1D 方波 / 2D 軌道，epicycles + N 滑桿（有 `coverImage`） |
| `trig-wave-interference` | 三角函數的疊加與波的干涉 | 疊加 / 拍頻雙模式、相位與頻率滑桿 |
| `conic-dynamic-geometry` | 二次曲線的幾何動態軌跡 | 離心率 $e$ 連續過渡（圓→橢圓→拋物→雙曲） |
| `matrix-linear-transform` | 矩陣與線性變換 | 欄向量、行列式與 $AB\neq BA$ |
| `limits-riemann-sum` | 極限與黎曼和 | 分割收斂、中點法與切線斜率 |
| `differential-equations-geometry` | 微分方程的幾何視覺化 | 斜率場、初始條件與尤拉法 |
| `complex-euler-formula` | 複數與尤拉公式 | $e^{i\theta}$、旋轉算子與棣莫弗定理 |
| `sequences-and-series` | 數列與級數 | 等差等比、收斂與邏輯斯諦混沌 |
| `permutations-combinations` | 排列組合 | 帕斯卡三角、路徑計數與組合爆炸 |
| `probability-statistics` | 機率與統計 | 條件機率、貝氏、CLT、蒙提霍爾 |
| `exponential-logarithm` | 指數與對數 | 反函數、$e$、對數尺度與換底 |
| `vectors` | 向量 | 內積、線性組合與法向量 |

未列於上表且尚無互動實作的 explore slug，詳頁 canvas 仍為佔位；列表無封面時顯示「主題佔位」。

### 內容佔位（待互動）

以下條目已有 Markdown 與路由，canvas 互動待實作。`date` 為預排順序；互動完成後改為實際完成日即可浮上首頁。

**視覺化**

（explore 主題頁正文已補齊；互動 canvas 待實作者見各 slug 詳頁。）

**作品集**

| 主題 | slug | 標題 |
|------|------|------|
| 數列與級數 | `arithmetic-geometric-sequences` | 等差等比數列的幾何視覺 |
| 數列與級數 | `fibonacci-spiral` | 費波那契螺線 |
| 碎形與動力系統 | `sierpinski-triangle` | 謝爾賓斯基三角形 |
| 數列與級數 | `basel-problem` | 巴塞爾問題 |
| 碎形與動力系統 | `logistic-bifurcation` | 邏輯斯諦映射分岔圖 |
| 組合數學 | `pascals-triangle` | 帕斯卡三角形 |
| 組合數學 | `combinatorial-path-counting` | 組合的路徑計數 |
| 組合數學 | `binomial-expansion-geometry` | 二項式展開的幾何意義 |
| 組合數學 | `catalan-numbers` | 卡特蘭數 |
| 機率與統計 | `conditional-probability-bayes` | 條件機率與貝氏定理 |
| 機率與統計 | `binomial-to-normal` | 二項分佈到常態分佈 |
| 機率與統計 | `buffon-needle` | 蒲豐投針 |
| 指數與對數 | `exponential-growth-decay` | 指數成長與衰減 |
| 指數與對數 | `logarithmic-scale` | 對數尺度 |
| 指數與對數 | `natural-log-e-geometry` | 自然對數 e 的幾何定義 |
| 指數與對數 | `logistic-curve` | 邏輯斯諦曲線 |
| 向量幾何 | `vector-addition-scalar` | 向量的加法與純量乘法 |
| 向量幾何 | `dot-product-geometry` | 內積的幾何意義 |
| 向量幾何 | `vector-projection` | 向量投影與分解 |
| 向量幾何 | `vector-field-patterns` | 向量場的基本圖樣 |

## 專案結構

```text
src/
├── content.config.ts
├── content/
│   ├── utils.ts              # 發布篩選、排序、首頁策展
│   ├── works/                  # 作品 Markdown
│   └── explore/                # 視覺化 Markdown
├── curve/                      # 曲線平台（零 p5）
│   ├── modules/                # rose | lissajous | harmonograph | spirograph | …
│   ├── registry.ts             # slug → module（縮圖用）
│   ├── morphFrame.ts           # 幀推進：stepAnimation → sample（零 React）
│   ├── morphPathCache.ts       # morph 點列快取（toFixed key；none 模組勿依賴）
│   ├── cache.ts, animation.ts, types.ts
├── explore/fourier/            # explore 傅立葉（path cache，零 p5）
├── systems/rendering/          # 共用 p5 渲染（grid、glow、reveal、fourierRender）
├── lib/curveThumbnail.ts       # 建置期卡片縮圖 SVG
├── components/
│   ├── curve/                  # CurveWorkRoot、useMorphCurveP5、ParamControls
│   ├── works/                  # *CurveRoot 薄包裝
│   ├── explore/                # FourierSeriesExploreRoot
│   ├── WorkCard.astro          # 作品集列表 + 曲線縮圖
│   └── ExploreCard.astro       # 視覺化列表 + coverImage
├── layouts/BaseLayout.astro
├── styles/
│   ├── pages/explore-detail.css
│   └── components/explore/fourier-explore.css
└── pages/
    ├── works/[slug].astro
    └── explore/[slug].astro

public/
└── explore/                    # ExploreCard 靜態封面（PNG）
    └── fourier-series-epicycles-cover.png
```

**CSS 原則**：元件樣式由元件 `import`；`BaseLayout` 不集中載入所有 component CSS。

## 新增作品（content）

在 `src/content/works/` 新增 `{slug}.md`，檔名即 URL。

```yaml
---
title: 標題
description: 一句話描述
tags:
  - 幾何
date: 2026-03-10        # 完成日；決定首頁「最新作品」與列表順序
featured: false         # 備用標記，不影響首頁
draft: false
---
```

### 新增互動曲線（工程）

見 [`p5toreact.md`](p5toreact.md) 檢查清單；連續 lerp 參數（δ、d）另見 [`reactkey.md`](reactkey.md)。摘要：

1. `src/curve/modules/{name}/index.ts` — `sample`、`paramSchema`、`renderPreset`
2. `src/components/works/{Name}CurveRoot.tsx` — 掛載至 `[slug].astro`
3. `src/curve/registry.ts` — 登記 slug（**列表縮圖**自動生成）
4. `src/systems/rendering/presets.ts` — 若需新 grid 型別則擴充 `frame.ts`

### 作品頁版面（互動曲線）

```
.work-detail__stage
├── .work-detail__canvas     ← *CurveRoot（p5）
└── .controls-panel--stage   ← React portal 滑桿（右側 sticky）

.container.work-detail
└── .prose                   ← Markdown 說明（舞台下方）
```

桌面：canvas 左、控制右；手機：canvas 上、控制下（均在 prose 之前）。

## 新增視覺化（content）

在 `src/content/explore/` 新增 `{slug}.md`。正文結構與語氣見 [`textstyle.md`](textstyle.md)。

```yaml
---
title: 傅立葉級數
description: 一句話描述
category: 分析          # 幾何 | 代數 | 統計 | 拓樸 | 分析
date: 2026-02-01        # 完成日
coverImage: /explore/fourier-series-epicycles-cover.png   # 可選，列表卡片封面
featured: false         # 備用標記，不影響首頁
draft: false
---
```

封面圖放 `public/explore/`，命名慣例：`{slug}-{主題}-cover.png`。  
互動掛載見 [`p5toreact.md`](p5toreact.md)「Explore 視覺化」章節。

### 視覺化頁版面（互動 explore）

```
.explore-detail--interactive
├── .fourier-explore__canvas      ← p5（限高 min(34vh, 400px)）
├── .fourier-explore__toolbar     ← N 滑桿、模式切換（canvas 下、一屏可見）
└── .prose                        ← Markdown 說明
```

控件**不走** portal；與作品集 `work-detail__stage` 分離。

## 排序策略（`src/content/utils.ts`）

| 場景 | 行為 |
|------|------|
| `/works` 列表 | `getPublishedAsc`：**舊→新**（完成愈晚愈靠後） |
| `/explore` 列表 | `getPublishedAsc`：**舊→新**（同上） |
| 首頁「最新作品」 | `getPublishedInteractive(works, workInteractiveSlugs, 3)`：已掛載 canvas 者中 **date 新→舊** 取 3 篇 |
| 首頁「最新視覺化」 | `getPublishedInteractive(explore, exploreInteractiveSlugs, 3)`：同上（目前 2 篇互動則顯示 2 張卡） |

`date` 代表完成日（或預排順序）；互動實作完成後更新 `date`，該篇會自動浮上首頁前三。  
`featured` 保留為備用標記，**不**參與首頁選稿（`getFeaturedOrLatest` 仍可供其他用途）。

## 設計系統（摘要）

作品 canvas 與卡片縮圖背景為 `#0a0a0a`；曲線 accent 為 `rgb(212, 184, 122)`。全站 UI 色票見 `src/styles/tokens.css`。

| 用途 | 色碼 |
|------|------|
| 背景 | `#0d0d0d` |
| 表面（卡片） | `#1a1a1a` |
| 邊框 | `#2a2a2a` |
| 主文字 | `#e8e8e8` |
| 次要文字 | `#888888` |
| 強調（hover、標籤） | `#c0ff6b` |

- `.prose`：僅用於作品／視覺化 Markdown 長文區
- 參數滑桿：`.range-wrap` + `.range`（`styles/components/range.css`）

## 預留擴充點

| 位置 | 狀態 |
|------|------|
| `#hero-canvas` | 已用：首頁 Hero 播放 `rotation-scale-composition` 動畫 |
| `.controls-panel--stage` | 已用：作品 canvas **右側** React portal 參數控制 |
| `.fourier-explore` | 已用：explore 傅立葉（canvas 下工具列，非 portal） |
| `TagFilter` | 已用：作品列表前端 tag 篩選 |
| `CategoryFilter` | explore 分類篩選 UI |

## 刻意未採用

- Astro View Transitions
- MDX、CMS、CSS framework
- Light/dark theme 切換
- Framer Motion 等動畫庫

## 聯絡

- Email：[lambliver.dev@gmail.com](mailto:lambliver.dev@gmail.com)
- GitHub：[lamb-liver](https://github.com/lamb-liver)
