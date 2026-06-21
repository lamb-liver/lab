# 羊·實驗

個人作品集網站：數學視覺化與 Generative Art 的實驗場地。以程式將數學形狀與演算法跑出來的圖案呈現出來，並用視覺化協助理解公式。

## 技術棧

- [Astro](https://astro.build) 6（靜態站）
- Content Collections（Git-based Markdown）
- [@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/) + [p5.js](https://p5js.org/)（作品互動曲線）
- 純手寫 CSS，無 UI framework；OG 圖使用本地字型套件

## 文件

完整索引見 [`docs/README.md`](docs/README.md)（[`docs/AGENTS.md`](docs/AGENTS.md) 為 AI 入口）。

**Authority 層級**（衝突時）：`src/` runtime > [`docs/AGENTS.md`](docs/AGENTS.md) > `docs/` 規格與系統地圖 > [`.cursor/rules/code-review.mdc`](.cursor/rules/code-review.mdc)（僅 AI review workflow，非 runtime spec）。

| 工具 | 說明 |
|------|------|
| [`.cursor/rules/code-review.mdc`](.cursor/rules/code-review.mdc) | Local AI-assisted review workflow（Cursor）；**非** canonical spec |

線上：[lab.lambliver.dev](https://lab.lambliver.dev/) · 倉庫 [lamb-liver/lab](https://github.com/lamb-liver/lab)

## 本地開發與部署

正式站：**https://lab.lambliver.dev/**（根路徑，`astro.config.mjs` 為 `site` + `base: '/'`）。

| 項目 | 說明 |
|------|------|
| 建置產物 | `npm run build` → `dist/`（`index.html` 在根目錄） |
| 前端驗證 | `npm run validate:frontend -- --url http://127.0.0.1:4321/`；screenshot 只在需要視覺證據時加 `--screenshot` |
| 自動部署 | `main` push → [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) → GitHub Pages（上傳整個 `dist`） |
| 自訂網域 | `public/CNAME` → `lab.lambliver.dev`；並在 repo **Settings → Pages → Custom domain** 填同一網域 |
| DNS | 將 `lab.lambliver.dev` CNAME 指向 GitHub Pages（或依 Pages 提示設定 A 記錄） |

```bash
npm install
npm run dev
# 例：http://localhost:4321/
```

站內連結使用 root-relative path（例如 `/works`、`/explore/{slug}`）；`astro.config.mjs` 固定 `base: '/'`。

## 頁面

路徑表為站內邏輯路徑（與正式網域根路徑一致）。

| 路徑 | 說明 |
|------|------|
| `/` | 首頁（Hero → 雙欄導覽 → 精選 → 最新作品 ×3 → 最新視覺化 ×3） |
| `/works` | 作品集列表（**舊→新**排序、tag 篩選、關鍵字搜尋 `?q=`） |
| `/works/[slug]` | 單件作品（canvas 左 + **右側參數面板** + Markdown 說明） |
| `/explore` | 視覺化主題列表（**舊→新**排序，`ExploreCard` + 封面圖） |
| `/explore/[slug]` | 單個視覺化（互動區 + 說明；如傅立葉級數） |
| `/about` | 關於 |

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
date: 2026-03-10        # 真實發布日；不參與排序
order: 62               # 發布排序；數字越大越新
featured: false         # true = 進入首頁「精選」池（需已掛互動；見下方排序表）
draft: false
---
```

### 新增互動曲線（工程）

見 [`docs/p5toreact.md`](docs/p5toreact.md) 檢查清單；連續 lerp 參數（δ、d）另見 [`docs/reactkey.md`](docs/reactkey.md)。摘要：

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

在 `src/content/explore/` 新增 `{slug}.md`。正文結構與語氣見 [`docs/textstyle.md`](docs/textstyle.md)。

```yaml
---
title: 傅立葉級數
description: 一句話描述
category: 分析          # 幾何 | 代數 | 統計 | 拓樸 | 分析
date: 2026-02-01        # 真實發布日；不參與排序
order: 18               # 發布排序；數字越大越新
coverImage: /images/explore-covers/{slug}.png   # 可選，列表卡片封面
featured: false         # true = 進入首頁「精選」池（需已掛互動；見下方排序表）
draft: false
---
```

新封面圖放 `public/images/explore-covers/`，對應來源檔放 `scripts/explore-covers/`；`fourier-series` 既有 legacy 封面保留原路徑。`coverImage` 使用 root-relative path。封面規格見 [`docs/exploreart.md`](docs/exploreart.md)。
互動掛載：在 [`src/explore/interactiveRegistry.ts`](src/explore/interactiveRegistry.ts) 登記 slug，並於 [`ExploreInteractiveStage.tsx`](src/components/explore/ExploreInteractiveStage.tsx) 掛載對應 `*ExploreRoot`。細節見 [`docs/p5toreact.md`](docs/p5toreact.md)「Explore 視覺化」章節。

### 視覺化頁版面（互動 explore）

多數 explore 互動採 **canvas 左 + sidebar 右**（如 `conic-dynamic-explore`、`matrix-linear-explore`）；傅立葉級數等少數為 canvas 下工具列。

```
.explore-detail--interactive
├── *-explore__stage
│   ├── canvas（p5 instance）
│   └── sidebar（React 控件、統計）
└── .prose                        ← Markdown 說明
```

控件**不走** portal；與作品集 `work-detail__stage` 分離。

## 排序與首頁策展（`src/content/utils.ts`）

| 場景 | 行為 |
|------|------|
| `/works` 列表 | `getPublishedAsc`：依 `order` **舊→新**（數字越大越靠後） |
| `/works` 搜尋 | client 端原生字串比對 **標題 + 描述 + slug**，與 tag 篩選交集；URL `?q=` |
| `/explore` 列表 | `getPublishedAsc`：依 `order` **舊→新**（同上） |
| 首頁「精選」作品 | `getFeaturedInteractive(works, …, 2)`：僅 `featured: true` 且已掛 canvas，**order 新→舊** 取 2 篇 |
| 首頁「精選」視覺化 | `getFeaturedInteractive(explore, …, 1)`：同上，取 1 篇 |
| 首頁「最新作品」 | `getPublishedInteractive` 取候選後 **排除精選 slug**，再取 3 篇 |
| 首頁「最新視覺化」 | 同上 |

`date` 代表真實發布日；排序由 `order` 控制。
`featured` 用於首頁精選策展：建議同時僅標記少數條目（例如 Works 2 + Explore 1），避免精選區過滿。精選池內多篇時依 **order 新→舊** 截斷，不影響 `/works`、`/explore` 列表排序。

### 區域定位（列表與首頁）

- **深度作品**（`/works`）：單一數學對象、公式與完整 Markdown；卡片角標「作品」、列表 badge「深度作品」。
- **互動探索**（`/explore`）：跨概念主題導覽；卡片角標「探索」、列表 badge「互動探索」。
- 首頁 Hero 下 **雙欄導覽卡** 說明兩區差異並連到列表頁。

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
| `FilterBar` | 已用：作品 / Explore 列表前端篩選 |

## 刻意未採用

- Astro View Transitions
- MDX、CMS、CSS framework
- Light/dark theme 切換
- Framer Motion 等動畫庫

## 聯絡

- Email：[lambliver.dev@gmail.com](mailto:lambliver.dev@gmail.com)
- GitHub：[lamb-liver](https://github.com/lamb-liver)
