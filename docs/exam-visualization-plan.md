# 試題視覺化（/exam）企劃

第三個內容集合，與 Works（單一數學對象的深度作品）、Explore（主題導覽）並列。
進入點是**一道具體的歷屆試題**，出口是「為什麼這題會錯」的互動解釋。

- 顯示名稱：試題視覺化
- 路由：`/exam`、`/exam/[slug]`
- Nav 位置：`作品集｜主題導覽｜試題視覺化｜關於`

## 為什麼獨立成一個集合

Works 的敘事是「這個數學對象長什麼樣」，Explore 是「這個單元怎麼串起來」。
試題視覺化的敘事是「這題全體考生都卡在哪個心智步驟」——需要三種現有集合沒有的欄位：
考科、年份、題號、原題連結、答對率／誘答分析、以及回連到對應的 Explore 單元與 Works 作品。
硬塞進 `works` 的 tag 會讓列表篩選與 SEO 都失焦。

## 內容模型

新增 `src/content.config.ts` 的第三個 collection：

```ts
export const examSubjects = ['學測數A', '學測數B', '分科數甲'] as const;
export const examQuestionTypes = ['單選', '多選', '選填', '非選'] as const;

const exam = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/exam' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    subject: z.enum(examSubjects),      // 考科
    year: z.number().int(),             // 民國年：112 / 113 / 114
    questionType: z.enum(examQuestionTypes),
    questionNo: z.string(),             // '11'、'17'
    unit: z.string(),                   // '高三選修數A・矩陣與線性變換'
    concepts: z.array(z.string()),      // 篩選與搜尋用的觀念標籤
    sourceUrl: z.string().url().optional(),   // 大考中心原卷 PDF
    analysisUrl: z.string().url().optional(), // 答對率／解析出處
    relatedExplore: z.array(z.string()).default([]),
    relatedWorks: z.array(z.string()).default([]),
    date: z.coerce.date(),
    order: z.number().int().nonnegative(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
```

**版權界線**：只寫改寫過的題意敘述與觀念拆解，附 `sourceUrl` 連回大考中心原卷，
不整段轉載題目文字或選項，不重製試卷圖檔。

## 頁面結構

列表 `/exam`：沿用 `ListSearchFilterScript` + `FilterBar` 單維度篩選，
`data-filter-param="subject"`，選項由已發布條目收集（`collectExamSubjects`）。
卡片標題左上掛 `112 學測數A・多選11` 的來源標記。

詳情 `/exam/[slug]`：
1. 題目卡（改寫題意 + 原卷連結 + 考科年份題號）
2. 互動舞台 `ExamInteractiveStage`
3. 為什麼會錯（答對率／誘答選項分析）
4. 觀念拆解（KaTeX）
5. 延伸：`relatedExplore` / `relatedWorks` 連結

## 公開前的封鎖機制（已實作）

`/exam` 目前**不對外開放**，三層擋法：

1. 頁面檔放在 `src/pages-preview/exam/`，不在 `src/pages/` 下，Astro 不會自動路由。
2. `astro.config.mjs` 的 `examPreview()` integration 只在 `command === 'dev'`
   或 `EXAM_PREVIEW=1` 時 `injectRoute`。正式 `npm run build` 完全不產出 `/exam` 的 HTML。
3. 保險層：sitemap 過濾掉 `/exam` 前綴，頁面帶 `noindex, nofollow`（BaseLayout 的 `noindex` prop），
   Nav 也還沒加第三個條目。

要在正式 build 產物中預覽：`EXAM_PREVIEW=1 npm run build && npm run preview`。
公開時的動作：把 `src/pages-preview/exam/` 移到 `src/pages/exam/`、移除 integration
與 sitemap filter、拿掉 `noindex`、Nav 加條目、內容 `draft: false`。

## 需要新增的檔案

跟著 Explore 的形狀走，不走 Works 的 portal 控制模型：

```text
src/content/exam/{slug}.md
src/pages-preview/exam/index.astro      # 公開後移到 src/pages/exam/
src/pages-preview/exam/[slug].astro
src/exam/interactiveSlugs.ts
src/exam/interactiveRegistry.ts
src/exam/{slug}/*                      # 幾何與狀態
src/components/exam/ExamInteractiveStage.tsx
src/components/exam/{Xxx}ExamRoot.tsx
src/components/exam/ExamCard.astro
src/components/curve/use{Xxx}P5.ts     # p5 hook 沿用既有位置
src/systems/rendering/{xxx}Render.ts
scripts/new-exam.mjs                   # 比照 new-explore.mjs，加 --interactive
```

同步清單（比照 `architecture.md` 的 registry relationships）：
`src/content/exam/{slug}.md`、`src/exam/interactiveRegistry.ts`、
`src/components/exam/ExamInteractiveStage.tsx`、封面圖（若採用）。
`registry.sync.test.ts` 要加上 exam 的對應斷言。

## 3D 題目的技術決定

`#3 歪斜線距離` 與 `#4 旋轉體體積` 原構想寫 three.js。**不引入 three.js**：
現有 `CurveModule.sample()` 回傳 2D `CurvePoint[]`，縮圖管線與 `src/systems/rendering/*`
都建立在這個契約上，加一個 WebGL 場景等於開第二套渲染世界。

改用 p5 2D + 自寫 3D→2D 正交投影（`project3d(x,y,z) -> {x,y}` + 拖曳控制 yaw/pitch），
與 `space-vectors-planes-lines` 系列共用同一組投影工具。旋轉體用投影後的線框
（母線 × n 條經線）表現掃掠，切片數滑桿疊圓盤，效果足夠且縮圖能直接沿用。

投影工具放 `src/systems/rendering/projection3d.ts`，供 exam 與空間向量 works 共用。

## 首批五題

| # | slug | 來源 | 單元 | 核心觀念 | 形式 | 難度 |
|---|------|------|------|----------|------|------|
| E1 | `gsat-112-rotation-composition` | 112 學測數A 多選11 | 矩陣與線性變換 | 旋轉矩陣、AB≠BA、變換合成 | p5 2D，按鈕依序套用 A/B，補間動畫，並排比較兩種順序 | 中 |
| E2 | `gsat-112-sinusoid-superposition` | 112 學測數A 多選10 | 三角函數圖形 | 疊合公式、對稱軸 f(a−x)=f(a+x)、半角 | p5 2D，a/b 滑桿即時疊合 + 對稱軸虛線 + 平移動畫 | 中 |
| E3 | `gsat-112-skew-line-distance` | 112 學測數A 選填17 | 空間向量 | 外積求公垂向量、投影長 \|AB·n\|/\|n\| | p5 2D + 自寫投影，拖曳視角，動態公垂線段 | 高 |
| E4 | `ast-114-solid-of-revolution` | 114 分科數甲 | 積分應用 | 圓盤法 V=π∫f(x)²dx、黎曼和 | p5 2D + 投影線框，掃掠動畫 + 切片數 n 滑桿 | 高 |
| E5 | `ast-113-geometric-distribution` | 113 分科數甲 | 機率分布 | 幾何分布 P(X=n)=0.9ⁿ⁻¹·0.1、無窮級數、大數法則 | Monte Carlo，一萬次直方圖累積 + 均值收斂折線 | 中 |

選題理由（答對率／鑑別度依據）記在各自的 `.md` 內文「為什麼會錯」段落，附 `analysisUrl`。

E2 與既有三角疊合系列、E5 與機率／數列級數系列、E3 與空間向量系列
都應該互相 `relatedExplore` / `relatedWorks` 對接。

## 實作順序

1. ~~**基礎建設**：collection schema、`/exam` 兩個路由、ExamCard、`new-exam.mjs`、封鎖機制。~~
   ✅ 2026-07-19 完成。E1 內容骨架已可在 dev 預覽，`npm run build` 不產出 `/exam`。
   （Nav 條目與 registry sync 測試留到有互動、要公開時再加。）
2. **E1**：純 2D、觀念最集中，當成集合的樣板頁（文案結構、互動節奏、控制項位置都在這頁定型）。
3. **E2、E5**：可沿用既有渲染工具，成本最低。
4. **`projection3d.ts`**：抽出投影工具。
5. **E3、E4**：3D 題，最後做。

## 上線前檢查（追加於 schedule.md 既有清單）

- [ ] `sourceUrl` 可開啟且指向大考中心原卷
- [ ] 題意為改寫，未整段轉載
- [ ] `relatedExplore` / `relatedWorks` 的 slug 都已發布（非 draft）
- [ ] 列表篩選 `subject` 選項與實際條目一致
